import { Trans } from '@lingui/macro';
import { Button, styled } from '@mui/material';
import { useEffect } from 'react';
import { NoData } from 'src/components/primitives/NoData';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useVariableDebtTokenContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { DASHBOARD } from 'src/utils/mixPanelEvents';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { ListColumn } from '../../../../components/lists/ListColumn';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemCanBeCollateral } from '../ListItemCanBeCollateral';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

export const ButtonSupplyCustom = styled(Button)(() => ({
  borderRadius: '4px',
  background: '#54618F',
  minwidth: '65.229px',
  height: '32px',
  fontSize: '14px',
  color: '#C4C8E2',
  fontWeight: 700,
  fontFamily: 'Mulish',
  padding: '12px',
  whiteSpace: 'nowrap',
  border: '1px solid #54618F',
  '&:hover': {
    border: '1px solid #C2C3E9CC',
  },
  '&:disabled': {
    background: '#484A77',
    color: '#C4C8E2',
    border: 'none',
    cursor: 'not-allowed',
    opacity: 0.7,
    pointerEvents: 'auto',
  },
})) as typeof Button;

export const ButtonDetailCustom = styled(Button)(() => ({
  borderRadius: '4px',
  background: '#DA3E3E',
  minWidth: '65.229px',
  height: '32px',
  fontSize: '14px',
  color: '#1A1A1C',
  fontWeight: 700,
  fontFamily: 'Mulish',
  padding: '12px',
  whiteSpace: 'nowrap',
  border: '1px solid #DA3E3E',
  '&:hover': {
    background: '#FF42281F',
    color: '#DA3E3E',
  },
  '&:disabled': {
    background: '#DA3E3E',
    color: '#1A1A1C',
    border: 'none',
    cursor: 'not-allowed',
    opacity: 0.7,
    pointerEvents: 'auto',
  },
})) as typeof Button;

export const SupplyAssetsListItem = ({
  symbol,
  iconSymbol,
  name,
  walletBalance,
  walletBalanceUSD,
  supplyCap,
  totalLiquidity,
  supplyAPY,
  aIncentivesData,
  underlyingAsset,
  isActive,
  isFreezed,
  isIsolated,
  usageAsCollateralEnabledOnUser,
  detailsAddress,
  variableDebtTokenAddress,
}: DashboardReserve) => {
  const { currentAccount } = useWeb3Context();
  const { currentMarket } = useProtocolDataContext();
  const { permissionSupply } = useAppDataContext();
  const { openSupply } = useModalContext();
  const variableDeptTokenContract = useVariableDebtTokenContract(variableDebtTokenAddress);

  // Disable the asset to prevent it from being supplied if supply cap has been reached
  const { supplyCap: supplyCapUsage, debtCeiling } = useAssetCaps();
  const isMaxCapReached = supplyCapUsage.isMaxed;

  const trackEvent = useRootStore((store) => store.trackEvent);
  const disableSupply = !isActive || isFreezed || Number(walletBalance) <= 0 || isMaxCapReached;

  const getScaledUserBalanceAndSupply = async () => {
    if (variableDeptTokenContract) {
      const dataDeptToken = await variableDeptTokenContract.getScaledUserBalanceAndSupply(
        currentAccount
      );

      console.log(
        'getScaledUserBalanceAndSupply',
        symbol,
        dataDeptToken[0].toString(),
        dataDeptToken[1].toString()
      );
    }
  };
  useEffect(() => {
    getScaledUserBalanceAndSupply();
  }, [variableDeptTokenContract]);

  return permissionSupply && permissionSupply[underlyingAsset] === false ? (
    <></>
  ) : (
    <ListItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      detailsAddress={detailsAddress}
      data-cy={`dashboardSupplyListItem_${symbol.toUpperCase()}`}
      currentMarket={currentMarket}
      showDebtCeilingTooltips
    >
      <ListValueColumn
        symbol={symbol}
        value={Number(walletBalance)}
        subValue={walletBalanceUSD}
        withTooltip
        disabled={Number(walletBalance) === 0 || isMaxCapReached}
        capsComponent={
          <CapsHint
            capType={CapType.supplyCap}
            capAmount={supplyCap}
            totalAmount={totalLiquidity}
            withoutText
          />
        }
      />

      <ListAPRColumn value={Number(supplyAPY)} incentives={aIncentivesData} symbol={symbol} />

      <ListColumn>
        {debtCeiling.isMaxed ? (
          <NoData variant="main14" sx={{ color: '#CFD3E2' }} />
        ) : (
          <ListItemCanBeCollateral
            isIsolated={isIsolated}
            usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
          />
        )}
      </ListColumn>

      <ListButtonsColumn>
        <ButtonSupplyCustom
          disabled={
            disableSupply || (permissionSupply && permissionSupply[underlyingAsset] === false)
          }
          variant="outlined"
          onClick={() => {
            openSupply(underlyingAsset, currentMarket, name, 'dashboard');
          }}
        >
          <Trans>Supply</Trans>
        </ButtonSupplyCustom>
        <ButtonDetailCustom
          component={Link}
          href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
          onClick={() => {
            trackEvent(DASHBOARD.DETAILS_NAVIGATION, {
              type: 'Button',
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
            });
          }}
        >
          <Trans>Details</Trans>
        </ButtonDetailCustom>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};

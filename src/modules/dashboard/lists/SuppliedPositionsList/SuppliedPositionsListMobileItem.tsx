import { Trans } from '@lingui/macro';
import { Box, Button, styled } from '@mui/material';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { IncentivesCard } from '../../../../components/incentives/IncentivesCard';
import { Row } from '../../../../components/primitives/Row';
import { useModalContext } from '../../../../hooks/useModal';
import { useProtocolDataContext } from '../../../../hooks/useProtocolDataContext';
import { isFeatureEnabled } from '../../../../utils/marketsAndNetworksConfig';
import { ListItemUsedAsCollateral } from '../ListItemUsedAsCollateral';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueRow } from '../ListValueRow';

export const ButtonSupplyCustomMobile = styled(Button)(() => ({
  background: ' #54618F',
  color: '#C4C8E2',
  width: '128px',
  fontSize: '11px',
  height: '28px',
  '&:hover': {
    border: '1px solid #C2C3E9CC',
  },
  '&:disabled': {
    background: '#484A77',
    color: '#C4C8E2',
    border: 'none',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
}));

export const ButtonDetailCustomMobile = styled(Button)(() => ({
  background: ' #DA3E3E',
  color: '#1A1A1C',
  width: '128px',
  fontSize: '11px',
  height: '28px',
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
  },
})) as typeof Button;

export const SuppliedPositionsListMobileItem = ({
  reserve,
  underlyingBalance,
  underlyingBalanceUSD,
  usageAsCollateralEnabledOnUser,
  underlyingAsset,
}: DashboardReserve) => {
  const { user, permissionSupply } = useAppDataContext();
  const { currentMarketData, currentMarket } = useProtocolDataContext();
  const { openSupply, openSwap, openWithdraw, openCollateralChange } = useModalContext();
  const { debtCeiling } = useAssetCaps();
  const isSwapButton = isFeatureEnabled.liquiditySwap(currentMarketData);
  const { symbol, iconSymbol, name, supplyAPY, isIsolated, aIncentivesData, isFrozen, isActive } =
    reserve;

  const canBeEnabledAsCollateral =
    !debtCeiling.isMaxed &&
    reserve.reserveLiquidationThreshold !== '0' &&
    ((!reserve.isIsolated && !user.isInIsolationMode) ||
      user.isolatedReserve?.underlyingAsset === reserve.underlyingAsset ||
      (reserve.isIsolated && user.totalCollateralMarketReferenceCurrency === '0'));

  const disableSwap = !isActive || reserve.symbol == 'stETH';
  const disableWithdraw = !isActive;
  const disableSupply = !isActive || isFrozen;

  return permissionSupply && permissionSupply[underlyingAsset] === false ? (
    <></>
  ) : (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
      frozen={reserve.isFrozen}
      showSupplyCapTooltips
      showDebtCeilingTooltips
    >
      <ListValueRow
        title={<Trans>Supply balance</Trans>}
        value={Number(underlyingBalance)}
        subValue={Number(underlyingBalanceUSD)}
        disabled={Number(underlyingBalance) === 0}
      />

      <Row
        caption={<Trans>Supply APY</Trans>}
        align="flex-start"
        captionVariant="description"
        mb={2}
        sx={{ color: '#fff' }}
      >
        <IncentivesCard
          value={Number(supplyAPY)}
          incentives={aIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Row
        caption={<Trans>Used as collateral</Trans>}
        align={isIsolated ? 'flex-start' : 'center'}
        captionVariant="description"
        mb={2}
        sx={{ color: '#fff' }}
      >
        <ListItemUsedAsCollateral
          isIsolated={isIsolated}
          usageAsCollateralEnabledOnUser={usageAsCollateralEnabledOnUser}
          canBeEnabledAsCollateral={canBeEnabledAsCollateral}
          onToggleSwitch={() =>
            openCollateralChange(
              underlyingAsset,
              currentMarket,
              reserve.name,
              'dashboard',
              usageAsCollateralEnabledOnUser
            )
          }
        />
      </Row>

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5, gap: '10px' }}
      >
        <ButtonSupplyCustomMobile
          disabled={
            disableWithdraw || (permissionSupply && permissionSupply[underlyingAsset] === false)
          }
          onClick={() => openWithdraw(underlyingAsset, currentMarket, reserve.name, 'dashboard')}
        >
          <Trans>Withdraw</Trans>
        </ButtonSupplyCustomMobile>
        {isSwapButton ? (
          <ButtonDetailCustomMobile
            disabled={disableSwap}
            onClick={() => openSwap(underlyingAsset)}
          >
            <Trans>Switch</Trans>
          </ButtonDetailCustomMobile>
        ) : (
          <ButtonDetailCustomMobile
            disabled={
              disableSupply || (permissionSupply && permissionSupply[underlyingAsset] === false)
            }
            onClick={() => openSupply(underlyingAsset, currentMarket, reserve.name, 'dashboard')}
          >
            <Trans>Supply</Trans>
          </ButtonDetailCustomMobile>
        )}
      </Box>
    </ListMobileItemWrapper>
  );
};

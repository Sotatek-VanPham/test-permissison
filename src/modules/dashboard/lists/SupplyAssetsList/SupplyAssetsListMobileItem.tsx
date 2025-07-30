import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { IncentivesCard } from '../../../../components/incentives/IncentivesCard';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { Row } from '../../../../components/primitives/Row';
import { useModalContext } from '../../../../hooks/useModal';
import { ListItemCanBeCollateral } from '../ListItemCanBeCollateral';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueRow } from '../ListValueRow';
import {
  ButtonDetailCustomMobile,
  ButtonSupplyCustomMobile,
} from '../SuppliedPositionsList/SuppliedPositionsListMobileItem';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

export const SupplyAssetsListMobileItem = ({
  symbol,
  iconSymbol,
  name,
  walletBalance,
  walletBalanceUSD,
  supplyCap,
  totalLiquidity,
  supplyAPY,
  aIncentivesData,
  isIsolated,
  usageAsCollateralEnabledOnUser,
  isActive,
  isFreezed,
  underlyingAsset,
  detailsAddress,
}: DashboardReserve) => {
  const { currentMarket } = useProtocolDataContext();
  const { openSupply } = useModalContext();
  const { permissionSupply } = useAppDataContext();

  // Disable the asset to prevent it from being supplied if supply cap has been reached
  const { supplyCap: supplyCapUsage } = useAssetCaps();
  const isMaxCapReached = supplyCapUsage.isMaxed;

  const disableSupply = !isActive || isFreezed || Number(walletBalance) <= 0 || isMaxCapReached;

  return permissionSupply && permissionSupply[underlyingAsset] === false ? (
    <></>
  ) : (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
      showDebtCeilingTooltips
    >
      <ListValueRow
        title={<Trans>Supply balance</Trans>}
        value={Number(walletBalance)}
        subValue={walletBalanceUSD}
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
        caption={<Trans>Can be collateral</Trans>}
        align="flex-start"
        captionVariant="description"
        mb={2}
        sx={{ color: '#fff' }}
      >
        <ListItemCanBeCollateral
          isIsolated={isIsolated}
          usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
        />
      </Row>

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5, gap: '10px' }}
      >
        <ButtonSupplyCustomMobile
          disabled={
            disableSupply || (permissionSupply && permissionSupply[underlyingAsset] === false)
          }
          variant="contained"
          onClick={() => openSupply(underlyingAsset, currentMarket, name, 'dashboard')}
        >
          <Trans>Supply</Trans>
        </ButtonSupplyCustomMobile>
        <ButtonDetailCustomMobile
          component={Link}
          href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
        >
          <Trans>Details</Trans>
        </ButtonDetailCustomMobile>
      </Box>
    </ListMobileItemWrapper>
  );
};

import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { BUSDOffBoardingTooltip } from 'src/components/infoTooltips/BUSDOffboardingToolTip';
import { RenFILToolTip } from 'src/components/infoTooltips/RenFILToolTip';
import { NoData } from 'src/components/primitives/NoData';
import { ReserveSubheader } from 'src/components/ReserveSubheader';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { CUSTOM_POOL_NAME } from 'src/ui-config/customPoolName';

import { IncentivesCard } from '../../components/incentives/IncentivesCard';
import { AMPLToolTip } from '../../components/infoTooltips/AMPLToolTip';
import { ListColumn } from '../../components/lists/ListColumn';
import { ListItem } from '../../components/lists/ListItem';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { Link, ROUTES } from '../../components/primitives/Link';
import { TokenIcon } from '../../components/primitives/TokenIcon';
import { ComputedReserveData } from '../../hooks/app-data-provider/useAppDataProvider';
import { MARKETS } from '../../utils/mixPanelEvents';
import { ButtonDetailCustom } from '../dashboard/lists/SupplyAssetsList/SupplyAssetsListItem';

export const MarketAssetsListItem = ({ ...reserve }: ComputedReserveData) => {
  const router = useRouter();
  const { currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const showStableBorrowRate = Number(reserve.totalStableDebtUSD) > 0;
  // if (currentMarket === CustomMarket.proto_mainnet && reserve.symbol === 'TUSD') {
  //   showStableBorrowRate = false;
  // }

  return (
    <ListItem
      px={6}
      minHeight={76}
      onClick={() => {
        trackEvent(MARKETS.DETAILS_NAVIGATION, {
          type: 'Row',
          assetName: reserve.name,
          asset: reserve.underlyingAsset,
          market: currentMarket,
        });
        router.push(ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket));
      }}
      sx={{
        cursor: 'pointer',
      }}
      button
      data-cy={`marketListItemListItem_${reserve.symbol.toUpperCase()}`}
    >
      <ListColumn isRow maxWidth={280}>
        <TokenIcon symbol={reserve.iconSymbol} fontSize="large" />
        <Box sx={{ pl: 3.5, overflow: 'hidden' }}>
          <Typography variant="h4" noWrap sx={{ color: '#fff' }}>
            {CUSTOM_POOL_NAME[reserve.name] || reserve.name || 'Unknow'}
          </Typography>
          <Box
            sx={{
              p: { xs: '0', xsm: '3.625px 0px' },
            }}
          >
            <Typography variant="subheader2" noWrap sx={{ color: '#fff' }}>
              {reserve.symbol || 'Unknow'}
            </Typography>
          </Box>
        </Box>
        {reserve.symbol === 'AMPL' && <AMPLToolTip />}
        {reserve.symbol === 'renFIL' && <RenFILToolTip />}
        {reserve.symbol === 'BUSD' && <BUSDOffBoardingTooltip />}
      </ListColumn>

      <ListColumn>
        <FormattedNumber
          compact
          value={reserve.totalLiquidity}
          variant="main16"
          color="#A5A8B3"
          symbolsColor="#A5A8B3"
        />
        <ReserveSubheader value={reserve.totalLiquidityUSD} colorCustom="#A5A8B3" />
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={reserve.supplyAPY}
          incentives={reserve.aIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
      </ListColumn>

      <ListColumn>
        {reserve.borrowingEnabled || Number(reserve.totalDebt) > 0 ? (
          <>
            <FormattedNumber
              compact
              value={reserve.totalDebt}
              variant="main16"
              color="#A5A8B3"
              symbolsColor="#A5A8B3"
            />{' '}
            <ReserveSubheader value={reserve.totalDebtUSD} colorCustom="#A5A8B3" />
          </>
        ) : (
          <NoData variant={'secondary14'} color="#A5A8B3" />
        )}
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={Number(reserve.totalVariableDebtUSD) > 0 ? reserve.variableBorrowAPY : '-1'}
          incentives={reserve.vIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
        {!reserve.borrowingEnabled &&
          Number(reserve.totalVariableDebt) > 0 &&
          !reserve.isFrozen && <ReserveSubheader value={'Disabled'} />}
      </ListColumn>

      <ListColumn>
        <IncentivesCard
          value={showStableBorrowRate ? reserve.stableBorrowAPY : '-1'}
          incentives={reserve.sIncentivesData || []}
          symbol={reserve.symbol}
          variant="main16"
          symbolsVariant="secondary16"
        />
        {!reserve.borrowingEnabled && Number(reserve.totalStableDebt) > 0 && !reserve.isFrozen && (
          <ReserveSubheader value={'Disabled'} />
        )}
      </ListColumn>

      <ListColumn minWidth={95} maxWidth={95} align="right">
        <ButtonDetailCustom
          component={Link}
          href={ROUTES.reserveOverview(reserve.underlyingAsset, currentMarket)}
          onClick={() =>
            trackEvent(MARKETS.DETAILS_NAVIGATION, {
              type: 'Button',
              assetName: reserve.name,
              asset: reserve.underlyingAsset,
              market: currentMarket,
            })
          }
        >
          <Trans>Details</Trans>
        </ButtonDetailCustom>
      </ListColumn>
    </ListItem>
  );
};

import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import { StableAPYTooltip } from 'src/components/infoTooltips/StableAPYTooltip';
import { VariableAPYTooltip } from 'src/components/infoTooltips/VariableAPYTooltip';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { IncentivesCard } from '../../../../components/incentives/IncentivesCard';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { Row } from '../../../../components/primitives/Row';
import { useModalContext } from '../../../../hooks/useModal';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueRow } from '../ListValueRow';
import {
  ButtonDetailCustomMobile,
  ButtonSupplyCustomMobile,
} from '../SuppliedPositionsList/SuppliedPositionsListMobileItem';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';

export const BorrowAssetsListMobileItem = ({
  symbol,
  iconSymbol,
  name,
  availableBorrows,
  availableBorrowsInUSD,
  borrowCap,
  totalBorrows,
  variableBorrowRate,
  stableBorrowRate,
  sIncentivesData,
  vIncentivesData,
  underlyingAsset,
  isFreezed,
}: DashboardReserve) => {
  const { openBorrow } = useModalContext();
  const { permissionBorrow } = useAppDataContext();
  const { currentMarket } = useProtocolDataContext();

  const disableBorrow = isFreezed || Number(availableBorrows) <= 0;

  return permissionBorrow && permissionBorrow[underlyingAsset] === false ? (
    <></>
  ) : (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
    >
      <ListValueRow
        title={<Trans>Available to borrow</Trans>}
        value={Number(availableBorrows)}
        subValue={Number(availableBorrowsInUSD)}
        disabled={Number(availableBorrows) === 0}
        capsComponent={
          <CapsHint
            capType={CapType.borrowCap}
            capAmount={borrowCap}
            totalAmount={totalBorrows}
            withoutText
          />
        }
      />

      <Row
        caption={
          <VariableAPYTooltip
            text={<Trans>APY, variable</Trans>}
            key="APY_dash_mob_variable_ type"
            variant="description"
            sx={{
              ['@media screen and (max-width: 560px)']: {
                fontSize: '11px',
              },
            }}
          />
        }
        sx={{ color: '#fff' }}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={Number(variableBorrowRate)}
          incentives={vIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Row
        caption={
          <StableAPYTooltip
            text={<Trans>APY, stable</Trans>}
            key="APY_dash_mob_stable_ type"
            variant="description"
            sx={{
              ['@media screen and (max-width: 560px)']: {
                fontSize: '11px',
              },
            }}
          />
        }
        sx={{ color: '#fff' }}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={Number(stableBorrowRate)}
          incentives={sIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5, gap: '10px' }}
      >
        <ButtonSupplyCustomMobile
          disabled={
            disableBorrow || (permissionBorrow && permissionBorrow[underlyingAsset] === false)
          }
          variant="contained"
          onClick={() => openBorrow(underlyingAsset, currentMarket, name, 'dashboard')}
        >
          <Trans>Borrow</Trans>
        </ButtonSupplyCustomMobile>
        <ButtonDetailCustomMobile
          component={Link}
          href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
          sx={() => ({
            background: '#DA3E3E',
            color: '#1A1A1C',
            width: '128px',
            fontSize: '11px',
            height: '28px',
          })}
        >
          <Trans>Details</Trans>
        </ButtonDetailCustomMobile>
      </Box>
    </ListMobileItemWrapper>
  );
};

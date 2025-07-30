import { Box, Divider, Skeleton, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { CUSTOM_POOL_NAME } from 'src/ui-config/customPoolName';
import { CustomMarket } from 'src/ui-config/marketsConfig';

import { Link, ROUTES } from '../primitives/Link';
import { TokenIcon } from '../primitives/TokenIcon';

interface ListMobileItemProps {
  warningComponent?: ReactNode;
  children: ReactNode;
  symbol?: string;
  iconSymbol?: string;
  name?: string;
  underlyingAsset?: string;
  loading?: boolean;
  currentMarket?: CustomMarket;
  showSupplyCapTooltips?: boolean;
  showBorrowCapTooltips?: boolean;
  showDebtCeilingTooltips?: boolean;
}

export const ListMobileItem = ({
  children,
  warningComponent,
  symbol,
  iconSymbol,
  name,
  underlyingAsset,
  loading,
  currentMarket,
  showSupplyCapTooltips = false,
  showBorrowCapTooltips = false,
  showDebtCeilingTooltips = false,
}: ListMobileItemProps) => {
  const { supplyCap, borrowCap, debtCeiling } = useAssetCaps();

  return (
    <Box>
      <Divider sx={{ borderColor: '#FFFFFF1A' }} />
      <Box sx={{ px: 4, pt: 4, pb: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={33} height={33} />
              <Box sx={{ ml: 2 }}>
                <Skeleton width={100} height={24} />
              </Box>
            </Box>
          ) : (
            symbol &&
            underlyingAsset &&
            name &&
            currentMarket &&
            iconSymbol && (
              <Link
                href={ROUTES.reserveOverview(underlyingAsset, currentMarket)}
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <TokenIcon symbol={iconSymbol} sx={{ fontSize: '33px' }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h4" color="common.white" sx={{ fontSize: '13px' }}>
                    {CUSTOM_POOL_NAME[name] || name}
                  </Typography>
                  <Typography variant="subheader2" color="common.white" sx={{ fontSize: '10px' }}>
                    {symbol}
                  </Typography>
                </Box>
                {showSupplyCapTooltips && supplyCap.displayMaxedTooltip({ supplyCap })}
                {showBorrowCapTooltips && borrowCap.displayMaxedTooltip({ borrowCap })}
                {showDebtCeilingTooltips && debtCeiling.displayMaxedTooltip({ debtCeiling })}
              </Link>
            )
          )}
          {warningComponent}
        </Box>
        {children}
      </Box>
    </Box>
  );
};

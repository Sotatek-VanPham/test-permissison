import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import { valueToBigNumber } from 'colend-math-utils';

import { FormattedNumber } from './primitives/FormattedNumber';

interface HealthFactorNumberProps extends TypographyProps {
  value: string;
  onInfoClick?: () => void;
  HALIntegrationComponent?: React.ReactNode;
  isWhite?: boolean;
}

export const HealthFactorNumber = ({
  value,
  onInfoClick,
  HALIntegrationComponent,
  isWhite,
  ...rest
}: HealthFactorNumberProps) => {
  const { palette } = useTheme();

  const formattedHealthFactor = Number(valueToBigNumber(value).toFixed(2, BigNumber.ROUND_DOWN));
  let healthFactorColor = '';
  if (formattedHealthFactor >= 3) {
    healthFactorColor = palette.success.main;
  } else if (formattedHealthFactor < 1.1) {
    healthFactorColor = palette.error.main;
  } else {
    healthFactorColor = palette.warning.main;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: { xs: 'flex-start', xsm: 'center' },
        flexDirection: { xs: 'column', xsm: 'row' },
      }}
      data-cy={'HealthFactorTopPannel'}
    >
      {value === '-1' ? (
        <Typography variant="secondary14" color={palette.success.main}>
          ∞
        </Typography>
      ) : (
        <FormattedNumber
          value={formattedHealthFactor}
          sx={{ color: isWhite ? '#fff' : healthFactorColor, ...rest.sx }}
          visibleDecimals={2}
          color={isWhite ? '#fff' : healthFactorColor}
          symbolsColor={isWhite ? '#fff' : healthFactorColor}
          compact
          {...rest}
        />
      )}

      {onInfoClick && (
        <Button
          onClick={onInfoClick}
          size="small"
          sx={{
            minWidth: 'unset',
            ml: { xs: 0, xsm: 2 },
            color: '#fff',
            border: '1px solid #FFFFFF33',
            background: '1B1B1D6B',
            ['@media screen and (max-width: 560px)']: {
              fontSize: '8px',
              fontWeight: 400,
            },
          }}
        >
          <Trans>Risk details</Trans>
        </Button>
      )}

      {HALIntegrationComponent && (
        <Box ml={{ xs: 0, xsm: 2 }} mt={{ xs: 1, xsm: 0 }}>
          {HALIntegrationComponent}
        </Box>
      )}
    </Box>
  );
};

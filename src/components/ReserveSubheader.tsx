import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

import { FormattedNumber } from './primitives/FormattedNumber';

type ReserveSubheaderProps = {
  value: string;
  rightAlign?: boolean;
  colorCustom?: string;
};

export function ReserveSubheader({ value, rightAlign, colorCustom }: ReserveSubheaderProps) {
  return (
    <Box
      sx={{
        p: rightAlign ? { xs: '0', xsm: '2px 0' } : { xs: '0', xsm: '3.625px 0px' },
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {value === 'Disabled' ? (
        <Typography component="span" sx={{ mr: 0.5 }} variant="secondary12" color="#fff">
          (<Trans>Disabled</Trans>)
        </Typography>
      ) : (
        <FormattedNumber
          compact
          value={value}
          color={colorCustom || '#fff'}
          symbolsColor={colorCustom || '#fff'}
          symbol="USD"
          sx={{ fontSize: '12px', fontFamily: 'Mulish' }}
        />
      )}
    </Box>
  );
}

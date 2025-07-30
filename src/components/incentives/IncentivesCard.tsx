import { Box } from '@mui/material';
import { ReserveIncentiveResponse } from 'colend-math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
import { ReactNode } from 'react';

import { FormattedNumber } from '../primitives/FormattedNumber';
import { NoData } from '../primitives/NoData';
import { IncentivesButton } from './IncentivesButton';

interface IncentivesCardProps {
  symbol: string;
  value: string | number;
  incentives?: ReserveIncentiveResponse[];
  variant?: 'main14' | 'main16' | 'secondary14' | 'secondary12';
  symbolsVariant?: 'secondary14' | 'secondary16';
  align?: 'center' | 'flex-end';
  color?: string;
  tooltip?: ReactNode;
}

export const IncentivesCard = ({
  symbol,
  value,
  incentives,
  variant = 'secondary12',
  symbolsVariant,
  align,
  color,
  tooltip,
}: IncentivesCardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align || { xs: 'flex-end', xsm: 'center' },
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: 'Mulish',
      }}
    >
      {value.toString() !== '-1' ? (
        <Box sx={{ display: 'flex' }}>
          <FormattedNumber
            data-cy={`apy`}
            value={value}
            percent
            variant={variant}
            symbolsVariant={symbolsVariant}
            color={'#CFD3E2'}
            symbolsColor={'#CFD3E2'}
            sx={{
              ['@media screen and (max-width: 560px)']: {
                fontSize: '11px',
              },
            }}
          />
          {tooltip}
        </Box>
      ) : (
        <NoData variant={variant} color={color || '#CFD3E2'} />
      )}

      <IncentivesButton incentives={incentives} symbol={symbol} />
    </Box>
  );
};

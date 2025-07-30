import { Typography } from '@mui/material';
import { ReactNode } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

export const ItemLeaderBoardMobile = ({
  title,
  value,
}: {
  title: ReactNode;
  value: number | string;
}) => {
  return (
    <div>
      <Typography color="common.white" sx={{ fontSize: '12px' }}>
        {title}
      </Typography>
      <FormattedNumber
        value={value}
        variant="secondary14"
        symbolsColor={'text.secondary'}
        color={'text.secondary'}
        visibleDecimals={1}
        sx={{
          fontFamily: 'Mulish',
          fontWeight: 400,
          ['@media screen and (max-width: 560px)']: {
            fontSize: '12px',
          },
        }}
      />
    </div>
  );
};

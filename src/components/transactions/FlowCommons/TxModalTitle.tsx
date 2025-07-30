import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export type TxModalTitleProps = {
  title: ReactNode;
  symbol?: string;
};

export const TxModalTitle = ({ title, symbol }: TxModalTitleProps) => {
  return (
    <Typography
      sx={{ mb: 6, color: '#fff', fontSize: '24px', fontWeight: '500', fontFamily: 'Work sans' }}
    >
      {title} {symbol ?? ''}
    </Typography>
  );
};

import { Box, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

type ReserveOverviewBoxProps = {
  children: ReactNode;
  title?: ReactNode;
  fullWidth?: boolean;
};

export const TypographyCustom = styled(Typography)(() => ({
  p: {
    color: '#FFF',
    fontFamily: 'Work Sans',
    fontSize: '16px',
    fontWeight: 500,
  },
})) as typeof Typography;

export function ReserveOverviewBox({
  title,
  children,
  fullWidth = false,
}: ReserveOverviewBoxProps) {
  return (
    <Box
      sx={() => ({
        borderRadius: '6px',
        background: 'rgba(27, 27, 29, 0.50)',
        backdropFilter: 'blur(100px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        flex: fullWidth ? '0 100%' : '0 32%',
        marginBottom: '2%',
        maxWidth: fullWidth ? '100%' : '32%',
        color: '#fff',
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-around',
          padding: '8px',
        }}
      >
        {title && <TypographyCustom>{title}</TypographyCustom>}
        {children}
      </Box>
    </Box>
  );
}

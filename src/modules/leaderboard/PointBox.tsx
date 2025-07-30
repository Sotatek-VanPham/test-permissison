import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export const PointBox = ({ title, children }: { title: ReactNode; children: ReactNode }) => {
  return (
    <Box
      sx={{
        background: '#1B1B1DE5',
        borderRadius: '16px',
        padding: '20px',
        flex: 1,
        height: '121px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ['@media screen and (max-width: 560px)']: {
          gap: '16px',
        },
      }}
    >
      <Typography
        color="common.white"
        sx={{ fontFamily: 'Work Sans', fontWeight: '500', fontSize: '20px' }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex' }}>{children}</Box>
    </Box>
  );
};

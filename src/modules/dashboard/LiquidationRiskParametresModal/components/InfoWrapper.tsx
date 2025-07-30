import { AlertColor, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface InfoWrapperProps {
  topValue: ReactNode;
  topTitle: ReactNode;
  topDescription: ReactNode;
  children: ReactNode;
  bottomText: ReactNode;
  color: AlertColor;
}

export const InfoWrapper = ({
  topValue,
  topTitle,
  topDescription,
  children,
  bottomText,
  color,
}: InfoWrapperProps) => {
  return (
    <Box
      sx={() => ({
        border: `1px solid rgba(255, 255, 255, 0.07)`,
        mb: 6,
        borderRadius: '6px',
        px: 4,
        pt: 4,
        pb: 6,
        '&:last-of-type': {
          mb: 0,
        },
      })}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: 'calc(100% - 72px)' }}>
          <Typography variant="subheader1" mb={1} color="#fff">
            {topTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {topDescription}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.main`,
            fontSize: '14px',
          }}
        >
          {topValue}
        </Box>
      </Box>

      <Box>{children}</Box>

      <Typography variant="secondary12" color="text.secondary" textAlign="left">
        {bottomText}
      </Typography>
    </Box>
  );
};

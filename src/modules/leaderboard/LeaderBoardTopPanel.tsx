import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';

import PoinIcon from '/public/icons/point-icon.svg';

export const LeaderBoardTopPanel = () => {
  return (
    <Box
      sx={{
        pt: { xs: 10, md: 12 },
        pb: { xs: 10, md: 12, lg: '32px' },
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <PoinIcon />

      <Box>
        <Typography sx={{ fontSize: '29px', fontFamily: 'Work sans', fontWeight: '600' }}>
          <Trans>COLEND POINTS</Trans>
        </Typography>
        <Typography sx={{ fontSize: '14px', fontFamily: 'Mulish', fontWeight: '400' }}>
          <Trans>The longer you use the platform, the more points you earn.</Trans>
        </Typography>
      </Box>
    </Box>
  );
};

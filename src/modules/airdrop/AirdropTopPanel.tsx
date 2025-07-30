import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';

import AirdropIcon from '/public/icons/icon-airdrop.svg';

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
      <AirdropIcon />

      <Box>
        <Typography sx={{ fontSize: '29px', fontFamily: 'Work sans', fontWeight: '600' }}>
          <Trans>CLAIM AIRDROPS</Trans>
        </Typography>
        <Typography sx={{ fontSize: '14px', fontFamily: 'Mulish', fontWeight: '400' }}>
          <Trans>The longer you use the platform, the more points you earn.</Trans>
        </Typography>
      </Box>
    </Box>
  );
};

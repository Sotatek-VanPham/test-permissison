import { Box, useMediaQuery, useTheme } from '@mui/material';

import { WrapperPage } from '../governance';
import { Line } from '../governance/TopInfo';
import { ClaimToken } from './ClaimToken';
import { LockToken } from './LockToken';
import { RedeemQueue } from './RedeemQueue';

type LockRedeemProps = {
  getTokenInfo: () => void;
};

export const LockRedeem = ({ getTokenInfo }: LockRedeemProps) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box>
      {!isMd ? (
        <WrapperPage>
          <Box
            sx={{
              boxShadow: '0px 4px 8px 0px #00000040',
              borderRadius: '16px',
              background: ' #1B1B1DE5',
              display: 'flex',
              padding: '32px',
              gap: '10px',
              ['@media screen and (max-width: 1150px)']: {
                justifyContent: 'center',
              },
            }}
          >
            <ClaimToken getTokenInfo={getTokenInfo} />
            <Line />

            <ClaimToken isCLND getTokenInfo={getTokenInfo} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              padding: '32px',
              gap: '10px',
            }}
          >
            <LockToken isLock={true} getTokenInfo={getTokenInfo} />
            <Line />
            <LockToken isLock={false} getTokenInfo={getTokenInfo} />
          </Box>

          <Box>
            <RedeemQueue />
          </Box>
        </WrapperPage>
      ) : (
        // Mobile
        <>
          <WrapperPage>
            <Box
              sx={{
                boxShadow: '0px 4px 8px 0px #00000040',
                borderRadius: '16px',
                background: ' #1B1B1DE5',
                display: 'flex',
                padding: '32px',
                gap: '30px',
                ['@media screen and (max-width: 1150px)']: {
                  justifyContent: 'center',
                },
              }}
            >
              <ClaimToken getTokenInfo={getTokenInfo} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <LockToken isLock={true} getTokenInfo={getTokenInfo} />
            </Box>
          </WrapperPage>

          <WrapperPage sx={{ mt: '20px' }}>
            <Box
              sx={{
                boxShadow: '0px 4px 8px 0px #00000040',
                borderRadius: '16px',
                background: ' #1B1B1DE5',
                display: 'flex',
                padding: '32px',
                gap: '10px',
                ['@media screen and (max-width: 1150px)']: {
                  justifyContent: 'center',
                },
              }}
            >
              <ClaimToken isCLND getTokenInfo={getTokenInfo} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <LockToken isLock={false} getTokenInfo={getTokenInfo} />
            </Box>
          </WrapperPage>

          <WrapperPage sx={{ mt: '20px' }}>
            <Box>
              <RedeemQueue />
            </Box>
          </WrapperPage>
        </>
      )}
    </Box>
  );
};

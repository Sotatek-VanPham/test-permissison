import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { useVoteLogicContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

export const WrapperTopInfo = styled(Box)`
  box-shadow: 0px 4px 8px 0px #00000040;
  border-radius: 16px;
`;

export const Line = styled(Box)`
  background: #ffffff1a;
  width: 2px;
`;

// const SECONDS_PER_WEEK = 7 * 24 * 60 * 60;
const SECONDS_PER_WEEK = 60 * 60;

export const getCurrentEpoch = () => {
  const NOW = new Date().getTime() / 1000;
  return Math.floor(NOW / SECONDS_PER_WEEK);
};

const getCountdownToNextEpoch = () => {
  const NOW = Math.floor(new Date().getTime() / 1000);
  const currentEpoch = Math.floor(NOW / SECONDS_PER_WEEK);
  const nextEpochStartTime = (currentEpoch + 1) * SECONDS_PER_WEEK;

  let timeLeftInSeconds = nextEpochStartTime - NOW;
  if (timeLeftInSeconds < 0) {
    timeLeftInSeconds = 0;
  }

  const days = Math.floor(timeLeftInSeconds / (24 * 60 * 60));
  const hours = Math.floor((timeLeftInSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeftInSeconds % (60 * 60)) / 60);

  return `${days}d ${hours}h ${minutes}m`;
};

export const TopInfo = () => {
  const {
    currentMarketData,
    tokenXCLND,
    setTotalVotingPower,
    totalVotingPower,
    votersRewards,
    rewardEstimate,
  } = useRootStore((store) => store);
  const voteLogicAddress = currentMarketData.addresses.VOTELOGIC;
  const voteLogicContract = useVoteLogicContract(voteLogicAddress || '');
  const { currentAccount } = useWeb3Context();

  const getTotalVotingPower = async () => {
    try {
      if (voteLogicContract && currentAccount) {
        const balanceOf = await voteLogicContract.balanceOf(currentAccount);
        setTotalVotingPower(formatUnits(balanceOf, tokenXCLND.decimal).toString());
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getTotalVotingPower();
  }, [voteLogicContract, currentAccount]);

  const calculateTotalReward = (object: any) => {
    if (Object.keys(object).length === 0) {
      return 0;
    }

    return Object.values(object).reduce((total: number, value: any) => {
      return total + parseFloat(value);
    }, 0);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: '12px',
        ['@media screen and (max-width: 1248px)']: {
          flexDirection: 'column',
          gap: '20px',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', flex: '1', pt: '20px', flexDirection: { xs: 'column', xsm: 'row' } }}
      >
        <Box sx={{ flex: '1', pl: '20px' }}>
          <Typography
            color="#A5A8B3"
            sx={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}
          >
            <Trans>My total </Trans>{' '}
            <strong style={{ color: '#fff', fontWeight: 600 }}>
              <Trans>voting power</Trans>
            </strong>
          </Typography>
          <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-end', mt: '10px' }}>
            <FormattedNumber
              value={totalVotingPower}
              color={'common.white'}
              visibleDecimals={2}
              sx={{
                fontFamily: 'Work Sans',
                fontWeight: 600,
                fontSize: '40px',
                lineHeight: '100%',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Work Sans',
                fontWeight: 600,
                fontSize: '24px',
                color: '#fff',
              }}
            >
              xCLND
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: '1',
            pr: '20px',
            ['@media screen and (max-width: 1248px)']: {
              pl: '20px',
              pt: '28px',
            },
          }}
        >
          <Typography
            color="#A5A8B3"
            sx={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px' }}
          >
            <Trans>My rewards this </Trans>{' '}
            <strong style={{ color: '#fff', fontWeight: 600 }}>
              <Trans>Epoch #{getCurrentEpoch()}</Trans>
            </strong>
          </Typography>
          <FormattedNumber
            value={calculateTotalReward(rewardEstimate)}
            color={'common.white'}
            visibleDecimals={2}
            symbol="USD"
            sx={{
              fontFamily: 'Work Sans',
              fontWeight: 600,
              fontSize: '40px',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          background: '#151517',
          borderRadius: '16px',
          p: '32px',
          flex: '1',
          justifyContent: 'center',
          gap: '60px',
          ['@media screen and (max-width: 1248px)']: {
            flexDirection: 'column',
            gap: '16px',
          },
        }}
      >
        <Box
          sx={{
            width: '40%',
            ['@media screen and (max-width: 1248px)']: {
              width: '100%',
            },
          }}
        >
          <Typography
            color="#A5A8B3"
            sx={{
              fontFamily: 'Work Sans',
              fontWeight: 500,
              fontSize: '16px',
              mb: '4px',
            }}
          >
            <Trans>Total rewards accrued this </Trans>{' '}
          </Typography>
          <Box sx={{ display: 'flex', gap: '6px', mb: '16px' }}>
            <strong style={{ color: '#fff', fontWeight: 600, fontFamily: 'Work Sans' }}>
              <Trans>Epoch #{getCurrentEpoch()}</Trans>
            </strong>
            <TextWithTooltip iconSize={19}>
              <Typography sx={{ fontFamily: 'Work Sans', fontWeight: '500', fontSize: '16px' }}>
                -----
              </Typography>
            </TextWithTooltip>
          </Box>

          <FormattedNumber
            value={calculateTotalReward(votersRewards)}
            color={'common.white'}
            visibleDecimals={2}
            symbol="USD"
            sx={{
              fontFamily: 'Work Sans',
              fontWeight: 600,
              fontSize: '24px',
            }}
          />
        </Box>

        <Line
          sx={{
            ['@media screen and (max-width: 1248px)']: {
              width: '70%',
              height: '2px',
            },
          }}
        />

        <Box>
          <Typography
            color="common.white"
            sx={{ fontFamily: 'Work Sans', fontWeight: 700, fontSize: '16px' }}
          >
            <Trans>Next : Epoch #{getCurrentEpoch() + 1} </Trans>
          </Typography>

          <Typography
            color="#A5A8B3"
            sx={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '16px', mt: '16px' }}
          >
            <Trans>Starting in: </Trans>
          </Typography>

          <Typography
            color="common.white"
            sx={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '24px' }}
          >
            {getCountdownToNextEpoch()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

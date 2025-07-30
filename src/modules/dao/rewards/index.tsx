import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { useModalContext } from 'src/hooks/useModal';
import { useVoterContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Votes } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';

import ClaimIcon from '/public/icons/claimIcon.svg';

import { ButtonCastVote, WrapperPage } from '../governance';
import { RewardItem } from './RewardItem';

const listHeaderRewards = [
  {
    title: <Trans>ID</Trans>,
    key: 'id',
  },
  {
    title: <Trans>Type of Reward</Trans>,
    key: 'typeOfReward',
  },
  {
    title: <Trans>Tokens</Trans>,
    key: 'tokens',
  },
  {
    title: <Trans>Action</Trans>,
    key: 'action',
  },
];

export const Rewards = () => {
  const theme = useTheme();
  const { currentAccount, readOnlyMode } = useWeb3Context();
  const { openDaoSuccess, openDaoFail } = useModalContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { listVotes, loadingData, myRewardsTab, currentMarketData, setTxHash } = useRootStore(
    (store) => store
  );
  const voterAddress = currentMarketData.addresses.VOTER;
  const voterContract = useVoterContract(voterAddress || '');
  const [isConfirm, setIsConfirm] = useState(false);

  const getValueTotalRewards = () => {
    return Object.values(myRewardsTab).reduce(
      (total: number, value: any) => total + parseFloat(value),
      0
    );
  };

  const handleClaimAll = async () => {
    try {
      if (voterContract) {
        setIsConfirm(true);
        const _bribes = listVotes.map((item) => item.contractBribe);
        const _tokens = listVotes.map((item) => {
          return item.listIncentiveToken.map((incentive) => incentive.incentiveToken);
        });

        const paramsContract = [_bribes, _tokens, currentAccount];
        const claimReward = await voterContract.claimBribes(...paramsContract);
        const txHash = await claimReward.wait(1);
        setTxHash(txHash.transactionHash);
        setIsConfirm(false);
        openDaoSuccess('You have successfully claimed reward', '');
      }
    } catch (error) {
      console.log('error', error);
      openDaoFail();
      setIsConfirm(false);
    }
  };

  return (
    <Box>
      <WrapperPage>
        <Box
          sx={{
            boxShadow: '0px 4px 8px 0px #00000040',
            borderRadius: '16px',
            background: ' #1B1B1DE5',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            p: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: '24px',
              gap: '28px',
            }}
          >
            <ClaimIcon />

            <Typography
              sx={{
                fontFamily: 'Work Sans',
                fontSize: '20px',
                fontWeight: 500,
                ['@media screen and (max-width: 560px)']: {
                  fontSize: '14px',
                },
              }}
              color="#A5A8B3"
            >
              <Trans>Claim your voting incentives here.</Trans>
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              background: '#151517',
              borderRadius: '16px',
              p: '40px',
              justifyContent: 'center',
              gap: '60px',
              ['@media screen and (max-width: 1248px)']: {
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'center',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Typography
                sx={{
                  fontFamily: 'Work Sans',
                  fontSize: '20px',
                  fontWeight: 500,
                  ['@media screen and (max-width: 560px)']: {
                    fontSize: '16px',
                  },
                }}
                color="#A5A8B3"
              >
                <Trans>Total Rewards:</Trans>
              </Typography>
              <FormattedNumber
                symbol="USD"
                value={getValueTotalRewards() || 0}
                sx={{
                  fontFamily: 'Work Sans',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: '#fff',
                  ['@media screen and (max-width: 560px)']: {
                    fontSize: '16px',
                  },
                }}
                visibleDecimals={2}
              />
            </Box>

            <ButtonCastVote
              sx={{ fontSize: '12px', height: '41px !important' }}
              disabled={readOnlyMode || isConfirm || !Number(getValueTotalRewards())}
              onClick={handleClaimAll}
            >
              {isConfirm && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
              {isConfirm ? <Trans>Claiming All</Trans> : <Trans>Claim All</Trans>}
            </ButtonCastVote>
          </Box>
        </Box>

        {/* Table Rewards */}
        <Box sx={{ mt: '12px', width: '100%', overflow: 'auto' }}>
          <ListHeaderWrapper
            sx={{
              ['@media screen and (max-width: 560px)']: {
                width: 'fit-content',
                alignItems: 'center',
              },
            }}
          >
            {listHeaderRewards.map((col, index) => (
              <ListColumn
                key={index}
                align={col.key === 'id' ? 'center' : 'left'}
                minWidth={
                  col.key === 'action' && isMobile ? 70 : col.key === 'typeOfReward' ? 70 : 120
                }
              >
                <ListHeaderTitle>
                  <Typography
                    sx={{
                      ['@media screen and (max-width: 560px)']: {
                        fontSize: '10px',
                        whiteSpace: 'break-spaces',
                      },
                    }}
                  >
                    {' '}
                    {col.title}
                  </Typography>
                </ListHeaderTitle>
              </ListColumn>
            ))}
          </ListHeaderWrapper>
          {listVotes.length > 0 ? (
            listVotes.map((item: Votes, index: number) => <RewardItem key={index} data={item} />)
          ) : (
            <Box sx={{ textAlign: 'center', color: 'white', p: '24px' }}>
              {loadingData ? (
                <>
                  <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
                  <Trans>Loading...</Trans>
                </>
              ) : (
                <Trans>'No data</Trans>
              )}
            </Box>
          )}
        </Box>
      </WrapperPage>
    </Box>
  );
};

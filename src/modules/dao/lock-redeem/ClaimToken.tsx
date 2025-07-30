import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { useModalContext } from 'src/hooks/useModal';
import { useRewardsControllerContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { RedeemQueueType } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';

import { ButtonCastVote } from '../governance';
import { getCurrentEpoch } from '../governance/TopInfo';

export const ClaimToken = ({
  isCLND,
  getTokenInfo,
}: {
  isCLND?: boolean;
  getTokenInfo: () => void;
}) => {
  const theme = useTheme();
  const { openDaoSuccess, openDaoFail, openStartEpoch } = useModalContext();
  const [isConfirm, setIsConfirm] = useState(false);
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const {
    tokenCLND,
    tokenXCLND,
    listRedeemQueue,
    currentMarketData,
    listAssetRewards,
    setTxHash,
    currentEpochContract,
  } = useRootStore((store) => store);
  const { readOnlyMode, currentAccount } = useWeb3Context();
  const rewardsControllerAddress = currentMarketData.addresses.REWARDS_CONTROLLER;
  const CLNDAddress = currentMarketData.addresses.CLND;
  const rewardsControllerContract = useRewardsControllerContract(rewardsControllerAddress);
  const [xCLNDClaimable, setXCLNDClaimable] = useState('0');

  const now = Math.floor(Date.now() / 1000);

  const filteredRedeemExpired =
    listRedeemQueue.length > 0
      ? listRedeemQueue.filter((item) => {
          const endTime = parseInt(item.timestamp) + parseInt(item.duration);
          return endTime < now;
        })
      : [];

  const getXCLNDClaimable = async () => {
    try {
      if (rewardsControllerContract) {
        const params = [listAssetRewards, currentAccount, CLNDAddress];
        const allowanceToken = await rewardsControllerContract.getUserRewards(...params);
        const claimable = allowanceToken.toString();

        setXCLNDClaimable(claimable);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getXCLNDClaimable();
  }, [rewardsControllerContract]);

  const calculateTotalCLND = (array: RedeemQueueType[]) => {
    return array.reduce((total: any, item) => {
      const totalAmount = new BigNumber(total).plus(formatUnits(item.amount, tokenCLND.decimal));
      return totalAmount;
    }, 0);
  };

  const balanceClaimable = isCLND
    ? Number(calculateTotalCLND(filteredRedeemExpired))
    : Number(formatUnits(xCLNDClaimable, tokenXCLND.decimal));

  const handleClaimXCLND = async () => {
    if (currentEpochContract < getCurrentEpoch()) {
      openStartEpoch('Claim xCLND by clicking on the button below first');
      return;
    }
    try {
      if (rewardsControllerContract) {
        setIsConfirm(true);
        const paramsClaimContract = [listAssetRewards, xCLNDClaimable, CLNDAddress];
        const claimXCLND = await rewardsControllerContract.claimRewardsToSelf(
          ...paramsClaimContract
        );
        const txHash = await claimXCLND.wait(1);
        openDaoSuccess('You have successfully claimed reward', '');
        setTxHash(txHash.transactionHash);
        setIsConfirm(false);
        getXCLNDClaimable();
        getTokenInfo();
      }
    } catch (error) {
      console.log('error', error);
      openDaoFail();
      setIsConfirm(false);
    }
  };

  return (
    <Box
      sx={{
        width: '50%',
        pl: '50px',
        ['@media screen and (max-width: 1150px)']: {
          width: 'auto',
          pl: '8px',
        },
      }}
    >
      <Box>
        <Typography
          color="common.white"
          sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '44px', mb: '8px' }}
        >
          {isCLND ? 'CLND' : 'xCLND'}
        </Typography>

        <Box
          sx={{
            width: 'fit-content',
            ['@media screen and (max-width: 1150px)']: {
              width: '100%',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '100px',
              ['@media screen and (max-width: 1150px)']: {
                gap: '32px',
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Work Sans',
                  fontWeight: '500',
                  fontSize: '16px',
                  color: '#A5A8B3',
                  mb: '8px',
                }}
              >
                <Trans>Your balance:</Trans>
              </Typography>
              <FormattedNumber
                value={isCLND ? tokenCLND.balance : tokenXCLND.balance}
                color="#fff"
                visibleDecimals={2}
                sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '25px' }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: 'Work Sans',
                  fontWeight: '500',
                  fontSize: '16px',
                  color: '#A5A8B3',
                  mb: '8px',
                }}
              >
                <Trans>Claimable:</Trans>
              </Typography>
              <FormattedNumber
                value={balanceClaimable}
                visibleDecimals={2}
                color="#fff"
                sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '25px' }}
              />
            </Box>
          </Box>
          {!isCLND && (
            <Box sx={{ textAlign: 'center', mt: '32px', mx: isMd ? '20px' : '0' }}>
              <ButtonCastVote
                disabled={!Number(balanceClaimable) || readOnlyMode || isConfirm}
                onClick={handleClaimXCLND}
              >
                {isConfirm && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
                <Trans>{isConfirm ? 'Claiming xCLND' : 'Claim xCLND'}</Trans>
              </ButtonCastVote>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

import { Trans } from '@lingui/macro';
import { Box, CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { AssetInput } from 'src/components/transactions/AssetInput';
import { ButtonAction } from 'src/components/transactions/TxActionsWrapper';
import { useModalContext } from 'src/hooks/useModal';
import { useBribeContract, useTokenERC20Contract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Incentives } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';
import { roundToTokenDecimals } from 'src/utils/utils';

import { ApproveInfo } from '../lock-redeem/LockToken';
import { ButtonCastVote } from '.';
import { initTokenInfo, TokenType } from './ModalAddRewards';

type PropsType = {
  tokenInfo: TokenType;
  setTokenInfo: any;
  tokenSelected: Incentives | undefined;
  setAmountInput: any;
  amountInput: string;
  poolVoter: any;
};

export const AddRewardAction = ({
  setTokenInfo,
  tokenInfo,
  tokenSelected,
  setAmountInput,
  amountInput,
  poolVoter,
}: PropsType) => {
  const { openDaoSuccess, openDaoFail } = useModalContext();
  const { priceUsdTokens, setTxHash } = useRootStore((store) => store);
  const tokenContract = useTokenERC20Contract(tokenSelected?.tokenAddress || '');
  const bribeContract = useBribeContract(poolVoter.poolContract);
  const { currentAccount } = useWeb3Context();
  const [approveInfo, setApproveInfo] = useState<ApproveInfo>({
    allowance: '0',
    loading: false,
  });

  const getTokenInfo = async () => {
    try {
      if (tokenContract) {
        const decimals = await tokenContract.decimals();
        const balanceAvailable = await tokenContract.balanceOf(currentAccount);
        setTokenInfo({
          ...tokenInfo,
          balance: formatUnits(balanceAvailable, Number(decimals)).toString(),
        });
      } else {
        setTokenInfo(initTokenInfo);
      }
    } catch (error) {
      console.log('error', error);
      setTokenInfo(initTokenInfo);
    }
  };

  const getAllowance = async () => {
    try {
      if (poolVoter.poolContract && tokenContract) {
        const allowanceToken = await tokenContract.allowance(
          currentAccount,
          poolVoter.poolContract
        );

        setApproveInfo({
          ...approveInfo,
          allowance: allowanceToken.toString(),
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getTokenInfo();
    getAllowance();
  }, [tokenContract, poolVoter]);

  // Approve
  const handleApprove = async () => {
    try {
      if (tokenContract) {
        setApproveInfo({
          ...approveInfo,
          loading: true,
        });
        const amount = parseUnits(amountInput, tokenSelected?.decimal);

        const paramsApproveContract = [poolVoter.poolContract, amount.toString()];
        const approveXCLND = await tokenContract.approve(...paramsApproveContract);
        await approveXCLND.wait(1);
        setApproveInfo({
          ...approveInfo,
          loading: false,
        });
        getAllowance();
      }
    } catch (error) {
      console.log('error', error);

      setApproveInfo({
        ...approveInfo,
        loading: false,
      });
    }
  };

  const handleAddReward = async () => {
    try {
      if (bribeContract) {
        setTokenInfo({
          ...approveInfo,
          loadingVote: true,
        });
        const amount = parseUnits(amountInput, tokenSelected?.decimal);

        const paramsAddRewardContract = [tokenSelected?.tokenAddress, amount.toString()];
        const addReward = await bribeContract.notifyRewardAmount(...paramsAddRewardContract);
        const txHash = await addReward.wait(1);
        setTxHash(txHash.transactionHash);
        setAmountInput('');
        setTokenInfo({
          ...approveInfo,
          loadingVote: false,
        });
        openDaoSuccess('You have successfully added reward', '');
        getAllowance();
      }
    } catch (error) {
      console.log('error', error);

      setTokenInfo({
        ...approveInfo,
        loadingVote: false,
      });
      openDaoFail();
    }
  };

  const amountUSD =
    Number(priceUsdTokens[tokenSelected?.tokenAddress.toLowerCase() || '']) * Number(amountInput);

  const isEnableButtonApprove =
    Number(amountInput) &&
    BigNumber.from(approveInfo.allowance).lt(
      BigNumber.from(parseUnits(amountInput, tokenSelected?.decimal))
    );

  return (
    <Box>
      <AssetInput
        value={amountInput}
        onChange={(value) => {
          const maxSelected = value === '-1';
          const amount = maxSelected ? tokenInfo?.balance : value;
          const decimalTruncatedValue = roundToTokenDecimals(amount, tokenSelected?.decimal || 18);
          setAmountInput(decimalTruncatedValue);
        }}
        usdValue={amountUSD + ''}
        symbol={tokenSelected?.symbol || ''}
        assets={[
          {
            balance: tokenInfo?.balance,
            symbol: tokenSelected?.symbol || '',
            iconSymbol: tokenSelected?.symbol || '',
          },
        ]}
        isMaxSelected={false}
        maxValue={tokenInfo?.balance}
        balanceText={<Trans>Wallet balance</Trans>}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: '20px',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {isEnableButtonApprove ? (
          <ButtonAction
            variant="contained"
            disabled={approveInfo.loading}
            onClick={handleApprove}
            sx={{
              height: '32px',
              width: '100%',
              color: '#fff',
              mt: '12px',
              fontSize: '12px',
              fontFamily: 'Mulish',
            }}
            data-cy="approvalButton"
          >
            {approveInfo.loading ? (
              <>
                <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
                <Trans>Approving {tokenSelected?.symbol}...</Trans>
              </>
            ) : (
              <Trans>Approve {tokenSelected?.symbol} to continue</Trans>
            )}
          </ButtonAction>
        ) : (
          <></>
        )}
        <ButtonCastVote
          onClick={handleAddReward}
          disabled={tokenInfo.loadingVote || !!isEnableButtonApprove || Number(amountInput) === 0}
          sx={{ width: '100% !important', height: '32px !important', fontSize: '12px' }}
        >
          {tokenInfo.loadingVote && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
          <Trans>Reward voters</Trans>
        </ButtonCastVote>
      </Box>
    </Box>
  );
};

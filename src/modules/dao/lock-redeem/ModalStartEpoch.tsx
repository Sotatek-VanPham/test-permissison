import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import {
  useMinterContract,
  useMultical3Contract,
  useVoterContract,
} from 'src/libs/hooks/useContract';
import { useRootStore } from 'src/store/root';

import { ButtonCastVote } from '../governance';
import { getCurrentEpoch } from '../governance/TopInfo';

const Message = styled(Typography)`
  font-family: Mulish;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
`;

export const ModalDaoStartEpoch = () => {
  const { type, close, contentNewEpoch } = useModalContext();
  const { currentMarketData, setCurrentEpochContract } = useRootStore((store) => store);
  const minterAddress = currentMarketData.addresses.MINTER;
  const multicall3Address = currentMarketData.addresses.MULTICALL3_ADDRESS;
  const minterContract = useMinterContract(minterAddress);
  const voterAddress = currentMarketData.addresses.VOTER;
  const voterContract = useVoterContract(voterAddress || '');
  const [isConfirm, setIsConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const multical3Contract = useMultical3Contract(multicall3Address || '');

  const handleStartNewEpoch = async () => {
    try {
      setErrorMessage('');
      if (minterContract && voterContract && multical3Contract) {
        setIsConfirm(true);
        // const updatePeriod = await minterContract.update_period();
        // await updatePeriod.wait(1);

        // const notifyRewards = await minterContract.notifyRewards();
        // await notifyRewards.wait(1);

        const updatePeriodCallData = minterContract.interface.encodeFunctionData('update_period');
        const notifyRewardsCallData = minterContract.interface.encodeFunctionData('notifyRewards');

        const calls = [
          { target: minterAddress, callData: updatePeriodCallData },
          { target: minterAddress, callData: notifyRewardsCallData },
        ];
        const multicalUpdateGasEstimate = await multical3Contract.estimateGas.tryAggregate(
          true,
          calls
        );

        const multicalUpdate = await multical3Contract.tryAggregate(true, calls, {
          gasLimit: multicalUpdateGasEstimate,
        });
        await multicalUpdate.wait(1);
        const currentEpoch = await voterContract.epoch();
        setCurrentEpochContract(Number(currentEpoch));
        setIsConfirm(false);
        close();
      }
    } catch (error) {
      console.log('error', error);
      if (error?.data?.message?.includes('only trigger')) {
        setErrorMessage('This epoch has already started!');
        if (voterContract) {
          const currentEpoch = await voterContract.epoch();
          setCurrentEpochContract(Number(currentEpoch));
        }
      }

      setIsConfirm(false);
    }
  };

  return (
    <BasicModal open={type === ModalType.NewEpoch} setOpen={close}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            mt: '48px',
            mb: '32px',
          }}
        >
          {' '}
          <Message>
            <Trans>{contentNewEpoch}</Trans>
          </Message>
        </Box>

        {errorMessage && (
          <Typography color="red" sx={{ mb: '28px' }}>
            {errorMessage}
          </Typography>
        )}

        <ButtonCastVote onClick={handleStartNewEpoch} disabled={isConfirm || !!errorMessage}>
          {isConfirm && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
          {isConfirm ? (
            <Trans>Starting...</Trans>
          ) : (
            <Trans> Start Epoch #{getCurrentEpoch()}</Trans>
          )}
        </ButtonCastVote>
      </Box>
    </BasicModal>
  );
};

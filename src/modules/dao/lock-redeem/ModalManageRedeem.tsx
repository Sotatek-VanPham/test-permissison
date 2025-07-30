import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { useTokenXCLNDContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { ButtonCastVote } from '../governance';
import { DurationType, TextMedium } from './LockToken';
import { ProgressBar, RATE_CONFIG } from './ProcessBar';

const TextThin = styled(Typography)`
  font-family: Mulish;
  font-size: 15px;
  font-weight: 400;
  color: #fff;
`;

export const ButtonExtendDuration = styled(ButtonCastVote)`
  height: 38px;
  width: 100%;
  font-size: 12px;
`;

export const ButtonCancel = styled(ButtonExtendDuration)`
  background: #ff42281f;
  color: #da3e3e !important;
  white-space: break-spaces;
  line-height: normal;

  &:hover {
    opacity: 0.8;
  }
`;

const calculateNewTime = (duration: number, startTime: number) => {
  const endTime = (duration || 0) + startTime;
  const date = new Date(endTime * 1000);

  const formattedDate =
    date.getUTCFullYear() +
    '/' +
    (date.getUTCMonth() + 1).toString().padStart(2, '0') +
    '/' +
    date.getUTCDate().toString().padStart(2, '0');

  return formattedDate;
};

export const ModalManageRedeem = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentAccount } = useWeb3Context();
  const { type, close, openConfirmRedeem, redeemSelected, openDaoSuccess, openDaoFail } =
    useModalContext();
  const [infoDuration, setInfoDuration] = useState<DurationType | undefined>();
  const [isConfirm, setIsConfirm] = useState(false);
  const { tokenCLND, tokenXCLND, indexRedeem, currentMarketData, setTxHash } = useRootStore(
    (store) => store
  );
  const XCLNDAddress = currentMarketData.addresses.XCLND;
  const XCLNDContract = useTokenXCLNDContract(XCLNDAddress || '');

  const preAmount = Number(formatUnits(redeemSelected?.amount || '0', tokenCLND.decimal));
  const amountXCLND = Number(formatUnits(redeemSelected?.xAmount || '0', tokenXCLND.decimal));
  const newAmount = infoDuration?.ratio
    ? Number(new BigNumber(infoDuration?.ratio).times(amountXCLND))
    : preAmount;

  const calculateIncreaseAmount = () => {
    if (infoDuration && Number(infoDuration?.duration) > Number(redeemSelected?.duration)) {
      return new BigNumber(newAmount).minus(preAmount).decimalPlaces(2).toString();
    }
    return 0;
  };

  const valueLabelFormat = () => {
    return '+' + calculateIncreaseAmount() + ' CLND';
  };

  const handleExtendDuration = async () => {
    try {
      setIsConfirm(true);
      if (XCLNDContract && currentAccount) {
        const _extendDuration = Number(infoDuration?.duration) - Number(redeemSelected?.duration);
        const paramsExtenDurationContract = [indexRedeem, _extendDuration];
        const extendDuration = await XCLNDContract.extendRedeem(...paramsExtenDurationContract);
        const txHash = await extendDuration.wait(1);
        setTxHash(txHash.transactionHash);
        setIsConfirm(false);
        setInfoDuration(undefined);
        openDaoSuccess('Redemption Request has been extended successfully', '');
      }
    } catch (error) {
      setInfoDuration(undefined);
      openDaoFail();
      console.log('error', error);
      setIsConfirm(false);
    }
  };
  return (
    <BasicModal
      open={type === ModalType.ManageRedeem}
      setOpen={() => {
        close();
        setInfoDuration(undefined);
      }}
      contentMaxWidth={532}
    >
      <Box sx={{ py: '12px', px: { xs: '0px', xsm: '20px' } }}>
        {' '}
        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: 'Work Sans',
            fontWeight: '600',
            fontSize: '28px',
          }}
          color="common.white"
        >
          <Trans>Manage</Trans>
        </Typography>
        <TextMedium sx={{ py: '8px' }}>
          {' '}
          <Trans>
            Extend the duration to recover more CLND or click on 'Cancel' to restore your voting
            power and governance rewards.
          </Trans>
        </TextMedium>
        {/* Slider  */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ProgressBar
            setInfoDuration={(value: DurationType | undefined) => setInfoDuration(value)}
            infoDuration={infoDuration}
            valueLabelFormat={valueLabelFormat}
            valueDefault={Number(redeemSelected?.duration)}
          />
          <Typography
            sx={{ fontFamily: 'Work Sans', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
            color="common.white"
            onClick={() => setInfoDuration({ ...RATE_CONFIG[RATE_CONFIG.length - 1] })}
          >
            <Trans>MAX</Trans>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '8px' }}>
          <TextThin>
            <Trans>New Estimated Date</Trans>
          </TextThin>
          <TextThin>
            {calculateNewTime(Number(infoDuration?.duration), Number(redeemSelected?.timestamp))}
          </TextThin>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '8px' }}>
          <TextThin>
            <Trans>New CLND output </Trans>
          </TextThin>
          <Typography
            sx={{
              fontFamily: 'Work Sans',
              fontSize: '14px',
              color: Number(calculateIncreaseAmount()) > 0 ? '#34C759' : '#fff',
            }}
          >
            <strong style={{ color: '#fff' }}>{newAmount.toFixed(2)} CLND</strong> (+
            {calculateIncreaseAmount()})
          </Typography>
        </Box>
        {infoDuration && calculateIncreaseAmount() === 0 && (
          <Typography color="red" sx={{ mt: '28px', textAlign: 'center' }}>
            <Trans>You can extend more redeem duration only</Trans>
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: '16px', px: { xs: '0px', xsm: '24px' }, pt: '24px' }}>
          <ButtonCancel
            onClick={() => {
              setInfoDuration(undefined);
              openConfirmRedeem();
            }}
          >
            {isMobile ? (
              <Trans>Cancel Redeem</Trans>
            ) : (
              <Trans>Cancel Redeem & Recover voting power</Trans>
            )}
          </ButtonCancel>
          <ButtonExtendDuration
            onClick={handleExtendDuration}
            disabled={isConfirm || calculateIncreaseAmount() === 0}
          >
            {isConfirm && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
            {isConfirm ? <Trans>Extending...</Trans> : <Trans>Extend duration</Trans>}
          </ButtonExtendDuration>
        </Box>
      </Box>
    </BasicModal>
  );
};

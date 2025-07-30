import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { useTokenXCLNDContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { getCurrentEpoch } from '../governance/TopInfo';
import { ButtonCancel, ButtonExtendDuration } from './ModalManageRedeem';

const TextStyle = styled(Typography)`
  text-align: center;
  font-family: Mulish;
  color: #fff;
`;

export const ModalWarningRedeem = () => {
  const { type, close, openDaoSuccess, openDaoFail, openStartEpoch } = useModalContext();
  const { currentAccount } = useWeb3Context();
  const { indexRedeem, currentMarketData, setTxHash, currentEpochContract } = useRootStore(
    (store) => store
  );
  const XCLNDAddress = currentMarketData.addresses.XCLND;
  const XCLNDContract = useTokenXCLNDContract(XCLNDAddress || '');
  const [isConfirm, setIsConfirm] = useState(false);

  const handleCancelRedeem = async () => {
    if (currentEpochContract < getCurrentEpoch()) {
      openStartEpoch('Cancel your redeem by clicking on the button below');
      return;
    }
    try {
      setIsConfirm(true);
      if (XCLNDContract && currentAccount) {
        const paramsCancelContract = [indexRedeem];
        const cancelRedemm = await XCLNDContract.cancelRedeem(...paramsCancelContract);
        const txHash = await cancelRedemm.wait(1);
        setTxHash(txHash.transactionHash);
        openDaoSuccess('Redemption Request has been cancelled', 'Please check your xCLND balance!');
        setIsConfirm(false);
      }
    } catch (error) {
      openDaoFail();
      console.log('error', error);
      setIsConfirm(false);
    }
  };

  return (
    <BasicModal open={type === ModalType.ConfirmRedeem} setOpen={close} contentMaxWidth={532}>
      <Box sx={{ py: '12px', px: { xs: '0px', xsm: '20px' } }}>
        {' '}
        <TextStyle
          sx={{
            fontWeight: '700',
            fontSize: '24px',
          }}
        >
          <Trans>Are you sure?</Trans>
        </TextStyle>
        <TextStyle
          sx={{
            fontWeight: '400',
            fontSize: '16px',
            py: '12px',
          }}
        >
          <Trans>Are you sure to recover your voting power ?</Trans>
        </TextStyle>
        <Box
          sx={{
            background: '#4D547026',
            borderRadius: '10px',
            p: '10px',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Mulish',
              fontWeight: 400,
              fontSize: '11px',
              color: '#fff',
              fontStyle: 'italic',
              lineHeight: '13.81px',
            }}
          >
            <Trans>
              By clicking "Yes," you’ll restore your voting power, making you eligible for rewards
              through governance participation. While you’ll stop the current unlocking process and
              forfeit additional CLND recovery, you can always start a new redeem process later.
            </Trans>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '16px', px: { xs: '0px', xsm: '24px' }, pt: '24px' }}>
          <ButtonCancel onClick={() => close()}>
            <Trans>CANCEL</Trans>
          </ButtonCancel>
          <ButtonExtendDuration onClick={() => handleCancelRedeem()} disabled={isConfirm}>
            {isConfirm && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
            <Trans>{isConfirm ? 'CONFIRMING' : 'YES'}</Trans>
          </ButtonExtendDuration>
        </Box>
      </Box>
    </BasicModal>
  );
};

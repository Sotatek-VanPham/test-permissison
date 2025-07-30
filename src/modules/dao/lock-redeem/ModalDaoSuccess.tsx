import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { TxSuccessView } from 'src/components/transactions/FlowCommons/Success';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Message } from 'src/modules/airdrop/ModalClaimFail';
import { useRootStore } from 'src/store/root';
import { networkConfigs } from 'src/ui-config/networksConfig';

export const ModalDaoSuccess = () => {
  const { type, close, message } = useModalContext();
  const { chainId } = useWeb3Context();
  const txHash = useRootStore((state) => state.txHash);

  const linkScan = networkConfigs[chainId]?.explorerLink;
  return (
    <BasicModal open={type === ModalType.DaoSuccess} setOpen={close}>
      <TxSuccessView
        customTextDao={
          <Box>
            {' '}
            <Message>
              <Trans>{message?.text1}</Trans>
            </Message>
            <Message>
              <Trans>{message?.text2}</Trans>
            </Message>
          </Box>
        }
        txHashClaim={`${linkScan}/tx/${txHash}`}
      />
    </BasicModal>
  );
};

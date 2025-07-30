import { Trans } from '@lingui/macro';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { TxSuccessView } from 'src/components/transactions/FlowCommons/Success';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';
import { useRootStore } from 'src/store/root';
import { networkConfigs } from 'src/ui-config/networksConfig';

export const ModalClaimSuccess = () => {
  const { type, close } = useModalContext();
  const { chainId } = useWeb3Context();
  const tokenReward = useRootStore((state) => state.tokenReward);
  const addToken: ERC20TokenType = {
    address: tokenReward.address,
    symbol: tokenReward.symbol,
    decimals: tokenReward.decimals,
    sToken: false,
  };
  const linkScan = networkConfigs[chainId]?.explorerLink;
  return (
    <BasicModal open={type === ModalType.Claim} setOpen={close}>
      <TxSuccessView
        action={<Trans>Claimed</Trans>}
        symbol={tokenReward.symbol}
        addToken={addToken}
        txHashClaim={`${linkScan}/tx/${tokenReward.txHash}`}
      />
    </BasicModal>
  );
};

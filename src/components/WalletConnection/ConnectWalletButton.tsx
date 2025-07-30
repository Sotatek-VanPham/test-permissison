import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import React from 'react';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

import { WalletModal } from './WalletModal';

export interface ConnectWalletProps {
  funnel?: string;
}

export const ConnectWalletButton: React.FC<ConnectWalletProps> = ({ funnel }) => {
  const { setWalletModalOpen } = useWalletModalContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <>
      <Button
        onClick={() => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          setWalletModalOpen(true);
        }}
        sx={(theme) => ({
          color: '#1A1A1C',
          backgroundColor: '#FF4228',
          fontWeight: '700',
          borderColor: theme.palette.primary.main,
          fontFamily: 'Mulish',
          fontSize: '14px',
          borderRadius: '6px',
          '&:hover': {
            color: '#1A1A1C',
            opacity: '0.8',
            backgroundColor: '#FF4228',
            borderColor: theme.palette.primary.main,
          },
        })}
      >
        <Trans>Connect wallet</Trans>
      </Button>
      <WalletModal />
    </>
  );
};

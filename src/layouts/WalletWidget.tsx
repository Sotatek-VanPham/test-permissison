import {
  // ClockIcon,
  DuplicateIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Skeleton,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
// import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AvatarSize } from 'src/components/Avatar';
import { CompactMode } from 'src/components/CompactableTypography';
import { Warning } from 'src/components/primitives/Warning';
import { UserDisplay } from 'src/components/UserDisplay';
import { WalletModal } from 'src/components/WalletConnection/WalletModal';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { CHAIN_SUPPORT } from 'src/ui-config/networksConfig';
import { AUTH, GENERAL } from 'src/utils/mixPanelEvents';

import {
  Link,
  // ROUTES
} from '../components/primitives/Link';
import { ENABLE_TESTNET, getNetworkConfig, STAGING_ENV } from '../utils/marketsAndNetworksConfig';
import { DrawerWrapper } from './components/DrawerWrapper';
import { MobileCloseButton } from './components/MobileCloseButton';

export const ButtonConnect = styled(Button)(() => ({
  background: '#DA3E3E',
  border: 'none',
  fontSize: '12px',
  color: '#1A1A1C',
  fontWeight: 700,
  '&:hover': {
    background: '#DA3E3E',
    opacity: 0.7,
  },
})) as typeof Button;

interface WalletWidgetProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

export default function WalletWidget({ open, setOpen, headerHeight }: WalletWidgetProps) {
  const {
    disconnectWallet,
    currentAccount,
    connected,
    chainId,
    loading,
    readOnlyModeAddress,
    switchNetwork,
  } = useWeb3Context();

  // const router = useRouter();
  const { setWalletModalOpen } = useWalletModalContext();

  const { breakpoints } = useTheme();
  const xsm = useMediaQuery(breakpoints.down('xsm'));
  const md = useMediaQuery(breakpoints.down('md'));
  const trackEvent = useRootStore((store) => store.trackEvent);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const networkConfig = getNetworkConfig(chainId);
  const isWrongNetwork = ![CHAIN_SUPPORT.core_testnet, CHAIN_SUPPORT.core_mainnet].includes(
    chainId || 1115
  );

  let networkColor = '';
  if (networkConfig?.isFork) {
    networkColor = '#ff4a8d';
  } else if (networkConfig?.isTestnet) {
    networkColor = '#FF4228';
  } else {
    networkColor = '#FF4228';
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!connected) {
      trackEvent(GENERAL.OPEN_MODAL, { modal: 'Connect Wallet' });
      setWalletModalOpen(true);
    } else {
      if (isWrongNetwork) {
        const chainID = process.env.NEXT_PUBLIC_CHAIN_ID || CHAIN_SUPPORT.core_mainnet;
        switchNetwork(Number(chainID));
      } else {
        setOpen(true);
        setAnchorEl(event.currentTarget);
      }
    }
  };

  const handleDisconnect = () => {
    if (connected) {
      disconnectWallet();
      trackEvent(AUTH.DISCONNECT_WALLET);
      handleClose();
    }
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(currentAccount);
    trackEvent(AUTH.COPY_ADDRESS);
    handleClose();
  };

  const handleSwitchWallet = (): void => {
    setWalletModalOpen(true);
    trackEvent(AUTH.SWITCH_WALLET);
    handleClose();
  };

  const handleViewOnExplorer = (): void => {
    trackEvent(GENERAL.EXTERNAL_LINK, { Link: 'Etherscan for Wallet' });
    handleClose();
  };

  const hideWalletAccountText = xsm && (ENABLE_TESTNET || STAGING_ENV || readOnlyModeAddress);

  const Content = ({ component = ListItem }: { component?: typeof MenuItem | typeof ListItem }) => (
    <>
      <Typography
        variant="subheader2"
        sx={{
          display: { xs: 'block', md: 'none' },
          color: '#fff',
          px: 4,
          py: 2,
        }}
      >
        <Trans>Account</Trans>
      </Typography>

      <Box component={component} disabled>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <UserDisplay
            avatarProps={{ size: AvatarSize.XL }}
            titleProps={{
              typography: 'h4',
              addressCompactMode: CompactMode.MD,
            }}
            subtitleProps={{
              addressCompactMode: CompactMode.LG,
              typography: 'caption',
            }}
          />
          {readOnlyModeAddress && (
            <Warning
              icon={false}
              severity="warning"
              sx={{
                mt: 3,
                mb: 0,
                background: 'transparent !important',
                color: '#FF4228',
                border: '2px solid #FF42284D !important',
                borderRadius: '6px !important',
                padding: '4px 8px',
              }}
            >
              <Trans>Read-only mode.</Trans>
            </Warning>
          )}
        </Box>
      </Box>
      {!md && (
        <Box sx={{ display: 'flex', flexDirection: 'row', padding: '0 16px 10px' }}>
          <Button
            sx={{
              padding: '0 5px',
              marginRight: '10px',
              background: '#DA3E3E',
              color: '#1A1A1C',
              '&:hover': {
                background: '#DA3E3E',
              },
            }}
            size="small"
            onClick={handleSwitchWallet}
          >
            Switch wallet
          </Button>
          <Button
            sx={{
              padding: '0 5px',
              background: '#DA3E3E',
              color: '#1A1A1C',
              '&:hover': {
                background: '#DA3E3E',
              },
            }}
            size="small"
            onClick={handleDisconnect}
            data-cy={`disconnect-wallet`}
          >
            Disconnect
          </Button>
        </Box>
      )}
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: '#FFFFFF1A' }} />

      <Box component={component} disabled>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              color={{ xs: '#FFFFFFB2', md: 'text.secondary', fontSize: '14px' }}
            >
              <Trans>Network</Trans>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                bgcolor: networkColor,
                width: 6,
                height: 6,
                mr: 2,
                boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
                borderRadius: '50%',
              }}
            />
            <Typography
              color={{ xs: '#F1F1F3', md: '#fff' }}
              variant="subheader1"
              sx={{ fontFamily: 'Mulish' }}
            >
              {networkConfig.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: '#FFFFFF1A' }} />

      {/* <Box
        component={component}
        sx={{ color: { xs: '#F1F1F3', md: 'text.primary', cursor: 'pointer' } }}
        onClick={() => {
          setOpen(false);
          router.push(ROUTES.history);
          trackEvent(AUTH.VIEW_TX_HISTORY);
        }}
      >
        <ListItemIcon
          sx={{
            color: {
              xs: '#F1F1F3',
              md: 'primary.light',
              minWidth: 'unset',
              marginRight: 12,
            },
          }}
        >
          <SvgIcon fontSize="small">
            <ClockIcon />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText sx={{ fontFamily: 'Mulish' }}>
          <Trans>Transaction history</Trans>
        </ListItemText>
      </Box> */}

      <Box
        component={component}
        sx={{ color: { xs: '#F1F1F3', md: '#fff', cursor: 'pointer' } }}
        onClick={handleCopy}
      >
        <ListItemIcon
          sx={{
            color: {
              xs: '#F1F1F3',
              md: 'primary.light',
              minWidth: 'unset',
              marginRight: 12,
            },
          }}
        >
          <SvgIcon fontSize="small">
            <DuplicateIcon />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText sx={{ fontFamily: 'Mulish' }}>
          <Trans>Copy address</Trans>
        </ListItemText>
      </Box>

      {networkConfig?.explorerLinkBuilder && (
        <Link href={networkConfig.explorerLinkBuilder({ address: currentAccount })}>
          <Box
            component={component}
            sx={{ color: { xs: '#F1F1F3', md: 'text.primary' } }}
            onClick={handleViewOnExplorer}
          >
            <ListItemIcon
              sx={{
                color: {
                  xs: '#F1F1F3',
                  md: 'primary.light',
                  minWidth: 'unset',
                  marginRight: 12,
                },
              }}
            >
              <SvgIcon fontSize="small">
                <ExternalLinkIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText sx={{ fontFamily: 'Mulish', color: '#fff' }}>
              <Trans>View on Explorer</Trans>
            </ListItemText>
          </Box>
        </Link>
      )}
      {md && (
        <>
          <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: '#FFFFFF1A' }} />
          <Box sx={{ padding: '16px 16px 10px' }}>
            <ButtonConnect
              sx={{
                marginBottom: '16px',
              }}
              fullWidth
              size="large"
              onClick={handleSwitchWallet}
            >
              Switch wallet
            </ButtonConnect>
            <ButtonConnect fullWidth size="large" onClick={handleDisconnect}>
              Disconnect
            </ButtonConnect>
          </Box>
        </>
      )}
    </>
  );

  return (
    <>
      {md && connected && open ? (
        <MobileCloseButton setOpen={setOpen} />
      ) : loading ? (
        <Skeleton height={28} width={126} sx={{ background: '#383D51' }} />
      ) : (
        <Button
          variant="surface"
          aria-label="wallet"
          id="wallet-button"
          aria-controls={open ? 'wallet-button' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          sx={{
            whiteSpace: 'nowrap',
            p: connected ? '4px 8px' : undefined,
            minWidth: hideWalletAccountText ? 'unset' : undefined,
            background: 'rgba(27, 27, 29, 0.69)',
            borderRadius: '4px',
            border: 'none',
            height: '28px',
            ['@media screen and (max-width: 560px)']: {
              height: '32px',
            },
          }}
          endIcon={
            connected &&
            !isWrongNetwork &&
            !hideWalletAccountText &&
            !md && (
              <SvgIcon
                sx={{
                  display: { xs: 'none', md: 'block' },
                }}
              >
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </SvgIcon>
            )
          }
        >
          {connected ? (
            isWrongNetwork ? (
              <Trans> Wrong network </Trans>
            ) : (
              <UserDisplay
                avatarProps={{ size: AvatarSize.SM }}
                oneLiner={true}
                titleProps={{ variant: 'buttonM' }}
              />
            )
          ) : (
            <Trans> Connect wallet </Trans>
          )}
        </Button>
      )}

      {md ? (
        <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>
          <List sx={{ px: 2, '.MuiListItem-root.Mui-disabled': { opacity: 1 } }}>
            <Content />
          </List>
        </DrawerWrapper>
      ) : (
        <Menu
          id="wallet-menu"
          MenuListProps={{
            'aria-labelledby': 'wallet-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          keepMounted={true}
          sx={{
            '.MuiPaper-root': { background: '#342A2B', border: 'none', borderRadius: '12px' },
          }}
        >
          <MenuList disablePadding sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}>
            <Content component={MenuItem} />
          </MenuList>
        </Menu>
      )}

      <WalletModal />
    </>
  );
}

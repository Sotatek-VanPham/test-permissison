import { ExternalLinkIcon } from '@heroicons/react/outline';
import { CheckIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Box, Button, Link, SvgIcon, Typography, useTheme } from '@mui/material';
import { InterestRate } from 'colend-contract-helpers';
import { ReactNode, useState } from 'react';
import { WalletIcon } from 'src/components/icons/WalletIcon';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Base64Token, TokenIcon } from 'src/components/primitives/TokenIcon';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';

export type SuccessTxViewProps = {
  txHash?: string;
  action?: ReactNode;
  amount?: string;
  symbol?: string;
  collateral?: boolean;
  rate?: InterestRate;
  addToken?: ERC20TokenType;
  customAction?: ReactNode;
  customText?: ReactNode;
  txHashClaim?: string;
  customTextDao?: ReactNode;
};

const ExtLinkIcon = () => (
  <SvgIcon sx={{ ml: '2px', fontSize: '11px' }}>
    <ExternalLinkIcon />
  </SvgIcon>
);

export const TxSuccessView = ({
  txHash,
  action,
  amount,
  symbol,
  collateral,
  rate,
  addToken,
  customAction,
  customText,
  txHashClaim,
  customTextDao,
}: SuccessTxViewProps) => {
  const { close, mainTxState } = useModalContext();
  const { addERC20Token } = useWeb3Context();
  const { currentNetworkConfig } = useProtocolDataContext();
  const [base64, setBase64] = useState('');
  const theme = useTheme();

  return (
    <>
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
            width: '48px',
            height: '48px',
            bgcolor: 'success.200',
            borderRadius: '50%',
            mt: 14,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgIcon sx={{ color: 'success.main', fontSize: '32px' }}>
            <CheckIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 4, color: '#fff' }} variant="h2">
          <Trans>All done!</Trans>
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {action && amount && symbol && (
            <Typography color="#fff">
              <Trans>
                You {action}{' '}
                <FormattedNumber value={Number(amount)} compact variant="secondary14" /> {symbol}
              </Trans>
            </Typography>
          )}

          {customTextDao && <Typography color="#fff">{customTextDao}</Typography>}

          {customAction && (
            <Typography color="#fff">
              {customText}
              {customAction}
            </Typography>
          )}

          {!action && !amount && symbol && (
            <Typography color="#fff">
              Your {symbol} {collateral ? 'now' : 'is not'} used as collateral
            </Typography>
          )}

          {rate && (
            <Typography color="#fff">
              <Trans>
                You switched to {rate === InterestRate.Variable ? 'variable' : 'stable'} rate
              </Trans>
            </Typography>
          )}

          {addToken && symbol && (
            <Box
              sx={(theme) => ({
                border:
                  theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
                background: 'rgba(91, 103, 145, 0.25)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mt: '24px',
              })}
            >
              <TokenIcon
                symbol={addToken.symbol}
                aToken={addToken && addToken.sToken ? true : false}
                sx={{ fontSize: '32px', mt: '12px', mb: '8px' }}
              />
              <Typography variant="description" color="#fff" sx={{ mx: '24px' }}>
                <Trans>
                  Add {addToken && addToken.sToken ? 'aCoreToken ' : 'token '} to wallet to track
                  your balance.
                </Trans>
              </Typography>
              <Button
                onClick={() => {
                  addERC20Token({
                    address: addToken.address,
                    decimals: addToken.decimals,
                    symbol: addToken.sToken ? `aCore${addToken.symbol}` : addToken.symbol,
                    image: !/_/.test(addToken.symbol) ? base64 : undefined,
                  });
                }}
                variant={theme.palette.mode === 'dark' ? 'outlined' : 'contained'}
                size="medium"
                sx={{
                  mt: '8px',
                  mb: '12px',
                  background: '#DA3E3E',
                  '&:hover': {
                    background: '#DA3E3E',
                    opacity: 0.7,
                  },
                }}
              >
                {addToken.symbol && !/_/.test(addToken.symbol) && (
                  <Base64Token
                    symbol={addToken.symbol}
                    onImageGenerated={setBase64}
                    aToken={addToken.sToken}
                  />
                )}
                <WalletIcon sx={{ width: '20px', height: '20px' }} />
                <Typography variant="buttonM" color="#0B0B0B" ml="4px" sx={{ fontSize: '15px' }}>
                  <Trans>Add to wallet</Trans>
                </Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Link
          variant="helperText"
          href={
            txHashClaim
              ? txHashClaim
              : currentNetworkConfig.explorerLinkBuilder({
                  tx: txHash ? txHash : mainTxState.txHash,
                })
          }
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'right',
            mt: 6,
            mb: 3,
            color: '#fff',
          }}
          underline="hover"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Trans>Review tx details</Trans>
          <ExtLinkIcon />
        </Link>
        <Button
          onClick={close}
          variant="contained"
          sx={{
            minHeight: '44px',
            background: '#DA3E3E',
            color: '#0B0B0B',
            fontWeight: '700',
            fontFamily: 'Mulish',
            fontSize: '15px',
            '&:hover': {
              background: '#DA3E3E',
              opacity: 0.7,
            },
          }}
          data-cy="closeButton"
        >
          <Trans>Ok, Close</Trans>
        </Button>
      </Box>
    </>
  );
};

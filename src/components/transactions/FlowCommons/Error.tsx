import { DuplicateIcon, XIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { useModalContext } from 'src/hooks/useModal';
import { TxErrorType } from 'src/ui-config/errorMapping';

export const TxErrorView = ({ txError }: { txError: TxErrorType }) => {
  const { close } = useModalContext();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: '92px',
        }}
      >
        <Box
          sx={{
            width: '48px',
            height: '48px',
            backgroundColor: 'error.200',
            borderRadius: '50%',
            mt: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgIcon sx={{ color: 'error.main', fontSize: '32px' }}>
            <XIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ marginTop: '20px' }} variant="h2" color="common.white">
          <Trans>Transaction failed</Trans>
        </Typography>

        {/* Please replace your colend github link below in the future  */}
        {/* <Typography color="common.white">
          <Trans>
            You can report incident to our{' '}
            <Link href="https://github.com/colend-protocol/interface" sx={{ color: '#FF4228' }}>
              Github
            </Link>
            .
          </Trans>
        </Typography> */}

        <Button
          onClick={() => navigator.clipboard.writeText(txError.rawError.message.toString())}
          sx={{
            mt: 6,
            background: '#FF4228',
            color: '#1A1A1C',
            fontSize: '15px',
            '&:hover': {
              background: '#FF4228',
              opacity: 0.7,
            },
          }}
        >
          <Trans>Copy error text</Trans>

          <SvgIcon sx={{ ml: 0.5, fontSize: '16px' }}>
            <DuplicateIcon />
          </SvgIcon>
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          onClick={close}
          variant="contained"
          size="large"
          sx={{
            minHeight: '44px',
            background: '#FF4228',
            color: '#1A1A1C',
            fontSize: '15px',
            '&:hover': {
              background: '#FF4228',
              opacity: 0.7,
            },
          }}
        >
          <Trans>Close</Trans>
        </Button>
      </Box>
    </>
  );
};

import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { ModalType, useModalContext } from 'src/hooks/useModal';

import { Button } from './AirdropItem';

export const Message = styled(Typography)`
  font-family: Mulish;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
`;

export const ModalClaimFail = () => {
  const { message, type, close } = useModalContext();

  return (
    <BasicModal open={type === ModalType.ClaimFail} setOpen={close}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: '700',
            marginTop: '32px',
          }}
          color="common.white"
        >
          <Trans>Claim failed!</Trans>
        </Typography>

        <Box
          sx={{
            margin: '28px 0',
          }}
        >
          {' '}
          <Message>
            <Trans>{message?.text1}</Trans>
          </Message>
          <Message>
            <Trans>{message?.text2}</Trans>
          </Message>
        </Box>

        <Button
          bgColor="#DA3E3E"
          borderColor="#DA3E3E"
          color="white"
          onClick={() => window.location.reload()}
        >
          <Trans> REFRESH</Trans>
        </Button>
      </Box>
    </BasicModal>
  );
};

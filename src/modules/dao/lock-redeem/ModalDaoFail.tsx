import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { Button } from 'src/modules/airdrop/AirdropItem';

const Message = styled(Typography)`
  font-family: Mulish;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
`;

export const ModalDaoFail = () => {
  const { type, close } = useModalContext();

  return (
    <BasicModal open={type === ModalType.DaoFail} setOpen={close}>
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
          <Trans>Failed!</Trans>
        </Typography>

        <Box
          sx={{
            margin: '28px 0',
          }}
        >
          {' '}
          <Message>
            <Trans>The transaction has just been rejected.</Trans>
          </Message>
        </Box>

        <Button bgColor="#DA3E3E" borderColor="#DA3E3E" color="white" onClick={() => close()}>
          <Trans> CLOSE</Trans>
        </Button>
      </Box>
    </BasicModal>
  );
};

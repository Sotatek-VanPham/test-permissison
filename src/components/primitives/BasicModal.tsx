import { Box, IconButton, Modal, Paper } from '@mui/material';
import React from 'react';

import IconClose from '/public/icons/iconClose.svg';

export interface BasicModalProps {
  open: boolean;
  children: React.ReactNode;
  setOpen: (value: boolean) => void;
  withCloseButton?: boolean;
  contentMaxWidth?: number;
}

export const BasicModal = ({
  open,
  setOpen,
  withCloseButton = true,
  contentMaxWidth = 420,
  children,
  ...props
}: BasicModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '.MuiPaper-root': {
          outline: 'none',
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
      data-cy={'Modal'}
    >
      <Paper
        sx={{
          position: 'relative',
          margin: '10px',
          overflowY: 'auto',
          width: '100%',
          maxWidth: { xs: '359px', xsm: `${contentMaxWidth}px` },
          maxHeight: 'calc(100vh - 20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          background: 'rgba(29, 29, 35, 0.85)',
          boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.48)',
          backdropFilter: 'blur(100px)',
          p: 6,
        }}
      >
        {children}

        {withCloseButton && (
          <Box sx={{ position: 'absolute', top: '32px', right: '40px', zIndex: 5 }}>
            <IconButton
              sx={{
                borderRadius: '50%',
                p: 0,
                minWidth: 0,
                position: 'absolute',
              }}
              onClick={handleClose}
              data-cy={'close-button'}
            >
              <IconClose />
            </IconButton>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

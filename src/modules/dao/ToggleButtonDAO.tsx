import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { ToggleButton, ToggleButtonProps, Typography } from '@mui/material';
import { ToggleDAOType } from 'pages/dao.page';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';

const CustomToggleButton = styled(ToggleButton)<ToggleButtonProps>(() => ({
  border: '0px',
  flex: 1,
  borderRadius: '50px !important',
  color: '#fff',

  '.MuiTypography-subheader1': {
    color: '#fff',
    backgroundClip: 'text',
  },
  '.MuiTypography-secondary14': {
    color: '#fff',
    backgroundClip: 'text',
  },

  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: '#1B1B1D80',
    border: 'none',
    borderRadius: '50px !important',
    '.MuiTypography-subheader1': {
      backgroundClip: 'text',
      color: '#fff !important',
    },
    '.MuiTypography-secondary14': {
      backgroundClip: 'text',
      color: '#fff !important',
    },
  },

  '&.Mui-selected, &.Mui-disabled': {
    zIndex: 100,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: '#fff !important',
    '&:before': {
      content: "''",
      display: 'inline-block',
      height: '10px',
      width: '10px',
      backgroundColor: '#FF4228',
      borderRadius: '50%',
      marginRight: '12px',
    },
  },
})) as typeof ToggleButton;

export const ToggleButtonDAO = ({ setMode, mode }: { setMode: any; mode: string }) => {
  return (
    <StyledToggleButtonGroup
      color="primary"
      value={mode}
      exclusive
      onChange={(_, value) => setMode(value)}
      sx={{
        minWidth: { xs: '100%', xsm: '603px' },
        height: '61px',
        borderRadius: '50px',
        border: 'none',
        background: '#1B1B1D61',
        padding: '11px',
      }}
    >
      <CustomToggleButton
        value={ToggleDAOType.governance}
        disabled={mode === ToggleDAOType.governance}
      >
        <Typography
          sx={{ fontSize: { xs: '12px', xsm: '20px' }, fontFamily: 'Work Sans', fontWeight: '500' }}
        >
          <Trans>Governance</Trans>
        </Typography>
      </CustomToggleButton>
      <CustomToggleButton value={ToggleDAOType.redeem} disabled={mode === ToggleDAOType.redeem}>
        <Typography
          sx={{
            fontSize: { xs: '12px', xsm: '20px' },
            fontFamily: 'Work Sans',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          <Trans>Lock & Redeem</Trans>
        </Typography>
      </CustomToggleButton>
      <CustomToggleButton value={ToggleDAOType.rewards} disabled={mode === ToggleDAOType.rewards}>
        <Typography
          sx={{ fontSize: { xs: '12px', xsm: '20px' }, fontFamily: 'Work Sans', fontWeight: '500' }}
        >
          <Trans>Rewards</Trans>
        </Typography>
      </CustomToggleButton>
    </StyledToggleButtonGroup>
  );
};

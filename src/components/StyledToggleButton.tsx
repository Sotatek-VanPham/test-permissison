import { styled, ToggleButton, ToggleButtonProps } from '@mui/material';
import React from 'react';

const CustomToggleButton = styled(ToggleButton)<ToggleButtonProps>(() => ({
  border: '0px',
  flex: 1,
  borderRadius: '50px !important',
  '.MuiTypography-subheader1': {
    color: '#CFD3E2',
    backgroundClip: 'text',
  },
  '.MuiTypography-secondary14': {
    color: '#CFD3E2',
    backgroundClip: 'text',
  },

  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: '#FFFFFF',
    borderRadius: '50px !important',
    '.MuiTypography-subheader1': {
      backgroundClip: 'text',
      color: '#000',
    },
    '.MuiTypography-secondary14': {
      backgroundClip: 'text',
      color: '#000',
    },
  },

  '&.Mui-selected, &.Mui-disabled': {
    zIndex: 100,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
})) as typeof ToggleButton;

// const CustomTxModalToggleButton = styled(ToggleButton)<ToggleButtonProps>(({ theme }) => ({
//   border: '0px',
//   flex: 1,
//   color: '#fff',
//   borderRadius: '50px !important',

//   '&.Mui-selected, &.Mui-selected:hover': {
//     border: `1px solid ${theme.palette.other.standardInputLine}`,
//     backgroundColor: '#FFFFFF',
//     borderRadius: '50px !important',
//   },

//   '&.Mui-selected, &.Mui-disabled': {
//     zIndex: 100,
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     color: theme.palette.background.header,
//     'span': {
//       color: theme.palette.background.header,
//     }
//   },
// })) as typeof ToggleButton;

export function StyledTxModalToggleButton(props: ToggleButtonProps) {
  return <CustomToggleButton {...props} />;
}

export default function StyledToggleButton(props: ToggleButtonProps) {
  return <CustomToggleButton {...props} />;
}

import { Slider, styled } from '@mui/material';
import React from 'react';
// import { STAGING_ENV } from 'src/utils/marketsAndNetworksConfig';

import { DurationType } from './LockToken';

// const RATE_CONFIG_MAINNET = [
//   {
//     value: 1,
//     label: '',
//     period: '1 Month',
//     ratio: 0.53,
//     duration: 2592000,
//   },
//   {
//     value: 2,
//     label: '',
//     period: '2 Months',
//     ratio: 0.59,
//     duration: 5184000,
//   },
//   {
//     value: 3,
//     label: '',
//     period: '3 Months',
//     ratio: 0.65,
//     duration: 7776000,
//   },
//   {
//     value: 4,
//     label: '',
//     period: '6 Months',
//     ratio: 0.82,
//     duration: 15552000,
//   },
//   {
//     value: 5,
//     label: '',
//     period: '9 Months',
//     ratio: 1.0,
//     duration: 23328000,
//   },
// ];

const RATE_CONFIG_TESTNET = [
  {
    value: 1,
    label: '',
    period: '10 mins',
    ratio: 0.5,
    duration: 600,
  },
  {
    value: 2,
    label: '',
    period: '20 mins',
    ratio: 0.625,
    duration: 1200,
  },
  {
    value: 3,
    label: '',
    period: '30 mins',
    ratio: 0.75,
    duration: 1800,
  },
  {
    value: 4,
    label: '',
    period: '40 mins',
    ratio: 0.875,
    duration: 2400,
  },
  {
    value: 5,
    label: '',
    period: '50 mins',
    ratio: 1.0,
    duration: 3000,
  },
];

export const RATE_CONFIG = RATE_CONFIG_TESTNET;

export const SliderCustom = styled(Slider)(({ isValueLabel }: { isValueLabel?: boolean }) => ({
  borderRadius: 'none',
  '.MuiSlider-mark': {
    border: '2px solid #5A5F8080',
    background: '#1A1A1C',
    width: '6.38px',
    height: '6.38px',
    borderRadius: '50%',
    '&[data-index="4"]': {
      left: '99% !important',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 1,
    backgroundColor: '#5A5F8080',
    height: '8px',
  },
  '& .MuiSlider-thumb': {
    width: '15px',
    height: '15px',
    backgroundColor: '#fff',
  },
  '& .MuiSlider-valueLabel': {
    display: isValueLabel ? 'block' : 'none',
  },
}));

export const ProgressBar = ({
  setInfoDuration,
  infoDuration,
  valueLabelFormat,
  valueDefault,
}: {
  setInfoDuration: (value: DurationType | undefined) => void;
  infoDuration: DurationType | undefined;
  valueLabelFormat?: any;
  valueDefault?: number;
}) => {
  const findValueByDuration = () => {
    if (valueDefault) {
      const item = RATE_CONFIG.find((config) => config.duration === valueDefault);
      return item ? item.value : RATE_CONFIG[0].value;
    }
    return RATE_CONFIG[0].value;
  };

  return (
    <SliderCustom
      isValueLabel={valueLabelFormat}
      valueLabelFormat={valueLabelFormat && valueLabelFormat}
      defaultValue={findValueByDuration()}
      value={infoDuration ? infoDuration.value : findValueByDuration()}
      aria-label="Default"
      valueLabelDisplay="auto"
      step={1}
      min={1}
      max={5}
      marks={RATE_CONFIG}
      onChange={(_, value: number | number[]) => {
        const getValueObject = RATE_CONFIG.filter((item) => item.value === value);
        setInfoDuration(getValueObject[0]);
      }}
    />
  );
};

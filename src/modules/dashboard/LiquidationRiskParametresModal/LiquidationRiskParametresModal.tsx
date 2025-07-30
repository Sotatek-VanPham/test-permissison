import { Trans } from '@lingui/macro';
import { AlertColor, Typography } from '@mui/material';

import { HealthFactorNumber } from '../../../components/HealthFactorNumber';
import { BasicModal } from '../../../components/primitives/BasicModal';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import { HFContent } from './components/HFContent';
import { InfoWrapper } from './components/InfoWrapper';
import { LTVContent } from './components/LTVContent';

interface LiquidationRiskParametresInfoModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  healthFactor: string;
  loanToValue: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
}

export const LiquidationRiskParametresInfoModal = ({
  open,
  setOpen,
  healthFactor,
  loanToValue,
  currentLoanToValue,
  currentLiquidationThreshold,
}: LiquidationRiskParametresInfoModalProps) => {
  let healthFactorColor: AlertColor = 'success';
  const hf = Number(healthFactor);
  if (hf > 1.1 && hf <= 3) {
    healthFactorColor = 'warning';
  } else if (hf <= 1.1) {
    healthFactorColor = 'error';
  }

  let ltvColor: AlertColor = 'success';
  const ltvPercent = Number(loanToValue) * 100;
  const currentLtvPercent = Number(currentLoanToValue) * 100;
  const liquidationThresholdPercent = Number(currentLiquidationThreshold) * 100;
  if (ltvPercent >= Math.min(currentLtvPercent, liquidationThresholdPercent)) {
    ltvColor = 'error';
  } else if (ltvPercent > currentLtvPercent / 2 && ltvPercent < currentLtvPercent) {
    ltvColor = 'warning';
  }

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <Typography
        variant="h2"
        mb={6}
        sx={{ fontSize: '24px', fontFamily: 'Work sans', fontWeight: '500' }}
        color="#fff"
      >
        <Trans>Liquidation risk parameters</Trans>
      </Typography>
      <Typography mb={6} color="#fff">
        <Trans>
          Your health factor and loan to value determine the assurance of your collateral. To avoid
          liquidations you can supply more collateral or repay borrow positions.
        </Trans>
      </Typography>

      <InfoWrapper
        topTitle={<Trans>Health factor</Trans>}
        topDescription={
          <Trans>
            Safety of your deposited collateral against the borrowed assets and its underlying
            value.
          </Trans>
        }
        topValue={
          <HealthFactorNumber
            value={healthFactor}
            variant="main14"
            sx={{ color: '#fff', fontWeight: '400' }}
            isWhite
          />
        }
        bottomText={
          <Trans>
            If the health factor goes below 1, the liquidation of your collateral might be
            triggered.
          </Trans>
        }
        color={healthFactorColor}
      >
        <HFContent healthFactor={healthFactor} />
      </InfoWrapper>

      <InfoWrapper
        topTitle={<Trans>Current LTV</Trans>}
        topDescription={
          <Trans>Your current loan to value based on your collateral supplied.</Trans>
        }
        topValue={
          <FormattedNumber
            value={loanToValue}
            percent
            variant="main14"
            color="common.white"
            symbolsColor="common.white"
            sx={{ fontWeight: '400' }}
          />
        }
        bottomText={
          <Trans>
            If your loan to value goes above the liquidation threshold your collateral supplied may
            be liquidated.
          </Trans>
        }
        color={ltvColor}
      >
        <LTVContent
          loanToValue={loanToValue}
          currentLoanToValue={currentLoanToValue}
          currentLiquidationThreshold={currentLiquidationThreshold}
          color={ltvColor}
        />
      </InfoWrapper>
    </BasicModal>
  );
};

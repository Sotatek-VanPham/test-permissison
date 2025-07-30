import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { CustomProps } from 'src/components/transactions/AssetInput';
import { ButtonAction } from 'src/components/transactions/TxActionsWrapper';
import { useModalContext } from 'src/hooks/useModal';
import { useTokenERC20Contract, useTokenXCLNDContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { getCurrentEpoch } from '../governance/TopInfo';
import { ProgressBar, RATE_CONFIG } from './ProcessBar';
import { TitleBold } from './RedeemQueue';

type LockTokenProps = {
  isLock: boolean;
  getTokenInfo: () => void;
};

export const TextMedium = styled(Typography)`
  font-family: Work Sans;
  font-weight: 500;
  font-size: 16px;
  color: #a5a8b3;
  strong {
    color: #ff4228;
    font-weight: 500;
  }

  @media screen and (max-width: 560px) {
    font-size: 12px;
  }
`;

export const ButtonRedeem = styled(Button)(() => ({
  background: '#484a77',
  height: '44px',
  fontFamily: 'Mulish',
  fontSize: '15px',
  fontWeight: '700',
  color: ' #999EBA',
  width: '100%',
  marginTop: '16px',

  '&:hover': {
    border: '1px solid #C2C3E9CC',
  },
  '&:disabled': {
    background: '#484A77',
    color: '#C4C8E2',
    border: 'none',
    cursor: 'not-allowed',
    opacity: 0.7,
    pointerEvents: 'auto',
  },
})) as typeof Button;

export type DurationType = {
  value: number;
  label: string;
  period: string;
  ratio: number;
  duration: number;
};

export type ApproveInfo = {
  allowance: string;
  loading: boolean;
};

export const NumberFormatCustomDecimal = React.forwardRef<NumberFormatProps, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          if (values.value !== props.value)
            onChange({
              target: {
                name: props.name,
                value: values.value || '',
              },
            });
        }}
        decimalScale={18}
        thousandSeparator
        isNumericString
        allowNegative={false}
      />
    );
  }
);

export const LockToken = ({ isLock, getTokenInfo }: LockTokenProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentAccount, readOnlyMode } = useWeb3Context();
  const { setTxHash, tokenCLND, tokenXCLND, currentMarketData, currentEpochContract } =
    useRootStore((store) => store);
  const CLNDAddress = currentMarketData.addresses.CLND;
  const XCLNDAddress = currentMarketData.addresses.XCLND;
  const CLNDContract = useTokenERC20Contract(CLNDAddress || '');
  const XCLNDContract = useTokenXCLNDContract(XCLNDAddress || '');

  const { openDaoSuccess, openDaoFail, openStartEpoch } = useModalContext();
  const [infoDuration, setInfoDuration] = useState<DurationType | undefined>(RATE_CONFIG[0]);
  const [inputAmount, setInputAmount] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);

  const [approveInfo, setApproveInfo] = useState<ApproveInfo>({
    allowance: '0',
    loading: false,
  });

  const getAllowance = async () => {
    try {
      if (CLNDContract && XCLNDContract) {
        const allowanceToken = isLock
          ? await CLNDContract.allowance(currentAccount, XCLNDAddress)
          : await XCLNDContract.allowance(currentAccount, CLNDAddress);

        setApproveInfo({
          ...approveInfo,
          allowance: allowanceToken.toString(),
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllowance();
  }, [CLNDContract, XCLNDContract]);

  // Approve
  const handleApprove = async () => {
    try {
      if (CLNDContract && XCLNDContract) {
        setApproveInfo({
          ...approveInfo,
          loading: true,
        });
        if (isLock) {
          const amount = parseUnits(inputAmount, tokenCLND.decimal);

          const paramsApproveContract = [XCLNDAddress, amount.toString()];
          const approveXCLND = await CLNDContract.approve(...paramsApproveContract);
          await approveXCLND.wait(1);
        } else {
          const amount = parseUnits(inputAmount, tokenCLND.decimal);
          const paramsApproveContract = [CLNDAddress, amount.toString()];
          const approveCLND = await XCLNDContract.approve(...paramsApproveContract);
          await approveCLND.wait(1);
        }
        setApproveInfo({
          ...approveInfo,
          loading: false,
        });
        getAllowance();
      }
    } catch (error) {
      setApproveInfo({
        ...approveInfo,
        loading: false,
      });
    }
  };

  // Lock
  const handleLockCLND = async () => {
    if (currentEpochContract < getCurrentEpoch()) {
      openStartEpoch('Lock CLND into xCLND by clicking on the button below first');
      return;
    }
    try {
      if (CLNDContract && XCLNDContract) {
        setIsConfirm(true);
        const amount = parseUnits(inputAmount, tokenCLND.decimal);
        const paramsLockContract = [amount.toString()];
        // const gasFee = await CLNDContract.convert(...paramsLockContract);
        const lockCNLD = await XCLNDContract.convert(...paramsLockContract);
        const txHash = await lockCNLD.wait(1);
        setTxHash(txHash.transactionHash);
        setIsConfirm(false);
        setInputAmount('');
        openDaoSuccess('You successfully locked your CLND into xCLND', '');
        getTokenInfo();
        getAllowance();
      }
    } catch (error) {
      console.log('error', error);
      openDaoFail();
      setIsConfirm(false);
    }
  };

  // Redeem
  const handleRedeemXCLND = async () => {
    if (currentEpochContract < getCurrentEpoch()) {
      openStartEpoch('Redeem xCLND into CLND by clicking on the button below first');
      return;
    }
    try {
      if (CLNDContract && XCLNDContract) {
        setIsConfirm(true);
        const amount = parseUnits(inputAmount, tokenCLND.decimal);
        const paramsRedeemContract = [amount.toString(), infoDuration?.duration];
        const redeemCNLD = await XCLNDContract.redeem(...paramsRedeemContract);
        const txHash = await redeemCNLD.wait(1);
        setTxHash(txHash.transactionHash);
        setIsConfirm(false);
        setInputAmount('');
        openDaoSuccess('You request to redeem CLND token is being processed', '');
        getTokenInfo();
        getAllowance();
      }
    } catch (error) {
      console.log('error', error);
      openDaoFail();
      setIsConfirm(false);
    }
  };

  const balance = isLock ? tokenCLND.balance : tokenXCLND.balance;
  const decimals = isLock ? tokenXCLND.decimal : tokenCLND.decimal;

  return (
    <Box
      sx={{
        width: '50%',
        pl: '50px',
        ['@media screen and (max-width: 1150px)']: {
          width: 'auto',
          pl: '8px',
          pb: '24px',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: '8px', mb: '8px' }}>
        <TitleBold>
          <Trans> {isLock ? ' Lock xCLND' : 'Redeem CLND'}</Trans>
        </TitleBold>
        <TextWithTooltip iconSize={19}>
          <Trans>
            Variable interest rate will <b>fluctuate</b> based on the market conditions. Recommended
            for short-term positions.
          </Trans>
        </TextWithTooltip>
      </Box>

      <Box>
        {isLock ? (
          <TextMedium>
            Lock your <strong>CLND</strong> into <strong>xCLND</strong> to boost your yield
          </TextMedium>
        ) : (
          <TextMedium>
            Redeem <strong>CLND</strong> from <strong>xCLND</strong> over a vesting period
          </TextMedium>
        )}
      </Box>

      <Box sx={{ width: isMobile ? '100%' : '80%' }}>
        <InputBase
          placeholder="0.00"
          value={inputAmount}
          onChange={(e) => {
            const maxValue = balance;
            if (Number(e.target.value) > Number(maxValue)) {
              setInputAmount(maxValue);
            } else {
              setInputAmount(e.target.value);
            }
          }}
          inputComponent={NumberFormatCustomDecimal as any}
          sx={{
            flex: 1,
            color: '#fff',
            my: '12px',
            width: '100%',
          }}
          inputProps={{
            'aria-label': 'amount input',
            style: {
              fontSize: '24px',
              padding: '0px 12px',
              height: '46px',
              width: '100%',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              border: ' 1px solid #FFFFFF33',
              borderRadius: '6px',
              background: '#1B1A1E',
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            gap: '4px',
            justifyContent: 'flex-end',
            '@media screen and (max-width: 560px)': {
              alignItems: 'baseline',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '4px',
            }}
          >
            <TextMedium
              sx={{
                '@media screen and (max-width: 560px)': {
                  fontSize: '14px !important',
                },
              }}
            >
              <Trans>Balance</Trans>
            </TextMedium>{' '}
            <FormattedNumber
              value={balance}
              sx={{
                fontFamily: 'Work Sans',
                fontWeight: 500,
                fontSize: '16px',
                color: '#A5A8B3',
                '@media screen and (max-width: 560px)': {
                  fontSize: '14px !important',
                },
              }}
              visibleDecimals={2}
            />
          </Box>

          <Box
            sx={{
              fontFamily: 'Work Sans',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              '@media screen and (max-width: 560px)': {
                fontSize: '14px !important',
              },
            }}
            color="common.white"
            onClick={() => setInputAmount(balance)}
          >
            <Trans>MAX </Trans>
          </Box>
        </Box>

        {!isLock && (
          <Box>
            <TitleBold sx={{ my: '8px' }}>
              <Trans> Redeem duration</Trans>
            </TitleBold>

            <ProgressBar
              setInfoDuration={(value: DurationType | undefined) => setInfoDuration(value)}
              infoDuration={infoDuration}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: '12px' }}>
                <TextMedium sx={{ color: '#fff' }}>
                  <Trans>{infoDuration?.period}</Trans>
                </TextMedium>
                <TextMedium sx={{ display: 'flex', gap: '6px' }}>
                  <Trans>ratio</Trans>
                  <TextMedium sx={{ color: '#FF4228' }}>{infoDuration?.ratio}</TextMedium>
                </TextMedium>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '4px',
                  '@media screen and (max-width: 560px)': {
                    alignItems: 'baseline',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  <TextMedium
                    sx={{
                      '@media screen and (max-width: 560px)': {
                        fontSize: '14px !important',
                      },
                    }}
                  >
                    <Trans>Balance</Trans>
                  </TextMedium>

                  <FormattedNumber
                    value={Number(inputAmount) * (infoDuration?.ratio || 0)}
                    sx={{
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      fontSize: '16px',
                      color: '#A5A8B3',
                      '@media screen and (max-width: 560px)': {
                        fontSize: '14px !important',
                      },
                    }}
                    visibleDecimals={2}
                  />
                </Box>
                <Box
                  sx={{
                    fontFamily: 'Work Sans',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    '@media screen and (max-width: 560px)': {
                      fontSize: '14px !important',
                    },
                  }}
                  color="common.white"
                  onClick={() => setInfoDuration(RATE_CONFIG[RATE_CONFIG.length - 1])}
                >
                  <Trans>MAX </Trans>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {Number(inputAmount) &&
          BigNumber.from(approveInfo.allowance).lt(
            BigNumber.from(parseUnits(inputAmount, decimals))
          ) ? (
            <ButtonAction
              variant="contained"
              disabled={readOnlyMode || approveInfo.loading}
              onClick={() => handleApprove()}
              size="large"
              sx={{
                minHeight: '44px',
                width: '100%',
                color: '#fff',
                mt: '12px',
                fontFamily: 'Mulish',
              }}
              data-cy="approvalButton"
            >
              {approveInfo.loading ? (
                <>
                  <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
                  <Trans>Approving {isLock ? 'xCLND' : 'CLND'}...</Trans>
                </>
              ) : (
                <Trans>Approve {isLock ? 'xCLND' : 'CLND'} to continue</Trans>
              )}
            </ButtonAction>
          ) : (
            <></>
          )}

          <ButtonRedeem
            onClick={() => (isLock ? handleLockCLND() : handleRedeemXCLND())}
            disabled={
              readOnlyMode ||
              isConfirm ||
              Number(inputAmount) === 0 ||
              BigNumber.from(approveInfo.allowance).lt(
                BigNumber.from(parseUnits(inputAmount, decimals))
              )
            }
          >
            {isConfirm && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
            {isLock ? (
              <Trans>{isConfirm ? 'Forging xCLND' : 'Forge xCLND'}</Trans>
            ) : (
              <Trans>{isConfirm ? 'Redeeming CLND' : 'Redeem CLND'}</Trans>
            )}
          </ButtonRedeem>
        </Box>
      </Box>
    </Box>
  );
};

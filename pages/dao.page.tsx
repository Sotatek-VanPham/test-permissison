import { Trans } from '@lingui/macro';
import { Box, Container, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { USD_DECIMALS } from 'colend-math-utils';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { usePermissions } from 'src/hooks/usePermissions';
import { MainLayout } from 'src/layouts/MainLayout';
import { useTokenERC20Contract, useTokenXCLNDContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Governance } from 'src/modules/dao/governance';
import { LockRedeem } from 'src/modules/dao/lock-redeem';
import { Rewards } from 'src/modules/dao/rewards';
import { ToggleButtonDAO } from 'src/modules/dao/ToggleButtonDAO';
import { useRootStore } from 'src/store/root';

export enum ToggleDAOType {
  'governance' = 'governance',
  'redeem' = 'redeem',
  'rewards' = 'rewards',
}

export default function DAO() {
  const { reserves, marketReferencePriceInUsd } = useAppDataContext();
  const [mode, setMode] = useState<
    ToggleDAOType.governance | ToggleDAOType.redeem | ToggleDAOType.rewards
  >(ToggleDAOType.governance);
  const { currentAccount, loading: web3Loading, connected, readOnlyMode } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const {
    setTokenCLND,
    setTokenXCLND,
    currentMarketData,
    setPriceUsdTokens,
    txHash,
    getAssetRewards,
  } = useRootStore((store) => store);
  const CLNDAddress = currentMarketData.addresses.CLND;
  const XCLNDAddress = currentMarketData.addresses.XCLND;
  const CLNDContract = useTokenERC20Contract(CLNDAddress);
  const XCLNDContract = useTokenXCLNDContract(XCLNDAddress);

  const getTokenInfo = async () => {
    try {
      if (CLNDContract && XCLNDContract && connected) {
        const [CLNDBalance, CLNDDecimal, XCLNDBalance, XCLNDDecimal] = await Promise.all([
          CLNDContract.balanceOf(currentAccount),
          CLNDContract.decimals(),
          XCLNDContract.balanceOf(currentAccount),
          XCLNDContract.decimals(),
        ]);
        setTokenCLND({
          balance: formatUnits(CLNDBalance, Number(CLNDDecimal)).toString(),
          decimal: Number(CLNDDecimal),
        });
        setTokenXCLND({
          balance: formatUnits(XCLNDBalance, Number(XCLNDDecimal)).toString(),
          decimal: Number(XCLNDDecimal),
        });
      }
    } catch (error) {}
  };

  const getPriceUsdToken = () => {
    reserves.length > 0 &&
      reserves.map((reserve) => {
        const amountIntEth = new BigNumber(1).multipliedBy(
          reserve.formattedPriceInMarketReferenceCurrency
        );
        const amountInUsd = amountIntEth
          .multipliedBy(marketReferencePriceInUsd)
          .shiftedBy(-USD_DECIMALS);

        setPriceUsdTokens(reserve.underlyingAsset, amountInUsd.toString());
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getTokenInfo();
    }, 5000);

    return () => clearInterval(interval);
  }, [CLNDContract, XCLNDContract, txHash, mode]);

  useEffect(() => {
    getPriceUsdToken();
  }, [reserves.length > 0]);

  useEffect(() => {
    getAssetRewards(CLNDAddress);
  }, []);

  return (
    <MainLayout>
      <Container>
        {currentAccount && !isPermissionsLoading ? (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: '50px',
                mb: '28px',
              }}
            >
              <ToggleButtonDAO setMode={setMode} mode={mode} />
            </Box>

            {readOnlyMode && (
              <Typography
                variant="helperText"
                color="warning.main"
                sx={{ textAlign: 'left', mb: '20px', fontSize: '16px', lineHeight: '1.1rem' }}
              >
                <Trans>Read-only mode. Connect to a wallet to perform transactions!</Trans>
              </Typography>
            )}

            {mode === ToggleDAOType.governance && <Governance />}
            {mode === ToggleDAOType.redeem && <LockRedeem getTokenInfo={getTokenInfo} />}
            {mode === ToggleDAOType.rewards && <Rewards />}
          </>
        ) : (
          <ConnectWalletPaper
            sx={{ mt: '50px', mb: '28px' }}
            loading={web3Loading}
            description={
              <Trans>
                Please connect your wallet to see Vote & Bribes, Lock & Redeem and Rewards.
              </Trans>
            }
          />
        )}
      </Container>
    </MainLayout>
  );
}

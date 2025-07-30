import { Trans } from '@lingui/macro';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackOutlined';
import {
  Box,
  Button,
  // Divider,
  Skeleton,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { getMarketInfoById, MarketLogo } from 'src/components/MarketSwitcher';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { CUSTOM_POOL_NAME } from 'src/ui-config/customPoolName';

import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';
import { AddTokenDropdown } from './AddTokenDropdown';
import { GhoReserveTopDetails } from './Gho/GhoReserveTopDetails';
import { ReserveTopDetails } from './ReserveTopDetails';
import { TokenLinkDropdown } from './TokenLinkDropdown';

export const ButtonBack = styled(Button)(() => ({
  borderRadius: '4px',
  color: '#C4C8E2',
  border: '1px solid rgba(194, 195, 233, 0.80)',
  background: 'rgba(72, 74, 119, 0.30)',
  minWidth: '104px',
  height: '36px',
  fontSize: '14px',
  fontWeight: 700,
  padding: '8px 10px',
  fontFamily: 'Mulish',
})) as typeof Button;

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetailsWrapper = ({ underlyingAsset }: ReserveTopDetailsProps) => {
  const router = useRouter();
  const { reserves, loading } = useAppDataContext();
  const { currentMarket, currentChainId } = useProtocolDataContext();
  const { market, network } = getMarketInfoById(currentMarket);
  const { addERC20Token, switchNetwork, chainId: connectedChainId, connected } = useWeb3Context();
  const [displayGho] = useRootStore((store) => [store.displayGho]);

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const poolReserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;

  // const valueTypographyVariant = downToSM ? 'main16' : 'main21';

  const ReserveIcon = () => {
    return (
      <Box
        mr={3}
        sx={{
          mr: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Skeleton variant="circular" width={40} height={40} sx={{ background: '#383D51' }} />
        ) : (
          <img
            src={`/icons/tokens/${poolReserve.iconSymbol.toLowerCase() || 'unknow'}.svg`}
            width="39px"
            height="39px"
            alt=""
          />
        )}
      </Box>
    );
  };

  const ReserveName = () => {
    return loading ? (
      <Skeleton width={60} height={28} sx={{ background: '#383D51' }} />
    ) : (
      <Typography
        sx={{
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'Work sans',
          ['@media screen and (max-width: 560px)']: {
            fontSize: '20px',
          },
        }}
      >
        {CUSTOM_POOL_NAME[String(poolReserve.name)] || poolReserve.name || 'Unknow'}
      </Typography>
    );
  };

  const isGho = displayGho({ symbol: poolReserve.symbol, currentMarket });

  return (
    <TopInfoPanel
      titleComponent={
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: downToSM ? 'flex-start' : 'center',
              alignSelf: downToSM ? 'flex-start' : 'center',
              mb: 4,
              minHeight: '40px',
              flexDirection: downToSM ? 'column' : 'row',
            }}
          >
            <ButtonBack
              startIcon={
                <SvgIcon
                  sx={{
                    fontSize: '20px',
                    ['@media screen and (max-width: 560px)']: {
                      fontSize: '12px',
                    },
                  }}
                >
                  <ArrowBackRoundedIcon />
                </SvgIcon>
              }
              onClick={() => {
                // https://github.com/vercel/next.js/discussions/34980
                if (history.state.idx !== 0) router.back();
                else router.push('/markets');
              }}
              sx={{
                mr: 3,
                mb: downToSM ? '24px' : '0',
                ['@media screen and (max-width: 560px)']: {
                  fontSize: '12px',
                },
              }}
            >
              <Trans>Go Back</Trans>
            </ButtonBack>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MarketLogo size={20} logo={network.networkLogoPath} />
              <Typography variant="subheader1" sx={{ color: 'common.white' }}>
                {market.marketTitle} <Trans>Market</Trans>
              </Typography>
            </Box>
          </Box>

          {downToSM && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
              <ReserveIcon />
              <Box>
                {!loading && (
                  <Typography
                    sx={{
                      color: '#fff',
                      fontSize: '24px',
                      ['@media screen and (max-width: 560px)']: {
                        fontSize: '20px',
                      },
                    }}
                    variant="caption"
                  >
                    {poolReserve.symbol || 'Unknow'}
                  </Typography>
                )}
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <ReserveName />
                  {loading ? (
                    <Skeleton width={160} height={16} sx={{ ml: 1, background: 'red' }} />
                  ) : (
                    <Box sx={{ display: 'flex' }}>
                      <TokenLinkDropdown
                        poolReserve={poolReserve}
                        downToSM={downToSM}
                        hideSToken={isGho}
                      />
                      {connected && (
                        <AddTokenDropdown
                          poolReserve={poolReserve}
                          downToSM={downToSM}
                          switchNetwork={switchNetwork}
                          addERC20Token={addERC20Token}
                          currentChainId={currentChainId}
                          connectedChainId={connectedChainId}
                          hideSToken={isGho}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      }
    >
      {!downToSM && (
        <>
          <TopInfoPanelItem
            title={!loading && <Trans>{poolReserve.symbol}</Trans>}
            withoutIconWrapper
            icon={<ReserveIcon />}
            loading={loading}
            fontTitle
          >
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <ReserveName />

              <Box sx={{ display: 'flex' }}>
                <TokenLinkDropdown
                  poolReserve={poolReserve}
                  downToSM={downToSM}
                  hideSToken={isGho}
                />
                {connected && (
                  <AddTokenDropdown
                    poolReserve={poolReserve}
                    downToSM={downToSM}
                    switchNetwork={switchNetwork}
                    addERC20Token={addERC20Token}
                    currentChainId={currentChainId}
                    connectedChainId={connectedChainId}
                    hideSToken={isGho}
                  />
                )}
              </Box>
            </Box>
          </TopInfoPanelItem>
          {/* <Divider
            orientation="vertical"
            flexItem
            sx={{ my: 1, borderColor: 'rgba(235, 235, 239, 0.08)' }}
          /> */}
        </>
      )}
      {isGho ? <GhoReserveTopDetails /> : <ReserveTopDetails underlyingAsset={underlyingAsset} />}
    </TopInfoPanel>
  );
};

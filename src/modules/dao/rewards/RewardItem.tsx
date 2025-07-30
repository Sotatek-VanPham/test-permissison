import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { useModalContext } from 'src/hooks/useModal';
import { useBribeContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { IncentiveTokenType } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';
import { CUSTOM_POOL_NAME } from 'src/ui-config/customPoolName';
import { DASHBOARD_LIST_COLUMN_WIDTHS } from 'src/utils/dashboardSortUtils';

import { DataProps } from '../governance/ItemAsset';
import { ButtonRedeem } from '../lock-redeem/LockToken';

const TextNumber = styled(Typography)`
  font-family: Work Sans;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  @media screen and (max-width: 560px) {
    font-size: 12px;
  }
`;

export const RewardItem = ({ data }: DataProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { openDaoSuccess, openDaoFail } = useModalContext();
  const bribeContract = useBribeContract(data.contractBribe);
  const { currentAccount, readOnlyMode } = useWeb3Context();
  const { priceUsdTokens, setMyRewardsTab, myRewardsTab, setTxHash, txHash } = useRootStore(
    (store) => store
  );
  const [amountRewards, setAmountRewards] = useState<any>();
  const [marketSelected, setIsConfirm] = useState<string | null>(null);

  const getTokenRewards = async () => {
    try {
      if (bribeContract && currentAccount) {
        let total = 0;
        const tokenListArray = await Promise.all(
          data.listIncentiveToken.map(async (item: IncentiveTokenType) => {
            const { incentiveToken } = item;
            const amountReward = await bribeContract.earned(incentiveToken, currentAccount);
            const amountConvert = formatUnits(amountReward.toString(), item.decimal);
            if (priceUsdTokens[incentiveToken.toLowerCase()]) {
              const value = parseFloat(priceUsdTokens[incentiveToken.toLowerCase()]);

              total += Number(amountConvert) * value;
            }
            return { [item.incentiveToken]: amountConvert };
          })
        );

        const tokenList = Object.assign({}, ...tokenListArray);
        setAmountRewards(tokenList);
        setMyRewardsTab(data.market, total + '');
        return tokenList;
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleClaim = async () => {
    try {
      if (bribeContract) {
        setIsConfirm(data.market);
        const tokensArr = data.listIncentiveToken.map((item) => item.incentiveToken);
        const paramsContract = [tokensArr];
        const claimReward = await bribeContract.getReward(...paramsContract);
        const txHash = await claimReward.wait(1);
        setTxHash(txHash.transactionHash);
        setIsConfirm(null);
        openDaoSuccess('You have successfully claimed reward', '');
      }
    } catch (error) {
      console.log('error', error);
      openDaoFail();
      setIsConfirm(null);
    }
  };

  useEffect(() => {
    getTokenRewards();
  }, [bribeContract, currentAccount, priceUsdTokens, txHash]);

  const tokensRewardArr = amountRewards
    ? data.listIncentiveToken.filter(
        (item: IncentiveTokenType) => Number(amountRewards[item.incentiveToken]) !== 0
      )
    : [];

  return (
    <ListItem
      sx={{
        ['@media screen and (max-width: 560px)']: {
          width: 'fit-content',
        },
      }}
    >
      {/* Token Name */}
      <ListColumn isRow minWidth={120}>
        <ListColumn isRow maxWidth={DASHBOARD_LIST_COLUMN_WIDTHS.ASSET}>
          <TokenIcon
            symbol={data?.symbol || ''}
            fontSize="inherit"
            sx={{ width: '29px', height: '29px' }}
          />
          <Box sx={{ pl: 2.5 }}>
            <Typography
              variant="h4"
              noWrap
              sx={{
                color: '#fff',
                '@media screen and (max-width: 560px)': {
                  fontSize: '12px',
                },
              }}
            >
              {CUSTOM_POOL_NAME[data?.symbol || ''] || data?.symbol || 'Unknow'}
            </Typography>
          </Box>
        </ListColumn>
      </ListColumn>

      {/* Type of Reward */}
      <ListColumn align="left" minWidth={70}>
        {' '}
        <TextNumber>Rebase</TextNumber>{' '}
      </ListColumn>

      {/* Tokens */}
      <ListColumn align="left" minWidth={120}>
        <Box sx={{ display: 'flex', gap: '6px' }}>
          <FormattedNumber
            value={myRewardsTab[data.market] || '0'}
            color="#fff"
            symbol="USD"
            visibleDecimals={2}
            sx={{
              fontFamily: 'Work Sans',
              fontWeight: '600',
              fontSize: '16px',
              '@media screen and (max-width: 560px)': {
                fontSize: '12px',
              },
            }}
          />
          {tokensRewardArr.length > 0 && (
            <TextWithTooltip iconSize={19}>
              <Box>
                {amountRewards &&
                  tokensRewardArr.map((item: IncentiveTokenType) => (
                    <Box>
                      {' '}
                      <FormattedNumber
                        value={amountRewards[item.incentiveToken]}
                        symbol={item.symbol}
                        visibleDecimals={2}
                        sx={{
                          fontFamily: 'Work Sans',
                          fontSize: '14px',
                          fontWeight: '400',
                          color: '#000',
                        }}
                      />
                    </Box>
                  ))}
              </Box>
            </TextWithTooltip>
          )}
        </Box>
      </ListColumn>

      {/* Action Claim */}
      <ListColumn align="left" minWidth={isMobile ? 70 : 120}>
        <ButtonRedeem
          sx={{
            width: 'fit-content',
            color: '#fff',
            fontSize: '12px',
            height: '32px',
            mt: '0px',
            ['@media screen and (max-width: 560px)']: {
              fontSize: '12px',
            },
          }}
          onClick={handleClaim}
          disabled={
            readOnlyMode ||
            !!marketSelected ||
            data?.listIncentiveToken.length === 0 ||
            !Number(myRewardsTab[data.market])
          }
        >
          {marketSelected !== null && marketSelected === data.market ? (
            <>
              <CircularProgress color="inherit" size="12px" sx={{ mr: 2 }} />{' '}
              <Trans>Claiming</Trans>
            </>
          ) : (
            <Trans>Claim</Trans>
          )}
        </ButtonRedeem>{' '}
      </ListColumn>
    </ListItem>
  );
};

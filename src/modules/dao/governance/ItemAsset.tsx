import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, InputBase, Typography, useMediaQuery, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListItem } from 'src/components/lists/ListItem';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useModalContext } from 'src/hooks/useModal';
import { useTokenERC20Contract, useVoterContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { ButtonSupplyCustom } from 'src/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsListItem';
import { IncentiveTokenType, Votes } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';
import { CUSTOM_POOL_NAME } from 'src/ui-config/customPoolName';
import { DASHBOARD_LIST_COLUMN_WIDTHS } from 'src/utils/dashboardSortUtils';

import IconDropdown from '/public/icons/iconDropdown.svg';
import IconDropdownShow from '/public/icons/iconDropdownShow.svg';

import { NumberFormatCustomDecimal } from '../lock-redeem/LockToken';
import { Line } from './TopInfo';

const TextThin = styled(Typography)`
  font-family: Mulish;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  text-align: center;
`;

const TextBold = styled(Typography)`
  font-family: Work Sans;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
`;

const TextZeroValue = styled(Typography)`
  font-family: Work Sans;
  font-weight: 600;
  font-size: 16px;
  color: #999eba;
`;

export type DataProps = {
  data: Votes;
};

export const ItemAsset = ({ data }: DataProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { openAddRewards } = useModalContext();
  const { currentAccount, readOnlyMode } = useWeb3Context();
  const { reserves } = useAppDataContext();
  const tokenContract = useTokenERC20Contract(data.market || '');
  const [totalVotesPercent, setTotalVotesPercent] = useState(0);
  const {
    setMyVotesInput,
    myVotesInput,
    currentMarketData,
    tokenXCLND,
    totalVotingPower,
    myVotesPercent,
    setMyVotesPercent,
    priceUsdTokens,
    setVotersRewards,
    votersRewards,
    listVotes,
    setRewardEstimate,
    rewardEstimate,
    setAPY,
    apyPool,
    txHash,
  } = useRootStore((store) => store);
  const voteLogicAddress = currentMarketData.addresses.VOTER;
  const voteLogicContract = useVoterContract(voteLogicAddress || '');

  const [indexShow, setIndexShow] = useState<undefined | string>(undefined);
  const dropdownRef = useRef<HTMLElement | null>(null);

  const getVoteInfo = async () => {
    try {
      if (voteLogicContract && currentAccount) {
        const totalUsedWeights = await voteLogicContract.usedWeights(currentAccount);
        const myVoteValue = await voteLogicContract.votes(currentAccount, data.market);

        const myVoteValuePercent =
          Number(totalUsedWeights) === 0 ? '0' : Number(myVoteValue) / Number(totalUsedWeights);
        setMyVotesPercent(data.market, myVoteValuePercent + '');
      }
    } catch (error) {}
  };

  useEffect(() => {
    getVoteInfo();
  }, [tokenContract, voteLogicContract, currentAccount, totalVotingPower, txHash]);

  useEffect(() => {
    calulatorVotersRewards();
    calulatorRewardEstimate();
  }, [data.listIncentiveToken, currentAccount, totalVotingPower, txHash]);

  const calulatorVotersRewards = () => {
    if (data.listIncentiveToken.length === 0) return 0;

    return data.listIncentiveToken.reduce((total, item) => {
      const { incentiveToken, amount, decimal } = item;
      if (priceUsdTokens[incentiveToken.toLowerCase()]) {
        const value = parseFloat(priceUsdTokens[incentiveToken.toLowerCase()]);
        const normalizedAmount = formatUnits(amount, decimal);

        total += Number(normalizedAmount) * value;
      }
      setVotersRewards(data.market, total + '');
      return total;
    }, 0);
  };

  const calulatorRewardEstimate = () => {
    const totalVotesAllPools = listVotes.reduce((total, item) => {
      return total + parseFloat(item?.totalVote || '0');
    }, 0);
    const votesPercent = totalVotesAllPools
      ? Number(data?.totalVote || '0') / totalVotesAllPools
      : 0;
    setTotalVotesPercent(votesPercent);

    // APY
    const findPool = reserves.find(
      (item) => item.underlyingAsset.toLowerCase() === data.market.toLowerCase()
    );
    const apy = Number(findPool?.variableBorrowAPY || 0) + votesPercent * (365 / 7);
    setAPY(data.market, apy + '');
    // (My votes % for each pool) * (My total voting power) / (total votes for each pool) * Voter rewards in the current time
    const rewardEstimateResult =
      Number(formatUnits(data.totalVote, tokenXCLND.decimal)) !== 0
        ? new BigNumber(myVotesPercent[data.market] || 0)
            .times(totalVotingPower)
            .times(votersRewards[data.market] || 0)
            .div(formatUnits(data.totalVote, tokenXCLND.decimal))
            .toString()
        : '0';

    setRewardEstimate(data.market, rewardEstimateResult);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIndexShow(undefined);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownRef]);

  useEffect(() => {
    setIndexShow(undefined);
  }, []);

  // Input My Vote
  const handleInputMyVote = (amount: string) => {
    setMyVotesInput({
      ...myVotesInput,
      [data.market]: amount ?? '0',
    });
  };

  // Click button Max
  const handleButtonMax = () => {
    if (totalValueInput() >= Number(totalVotingPower)) return;
    const totalUsed = Object.values(myVotesInput).reduce((sum: number, value: any) => {
      return sum + parseFloat(value || 0);
    }, 0);

    const remaining = Number(totalVotingPower) - totalUsed;

    setMyVotesInput({
      ...myVotesInput,
      [data.market]: remaining.toString(),
    });
  };

  const totalValueInput = () => {
    return Object.values(myVotesInput).reduce((sum: number, value: any) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  };

  return (
    <>
      {/* Mobile */}
      {isMobile ? (
        <Box
          sx={{
            background: indexShow === data.market ? '#1C2028' : '',
            '&:not(:last-child)': {
              borderBottom: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.10)',
            },
          }}
        >
          <ListItem>
            <ListColumn isRow maxWidth={DASHBOARD_LIST_COLUMN_WIDTHS.ASSET}>
              <TokenIcon symbol={data?.symbol || ''} fontSize="large" />
              <Box sx={{ pl: 3.5 }}>
                <Typography variant="h4" noWrap sx={{ color: '#fff' }}>
                  {CUSTOM_POOL_NAME[data?.symbol || ''] || data?.symbol || 'Unknow'}
                </Typography>
              </Box>
            </ListColumn>

            {/* APY */}
            <ListColumn align="center">
              <FormattedNumber
                percent
                value={apyPool[data.market]}
                color="#FA3A2E"
                symbolsColor="#FA3A2E"
                sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
                visibleDecimals={2}
              />
            </ListColumn>

            <Box sx={{ width: '15px', textAlign: 'right', mr: '8px' }}>
              {indexShow === data.market ? (
                <IconDropdownShow onClick={() => setIndexShow(undefined)} />
              ) : (
                <IconDropdown onClick={() => setIndexShow(data.market)} />
              )}
            </Box>
          </ListItem>
          {indexShow === data.market && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  background: '#151517',
                  borderRadius: '16px',
                  justifyContent: 'center',
                  margin: '16px',
                  gap: '20px',
                  p: '32px',
                }}
              >
                <Box>
                  {' '}
                  <TextThin sx={{ mb: '7px' }}>
                    <Trans>My Votes</Trans>
                  </TextThin>
                  <InputBase
                    placeholder="0.00"
                    disabled={
                      !myVotesInput[data.market] && totalValueInput() >= Number(totalVotingPower)
                    }
                    value={myVotesInput[data.market] ?? ''}
                    onChange={(e) => handleInputMyVote(e.target.value)}
                    sx={{ flex: 1, color: '#fff', my: '12px' }}
                    inputComponent={NumberFormatCustomDecimal as any}
                    inputProps={{
                      'aria-label': 'amount input',
                      style: {
                        fontSize: '16px',
                        padding: '0.5px 12px',
                        height: '28px',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        border: ' 1px solid #FFFFFF33',
                        borderRadius: '4px',
                        width: '87px',
                        background: '#1B1A1E',
                      },
                    }}
                  />
                  <TextBold
                    onClick={handleButtonMax}
                    sx={{
                      fontSize: '12px !important',
                      fontWeight: '700 !important',
                      cursor:
                        totalValueInput() >= Number(totalVotingPower) ? 'not-allowed' : 'pointer',
                      opacity: totalValueInput() >= Number(totalVotingPower) ? '0.6' : '1',
                    }}
                  >
                    MAX
                  </TextBold>
                </Box>

                <Line sx={{ width: '1px !important' }} />

                <Box>
                  {' '}
                  <TextThin sx={{ mb: '7px' }}>
                    <Trans>My Votes %</Trans>
                  </TextThin>
                  <Box sx={{ textAlign: 'center' }}>
                    {!Number(myVotesPercent[data.market]) ? (
                      <TextZeroValue>-</TextZeroValue>
                    ) : (
                      <FormattedNumber
                        percent
                        value={myVotesPercent[data.market] ?? '0'}
                        color="#fff"
                        sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ mt: '24px' }}>
                    <TextThin sx={{ mb: '7px' }}>
                      <Trans>Reward Estimate</Trans>
                    </TextThin>
                    <Box sx={{ textAlign: 'center' }}>
                      {!Number(rewardEstimate[data.market]) ? (
                        <TextZeroValue>-</TextZeroValue>
                      ) : (
                        <FormattedNumber
                          value={rewardEstimate[data.market] || '0'}
                          color="#fff"
                          symbol="USD"
                          visibleDecimals={2}
                          sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                <Box>
                  <TextThin>
                    <Trans>Incentivize</Trans>
                  </TextThin>
                  <ButtonSupplyCustom
                    onClick={() => openAddRewards(data?.symbol || '', data.contractBribe)}
                    sx={{
                      fontSize: '10px',
                      mt: '8px',
                      height: '29px',
                      background: '#484A77',
                      border: '1px solid #484A77',
                    }}
                    disabled={readOnlyMode}
                  >
                    <Trans>Add Rewards</Trans>
                  </ButtonSupplyCustom>
                </Box>

                <Box>
                  <TextThin>
                    <Trans>Voters rewards</Trans>
                  </TextThin>
                  <Box sx={{ display: 'flex', gap: '6px', justifyContent: 'center', mt: '12px' }}>
                    {' '}
                    <FormattedNumber
                      value={votersRewards[data.market] || '0'}
                      color="#fff"
                      symbol="USD"
                      visibleDecimals={2}
                      sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '12px' }}
                    />
                    <TextWithTooltip iconSize={19}>
                      <Box>
                        <Typography
                          sx={{ fontFamily: 'Work Sans', fontWeight: '500', fontSize: '16px' }}
                        >
                          <Trans>
                            <strong> Voting Incentives</strong>
                          </Trans>
                        </Typography>

                        {data.listIncentiveToken
                          .filter((item: IncentiveTokenType) => Number(item.amount) !== 0)
                          .map((item: IncentiveTokenType) => (
                            <Typography
                              sx={{
                                textAlign: 'center',
                                fontFamily: 'Work Sans',
                                fontSize: '14px',
                                fontWeight: '400',
                              }}
                            >
                              {formatUnits(item.amount, item.decimal)} {item.symbol}
                            </Typography>
                          ))}
                      </Box>
                    </TextWithTooltip>
                  </Box>
                </Box>

                <Box>
                  <TextThin>
                    <Trans>Total Votes</Trans>
                  </TextThin>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mt: '12px',
                    }}
                  >
                    <FormattedNumber
                      value={formatUnits(data.totalVote, tokenXCLND.decimal)}
                      color="#fff"
                      symbol="xCLND"
                      sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: '600',
                        fontSize: '12px',
                        gap: '4px',
                      }}
                      visibleDecimals={2}
                    />
                    <FormattedNumber
                      percent
                      value={totalVotesPercent}
                      color="#fff"
                      sx={{
                        fontFamily: 'Mulish',
                        fontWeight: '400',
                        fontSize: '12px',
                        color: '#A5A8B3',
                      }}
                      visibleDecimals={2}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        /*======== Desktop======= */
        <ListItem
          sx={{
            padding: '16px',
            '&:not(:last-child)': {
              borderBottom: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.10)',
            },
          }}
        >
          <ListColumn isRow maxWidth={DASHBOARD_LIST_COLUMN_WIDTHS.ASSET}>
            <TokenIcon symbol={data?.symbol || ''} fontSize="large" />
            <Box sx={{ pl: 3.5 }}>
              <Typography variant="h4" noWrap sx={{ color: '#fff' }}>
                {CUSTOM_POOL_NAME[data?.symbol || ''] || data?.symbol || 'Unknow'}
              </Typography>
            </Box>
          </ListColumn>

          <ListColumn align="center">
            <ButtonSupplyCustom
              onClick={() => openAddRewards(data?.symbol || '', data.contractBribe)}
              disabled={readOnlyMode}
              sx={{ background: '#484A77', border: '1px solid #484A77', fontSize: '12px' }}
            >
              <Trans>Add Rewards</Trans>
            </ButtonSupplyCustom>
          </ListColumn>

          {/* Voters rewards */}
          <ListColumn align="center">
            <Box sx={{ display: 'flex', gap: '6px' }}>
              <FormattedNumber
                value={votersRewards[data.market] || '0'}
                color="#fff"
                symbol="USD"
                visibleDecimals={2}
                sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
              />

              <TextWithTooltip iconSize={19}>
                <Box>
                  <Typography sx={{ fontFamily: 'Work Sans', fontWeight: '500', fontSize: '16px' }}>
                    <Trans>
                      <strong> Voting Incentives</strong>
                    </Trans>
                  </Typography>

                  {data.listIncentiveToken
                    .filter((item: IncentiveTokenType) => Number(item.amount) !== 0)
                    .map((item: IncentiveTokenType) => (
                      <Typography
                        sx={{
                          textAlign: 'center',
                          fontFamily: 'Work Sans',
                          fontSize: '14px',
                          fontWeight: '400',
                        }}
                      >
                        {formatUnits(item.amount, item.decimal)} {item.symbol}
                      </Typography>
                    ))}
                </Box>
              </TextWithTooltip>
            </Box>
          </ListColumn>

          {/* Total Votes */}
          <ListColumn align="center">
            <FormattedNumber
              value={formatUnits(data.totalVote, tokenXCLND.decimal)}
              color="#fff"
              symbol="xCLND"
              sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px', gap: '4px' }}
              visibleDecimals={2}
            />

            <FormattedNumber
              percent
              value={totalVotesPercent}
              color="#fff"
              sx={{ fontFamily: 'Mulish', fontWeight: '400', fontSize: '12px', color: '#A5A8B3' }}
              visibleDecimals={2}
            />
          </ListColumn>

          {/* APY */}
          <ListColumn align="center">
            <FormattedNumber
              percent
              value={apyPool[data.market]}
              color="#FA3A2E"
              symbolsColor="#FA3A2E"
              sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
              visibleDecimals={2}
            />
          </ListColumn>

          {/* My Votes */}
          <ListColumn align="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <InputBase
                disabled={
                  !myVotesInput[data.market] && totalValueInput() >= Number(totalVotingPower)
                }
                value={myVotesInput[data.market] ?? ''}
                onChange={(e) => handleInputMyVote(e.target.value)}
                placeholder="0.00"
                sx={{ flex: 1, color: '#fff' }}
                inputComponent={NumberFormatCustomDecimal as any}
                inputProps={{
                  'aria-label': 'amount input',
                  style: {
                    fontSize: '16px',
                    padding: '2px 12px',
                    height: '28px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    border: ' 1px solid #FFFFFF33',
                    borderRadius: '4px',
                    width: '87px',
                    background: '#1B1A1E',
                  },
                }}
              />

              <Typography
                sx={{
                  fontFamily: 'Work Sans',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: totalValueInput() >= Number(totalVotingPower) ? 'not-allowed' : 'pointer',
                  opacity: totalValueInput() >= Number(totalVotingPower) ? '0.6' : '1',
                }}
                color="common.white"
                onClick={handleButtonMax}
              >
                MAX
              </Typography>
            </Box>
          </ListColumn>

          {/* My Votes % */}
          <ListColumn align="center">
            {!Number(myVotesPercent[data.market]) ? (
              <TextZeroValue>-</TextZeroValue>
            ) : (
              <FormattedNumber
                percent
                value={myVotesPercent[data.market]}
                color="#fff"
                sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
              />
            )}
          </ListColumn>

          {/* Reward Estimate */}
          <ListColumn align="center">
            {!Number(rewardEstimate[data.market]) ? (
              <TextZeroValue>-</TextZeroValue>
            ) : (
              <FormattedNumber
                value={rewardEstimate[data.market] || '0'}
                color="#fff"
                symbol="USD"
                visibleDecimals={2}
                sx={{ fontFamily: 'Work Sans', fontWeight: '600', fontSize: '16px' }}
              />
            )}
          </ListColumn>
        </ListItem>
      )}
    </>
  );
};

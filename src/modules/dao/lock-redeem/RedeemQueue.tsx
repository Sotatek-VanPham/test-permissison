import { Trans } from '@lingui/macro';
import {
  Box,
  CircularProgress,
  ListItem,
  Pagination,
  PaginationItem,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { useModalContext } from 'src/hooks/useModal';
import { useTokenXCLNDContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { RedeemQueueType } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';
// import { STAGING_ENV } from 'src/utils/marketsAndNetworksConfig';

import IconDropdown from '/public/icons/iconDropdown.svg';
import IconDropdownShow from '/public/icons/iconDropdownShow.svg';

import { ButtonCastVote } from '../governance';
import { getCurrentEpoch } from '../governance/TopInfo';
import { ButtonRedeem } from './LockToken';
import { RATE_CONFIG } from './ProcessBar';

interface BigNumberObject {
  type: string;
  hex: string;
}

const listHeaderRedeem = [
  {
    title: <Trans>xCLND Vesting</Trans>,
    sortKey: 'xCLNDVesting',
  },
  {
    title: <Trans>CLND output</Trans>,
    sortKey: 'CLNDoutput',
  },
  {
    title: <Trans>Ratio</Trans>,
    sortKey: 'ratio',
  },
  {
    title: <Trans>Remaining time</Trans>,
    sortKey: 'remainingTime',
  },
  {
    title: <Trans>Actions</Trans>,
    sortKey: 'actions',
  },
];

const listHeaderRedeemMobile = [
  {
    title: <Trans>xCLND Vesting</Trans>,
    sortKey: 'xCLNDVesting',
  },
  {
    title: <Trans>Ratio</Trans>,
    sortKey: 'ratio',
  },
  {
    title: <Trans>Actions</Trans>,
    sortKey: 'actions',
  },
];

const TextThin = styled(Typography)`
  font-family: Mulish;
  font-size: 14px;
  font-weight: 400;
  color: #a5a8b3;
`;

export const TitleBold = styled(Typography)`
  font-family: Work Sans;
  font-size: 28px;
  font-weight: 600;
  color: #fff;
`;

const filterDurationToRatio = (duration: number) => {
  const ratio = RATE_CONFIG.filter((item) => item.duration === duration);
  return ratio[0]?.ratio || 0;
};

const calculateEndTime = (duration: number, startTime: number) => {
  const endTime = duration + startTime;

  const date = new Date(endTime * 1000);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return formattedDate;
};
const calculateTimeLeft = (targetTimestamp: number) => {
  const difference = targetTimestamp * 1000 - new Date().getTime();
  let timeLeft = 0;

  if (difference > 0) {
    // if (STAGING_ENV) {
    //   const minsLeft = difference / (1000 * 60);
    //   timeLeft = minsLeft < 1 ? parseFloat(minsLeft.toFixed(1)) : Math.floor(minsLeft);
    // } else {
    //   const daysLeft = difference / (1000 * 60 * 60 * 24);
    //   timeLeft = daysLeft < 1 ? parseFloat(daysLeft.toFixed(1)) : Math.floor(daysLeft);
    // }
    const minsLeft = difference / (1000 * 60);
    timeLeft = minsLeft < 1 ? parseFloat(minsLeft.toFixed(1)) : Math.floor(minsLeft);
  }
  return timeLeft;
};

const unitTime = (time: number) => {
  // if (time > 0) return STAGING_ENV ? 'mins' : 'days';
  // return STAGING_ENV ? 'min' : 'day';
  if (time > 0) return 'mins';
  return 'min';
};

const LIMIT = 5;

export const RedeemQueue = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { openManageRedeem, openStartEpoch, openDaoSuccess, openDaoFail } = useModalContext();
  const { currentAccount, readOnlyMode } = useWeb3Context();

  const {
    listRedeemQueue,
    setDataRedeemQueue,
    tokenCLND,
    tokenXCLND,
    setIndexRedeem,
    setPaging,
    pagingRedeem,
    currentMarketData,
    txHash,
    currentEpochContract,
    setTxHash,
  } = useRootStore((store) => store);
  const XCLNDAddress = currentMarketData.addresses.XCLND;
  const XCLNDContract = useTokenXCLNDContract(XCLNDAddress || '');
  const [indexSelected, setIndexSelected] = useState<string | null>(null);
  const [indexShow, setIndexShow] = useState<undefined | number>(undefined);
  const dropdownRef = useRef<HTMLElement | null>(null);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPaging({
      ...pagingRedeem,
      currentPage: value,
    });
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

  const getRedeemQueue = async () => {
    if (XCLNDContract && currentAccount) {
      const dataQueue: BigNumberObject[][] = await XCLNDContract.getUserRedeems(currentAccount);
      const convertBigNumberArray = (): RedeemQueueType[] => {
        return dataQueue.map(([amount, xAmount, startTime, endTime], index: number) => ({
          amount: amount.toString(),
          xAmount: xAmount.toString(),
          timestamp: Number(startTime).toString(),
          duration: (Number(endTime) - Number(startTime)).toString(),
          indexRedeem: index + '',
          endTime: Number(endTime),
        }));
      };
      const dataList = convertBigNumberArray();
      setDataRedeemQueue(dataList);
      setPaging({
        totalPages: Math.ceil(dataList.length / LIMIT),
        currentPage: 1,
      });
    }
  };

  useEffect(() => {
    getRedeemQueue();
  }, [currentAccount, XCLNDContract, txHash]);

  const paginateArray = () => {
    const startIndex = (pagingRedeem.currentPage - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;
    const listRedeemSort = [...listRedeemQueue];
    return listRedeemSort.length > 0
      ? listRedeemSort.sort((a, b) => a?.endTime - b?.endTime).slice(startIndex, endIndex)
      : [];
  };

  const handleClaimCLND = async (index: string | null, amount: string) => {
    if (currentEpochContract < getCurrentEpoch()) {
      openStartEpoch('Claim CLND by clicking on the button below first');
      return;
    }
    try {
      setIndexSelected(index);
      if (XCLNDContract) {
        const paramsClaim = [index];
        const claimCLND = await XCLNDContract.finalizeRedeem(...paramsClaim);
        const txHash = await claimCLND.wait(1);
        setTxHash(txHash.transactionHash);
        setIndexSelected(null);
        openDaoSuccess(`You already got ${amount} xCLND in your wallet`, '');
      }
    } catch (error) {
      console.log('error', error);
      setIndexSelected(null);
      openDaoFail();
    }
  };

  return (
    <Box sx={{ borderRadius: '16px', background: '#151517' }}>
      <TitleBold sx={{ margin: '20px' }}>
        <Trans>Redeem Queue</Trans>
      </TitleBold>
      <ListHeaderWrapper>
        {(isMobile ? listHeaderRedeemMobile : listHeaderRedeem).map((col) => (
          <ListColumn key={col.sortKey} align="left">
            <ListHeaderTitle>{col.title}</ListHeaderTitle>
          </ListColumn>
        ))}{' '}
      </ListHeaderWrapper>
      <Box>
        {paginateArray().length > 0 ? (
          paginateArray().map((redeem, index) => (
            <ListItem
              sx={{
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                padding: isMobile ? '16px' : '',
                '&:not(:last-child)': {
                  borderBottom: '1px solid',
                  borderColor: 'rgba(255, 255, 255, 0.10)',
                },
              }}
              key={index}
            >
              {/* xCLND Vesting */}
              <ListColumn align="left">
                <FormattedNumber
                  value={formatUnits(redeem.xAmount, tokenXCLND.decimal).toString()}
                  color="#fff"
                  symbol="xCLND"
                  visibleDecimals={2}
                  sx={{
                    fontFamily: 'Work Sans',
                    fontWeight: '700',
                    fontSize: '14px',
                  }}
                />
              </ListColumn>

              {/* CLND output */}
              {!isMobile && (
                <ListColumn align="left">
                  <FormattedNumber
                    value={formatUnits(redeem.amount, tokenCLND.decimal).toString()}
                    color="#fff"
                    symbol="CLND"
                    visibleDecimals={2}
                    sx={{ fontWeight: '400', fontSize: '14px', color: '#a5a8b3' }}
                  />
                  <FormattedNumber
                    value={'0'}
                    color="#fff"
                    symbol="USD"
                    visibleDecimals={2}
                    sx={{ fontWeight: '400', fontSize: '14px', color: '#a5a8b3' }}
                  />
                </ListColumn>
              )}

              {/* Ratio */}
              <ListColumn align="left">
                <TextThin sx={{ pl: isMobile ? '18px' : '0' }}>
                  {filterDurationToRatio(Number(redeem.duration))}
                </TextThin>
              </ListColumn>

              {/* Remaining time */}
              {!isMobile && (
                <ListColumn align="left">
                  <TextThin>
                    {calculateEndTime(Number(redeem.duration), Number(redeem.timestamp))}
                  </TextThin>
                  <TextThin>
                    {calculateTimeLeft(Number(redeem.duration) + Number(redeem.timestamp))}{' '}
                    {unitTime(
                      calculateTimeLeft(Number(redeem.duration) + Number(redeem.timestamp))
                    )}
                  </TextThin>
                </ListColumn>
              )}

              {/* Actions */}
              <ListColumn align="left">
                {' '}
                <Box
                  sx={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}
                >
                  <ButtonRedeem
                    sx={{
                      width: '100px',
                      color: '#fff',
                      fontSize: '12px',
                      height: '32px',
                      marginTop: isMobile ? '0' : '16px',
                    }}
                    onClick={() => {
                      setIndexRedeem(Number(redeem.indexRedeem));
                      openManageRedeem(redeem);
                    }}
                    disabled={
                      readOnlyMode ||
                      (Number(redeem.duration) + Number(redeem.timestamp)) * 1000 -
                        new Date().getTime() <=
                        0
                    }
                  >
                    Manage{' '}
                  </ButtonRedeem>
                  <ButtonCastVote
                    sx={{
                      height: '32px !important',
                      width: '100px !important',
                      mt: isMobile ? '0' : '16px',
                      fontSize: '12px !important',
                    }}
                    onClick={() =>
                      handleClaimCLND(
                        redeem.indexRedeem,
                        formatUnits(redeem.amount, tokenCLND.decimal).toString()
                      )
                    }
                    disabled={
                      readOnlyMode ||
                      (indexSelected !== null &&
                        Number(indexSelected) === Number(redeem.indexRedeem)) ||
                      !!calculateTimeLeft(Number(redeem.duration) + Number(redeem.timestamp))
                    }
                  >
                    {indexSelected !== null &&
                    Number(indexSelected) === Number(redeem.indexRedeem) ? (
                      <>
                        <CircularProgress color="inherit" size="12px" sx={{ mr: 2 }} />{' '}
                        <Trans>Claiming</Trans>
                      </>
                    ) : (
                      <Trans>Claim CLND</Trans>
                    )}
                  </ButtonCastVote>
                </Box>
              </ListColumn>

              {isMobile && (
                <>
                  <Box style={{ width: '34px', textAlign: 'right' }}>
                    {indexShow === index ? (
                      <IconDropdownShow onClick={() => setIndexShow(undefined)} />
                    ) : (
                      <IconDropdown onClick={() => setIndexShow(index)} />
                    )}
                  </Box>
                  {indexShow === index ? (
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        marginLeft: '70px',
                        gap: '40px',
                        marginTop: '10px',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ mb: '4px' }}>
                          <ListHeaderTitle>CLND output</ListHeaderTitle>
                        </Box>
                        <FormattedNumber
                          value={formatUnits(redeem.amount, tokenCLND.decimal).toString()}
                          color="#fff"
                          symbol="CLND"
                          visibleDecimals={2}
                          sx={{ fontWeight: '400', fontSize: '14px', color: '#a5a8b3' }}
                        />
                        <FormattedNumber
                          value={'0'}
                          color="#fff"
                          symbol="USD"
                          visibleDecimals={2}
                          sx={{ fontWeight: '400', fontSize: '14px', color: '#a5a8b3' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ mb: '4px' }}>
                          <ListHeaderTitle>Remaining time</ListHeaderTitle>
                        </Box>

                        <TextThin>
                          {calculateEndTime(Number(redeem.duration), Number(redeem.timestamp))}
                        </TextThin>
                        <TextThin>
                          {calculateTimeLeft(Number(redeem.duration) + Number(redeem.timestamp))}{' '}
                          {unitTime(
                            calculateTimeLeft(Number(redeem.duration) + Number(redeem.timestamp))
                          )}
                        </TextThin>
                      </Box>
                    </Box>
                  ) : (
                    <div />
                  )}
                </>
              )}
            </ListItem>
          ))
        ) : (
          <Typography color="common.white" sx={{ textAlign: 'center', p: '24px' }}>
            <Trans>No data</Trans>
          </Typography>
        )}
      </Box>
      {listRedeemQueue.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: '12px' }}>
          <Pagination
            count={pagingRedeem.totalPages}
            page={pagingRedeem.currentPage}
            siblingCount={0}
            boundaryCount={1}
            onChange={handleChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  backgroundColor: 'transparent !important',
                  border: item.selected ? '1px solid #DA3E3E !important' : '1px solid white',
                  color: item.selected ? '#DA3E3E' : '#fff',
                  '&:hover': {
                    backgroundColor: item.selected ? 'darkorange' : 'lightgrey',
                  },
                }}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

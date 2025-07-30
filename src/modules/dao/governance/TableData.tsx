import { Trans } from '@lingui/macro';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { NoSearchResults } from 'src/components/NoSearchResults';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { Votes } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';
import { handleSortDao } from 'src/utils/daoSortUtils';
import { DASHBOARD_LIST_COLUMN_WIDTHS } from 'src/utils/dashboardSortUtils';

import { ItemAsset } from './ItemAsset';

const listHeadersAssets = [
  {
    title: <Trans>Assets</Trans>,
    sortKey: 'symbol',
  },
  {
    title: <Trans>Incentivize</Trans>,
  },
  {
    title: <Trans>Voters rewards</Trans>,
    sortKey: 'votersRewards',
  },
  {
    title: <Trans>Total Votes</Trans>,
    sortKey: 'totalVotes',
  },
  {
    title: <Trans>APY</Trans>,
    sortKey: 'APY',
  },
];

const listHeadersMobile = [
  {
    title: <Trans>Asset</Trans>,
    sortKey: 'symbol',
  },
  {
    title: <Trans>APY</Trans>,
    sortKey: 'APY',
  },
];

const listHeadersMyVotes = [
  {
    title: <Trans>My Votes</Trans>,
  },
  {
    title: <Trans>My Votes %</Trans>,
    sortKey: 'myVotesPercent',
  },
  {
    title: <Trans>Reward Estimate</Trans>,
    sortKey: 'rewardEstimate',
  },
];
export const TableData = ({ searchTerm }: { searchTerm: string }) => {
  const theme = useTheme();
  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const { currentAccount } = useWeb3Context();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    getVotes,
    listVotes,
    getIncentives,
    loadingData,
    votersRewards,
    myVotesPercent,
    rewardEstimate,
    apyPool,
  } = useRootStore((store) => store);

  useEffect(() => {
    getVotes();
    getIncentives();
  }, [currentAccount]);

  useEffect(() => {
    const intervalGetVotes = setInterval(() => getVotes(), 10000);
    return () => clearInterval(intervalGetVotes);
  }, []);

  const sortField = () => {
    const fieldMap: Record<any, any> = {
      symbol: null,
      votersRewards: votersRewards,
      myVotesPercent: myVotesPercent,
      rewardEstimate: rewardEstimate,
      APY: apyPool,
      totalVotes: null,
    };

    return fieldMap[sortName];
  };

  const sortedVotes =
    listVotes.length > 0 ? handleSortDao(sortDesc, sortName, listVotes, sortField()) : [];

  const filterArrayBySearch = () => {
    return sortedVotes.filter((item) => {
      const marketMatch = item.market.toLowerCase().includes(searchTerm.toLowerCase());
      const valueMatch = item?.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      return marketMatch || valueMatch;
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        '&:after': {
          content: "''",
          position: 'absolute',
          top: 0,
          right: '12px',
          width: '40%',
          height: '100%',
          zIndex: -1,
          background: isMobile ? '' : '#151517',
          borderRadius: '16px',
        },

        '&:before': {
          content: "''",
          position: 'absolute',
          top: 0,
          right: '41.5%',
          width: '9%',
          height: '100%',
          zIndex: -1,
          background: isMobile ? '' : '#1515174D',
          borderRadius: '16px',
        },
      }}
    >
      {' '}
      <ListHeaderWrapper>
        {(isMobile ? listHeadersMobile : listHeadersAssets).map((col) => (
          <ListColumn
            isRow={col.sortKey === 'symbol'}
            maxWidth={col.sortKey === 'symbol' ? DASHBOARD_LIST_COLUMN_WIDTHS.ASSET : undefined}
            key={col.sortKey}
          >
            <ListHeaderTitle
              sortName={sortName}
              sortDesc={sortDesc}
              setSortName={setSortName}
              setSortDesc={setSortDesc}
              sortKey={col.sortKey}
              source={'Borrow Dashboard'}
            >
              {col.title}
            </ListHeaderTitle>
          </ListColumn>
        ))}{' '}
        {!isMobile &&
          listHeadersMyVotes.map((col) => (
            <ListColumn
              isRow={col.sortKey === 'symbol'}
              maxWidth={col.sortKey === 'symbol' ? DASHBOARD_LIST_COLUMN_WIDTHS.ASSET : undefined}
              key={col.sortKey}
            >
              <ListHeaderTitle
                sortName={sortName}
                sortDesc={sortDesc}
                setSortName={setSortName}
                setSortDesc={setSortDesc}
                sortKey={col.sortKey}
                source={'Borrow Dashboard'}
              >
                {col.title}
              </ListHeaderTitle>
              <div style={{ width: '50px' }} />
            </ListColumn>
          ))}
      </ListHeaderWrapper>{' '}
      <Box>
        {filterArrayBySearch().length > 0 ? (
          filterArrayBySearch().map((item: Votes, index: number) => (
            <ItemAsset key={index} data={item} />
          ))
        ) : (
          <Box sx={{ textAlign: 'center', color: 'white', p: '24px' }}>
            {searchTerm ? (
              <NoSearchResults
                searchTerm={searchTerm}
                subtitle={
                  <Trans>
                    We couldn&apos;t find any assets related to your search. Try again with a
                    different asset name, symbol, or address.
                  </Trans>
                }
              />
            ) : loadingData ? (
              <>
                <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
                <Trans>Loading...</Trans>
              </>
            ) : (
              <Trans>No Data</Trans>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

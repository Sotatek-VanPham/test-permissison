import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { AirdropItem } from './AirdropItem';

const LIMIT = 10000;

export const AirdropList = () => {
  const { currentAccount } = useWeb3Context();
  const campaigns = useRootStore((state) => state.campaigns);
  const setCampains = useRootStore((store) => store.setCampains);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const endPoint = process.env.NEXT_PUBLIC_API_LEADERBOARD || '';
      const data = await axios.get(
        `${endPoint}/campaigns/user?address=${currentAccount}&page=1&limit=${LIMIT}`
      );
      setCampains(data.data.data?.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentAccount]);

  return (
    <>
      {campaigns.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginTop: '20px',
            gap: '40px',

            ['@media screen and (max-width: 1280px)']: {
              gap: '20px',
            },
            ['@media screen and (max-width: 928px)']: {
              gridTemplateColumns: 'repeat(2, 1fr)',
            },
            ['@media screen and (max-width: 526px)']: {
              gridTemplateColumns: 'repeat(1, 1fr)',
            },
          }}
        >
          {campaigns.map((item) => (
            <AirdropItem
              bannerImg={item.banner_url}
              name={item.title}
              statusUserCampaign={item.statusUserCampaign}
              endTime={item.end_date}
              vestingAddress={item.vesting_contract}
              campaignId={item.id}
              periodicReward={item.userTokenPerDay}
              proof={item.userProof}
              tokenAddress={item.token_contract}
              balanceRemaining={item.balanceRemaining}
              fetchData={fetchData}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            color: '#fff',
            fontWeight: 600,
            fontSize: '24px',
            textAlign: 'center',
            width: '100%',
            marginTop: '70px',
          }}
        >
          {loading ? (
            <Trans>Loading data...</Trans>
          ) : (
            <Trans>Airdrops are coming soon. Please come back later!</Trans>
          )}
        </Box>
      )}
    </>
  );
};

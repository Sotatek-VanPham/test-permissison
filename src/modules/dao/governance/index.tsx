import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { parseUnits } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { TitleWithSearchBar } from 'src/components/TitleWithSearchBar';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useModalContext } from 'src/hooks/useModal';
import { useVoterContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { ButtonDetailCustom } from 'src/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsListItem';
import { useRootStore } from 'src/store/root';

import IconVote from '/public/icon-vote.svg';

import { TableData } from './TableData';
import { getCurrentEpoch, TopInfo } from './TopInfo';

export const WrapperPage = styled(Box)`
  background: #1b1b1d80;
  border-radius: 16px;
`;

export const ButtonCastVote = styled(ButtonDetailCustom)`
  width: 200px;
  height: 41.56px;
  color: #fff !important;

  @media screen and (max-width: 1150px) {
    height: 32px;
    font-size: 12px;
  }
`;

export const Governance = () => {
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const { currentAccount, readOnlyMode } = useWeb3Context();
  const {
    currentMarketData,
    myVotesInput,
    setMyVotesInput,
    tokenXCLND,
    myVotesPercent,
    setCurrentEpochContract,
    currentEpochContract,
    setTxHash,
  } = useRootStore((store) => store);
  const voterAddress = currentMarketData.addresses.VOTER;
  const voterContract = useVoterContract(voterAddress || '');
  const { openDaoSuccess, openDaoFail, openStartEpoch } = useModalContext();
  const [loading, setLoading] = useState(false);

  const valueMyVoteInput = () => {
    return Object.fromEntries(
      Object.entries(myVotesInput).filter(([_, value]) => Number(value) !== 0)
    );
  };

  const handleCastVote = async () => {
    if (currentEpochContract < getCurrentEpoch()) {
      openStartEpoch('Cast your vote by clicking on the button below');
      return;
    }
    try {
      setLoading(true);
      if (voterContract && currentAccount) {
        const valuesMultiplied = Object.values(valueMyVoteInput()).map((value: any) =>
          parseUnits(value, tokenXCLND.decimal).toString()
        );
        const paramsVoterContract = [
          currentAccount,
          Object.keys(valueMyVoteInput()),
          valuesMultiplied,
        ];
        const castVote = await voterContract.vote(...paramsVoterContract);
        setMyVotesInput({});
        const txHash = await castVote.wait(1);
        setTxHash(txHash.transactionHash);
        openDaoSuccess('You have successfully cast your vote', '');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      openDaoFail();
      setMyVotesInput({});
      console.log('error', error);
    }
  };

  const checkIsVoted = () => {
    return Object.values(myVotesPercent).some((value: any) => parseFloat(value) !== 0);
  };

  const getCurrentEpochSC = async () => {
    try {
      if (voterContract) {
        const currentEpoch = await voterContract.epoch();
        setCurrentEpochContract(Number(currentEpoch));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getCurrentEpochSC();
  }, [voterContract]);

  return (
    <Box>
      <WrapperPage
        sx={{
          '@media screen and (max-width: 759px)': {
            background: 'none',
          },
        }}
      >
        <Box
          sx={{
            boxShadow: '0px 4px 8px 0px #00000040',
            borderRadius: '16px',
            background: '#1B1B1DE5',
          }}
        >
          <TopInfo />
        </Box>

        <Box sx={{ padding: '28px' }}>
          <TitleWithSearchBar
            onSearchTermChange={setSearchTerm}
            title={<PageTitle withMarketSwitcher />}
            searchPlaceholder={sm ? 'Search asset' : 'Search asset name, symbol, or address'}
            widthFitContent
          />
        </Box>

        <Box
          sx={{
            borderRadius: sm ? '16px' : '',
            background: sm ? '#1B1B1DE5' : '',
          }}
        >
          <TableData searchTerm={searchTerm.trim()} />
        </Box>
      </WrapperPage>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: sm ? '60px' : '100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: sm ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0px 4px 10px 0px #00000040',
            background: '#1B1B1DCC',
            borderRadius: '16px',
            height: sm ? '176px' : '137px',
            width: '625px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <IconVote />
            <Box>
              <Typography
                color="common.white"
                sx={{
                  fontFamily: ' Work Sans',
                  fontSize: '16px',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                <Trans>Vote Power Used:</Trans> {checkIsVoted() ? '100%' : '0%'}
              </Typography>

              <Box
                sx={{
                  border: '1px solid #A5A8B3',
                  padding: '1px',
                  borderRadius: '20px',
                  width: '100%',
                  marginTop: '12px',
                }}
              >
                <Box
                  sx={{
                    background: '#DA3E3E',
                    borderRadius: '20px',
                    width: checkIsVoted() ? '100%' : '0%',
                    height: '8px',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <ButtonCastVote
            onClick={handleCastVote}
            disabled={Object.keys(valueMyVoteInput()).length === 0 || loading || readOnlyMode}
            sx={{ fontSize: '12px' }}
          >
            {loading && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
            <Trans>Cast Vote</Trans>
          </ButtonCastVote>
        </Box>
      </Box>
    </Box>
  );
};

import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, Button, Container, Link, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { MainLayout } from 'src/layouts/MainLayout';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { LeaderBoardTopPanel } from 'src/modules/leaderboard/LeaderBoardTopPanel';
import { ListLeaderboard, TypeData } from 'src/modules/leaderboard/ListLeaderboard';
import { PointBox } from 'src/modules/leaderboard/PointBox';

const NumberBold = styled(FormattedNumber)`
  font-weight: 700 !important;
  font-size: 25px;
  font-family: Work Sans;
`;

const NumberMedium = styled(FormattedNumber)`
  font-weight: 400;
  font-size: 16px;
  font-family: Mulish;
`;

export default function LeaderBoard() {
  const { connected, currentAccount } = useWeb3Context();
  const [dataUser, setDataUser] = useState<TypeData | undefined>();
  const getDataUser = async () => {
    if (!connected) {
      return;
    }
    const endpointURL = process.env.NEXT_PUBLIC_API_LEADERBOARD + '/user-points';
    const url = `${endpointURL}/${currentAccount}`;
    const response = await axios.get(url);
    setDataUser(response?.data.data);
  };

  useEffect(() => {
    getDataUser();
  }, [connected, currentAccount]);

  return (
    <MainLayout>
      <Container>
        <LeaderBoardTopPanel />

        {connected ? (
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'space-between',
              ['@media screen and (max-width: 850px)']: {
                flexDirection: 'column',
              },
            }}
          >
            <PointBox title={<Trans>Your Rank</Trans>}>
              <Typography
                color="common.white"
                sx={{
                  fontWeight: '700',
                  fontSize: '25px',
                  fontFamily: 'Work Sans',
                  paddingRight: '8px',
                }}
              >
                {dataUser?.rank ? ' #' : '-'}
              </Typography>
              {dataUser?.rank && (
                <NumberBold
                  value={dataUser.rank}
                  variant="secondary14"
                  color={'common.white'}
                  visibleDecimals={0}
                  sx={{
                    lineHeight: '1.5rem',
                  }}
                />
              )}
            </PointBox>

            <PointBox title={<Trans>Lending Points</Trans>}>
              {dataUser?.lendingPoint === null ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    fontWeight: '400',
                    fontSize: '16px',
                    fontFamily: 'Mulish',
                  }}
                >
                  -
                </Typography>
              ) : (
                <NumberMedium
                  value={dataUser?.lendingPoint || 0}
                  variant="secondary14"
                  color="text.secondary"
                  symbolsColor="text.secondary"
                  visibleDecimals={1}
                />
              )}
            </PointBox>

            <PointBox title={<Trans>Borrowing Points</Trans>}>
              {dataUser?.borrowPoint === null ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    fontWeight: '400',
                    fontSize: '16px',
                    fontFamily: 'Mulish',
                  }}
                >
                  -
                </Typography>
              ) : (
                <NumberMedium
                  value={dataUser?.borrowPoint || 0}
                  variant="secondary14"
                  color="text.secondary"
                  symbolsColor="text.secondary"
                  visibleDecimals={1}
                />
              )}
            </PointBox>

            <PointBox title={<Trans>Your Total Points</Trans>}>
              {dataUser?.totalPoint === null ? (
                <Typography
                  color="common.white"
                  sx={{
                    fontWeight: '700',
                    fontSize: '25px',
                    fontFamily: 'Work Sans',
                    paddingRight: '8px',
                  }}
                >
                  -
                </Typography>
              ) : (
                <NumberBold
                  value={dataUser?.totalPoint || 0}
                  variant="secondary14"
                  color="common.white"
                  symbolsColor="common.white"
                  visibleDecimals={1}
                  sx={{
                    fontWeight: 700,
                    fontSize: '25px',
                    fontFamily: 'Work Sans',
                    lineHeight: '1.5rem',
                  }}
                />
              )}
            </PointBox>
          </Box>
        ) : (
          <ConnectWalletPaper
            description={
              <Trans>
                Please connect your wallet to see your rank, lending points, borrowing points, and
                total points.
              </Trans>
            }
          />
        )}

        <Box
          className="bg-item"
          sx={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '105px',
            color: 'common.white',
            justifyContent: 'space-between',
            padding: '20px',
            marginTop: '20px',
            ['@media screen and (max-width: 850px)']: {
              flexDirection: 'column',
            },
          }}
        >
          <Box sx={{ fontFamily: 'Mulish', fontSize: '14px', fontWeight: '400' }}>
            {' '}
            <Typography>
              <Trans>
                Airdrop Points are updated daily and randomly, based on the current value of the
                liquidity you have supplied and borrowed.
              </Trans>
            </Typography>
            <Typography>
              <Trans>The longer you use the platform, the more points you earn. </Trans>
            </Typography>
          </Box>

          <Button
            component={Link}
            href={process.env.NEXT_PUBLIC_ARTICLE_AIRDROP_URL}
            target="_blank"
            sx={{
              fontFamily: 'Mulish',
              background: '#DA3E3E',
              color: 'common.white',
              fontWeight: '700',
              fontSize: '12px',
              '&:hover': { background: '#FF42281F', border: '1px solid #DA3E3E', color: '#DA3E3E' },
              ['@media screen and (max-width: 850px)']: {
                marginTop: '20px',
              },
            }}
          >
            <Trans>Read the article</Trans>
          </Button>
        </Box>

        <ListLeaderboard />
      </Container>
    </MainLayout>
  );
}

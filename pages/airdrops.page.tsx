import { Trans } from '@lingui/macro';
import { Box, Button, Container, Link, Typography } from '@mui/material';
import { MainLayout } from 'src/layouts/MainLayout';
import { AirdropList } from 'src/modules/airdrop/AirdropList';
import { LeaderBoardTopPanel } from 'src/modules/airdrop/AirdropTopPanel';

export default function AirDrop() {
  return (
    <MainLayout>
      <Container
        sx={{
          ['@media screen and (max-width: 1280px)']: {
            paddingLeft: '18px',
            paddingRight: '18px',
          },
        }}
      >
        <LeaderBoardTopPanel />

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

        <AirdropList />
      </Container>
    </MainLayout>
  );
}

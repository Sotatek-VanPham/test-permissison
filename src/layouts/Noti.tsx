import { Trans } from '@lingui/macro';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

// import { ButtonDetailCustom } from 'src/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsListItem';
// import { Link } from 'src/components/primitives/Link';
import IconCloseBanner from '/public/icons/iconCloseBanner.svg';

export function Noti({ setIsOpenNoti }: { setIsOpenNoti: any }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleCloseNoti = () => {
    setIsOpenNoti(false);
  };
  return (
    <Box
      sx={{
        background: 'linear-gradient(60deg, #DA3E3E 24%, #492333 95.82%)',
        display: 'flex',
        justifyContent: 'center',
        padding: '6px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Typography sx={{ fontWeight: '500', textAlign: 'center', marginRight: '21px' }} color="#fff">
        <Trans>Core ignition program - Deposit now and earn additionnal rewards. </Trans>
      </Typography>

      {/* <ButtonDetailCustom
        sx={{ textTransform: 'uppercase', fontSize: '12px', marginRight: isMobile ? '24px' : '0px' }}
        component={Link}
        href={process.env.NEXT_PUBLIC_LEARN_MORE}
      >
        <Trans>Learn More</Trans>
      </ButtonDetailCustom> */}
      {!isMobile ? (
        <IconButton onClick={handleCloseNoti}>
          <IconCloseBanner />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleCloseNoti}
          sx={{ position: 'absolute', top: '4px', right: '4px' }}
        >
          <IconCloseBanner />
        </IconButton>
      )}
    </Box>
  );
}

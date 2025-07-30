import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import * as React from 'react';
import { useRootStore } from 'src/store/root';
import { NAV_BAR } from 'src/utils/mixPanelEvents';

import { Link, ROUTES } from '../../components/primitives/Link';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { navigation } from '../../ui-config/menu-items';
// import { MoreMenu } from '../MoreMenu';

interface NavItemsProps {
  setOpen?: (value: boolean) => void;
}

export const NavItems = ({ setOpen }: NavItemsProps) => {
  const { i18n } = useLingui();
  const { currentMarketData } = useProtocolDataContext();

  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const trackEvent = useRootStore((store) => store.trackEvent);
  const [isLifiWidgetOpen, setLifiWidgetOpen] = useRootStore((state) => [
    state.isLifiWidgetOpen,
    state.setLifiWidgetOpen,
  ]);

  const handleClick = (title: string, isMd: boolean) => {
    if (isMd && setOpen) {
      trackEvent(NAV_BAR.MAIN_MENU, { nav_link: title });
      setOpen(false);
    } else {
      trackEvent(NAV_BAR.MAIN_MENU, { nav_link: title });
    }
  };
  return (
    <List
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
      }}
      disablePadding
    >
      {navigation
        .filter((item) => !item.isVisible || item.isVisible(currentMarketData))
        .map((item, index) => (
          <ListItem
            sx={{
              width: { xs: '100%', md: 'unset' },
              mr: { xs: 0, md: 2 },
            }}
            data-cy={item.dataCy}
            disablePadding
            key={index}
          >
            {md ? (
              <Typography
                component={Link}
                href={item.link}
                color="#FFF"
                sx={{
                  width: '100%',
                  p: 4,
                  fontWeight: 500,
                  fontSize: '16px',
                  fontFamily: 'Work Sans',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => handleClick(item.title, true)}
              >
                {i18n._(item.title)}
              </Typography>
            ) : (
              <Button
                component={Link}
                onClick={() => {
                  item.dataCy === 'swapBase'
                    ? setLifiWidgetOpen(true)
                    : handleClick(item.title, false);
                }}
                disabled={item.dataCy === 'swapBase' && isLifiWidgetOpen ? true : false}
                href={item.link}
                sx={(theme) => ({
                  color: '#FFF',
                  p: '6px 8px',
                  fontWeight: 500,
                  fontSize: '16px',
                  fontFamily: 'Work Sans',
                  whiteSpace: 'nowrap',
                  '.active&:after, &:hover&:after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'bottom left',
                  },
                  '&:after': {
                    content: "''",
                    position: 'absolute',
                    width: '100%',
                    transform: 'scaleX(0)',
                    height: '4px',
                    bottom: '-9px',
                    left: '0',
                    borderRadius: '16px',
                    background: theme.palette.gradients.colend,
                    transformOrigin: 'bottom right',
                    transition: 'transform 0.25s ease-out',
                  },
                })}
              >
                {item?.icon && (
                  <ListItemIcon>
                    <SvgIcon sx={{ fontSize: '20px' }}>{item.icon}</SvgIcon>
                  </ListItemIcon>
                )}
                {i18n._(item.title)}
              </Button>
            )}
          </ListItem>
        ))}

      {/* Airdrop Page */}

      <ListItem sx={{ width: 'unset' }}>
        <Button
          component={Link}
          href={ROUTES.airdropPage}
          sx={(theme) =>
            md
              ? {
                  color: '#FFF',
                  p: '4px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  fontFamily: 'Mulish',
                  background: '#DA3E3E',
                  borderRadius: '50px',
                }
              : {
                  color: '#FFF',
                  p: '4px 16px',
                  fontWeight: 700,
                  fontSize: '12px',
                  fontFamily: 'Mulish',
                  background: '#DA3E3E',
                  borderRadius: '50px',
                  '&:hover': {
                    background: '#DA3E3E',
                  },
                  '.active&:after, &:hover&:after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'bottom left',
                  },
                  '&:after': {
                    content: "''",
                    position: 'absolute',
                    width: '100%',
                    transform: 'scaleX(0)',
                    height: '4px',
                    bottom: '-9px',
                    left: '0',
                    borderRadius: '16px',
                    background: theme.palette.gradients.colend,
                    transformOrigin: 'bottom right',
                    transition: 'transform 0.25s ease-out',
                  },
                }
          }
        >
          <Trans>AIRDROP</Trans>
        </Button>
      </ListItem>
    </List>
  );
};

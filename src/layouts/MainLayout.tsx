import { Box } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import AnalyticsConsent from 'src/components/Analytics/AnalyticsConsent';
import DynamicLifi from 'src/components/LIFI/DynamicLifi';
import { useRootStore } from 'src/store/root';
import { FORK_ENABLED } from 'src/utils/marketsAndNetworksConfig';

import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { Noti } from './Noti';

export function MainLayout({ children }: { children: ReactNode }) {
  const isLifiWidgetOpen = useRootStore((state) => state.isLifiWidgetOpen);
  const [isOpenNoti, setIsOpenNoti] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const enableNoti = process.env.NEXT_PUBLIC_ENABLE_NOTI === 'true';

  return (
    <>
      {isOpenNoti && enableNoti && !mobileMenuOpen ? <Noti setIsOpenNoti={setIsOpenNoti} /> : null}

      <AppHeader setMobileMenuOpen={setMobileMenuOpen} mobileMenuOpen={mobileMenuOpen} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {isLifiWidgetOpen && <DynamicLifi />}
        {children}
      </Box>

      <AppFooter />
      {FORK_ENABLED ? null : <AnalyticsConsent />}
    </>
  );
}

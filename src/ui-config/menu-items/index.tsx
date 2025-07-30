import {
  // BookOpenIcon,
  CreditCardIcon,
  // GiftIcon,
  // QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { ReactNode } from 'react';
import { ROUTES } from 'src/components/primitives/Link';

// import { ENABLE_TESTNET } from 'src/utils/marketsAndNetworksConfig';
import { MarketDataType } from '../marketsConfig';

interface Navigation {
  link: string;
  title: string;
  isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
  action?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export const navigation: Navigation[] = [
  {
    link: ROUTES.markets,
    title: t`All Markets`,
    dataCy: 'menuMarkets',
  },
  {
    link: ROUTES.dashboard,
    title: t`Supply & Borrow`,
    dataCy: 'menuDashboard',
  },
  {
    link: process.env.NEXT_PUBLIC_URL_BRIDGE || 'https://ignition.coredao.org',
    title: t`Bridge`,
    dataCy: 'Bridge',
  },
  {
    link: ROUTES.leaderboard,
    title: t`Leaderboard`,
    dataCy: 'Leaderboard',
  },
  {
    link: ROUTES.farms,
    title: t`Staking Farms [Soon]`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
  },
  {
    link: ROUTES.dao,
    title: t`DAO`,
    dataCy: 'DAO',
  },
  // {
  //   link: '',
  //   title: t`Bridge to Core`,
  //   dataCy: 'swapBase',
  //   disabled: false,
  // },
  // {
  //   link: ROUTES.staking,
  //   title: t`Stake`,
  //   dataCy: 'menuStake',
  //   isVisible: () =>
  //     process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true' &&
  //     process.env.NEXT_PUBLIC_ENV === 'prod' &&
  //     !ENABLE_TESTNET,
  // },
  // {
  //   link: ROUTES.governance,
  //   title: t`Governance`,
  //   dataCy: 'menuGovernance',
  //   isVisible: () =>
  //     process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === 'true' &&
  //     process.env.NEXT_PUBLIC_ENV === 'prod' &&
  //     !ENABLE_TESTNET,
  // },
  // {
  //   link: ROUTES.faucet,
  //   title: t`Faucet`,
  //   isVisible: () => process.env.NEXT_PUBLIC_ENV === 'staging' || ENABLE_TESTNET,
  // },
];

interface MoreMenuItem extends Navigation {
  icon: ReactNode;
  makeLink?: (walletAddress: string) => string;
}

const moreMenuItems: MoreMenuItem[] = [
  {
    link: ROUTES.farms,
    title: t`Staking Farms`,
    icon: (
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.51721 0C11.7329 0 15.0344 2.01184 15.0344 4.57952V14.6138C15.0344 17.1815 11.7329 19.1933 7.51721 19.1933C3.30155 19.1933 9.53674e-07 17.1815 9.53674e-07 14.6138V4.57952C9.53674e-07 2.01184 3.30155 0 7.51721 0ZM7.51721 1.24443C3.688 1.24443 1.11476 2.97005 1.11476 4.57952C1.11476 6.18899 3.688 7.9146 7.51721 7.9146C11.3464 7.9146 13.9197 6.19106 13.9197 4.57952C13.9197 2.96798 11.3464 1.24443 7.51721 1.24443ZM7.51721 17.9489C11.3464 17.9489 13.9197 16.2233 13.9197 14.6138V13.7012C12.6061 14.9996 10.2558 15.8499 7.51721 15.8499C4.77861 15.8499 2.42647 14.9996 1.11476 13.7012V14.6138C1.11476 16.2253 3.688 17.9489 7.51721 17.9489ZM7.51721 14.6055C11.3464 14.6055 13.9197 12.8799 13.9197 11.2704V10.3578C12.6061 11.6562 10.2558 12.5066 7.51721 12.5066C4.77861 12.5066 2.42647 11.6562 1.11476 10.3578V11.2704C1.11476 12.882 3.688 14.6055 7.51721 14.6055ZM7.51721 11.2621C11.3464 11.2621 13.9197 9.53652 13.9197 7.92705V7.01446C12.6061 8.31282 10.2558 9.16319 7.51721 9.16319C4.77861 9.16319 2.42647 8.31282 1.11476 7.01446V7.92705C1.11476 9.53859 3.688 11.2621 7.51721 11.2621Z"
          fill="#999EBA"
        />
      </svg>
    ),
  },
  // {
  //   link: ROUTES.airdrop,
  //   title: t`Claim Airdrop`,
  //   icon: <GiftIcon />,
  // },
  // {
  //   link: 'https://docs.colend.xyz/overview/faq',
  //   title: t`FAQ`,
  //   icon: <QuestionMarkCircleIcon />,
  // },
  // {
  //   link: 'https://github.com/colend-protocol',
  //   title: t`Github`,
  //   icon: <BookOpenIcon />,
  // },
];

const fiatEnabled = process.env.NEXT_PUBLIC_FIAT_ON_RAMP;
if (fiatEnabled === 'true') {
  moreMenuItems.push({
    link: 'https://global.transak.com',
    makeLink: (walletAddress) =>
      `${process.env.NEXT_PUBLIC_TRANSAK_APP_URL}/?apiKey=${process.env.NEXT_PUBLIC_TRANSAK_API_KEY}&walletAddress=${walletAddress}&disableWalletAddressForm=true`,
    title: t`Buy Crypto With Fiat`,
    icon: <CreditCardIcon />,
  });
}
export const moreNavigation: MoreMenuItem[] = [...moreMenuItems];

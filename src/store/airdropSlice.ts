import { StateCreator } from 'zustand';

import { RootStore } from './root';

export type Campaigns = {
  id: number;
  title: string;
  vesting_type: string;
  start_date: string;
  end_date: string;
  banner_url: string;
  tree_root: string;
  token_contract: string;
  treasury_contract: string;
  tx_deployer: string;
  vesting_contract: string;
  statusUserCampaign: number;
  is_show: boolean;
  created_at: string;
  updated_at: string;
  userTokenPerDay: string;
  userProof: string;
  balanceRemaining: string;
};

export type TokenInfo = {
  address: string;
  symbol: string;
  decimals: number;
  txHash: string;
};

export interface CampaignsSlice {
  campaigns: Campaigns[];
  tokenReward: TokenInfo;
  setCampains: (data: Campaigns[]) => void;
  setTokenAirdrop: (data: TokenInfo) => void;
}

export const createCampaignsSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  CampaignsSlice
> = (set) => {
  return {
    campaigns: [],
    tokenReward: {
      address: '',
      symbol: '',
      decimals: 18,
      txHash: '',
    },
    setCampains(data: Campaigns[]) {
      set({ campaigns: data });
    },
    setTokenAirdrop(data: TokenInfo) {
      set({ tokenReward: data });
    },
  };
};

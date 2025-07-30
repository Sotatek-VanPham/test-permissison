import axios from 'axios';
import { StateCreator } from 'zustand';

import { RootStore } from './root';

type TokenInfo = {
  balance: string;
  decimal: number;
};

export type RedeemQueueType = {
  amount: string;
  xAmount: string;
  duration: string;
  timestamp: string;
  indexRedeem: string;
  endTime: number;
};

export type IncentiveTokenType = {
  incentiveToken: string;
  amount: string;
  decimal: number;
  symbol: string;
};

export type Votes = {
  market: string;
  symbol: string;
  contractBribe: string;
  totalVote: string;
  duration: string;
  listIncentiveToken: IncentiveTokenType[];
};

export type Incentives = {
  name: string;
  symbol: string;
  tokenAddress: string;
  decimal: number;
};

type PagingType = {
  currentPage: number;
  totalPages: number;
};

export interface DaoSlice {
  totalVotingPower: string;
  tokenCLND: TokenInfo;
  tokenXCLND: TokenInfo;
  txHash: string;
  indexRedeem: null | number;
  loadingData: boolean;
  listRedeemQueue: RedeemQueueType[];
  listAssetRewards: string[];
  listVotes: Votes[];
  listIncentives: Incentives[];
  pagingRedeem: PagingType;
  myVotesInput: any;
  myVotesPercent: any;
  priceUsdTokens: any;
  votersRewards: any;
  rewardEstimate: any;
  myRewardsTab: any;
  apyPool: any;
  currentEpochContract: number;
  setTotalVotingPower: (data: string) => void;
  setTokenCLND: (data: TokenInfo) => void;
  setTokenXCLND: (data: TokenInfo) => void;
  setTxHash: (tsx: string) => void;
  setListRedeemQueue: (data: RedeemQueueType[]) => void;
  setIndexRedeem: (index: null | number) => void;
  setPaging: (paging: PagingType) => void;
  setDataRedeemQueue: (data: RedeemQueueType[]) => void;
  getVotes: () => Promise<Votes[]>;
  getIncentives: () => Promise<Incentives[]>;
  getAssetRewards: (CLNDAddress: string) => Promise<string[]>;
  setMyVotesInput: (data: any) => void;
  setMyVotesPercent: (address: string, value: string) => void;
  setPriceUsdTokens: (address: string, value: string) => void;
  setVotersRewards: (address: string, value: string) => void;
  setRewardEstimate: (address: string, value: string) => void;
  setMyRewardsTab: (address: string, value: string) => void;
  setAPY: (address: string, value: string) => void;
  setCurrentEpochContract: (index: number) => void;
}

const endPoint = process.env.NEXT_PUBLIC_API_LEADERBOARD || '';

export const createDaoSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  DaoSlice
> = (set, get) => {
  return {
    totalVotingPower: '0',
    tokenCLND: {
      balance: '0',
      decimal: 18,
    },
    tokenXCLND: {
      balance: '0',
      decimal: 18,
    },
    loadingData: false,
    listRedeemQueue: [],
    listVotes: [],
    listIncentives: [],
    listAssetRewards: [],
    txHash: '',
    indexRedeem: null,
    pagingRedeem: {
      currentPage: 1,
      totalPages: 1,
    },
    myVotesInput: {},
    myVotesPercent: {},
    priceUsdTokens: {},
    votersRewards: {},
    rewardEstimate: {},
    symbolVotes: {},
    myRewardsTab: {},
    apyPool: {},
    currentEpochContract: 0,
    setCurrentEpochContract(index: number) {
      set({ currentEpochContract: index });
    },
    setTotalVotingPower(data: string) {
      set({ totalVotingPower: data });
    },
    setTokenCLND(data: TokenInfo) {
      set({ tokenCLND: data });
    },
    setTokenXCLND(data: TokenInfo) {
      set({ tokenXCLND: data });
    },
    setTxHash(tx: string) {
      set({ txHash: tx });
    },
    setListRedeemQueue(data: RedeemQueueType[]) {
      set({ listRedeemQueue: data });
    },
    setIndexRedeem(index: null | number) {
      set({ indexRedeem: index });
    },
    setPaging(data: PagingType) {
      set({ pagingRedeem: data });
    },
    setMyVotesInput(data: any) {
      set({ myVotesInput: data });
    },
    setMyVotesPercent(address: string, value: string) {
      const myVotes = get().myVotesPercent;
      set({
        myVotesPercent: {
          ...myVotes,
          [address]: value,
        },
      });
    },

    setPriceUsdTokens(address: string, value: string) {
      const priceUsdTokensGet = get().priceUsdTokens;
      set({
        priceUsdTokens: {
          ...priceUsdTokensGet,
          [address]: value,
        },
      });
    },

    setRewardEstimate(address: string, value: string) {
      const rewardEstimateGet = get().rewardEstimate;
      set({
        rewardEstimate: {
          ...rewardEstimateGet,
          [address]: value,
        },
      });
    },

    setVotersRewards(address: string, value: string) {
      const votersRewardsGet = get().votersRewards;
      set({
        votersRewards: {
          ...votersRewardsGet,
          [address]: value,
        },
      });
    },

    setAPY(address: string, value: string) {
      const apyPoolGet = get().apyPool;
      set({
        apyPool: {
          ...apyPoolGet,
          [address]: value,
        },
      });
    },

    setMyRewardsTab(address: string, value: string) {
      const myRewardsTabGet = get().myRewardsTab;
      set({
        myRewardsTab: {
          ...myRewardsTabGet,
          [address]: value,
        },
      });
    },
    setDataRedeemQueue(data: RedeemQueueType[]) {
      set({ listRedeemQueue: data });
    },
    getVotes: async () => {
      try {
        // Call BE
        set({ loadingData: true });
        const res = await axios.get(`${endPoint}/vote-bribe`);
        const dataList = res?.data?.data;

        set({ listVotes: dataList });
        set({ loadingData: false });
        return dataList;
      } catch (error) {
        set({ loadingData: false });
        set({ listVotes: [] });
      }
    },

    getIncentives: async () => {
      try {
        // Call BE
        const res = await axios.get(`${endPoint}/vote-bribe/list-incentive`);
        const dataList = res?.data?.data;

        set({ listIncentives: dataList });
        return dataList;
      } catch (error) {}
    },

    getAssetRewards: async (CLNDAddress: string) => {
      try {
        // Call BE
        const res = await axios.get(`${endPoint}/reward/asset-reward?reward=${CLNDAddress}`);
        const dataList = res?.data?.data;
        const transformedArray = [...new Set(dataList.map((item: any) => item.asset))];

        set({ listAssetRewards: transformedArray as string[] });
        return dataList;
      } catch (error) {}
    },
  };
};

import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import ABI_BRIBE from 'src/services/abi/Bribe.json';
import ABI_ERC20 from 'src/services/abi/ERC20.json';
import ABI_MINTER from 'src/services/abi/Minter.json';
import ABI_MULTICAL3 from 'src/services/abi/Multical3.json';
import ABI_REWARDS_CONTROLLER from 'src/services/abi/rewardsController.json';
import ABI_VARIABLE_DEPT_TOKEN from 'src/services/abi/VariableDebtToken.json';
import ABI_VESTING from 'src/services/abi/VestingAddress.json';
import VOTE_LOGIC from 'src/services/abi/VoteLogic.json';
import ABI_VOTER from 'src/services/abi/Voter.json';
import ABI_XCLND from 'src/services/abi/XCLND.json';
import ABI_SOUL_BOUND_TOKEN from 'src/services/abi/SoulBoundToken.json';
import { useRootStore } from 'src/store/root';
import { getProvider } from 'src/utils/marketsAndNetworksConfig';

import { useWeb3Context } from './useWeb3Context';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === ADDRESS_ZERO) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export const useContract = (address: string, abi: any): Contract | null => {
  const { library, account } = useWeb3React();
  const { readOnlyMode } = useWeb3Context();
  const { currentMarketData } = useRootStore((store) => store);

  const provider = readOnlyMode ? getProvider(currentMarketData.chainId) : library;

  return useMemo(() => {
    if (!address || !abi || !provider || !account) return null;

    try {
      return getContract(address, abi, provider, account);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [abi, address, provider, account]);
};

export const useVestingContract = (address: string): Contract | null => {
  return useContract(address, ABI_VESTING);
};

export const useTokenERC20Contract = (address: string): Contract | null => {
  return useContract(address, ABI_ERC20);
};

export const useTokenXCLNDContract = (address: string): Contract | null => {
  return useContract(address, ABI_XCLND);
};

export const useBribeContract = (address: string): Contract | null => {
  return useContract(address, ABI_BRIBE);
};

export const useVoteLogicContract = (address: string): Contract | null => {
  return useContract(address, VOTE_LOGIC);
};

export const useVoterContract = (address: string): Contract | null => {
  return useContract(address, ABI_VOTER);
};

export const useMinterContract = (address: string): Contract | null => {
  return useContract(address, ABI_MINTER);
};

export const useMultical3Contract = (address: string): Contract | null => {
  return useContract(address, ABI_MULTICAL3);
};

export const useRewardsControllerContract = (address: string): Contract | null => {
  return useContract(address, ABI_REWARDS_CONTROLLER);
};

export const useVariableDebtTokenContract = (address: string): Contract | null => {
  return useContract(address, ABI_VARIABLE_DEPT_TOKEN);
};

export const useSoulBoundTokenContract = (address: string): Contract | null => {
  return useContract(address, ABI_SOUL_BOUND_TOKEN);
};

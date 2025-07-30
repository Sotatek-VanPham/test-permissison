import { useQuery } from '@tanstack/react-query';
import { constants } from 'ethers';
import { useRootStore } from 'src/store/root';
import { POLLING_INTERVAL, QueryKeys } from 'src/ui-config/queries';
import { useSharedDependencies } from 'src/ui-config/SharedDependenciesProvider';

export const usePowers = () => {
  const { governanceService } = useSharedDependencies();
  const user = useRootStore((store) => store.account);

  return useQuery({
    queryFn: () => governanceService.getPowers(user),
    queryKey: [QueryKeys.POWERS, user, governanceService.toHash()],
    enabled: !!user,
    refetchInterval: POLLING_INTERVAL,
    initialData: {
      votingPower: '0',
      seamTokenPower: '0',
      esSEAMTokenPower: '0',
      seamVotingDelegatee: constants.AddressZero,
      esSEAMVotingDelegatee: constants.AddressZero,
    },
  });
};

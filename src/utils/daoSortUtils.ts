import { Votes } from 'src/store/daoSlice';

export const handleSortDao = (
  sortDesc: boolean,
  sortName: string,
  data: Votes[],
  objectValues?: any
): Votes[] => {
  const dataSort = [...data];

  if (dataSort.length === 0 || !sortName) return dataSort;
  if (sortName === 'totalVotes' && !objectValues) {
    return dataSort.sort((a, b) =>
      sortDesc
        ? Number(a.totalVote) - Number(b.totalVote)
        : Number(b.totalVote) - Number(a.totalVote)
    );
  }
  if (sortName === 'symbol' && !objectValues) {
    return dataSort.sort((a, b) =>
      sortDesc ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)
    );
  }
  if (!objectValues || dataSort.length === 0) return dataSort;

  return dataSort.sort((a, b) => {
    const valueA = objectValues[a.market] || '';
    const valueB = objectValues[b.market] || '';

    if (sortDesc) {
      return Number(valueA) - Number(valueB);
    }
    return Number(valueB) - Number(valueA);
  });
};

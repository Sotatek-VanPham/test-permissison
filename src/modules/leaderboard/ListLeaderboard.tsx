import { Trans } from '@lingui/macro';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { CompactMode, compactModeMap } from 'src/components/CompactableTypography';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListItem } from 'src/components/lists/ListItem';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { textCenterEllipsis } from 'src/helpers/text-center-ellipsis';

import IconDropdown from '/public/icons/iconDropdown.svg';
import IconDropdownShow from '/public/icons/iconDropdownShow.svg';
import IconRank1 from '/public/icons/ranks/no1.svg';
import IconRank2 from '/public/icons/ranks/no2.svg';
import IconRank3 from '/public/icons/ranks/no3.svg';

import { ItemLeaderBoardMobile } from './ItemLeaderBoardMobile';

export type TypeData = {
  address: string;
  borrowPoint: string;
  lendingPoint: string;
  totalPoint: string;
  rank: string;
};

const head = [
  {
    title: <Trans>Rank</Trans>,
    sortKey: 'rank',
  },
  {
    title: <Trans key="Address">Address</Trans>,
    sortKey: 'address',
  },
  {
    title: <Trans key="lendingPoint">Lending Points</Trans>,
    sortKey: 'lendingPoint',
  },
  {
    title: <Trans key="borrowPoint">Borrowing Points</Trans>,
    sortKey: 'borrowPoint',
  },
  {
    title: <Trans key="totalPoint">Total Points</Trans>,
    sortKey: 'totalPoint',
  },
];

const headMobile = [
  {
    title: <Trans>Rank</Trans>,
    sortKey: 'rank',
  },
  {
    title: <Trans key="Address">Address</Trans>,
    sortKey: 'address',
  },
  {
    title: <Trans key="totalPoint">Total Points</Trans>,
    sortKey: 'totalPoint',
  },
];

const TOTAL = 20;

export const ListLeaderboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortField, setSortField] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  const [data, setData] = useState<TypeData[]>([]);
  const [indexShow, setIndexShow] = useState<undefined | number>(undefined);
  const dropdownRef = useRef<HTMLElement | null>(null);

  const getDataTable = async () => {
    const sortType = !sortDesc ? 'DESC' : 'ASC';
    const sort = sortField === 'rank' || sortField === '' ? 'totalPoint' : sortField;
    const endpointURL = process.env.NEXT_PUBLIC_API_LEADERBOARD + '/user-points/leaderboard';
    const url = `${endpointURL}?top=${TOTAL}&sort=${sort}&sortType=${sortType}`;
    const response = await axios.get(url);
    setData(response?.data?.data);
  };

  useEffect(() => {
    getDataTable();
  }, [sortField, sortDesc]);

  const renderIconRank = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconRank1 />;
      case 2:
        return <IconRank2 />;
      case 3:
        return <IconRank3 />;
      default:
        return <Box sx={{ width: '17px' }} />;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIndexShow(undefined);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownRef]);

  useEffect(() => {
    setIndexShow(undefined);
  }, [sortDesc, sortField]);

  const RenderHeader: React.FC = () => {
    return (
      <ListHeaderWrapper>
        {(isMobile ? headMobile : head).map((col) => (
          <ListColumn isRow={col.sortKey === 'rank'} key={col.sortKey} align="left">
            <ListHeaderTitle
              sortName={sortField}
              sortDesc={sortDesc}
              setSortName={setSortField}
              setSortDesc={setSortDesc}
              sortKey={col.sortKey}
              source="Borrowed Positions Dashboard"
            >
              {col.title}
            </ListHeaderTitle>
          </ListColumn>
        ))}
        {isMobile && <div style={{ width: '50px' }} />}
      </ListHeaderWrapper>
    );
  };

  return (
    <Box sx={{ marginTop: '20px' }}>
      <ListWrapper
        titleComponent={
          <Typography
            component="div"
            variant="h3"
            sx={{
              mr: 4,
              color: '#fff',
              fontWeight: '500',
              fontFamily: 'Work Sans',
              fontSize: '24px',

              ['@media screen and (max-width: 560px)']: {
                fontSize: '24px',
              },
            }}
          >
            <Trans>Leaderboard</Trans>
          </Typography>
        }
      >
        <Box ref={dropdownRef}>
          <RenderHeader />

          {data.length > 0 ? (
            data.map((item, index) => (
              <>
                <ListItem
                  sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap', padding: isMobile ? '16px' : '' }}
                >
                  <ListColumn align="left" isRow>
                    {' '}
                    {renderIconRank(Number(item.rank))}
                    <Typography
                      color="common.white"
                      sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: '700',
                        fontSize: '12px',
                        marginLeft: '20px',
                      }}
                    >
                      {item.rank}
                    </Typography>
                  </ListColumn>
                  <ListColumn align="left">
                    <Typography
                      color="common.white"
                      sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: '700',
                        fontSize: '14px',
                        ['@media screen and (max-width: 560px)']: {
                          fontSize: '12px',
                        },
                      }}
                    >
                      {textCenterEllipsis(
                        item.address,
                        compactModeMap[CompactMode.SM].from,
                        compactModeMap[CompactMode.SM].to
                      )}
                    </Typography>
                  </ListColumn>
                  {!isMobile && (
                    <>
                      <ListColumn align="left">
                        <FormattedNumber
                          value={item.lendingPoint}
                          variant="secondary14"
                          symbolsColor={'text.secondary'}
                          color={'text.secondary'}
                          visibleDecimals={1}
                          sx={{
                            fontFamily: 'Mulish',
                            fontWeight: 400,
                            ['@media screen and (max-width: 560px)']: {
                              fontSize: '12px',
                            },
                          }}
                        />
                      </ListColumn>
                      <ListColumn align="left">
                        <FormattedNumber
                          value={item.borrowPoint}
                          variant="secondary14"
                          symbolsColor={'text.secondary'}
                          color={'text.secondary'}
                          visibleDecimals={1}
                          sx={{
                            fontFamily: 'Mulish',
                            fontWeight: 400,
                            ['@media screen and (max-width: 560px)']: {
                              fontSize: '12px',
                            },
                          }}
                        />
                      </ListColumn>
                    </>
                  )}
                  <ListColumn align="left">
                    <FormattedNumber
                      value={item.totalPoint}
                      variant="secondary14"
                      color={'common.white'}
                      visibleDecimals={1}
                      sx={{
                        fontWeight: 700,
                        ['@media screen and (max-width: 560px)']: {
                          fontSize: '12px',
                        },
                      }}
                    />
                  </ListColumn>

                  {isMobile && (
                    <>
                      <Box style={{ width: '50px', textAlign: 'right' }}>
                        {indexShow === index ? (
                          <IconDropdownShow onClick={() => setIndexShow(undefined)} />
                        ) : (
                          <IconDropdown onClick={() => setIndexShow(index)} />
                        )}
                      </Box>
                      {indexShow === index ? (
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            marginLeft: '70px',
                            gap: '40px',
                            marginTop: '10px',
                          }}
                        >
                          <ItemLeaderBoardMobile
                            title={<Trans>Lending Points</Trans>}
                            value={item.lendingPoint}
                          />
                          <ItemLeaderBoardMobile
                            title={<Trans>Borrowing Points</Trans>}
                            value={item.borrowPoint}
                          />
                        </Box>
                      ) : (
                        <div />
                      )}
                    </>
                  )}
                </ListItem>
              </>
            ))
          ) : (
            <Box>
              <Typography
                sx={{ textAlign: 'center', padding: '32px', fontWeight: '700' }}
                color="common.white"
              >
                <Trans>No data</Trans>
              </Typography>
            </Box>
          )}
        </Box>
      </ListWrapper>
    </Box>
  );
};

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useRootStore } from 'src/store/root';

import { MARKETS } from '../../utils/mixPanelEvents';

interface ListHeaderTitleProps {
  sortName?: string;
  sortDesc?: boolean;
  sortKey?: string;
  source?: string;
  setSortName?: (value: string) => void;
  setSortDesc?: (value: boolean) => void;
  onClick?: () => void;
  children: ReactNode;
}

export const ListHeaderTitle = ({
  sortName,
  sortDesc,
  sortKey,
  source,
  setSortName,
  setSortDesc,
  onClick,
  children,
}: ListHeaderTitleProps) => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleSorting = (name: string) => {
    trackEvent(MARKETS.SORT, { sort_by: name, tile: source });
    setSortDesc && setSortDesc(false);
    setSortName && setSortName(name);
    if (sortName === name) {
      setSortDesc && setSortDesc(!sortDesc);
    }
  };

  return (
    <Typography
      component="div"
      variant="subheader2"
      noWrap
      onClick={() => (!!onClick ? onClick() : !!sortKey && handleSorting(sortKey))}
      sx={{
        cursor: !!onClick || !!sortKey ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        color: '#FFF',
        fontFamily: 'Mulish',
        fontWeight: 400,
      }}
    >
      {children}

      {!!sortKey && (
        <Box sx={{ display: 'inline-flex', flexDirection: 'column', ml: 2, width: '6px' }}>
          <Box
            component="span"
            sx={() => ({
              width: '5px',
              height: '5px',
              borderStyle: 'solid',
              borderWidth: '0px 1px 1px 0px',
              marginBottom: '-1px',
              borderColor: sortName === sortKey && sortDesc ? '#fff' : '#5A5F80',
              transform: 'rotate(225deg)',
              transition: 'border-width 150ms ease-in-out',
            })}
          />
          <Box
            component="span"
            sx={() => ({
              width: '5px',
              height: '5px',
              borderStyle: 'solid',
              borderWidth: '0px 1px 1px 0px',
              borderColor: sortName === sortKey && !sortDesc ? '#fff' : '#5A5F80',
              transform: 'rotate(45deg)',
              transition: 'border-width 150ms ease-in-out',
            })}
          />
        </Box>
      )}
    </Typography>
  );
};

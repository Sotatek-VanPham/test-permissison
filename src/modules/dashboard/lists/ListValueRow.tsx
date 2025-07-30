import { Box } from '@mui/material';
import { ReactNode } from 'react';

import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import { Row } from '../../../components/primitives/Row';

interface ListValueRowProps {
  title: ReactNode;
  capsComponent?: ReactNode;
  value: string | number;
  subValue: string | number;
  disabled?: boolean;
}

export const ListValueRow = ({
  title,
  capsComponent,
  value,
  subValue,
  disabled,
}: ListValueRowProps) => {
  return (
    <Row
      caption={title}
      captionVariant="description"
      align="flex-start"
      mb={2}
      sx={{ color: '#fff' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <FormattedNumber
            value={value}
            variant="secondary14"
            color={'#fff'}
            sx={{
              ['@media screen and (max-width: 560px)']: {
                fontSize: '11px',
              },
            }}
          />
          {capsComponent}
        </Box>

        {!disabled && (
          <FormattedNumber
            value={subValue}
            variant="secondary12"
            color={'#fff'}
            symbol="USD"
            mb={0.5}
            sx={{
              ['@media screen and (max-width: 560px)']: {
                fontSize: '10px',
              },
            }}
          />
        )}
      </Box>
    </Row>
  );
};

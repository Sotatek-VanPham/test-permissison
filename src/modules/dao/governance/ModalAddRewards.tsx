import { Trans } from '@lingui/macro';
import {
  Box,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { Incentives } from 'src/store/daoSlice';
import { useRootStore } from 'src/store/root';

import { AddRewardAction } from './AddRewardAction';

export type TokenType = {
  balance: string;
  decimal: number;
  loadingVote: boolean;
};

export const initTokenInfo = {
  balance: '0',
  decimal: 18,
  loadingVote: false,
};

export const ModalAddRewards = () => {
  const { type, close, poolVoter } = useModalContext();
  const { listIncentives } = useRootStore((store) => store);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tokenSelected, setTokenSelected] = useState<Incentives | undefined>(listIncentives[0]);
  const [tokenInfo, setTokenInfo] = useState<TokenType>(initTokenInfo);
  const [amountInput, setAmountInput] = useState('');

  const handleSelect = (event: SelectChangeEvent) => {
    setAmountInput('');
    const newAsset = listIncentives.find((asset) => asset.symbol === event.target.value);
    setTokenSelected(newAsset);
  };

  useEffect(() => {
    setTokenSelected(listIncentives[0]);
  }, [listIncentives]);

  return (
    <BasicModal
      open={type === ModalType.AddRewards}
      setOpen={() => {
        setTokenInfo(initTokenInfo);
        setTokenSelected(listIncentives[0]);
        setAmountInput('');
        close();
      }}
      contentMaxWidth={532}
    >
      <Box sx={{ py: '12px', px: { xs: '0px', xsm: '20px' } }}>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Typography
            sx={{ fontFamily: 'Mulish', fontSize: '24px', fontWeight: '700' }}
            color="common.white"
          >
            <Trans>Incentivize</Trans>
          </Typography>

          <TextWithTooltip iconSize={19}>
            <Typography sx={{ fontFamily: 'Work Sans', fontWeight: '500', fontSize: '16px' }}>
              <Trans>
                To encourage more liquidity in a pool, offering incentives to voters can be a smart
                strategy. When voters direct emissions to a specific pool, they receive rewards,
                which motivates them to support your pool. As your pool receives more emissions, the
                rewards for liquidity providers increase, making it more attractive for others to
                join. By incentivizing voters, you're essentially boosting your pool's appeal and
                potential rewards.
              </Trans>
            </Typography>
          </TextWithTooltip>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #343338',
              borderRadius: '20px',
              padding: '6px',
              '.MuiIcon-root': {
                marginLeft: 0,
              },
            }}
          >
            <TokenIcon symbol={poolVoter.poolName} sx={{ mr: 2, ml: 4 }} />
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Work Sans',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                paddingRight: '8px',
              }}
            >
              {poolVoter.poolName}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: isMobile ? '10px' : '20px',
            display: 'flex',
            gap: '12px',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Select
            disabled={false}
            value={tokenSelected?.symbol}
            onChange={handleSelect}
            variant="outlined"
            className="AssetInput__select"
            data-cy={'assetSelect'}
            MenuProps={{
              sx: {
                maxHeight: '240px',
                '.MuiPaper-root': {
                  border: theme.palette.mode === 'dark' ? '1px solid #EBEBED1F' : 'unset',
                  boxShadow: '0px 2px 10px 0px #0000001A',
                  marginTop: '12px',
                },
              },
            }}
            sx={{
              border: '1px solid #343338',
              borderRadius: '20px',
              padding: '6px',
              mt: '32px',
              height: 'fit-content',
              '&.AssetInput__select .MuiOutlinedInput-input': {
                p: 0,
                backgroundColor: 'transparent',
                pr: '12px !important',
              },
              '&.AssetInput__select .MuiOutlinedInput-notchedOutline': { display: 'none' },
              '&.AssetInput__select .MuiSelect-icon': {
                color: '#fff',
                right: '8px',
              },
              '.MuiIcon-root': {
                marginLeft: 0,
              },
            }}
            renderValue={(symbol) => {
              const asset =
                listIncentives.length === 1
                  ? listIncentives[0]
                  : listIncentives &&
                    (listIncentives.find((asset) => asset.symbol === symbol) as any);
              return (
                <Box
                  sx={{ display: 'flex', alignItems: 'center' }}
                  data-cy={`assetsSelectedOption_${asset.symbol.toUpperCase()}`}
                >
                  <TokenIcon symbol={asset.symbol} sx={{ mr: 2, ml: 4 }} />
                  {isMobile && (
                    <ListItemText sx={{ mr: 6, color: '#fff' }}>{asset.symbol || ''}</ListItemText>
                  )}
                </Box>
              );
            }}
          >
            {listIncentives.map((asset) => (
              <MenuItem
                key={asset.symbol}
                value={asset.symbol}
                data-cy={`assetsSelectOption_${asset.symbol.toUpperCase()}`}
              >
                <TokenIcon symbol={asset.symbol || ''} sx={{ fontSize: '22px', mr: 1 }} />
                <ListItemText sx={{ mr: 6 }}>{asset.symbol || ''}</ListItemText>
              </MenuItem>
            ))}
          </Select>

          <AddRewardAction
            setTokenInfo={setTokenInfo}
            tokenInfo={tokenInfo}
            tokenSelected={tokenSelected}
            setAmountInput={setAmountInput}
            amountInput={amountInput}
            poolVoter={poolVoter}
          />
        </Box>
      </Box>
    </BasicModal>
  );
};

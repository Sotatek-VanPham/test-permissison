import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { formatUnits } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { DarkTooltip } from 'src/components/infoTooltips/DarkTooltip';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { textEndEllipsis } from 'src/helpers/text-center-ellipsis';
import { useModalContext } from 'src/hooks/useModal';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useTokenERC20Contract, useVestingContract } from 'src/libs/hooks/useContract';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { CHAIN_SUPPORT } from 'src/ui-config/networksConfig';

export enum StatusDisplayCampaign {
  CLAIM = 1,
  RETRY_LATER = 2,
  CLAIMED = 3,
  COMING_SOON = 4,
  NOT_ELIGIBLE = 5,
  FINISHED = 6,
}

type AirdropItemProps = {
  bannerImg: string;
  name: string;
  statusUserCampaign: number;
  endTime: string;
  vestingAddress: string;
  campaignId: number;
  periodicReward: string;
  proof: string;
  tokenAddress: string;
  balanceRemaining: string;
  fetchData: () => void;
};

export const Button = styled.button<{ bgColor: string; borderColor: string; color: string }>`
  font-family: Mulish;
  font-weight: 700;
  font-size: 12px;
  background: ${(props) => props.bgColor};
  border: 1px solid ${(props) => props.borderColor};
  color: ${(props) => props.color};
  border-radius: 4px;
  padding: 6px 12px;
  min-width: 167px;
  cursor: pointer;
  margin-top: 16px;
  margin-bottom: 32px;
  &:hover {
    opacity: 0.7;
  }
  &:disabled {
    background: #da3e3e;
    color: #1a1a1c;
    border: none;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const ButtonDisable = styled(Button)<{
  bgColor: string;
  borderColor: string;
  color: string;
}>`
  background: ${(props) => props.bgColor} !important;
  border: 1px solid ${(props) => props.borderColor} !important;
  color: ${(props) => props.color} !important;
  opacity: 1 !important;
`;

const Content = styled(Typography)`
  text-align: center;
  font-family: Work Sans;
  font-weight: 500;
`;

const Label = styled.div`
  background: #1b1b1d99;
  position: absolute;
  width: 100%;
  text-align: right;
  padding: 4px 8px;
  font-family: Mulish;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff99;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

export const calculateTimeLeft = (time: string) => {
  const targetTimestamp = new Date(time).getTime();
  const difference = targetTimestamp - new Date().getTime();
  let timeLeft = 0;

  if (difference > 0) {
    const daysLeft = difference / (1000 * 60 * 60 * 24);
    timeLeft = daysLeft < 1 ? parseFloat(daysLeft.toFixed(1)) : Math.floor(daysLeft);
  }
  return timeLeft;
};

type TokenInfo = {
  decimals: number;
  symbol: string;
};

export const AirdropItem = ({
  bannerImg,
  name,
  statusUserCampaign,
  endTime,
  vestingAddress,
  campaignId,
  periodicReward,
  proof,
  tokenAddress,
  balanceRemaining,
  fetchData,
}: AirdropItemProps) => {
  const { setWalletModalOpen } = useWalletModalContext();
  const { connected, currentAccount, provider, switchNetwork, chainId, readOnlyModeAddress } =
    useWeb3Context();
  const vestingContract = useVestingContract(vestingAddress || '');
  const tokenContract = useTokenERC20Contract(tokenAddress || '');
  const setTokenAirdrop = useRootStore((store) => store.setTokenAirdrop);
  const { openClaimSuccess, openClaimFail } = useModalContext();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isShowRecapcha, setIsShowRecapcha] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  const getTokenInfo = async () => {
    try {
      if (tokenContract) {
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        setTokenInfo({
          decimals: decimals,
          symbol: symbol,
        });
      } else {
        setTokenInfo(null);
      }
    } catch (error) {
      setTokenInfo(null);
    }
  };

  useEffect(() => {
    getTokenInfo();
  }, [tokenContract]);

  const isWrongNetwork = ![CHAIN_SUPPORT.core_testnet, CHAIN_SUPPORT.core_mainnet].includes(
    chainId || 1115
  );

  const handleClaim = async (tokenRecaptcha: string | null) => {
    try {
      if (
        vestingContract &&
        connected &&
        provider &&
        tokenContract &&
        !isWrongNetwork &&
        tokenInfo
      ) {
        setIsClaiming(true);
        // Call BE
        const endPoint = process.env.NEXT_PUBLIC_API_LEADERBOARD || '';
        const checkStatus = await axios.get(`${endPoint}/campaigns/${campaignId}`);
        const statusCampaign = checkStatus?.data?.data?.status;
        const whitelist = checkStatus?.data?.data?.whitelist;

        const currentAddressInfo = whitelist.filter(
          (item: any) => item.address.toLowerCase() === currentAccount.toLowerCase()
        );

        if (statusCampaign === 'PAUSED' || statusCampaign === 'FINISHED') {
          openClaimFail(
            statusCampaign === 'PAUSED'
              ? 'This campaign is paused temporarily.'
              : 'Vesting strategy has Finished.',
            statusCampaign === 'PAUSED'
              ? 'Please try again later!'
              : 'Please go back to main page for more campaigns!'
          );
          setIsShowRecapcha(false);
          setIsClaiming(false);
          return;
        }

        if (currentAddressInfo[0].isBlock) {
          openClaimFail(
            'Your address is blocked and not eligible to join.',
            'Please contact admin for supports.'
          );
          setIsShowRecapcha(false);
          setIsClaiming(false);
          return;
        }

        const data = await axios.get(
          `${endPoint}/campaigns/user/sign?campaignId=${campaignId}&address=${currentAccount}`,
          {
            headers: {
              'captcha-token': tokenRecaptcha || '',
            },
          }
        );
        const dataSign = data?.data?.data;
        const { r, s, v } = dataSign.sign;

        // Call SC
        const paramsContract = [periodicReward, dataSign?.signatureExpTime, proof, v, r, s];

        // const gasFee = await vestingContract.claim(...paramsContract);
        const claimToken = await vestingContract.claim(...paramsContract);
        const txHash = await claimToken.wait(1);

        if (!txHash.status) {
          openClaimFail('The system is now busy.', 'Please retry later!');
        } else {
          setTokenAirdrop({
            decimals: tokenInfo.decimals,
            symbol: tokenInfo.symbol,
            address: tokenAddress,
            txHash: txHash.transactionHash,
          });
          openClaimSuccess();
          fetchData();
        }
        setIsShowRecapcha(false);
        setIsClaiming(false);
      }
    } catch (error) {
      console.log('error', error);
      setIsShowRecapcha(false);
      setIsClaiming(false);
      if (error?.response?.data?.info?.error) {
        openClaimFail(error?.response?.data?.info?.error, '');
        return;
      }
      if (error?.code === 4001) {
        openClaimFail('You cancelled the transaction', '');
        return;
      }
      openClaimFail('The system is now busy. Please retry later!', '');
    }
  };

  const renderButton = () => {
    switch (statusUserCampaign) {
      case StatusDisplayCampaign.CLAIM:
        return (
          <Button
            bgColor="#DA3E3E"
            borderColor="#DA3E3E"
            color="white"
            disabled={isClaiming || !!readOnlyModeAddress}
            onClick={() => {
              if (isWrongNetwork) {
                switchNetwork(Number(process.env.NEXT_PUBLIC_CHAIN_ID));
              } else {
                setIsShowRecapcha(true);
              }
            }}
          >
            <Trans>
              {' '}
              {isWrongNetwork ? 'WRONG NETWORK' : isClaiming ? 'CLAIMING' : 'CLAIM NOW'}
            </Trans>
          </Button>
        );
      case StatusDisplayCampaign.RETRY_LATER:
        return (
          <ButtonDisable bgColor="#FF42281F" borderColor="#DA3E3E" color="#DA3E3E" disabled>
            <Trans>RETRY LATER</Trans>
          </ButtonDisable>
        );
      case StatusDisplayCampaign.NOT_ELIGIBLE:
        return (
          <ButtonDisable bgColor="#FFFFFF1A" borderColor="#A5A8B3" color="#A5A8B3" disabled>
            <Trans>NOT ELIGIBLE</Trans>
          </ButtonDisable>
        );

      case StatusDisplayCampaign.CLAIMED:
        return (
          <ButtonDisable bgColor="#FFFFFF1A" borderColor="#A5A8B3" color="#A5A8B3" disabled>
            <Trans>CLAIMED</Trans>
          </ButtonDisable>
        );
      case StatusDisplayCampaign.COMING_SOON:
        return (
          <ButtonDisable bgColor="#FFFFFF1A" borderColor="#A5A8B3" color="#A5A8B3" disabled>
            <Trans>COMING SOON</Trans>
          </ButtonDisable>
        );
      default:
        return (
          <ButtonDisable bgColor="#FFFFFF1A" borderColor="#A5A8B3" color="#A5A8B3" disabled>
            <Trans>FINISHED</Trans>
          </ButtonDisable>
        );
    }
  };

  return (
    <Box
      sx={{
        borderRadius: '16px',
        background: '#1B1B1DE5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        minHeight: '294px',
      }}
    >
      <Label>
        {calculateTimeLeft(endTime)} <Trans>DAY(S)</Trans>
      </Label>
      <img
        src={bannerImg}
        width="100%"
        height="149px"
        style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      />
      <Box sx={{ color: 'common.white', marginTop: '12px' }}>
        <Content sx={{ fontSize: '20px' }}>
          <DarkTooltip
            wrap
            title={
              <Typography
                sx={(theme) => ({
                  color: `${theme.palette.text.links}`,
                })}
              >
                <Trans>{name}</Trans>
              </Typography>
            }
          >
            <div style={{ wordBreak: 'break-word', padding: '0px 24px' }}>
              {' '}
              <Trans>{textEndEllipsis(name, 20)}</Trans>
            </div>
          </DarkTooltip>
        </Content>
        <Content sx={{ fontSize: '15px' }}>
          {statusUserCampaign === StatusDisplayCampaign.FINISHED || isWrongNetwork || !tokenInfo ? (
            '--'
          ) : (
            <FormattedNumber
              value={formatUnits(balanceRemaining, tokenInfo.decimals).toString()}
              sx={{ fontFamily: 'Work Sans', fontWeight: 500, fontSize: '15px' }}
              compact={false}
              symbol={tokenInfo.symbol}
              visibleDecimals={2}
            />
          )}
        </Content>
      </Box>

      {connected ? (
        <>
          {isShowRecapcha && (
            <div style={{ marginTop: '24px' }}>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_KEY_RECAPCHA || ''}
                onChange={(value) => {
                  handleClaim(value);
                }}
              />
            </div>
          )}

          {renderButton()}
        </>
      ) : (
        <Button
          bgColor="#DA3E3E"
          borderColor="#DA3E3E"
          color="white"
          onClick={() => setWalletModalOpen(true)}
        >
          <Trans>Connect wallet</Trans>
        </Button>
      )}
    </Box>
  );
};

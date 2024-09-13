import { Card, styled, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import useAuth from "../../../hooks/useAuth";
import React, { useState } from 'react';
import axios from 'axios';
import ProfilePhoto from '../../../components/ProfilePhoto';

// STYLED COMPONENTS
const CardRoot = styled(Card)(({ theme }) => ({
    textAlign: "center",
    position: "relative",
    padding: "16px !important",
    paddingTop: "40px !important",  // 为顶部的Profile>预留空间
    [theme.breakpoints.down("sm")]: { paddingLeft: "16px !important" }
}));

const Paragraph = styled("div")(({ theme }) => ({
    margin: 0,
    paddingTop: "8px",
    paddingBottom: "8px",
}));

const PromoCode = styled("span")(({ theme }) => ({
    color: "gray",
    fontSize: "0.875rem",
    marginRight: "8px"
}));

const EmailText = styled(Typography)(({ theme }) => ({
    fontSize: "0.875rem",
    marginBottom: "12px"
}));

const UserName = styled(Typography)(({ theme }) => ({
    fontSize: "1rem",
    marginBottom: "12px"
}));

const PromoCodeText = styled(Typography)(({ theme }) => ({
    marginBottom: "16px"
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
    padding: 0,
    marginLeft: '4px',
    fontSize: "0.875rem",
    backgroundColor: 'transparent',
}));

const CopyIcon = styled(ContentCopyIcon)(({ theme }) => ({
    fontSize: "0.875rem",
}));

const CopiedIcon = styled(CheckIcon)(({ theme }) => ({
    fontSize: "0.875rem",
}));

const SocialIconsContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '16px'
});

const IconImage = styled('img')({
    width: '25px',
    height: '25px',
    objectFit: 'contain',
    cursor: 'pointer'
});

const ProfileLink = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '10px',
    left: '20px',
    fontSize: "0.875rem",
    color: 'gray',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold'  // 加粗字体
}));

export default function UpgradeCard() {
    const { user } = useAuth();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [copied, setCopied] = useState(false);

    const handleSocialClick = async (platform) => {
        try {
            const response = await axios.get(`${BASE_URL}/generate_social_post_url`, {
                params: { platform, influencer_name: user.influencer_name }
            });
            window.open(response.data.url, '_blank');

            const textToCopy = response.data.text;

            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log(`Text copied to clipboard: ${textToCopy}`);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } catch (error) {
            console.error(`Error generating ${platform} post URL:`, error);
        }
    };

    const handleCopyPromoCode = () => {
        navigator.clipboard.writeText(user.promo_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }).catch(err => {
            console.error('Failed to copy promo code: ', err);
        });
    };

    return (
        <CardRoot>
            <ProfileLink onClick={() => window.location.href = '/resume'}>
                Profile &gt;
            </ProfileLink>
            <ProfilePhoto style={{ width: 120, height: 120, borderRadius: '50%' }} />
            <Paragraph>
                <UserName variant="h6">{user.influencer_name}</UserName>
                <EmailText variant="h6">{user.influencer_email}</EmailText>
                <PromoCodeText variant="body" id="promo-code">
                    Promo Code <PromoCode>{user.promo_code}</PromoCode>
                    <Tooltip title={copied ? "Copied!" : "Copy"}>
                        <CopyButton onClick={handleCopyPromoCode}>
                            {copied ? <CopiedIcon /> : <CopyIcon />}
                        </CopyButton>
                    </Tooltip>
                </PromoCodeText>
            </Paragraph>

            <SocialIconsContainer id="social-media">
                <IconImage src="/assets/images/logos/facebook.png" alt="FaceBook" onClick={() => handleSocialClick('facebook')} />
                <IconImage src="/assets/images/logos/tiktok.png" alt="TikTok" onClick={() => handleSocialClick('tiktok')} />
                <IconImage src="/assets/images/logos/instagram.png" alt="Instagram" onClick={() => handleSocialClick('instagram')} />
                <IconImage src="/assets/images/logos/twitter.png" alt="Twitter" onClick={() => handleSocialClick('twitter')} />
            </SocialIconsContainer>
        </CardRoot>
    );
}
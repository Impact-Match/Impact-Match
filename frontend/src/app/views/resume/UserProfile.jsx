import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, IconButton, Tooltip, styled, Box, Chip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { MatxLoading } from "../../components";
import useAuth from "../../hooks/useAuth";
import axios from 'axios';

// STYLED COMPONENTS
const StyledCard = styled(Card)(({ theme }) => ({
    padding: '20px',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    marginLeft: '28px',
    marginRight: '28px',
    marginTop: '20px',
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '25px',
    marginRight: '15px',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

const ProfileDetails = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(2),
}));

const ProfileField = styled(Box)(({ theme }) => ({
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
}));

const ProfileLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.text.primary,
}));

const ProfileValue = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

const TagsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginTop: '5px',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    height: '20px',
    fontSize: '0.75rem',
    '& .MuiChip-label': {
        paddingLeft: '6px',
        paddingRight: '6px',
    },
}));

const SocialIconsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '8px',
    marginTop: '20px',
}));

const IconImage = styled('img')(({ theme }) => ({
    width: '22px',
    height: '22px',
    objectFit: 'contain',
    cursor: 'pointer',
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
    padding: 0,
    marginLeft: '4px',
    fontSize: "0.75rem",
    backgroundColor: 'transparent',
}));

const CopyIcon = styled(ContentCopyIcon)(({ theme }) => ({
    fontSize: "0.75rem",
}));

const CopiedIcon = styled(CheckIcon)(({ theme }) => ({
    fontSize: "0.75rem",
}));

const BioContainer = styled(Box)(({ theme }) => ({
    maxHeight: '4rem', // Approximately 3 lines of text
    overflowY: 'auto',
}));

const ProfilePage = ({ influencer }) => {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(influencer);
    const [copied, setCopied] = useState(false);
    const [addressCopied, setAddressCopied] = useState(false);
    const { user } = useAuth();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        if (!influencer && user) {
            axios.post(`${BASE_URL}/influencer`, { influencer_name: user.influencer_name })
                .then(response => {
                    setProfileData(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching influencer data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [influencer, BASE_URL, user]);

    if (loading) {
        return <MatxLoading />;
    }

    const handleSocialClick = async (platform) => {
        try {
            const response = await fetch(`${BASE_URL}/generate_social_post_url`, {
                params: { platform, influencer_name: profileData.influencer_name }
            });
            const data = await response.json();
            window.open(data.url, '_blank');

            const textToCopy = data.text;

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
        navigator.clipboard.writeText(profileData.promo_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }).catch(err => {
            console.error('Failed to copy promo code: ', err);
        });
    };

    const handleCopyAddress = () => {
        const fullAddress = `${profileData.shipping_address}, ${profileData.city}, ${profileData.zipcode}, ${profileData.state}, ${profileData.country}`;
        navigator.clipboard.writeText(fullAddress).then(() => {
            setAddressCopied(true);
            setTimeout(() => setAddressCopied(false), 3000);
        }).catch(err => {
            console.error('Failed to copy address: ', err);
        });
    };

    return (
        <Grid container spacing={2} sx={{ padding: 1 }}>
            <Grid item xs={12}>
                <StyledCard>
                    <Typography variant="h6" gutterBottom sx={{ marginLeft: '15px' }}>
                        <strong>Personal Information</strong>
                    </Typography>
                    <ProfileContainer>
                        <Box sx={{ flex: '1 1 25%', textAlign: 'left', padding: 1 }}>
                            <img
                                src={profileData.avatar ? `data:image/jpeg;base64,${profileData.avatar}` : '../assets/images/illustrations/user.png'}
                                alt="User Profile"
                                style={{ borderRadius: '50%', overflow: 'hidden', width: 100, height: 100, objectFit: 'cover' }}
                            />
                            <Typography variant="body1" gutterBottom>
                                <strong>{profileData.first_name} {profileData.last_name}</strong>
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {profileData.influencer_name}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <strong>Promo Code</strong>
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{profileData.promo_code}</strong>
                                <Tooltip title={copied ? "Copied!" : "Copy"}>
                                    <CopyButton onClick={handleCopyPromoCode}>
                                        {copied ? <CopiedIcon /> : <CopyIcon />}
                                    </CopyButton>
                                </Tooltip>
                            </Typography>
                            <SocialIconsContainer>
                                <IconImage src="/assets/images/logos/facebook.png" alt="Meta" onClick={() => handleSocialClick('facebook')} />
                                <IconImage src="/assets/images/logos/tiktok.png" alt="TikTok" onClick={() => handleSocialClick('tiktok')} />
                                <IconImage src="/assets/images/logos/instagram.png" alt="Instagram" onClick={() => handleSocialClick('instagram')} />
                                <IconImage src="/assets/images/logos/twitter.png" alt="Twitter" onClick={() => handleSocialClick('twitter')} />
                            </SocialIconsContainer>
                        </Box>
                        <Box sx={{ flex: '1 1 70%', padding: 1 }}>
                            <ProfileDetails>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <ProfileField>
                                            <ProfileLabel variant="body2">Email</ProfileLabel>
                                            <ProfileValue variant="body1">{profileData.influencer_email}</ProfileValue>
                                        </ProfileField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <ProfileField>
                                            <ProfileLabel variant="body2">Phone</ProfileLabel>
                                            <ProfileValue variant="body1">{profileData.phone}</ProfileValue>
                                        </ProfileField>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <ProfileField>
                                            <ProfileLabel variant="body2">Age</ProfileLabel>
                                            <ProfileValue variant="body1">{profileData.age}</ProfileValue>
                                        </ProfileField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ProfileField>
                                            <ProfileLabel variant="body2">Niches</ProfileLabel>
                                            <TagsContainer>
                                                {profileData.niche.map((niche, index) => (
                                                    <StyledChip key={index} label={niche.label} variant="outlined" color="primary" />
                                                ))}
                                            </TagsContainer>
                                        </ProfileField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ProfileField>
                                            <ProfileLabel variant="body2">Interests</ProfileLabel>
                                            <TagsContainer>
                                                {profileData.interest.map((interest, index) => (
                                                    <StyledChip key={index} label={interest.label} variant="outlined" color="secondary" />
                                                ))}
                                            </TagsContainer>
                                        </ProfileField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ProfileField>
                                            <ProfileLabel variant="body2">Bio</ProfileLabel>
                                            <BioContainer>
                                                <ProfileValue variant="body1">{profileData.bio}</ProfileValue>
                                            </BioContainer>
                                        </ProfileField>
                                    </Grid>
                                </Grid>
                            </ProfileDetails>
                        </Box>
                    </ProfileContainer>
                </StyledCard>
            </Grid>

            {/* Middle Card: Personal Info */}
            <Grid item xs={12}>
                <StyledCard>
                    <Typography variant="h6" gutterBottom sx={{ marginLeft: '15px' }}>
                        <strong>Contact Information</strong>
                    </Typography>
                    <ProfileDetails>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={3}>
                                <ProfileField>
                                    <ProfileLabel variant="body2">Country</ProfileLabel>
                                    <ProfileValue variant="body1">{profileData.country}</ProfileValue>
                                </ProfileField>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <ProfileField>
                                    <ProfileLabel variant="body2">State</ProfileLabel>
                                    <ProfileValue variant="body1">{profileData.state}</ProfileValue>
                                </ProfileField>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <ProfileField>
                                    <ProfileLabel variant="body2">City</ProfileLabel>
                                    <ProfileValue variant="body1">{profileData.city}</ProfileValue>
                                </ProfileField>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <ProfileField>
                                    <ProfileLabel variant="body2">Zipcode</ProfileLabel>
                                    <ProfileValue variant="body1">{profileData.zipcode}</ProfileValue>
                                </ProfileField>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <ProfileField>
                                    <ProfileLabel variant="body2">Shipping Address
                                        <Tooltip title={addressCopied ? "Copied!" : "Copy"}>
                                            <CopyButton onClick={handleCopyAddress}>
                                                {addressCopied ? <CopiedIcon /> : <CopyIcon />}
                                            </CopyButton>
                                        </Tooltip>
                                    </ProfileLabel>
                                    <ProfileValue variant="body1">
                                        {profileData.shipping_address}, {profileData.city}, {profileData.zipcode}, {profileData.state}, {profileData.country}
                                    </ProfileValue>
                                </ProfileField>
                            </Grid>
                        </Grid>
                    </ProfileDetails>
                </StyledCard>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
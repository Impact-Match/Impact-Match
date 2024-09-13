import React, { useState, useCallback } from 'react';
import {
    Card,
    Chip,
    Grid,
    Autocomplete,
    TextField,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    styled,
    Button
} from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";
import { collaborationOptions, countries, interests, niches } from "../../data/constant";
import EditableField from './EditableField';
import CustomBioField from './CustomBioField';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import AvatarUploader from '../../components/AvatarUploader';

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

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        },
        '&:hover fieldset': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.42)',
        },
        '&.Mui-focused fieldset': {
            borderBottom: '2px solid',
        },
    },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    height: '25px',
    fontSize: '0.8rem',
    '& .MuiChip-label': {
        padding: '12px',
    },
}));

const EditableDisplayProfile = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState({
        ...user,
        niche: user.niche || [],
        interest: user.interest || [],
    });
    const [editable, setEditable] = useState({
        avatar: false,
        firstName: false,
        middleName: false,
        lastName: false,
        username: false,
        email: false,
        age: false,
        country: false,
        cityState: false,
        phone: false,
        collaborations: false,
        audience: false,
        niches: false,
        interests: false,
        shippingAddress: false,
        bio: false
    });
    const [imagePreview, setImagePreview] = useState(profile.avatar);

    const handleFileChange = (base64Image) => {
        setProfile(prev => ({
            ...prev,
            avatar: base64Image
        }));
    };

    const handleChange = useCallback((name, value) => {
        setProfile(prev => ({ ...prev, [name]: value }));
    }, []);

    const toggleEditable = useCallback((name) => {
        setEditable(prev => ({ ...prev, [name]: !prev[name] }));
    }, []);

    const handleInterestChange = useCallback((event, newValue) => {
        setProfile(prev => ({ ...prev, interest: newValue }));
    }, []);

    const handleNicheChange = useCallback((event, newValue) => {
        setProfile(prev => ({ ...prev, niche: newValue }));
    }, []);

    const handleSaveAll = useCallback(async () => {
        const formDataToSend = new FormData();

        // Append each key-value pair to formDataToSend
        Object.entries(profile).forEach(([key, value]) => {
            if (key === 'collaborations' || key === 'audience' || key === 'niches' || key === 'interests') {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (key === 'avatar' && value) {
                const byteString = atob(value.split(',')[1]);
                const mimeString = value.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                formDataToSend.append('avatar', blob, 'avatar.png');
            } else {
                formDataToSend.append(key, value);
            }
        });

        try {
            const response = await axios.post(`${BASE_URL}/update_influencer`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUser(profile);
            } else {
                console.log("Failed to update user info");
            }
        } catch (error) {
            console.error(error);
        }
    }, [profile, setUser, BASE_URL]);

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <ValidatorForm onSubmit={handleSaveAll}>
            <Grid container spacing={2} sx={{ padding: 1 }}>
                {/* Personal Information Card */}
                <Grid item xs={12}>
                    <StyledCard>
                        <Typography variant="h6" gutterBottom>
                            <strong>Personal Information</strong>
                        </Typography>
                        <ProfileContainer>
                            <Box sx={{ flex: '1 1 25%', textAlign: 'left', padding: 1 }}>
                                <AvatarUploader
                                    imagePreview={profile.avatar ? `data:image/jpeg;base64,${profile.avatar}` : '../assets/images/illustrations/user.png'}
                                    setImagePreview={setImagePreview}
                                    handleFileChange={handleFileChange}
                                />
                                <Typography variant="body1" gutterBottom>
                                    <strong>{profile.first_name} {profile.last_name}</strong>
                                </Typography>
                                <Typography variant="body1" color="textSecondary" gutterBottom>
                                    {profile.influencer_name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Promo Code</strong>
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    <strong>{profile.promo_code}</strong>
                                </Typography>
                            </Box>
                            <Box sx={{ flex: '1 1 70%', padding: 1 }}>
                                <ProfileDetails>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={4}>
                                            <EditableField
                                                label="First Name"
                                                name="firstName"
                                                value={profile.first_name}
                                                editable={editable.firstName}
                                                toggleEditable={toggleEditable}
                                                onChange={handleChange}
                                                showEditIcon
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <EditableField
                                                label="Middle Name"
                                                name="middleName"
                                                value={profile.middle_name}
                                                editable={editable.middleName}
                                                toggleEditable={toggleEditable}
                                                onChange={handleChange}
                                                showEditIcon
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <EditableField
                                                label="Last Name"
                                                name="lastName"
                                                value={profile.last_name}
                                                editable={editable.lastName}
                                                toggleEditable={toggleEditable}
                                                onChange={handleChange}
                                                showEditIcon
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <EditableField
                                                label="Email"
                                                name="email"
                                                value={profile.influencer_email}
                                                editable={editable.email}
                                                toggleEditable={toggleEditable}
                                                onChange={handleChange}
                                                showEditIcon={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <EditableField
                                                label="Phone"
                                                name="phone"
                                                value={profile.phone}
                                                editable={editable.phone}
                                                toggleEditable={toggleEditable}
                                                onChange={handleChange}
                                                showEditIcon
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <EditableField
                                                label="Age"
                                                name="age"
                                                value={profile.age}
                                                editable={editable.age}
                                                toggleEditable={toggleEditable}
                                                onChange={handleChange}
                                                showEditIcon
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Autocomplete
                                                multiple
                                                options={niches}
                                                groupBy={(option) => option.group}
                                                getOptionLabel={(option) => option.label}
                                                value={profile.niche}
                                                validators={['required']}
                                                errorMessages={['Niches are required']}
                                                onChange={(event, newValue) => {
                                                    handleNicheChange(event, newValue);
                                                }}
                                                disableCloseOnSelect
                                                renderOption={(props, option, { selected }) => (
                                                    <li {...props}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={selected} />}
                                                            label={option.label}
                                                        />
                                                    </li>
                                                )}
                                                renderGroup={(params) => (
                                                    <React.Fragment key={params.key}>
                                                        <Grid item xs={12} style={{ paddingLeft: '10px' }}>
                                                            <strong>{params.group}</strong>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Grid container spacing={0}>
                                                                {params.children.map((child, index) => (
                                                                    <Grid item xs={4} key={index}>
                                                                        {child}
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        </Grid>
                                                    </React.Fragment>
                                                )}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <StyledChip label={option.label} {...getTagProps({ index })} variant="outlined" color="primary" />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <CustomTextField
                                                        {...params}
                                                        label="Select Niches"
                                                        placeholder="Favorites"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                            <br />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Autocomplete
                                                multiple
                                                options={interests}
                                                groupBy={(option) => option.group}
                                                getOptionLabel={(option) => option.label}
                                                value={profile.interest || []}
                                                onChange={(event, newValue) => {
                                                    handleInterestChange(event, newValue);
                                                }}
                                                disableCloseOnSelect
                                                renderOption={(props, option, { selected }) => (
                                                    <li {...props}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={selected} />}
                                                            label={option.label}
                                                        />
                                                    </li>
                                                )}
                                                renderGroup={(params) => (
                                                    <React.Fragment key={params.key}>
                                                        <Grid item xs={12} style={{ paddingLeft: '10px' }}>
                                                            <strong>{params.group}</strong>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Grid container spacing={0}>
                                                                {params.children.map((child, index) => (
                                                                    <Grid item xs={4} key={index}>
                                                                        {child}
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                        </Grid>
                                                    </React.Fragment>
                                                )}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <StyledChip label={option.label} {...getTagProps({ index })} variant="outlined" color="primary" />
                                                    ))
                                                }
                                                renderInput={(params) => (
                                                    <CustomTextField
                                                        {...params}
                                                        label="Select Interests"
                                                        placeholder="Favorites"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomBioField
                                                label="Bio"
                                                name="bio"
                                                value={profile.bio}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </ProfileDetails>
                            </Box>
                        </ProfileContainer>
                    </StyledCard>
                </Grid>

                {/* Contact Information Card */}
                <Grid item xs={12}>
                    <StyledCard>
                        <Typography variant="h6" gutterBottom>
                            <strong>Contact Information</strong>
                        </Typography>
                        <ProfileDetails>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={3}>
                                    <EditableField
                                        label="Country"
                                        name="country"
                                        value={profile.country}
                                        editable={editable.country}
                                        toggleEditable={toggleEditable}
                                        onChange={handleChange}
                                        showEditIcon
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <EditableField
                                        label="State"
                                        name="state"
                                        value={profile.state}
                                        editable={editable.state}
                                        toggleEditable={toggleEditable}
                                        onChange={handleChange}
                                        showEditIcon
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <EditableField
                                        label="City"
                                        name="city"
                                        value={profile.city}
                                        editable={editable.city}
                                        toggleEditable={toggleEditable}
                                        onChange={handleChange}
                                        showEditIcon
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <EditableField
                                        label="Zipcode"
                                        name="zipcode"
                                        value={profile.zipcode}
                                        editable={editable.zipcode}
                                        toggleEditable={toggleEditable}
                                        onChange={handleChange}
                                        showEditIcon
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <EditableField
                                        label="Street Address"
                                        name="shippingAddress"
                                        value={profile.shipping_address}
                                        editable={editable.shippingAddress}
                                        toggleEditable={toggleEditable}
                                        onChange={handleChange}
                                        showEditIcon
                                    />
                                </Grid>
                            </Grid>
                        </ProfileDetails>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">Save All</Button>
                </Grid>
            </Grid>
        </ValidatorForm>
    );
};

export default EditableDisplayProfile;
import React, { useState, useEffect } from 'react';
import { Grid, Autocomplete, styled, FormControlLabel, Checkbox, IconButton, Typography, Box } from '@mui/material';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { collaborationOptions, countries, interests, niches, states } from "../../data/constant";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import OneTooltip from '../../components/OneTooltip';
import TermsOfServiceDialog from './TermsOfServiceDialog'; // Adjust the path as needed

const TextField = styled(TextValidator)(({ theme }) => ({
    width: "100%",
    marginBottom: theme.spacing(2),
}));

const FormStepTwo = ({ data, onChange }) => {
    const [errors, setErrors] = useState({
        countryError: '',
        stateError: '',
        collaborationsError: data.collaborations.map(() => ''),
        interestsError: '',
        nichesError: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(data.isAgreed || false);

    const validateCountry = (value) => {
        if (!value) {
            setErrors(prev => ({ ...prev, countryError: 'Country is required' }));
            return false;
        } else {
            setErrors(prev => ({ ...prev, countryError: '' }));
            return true;
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'isAgreed') {
            setIsAgreed(event.target.checked);
            onChange(name, event.target.checked);
        } else {
            onChange(name, value);
        }
    };

    const handleNicheChange = (event, newValue) => {
        onChange("niches", newValue);
    };

    const handleInterestChange = (event, newValue) => {
        onChange("interests", newValue);
    };

    const handleCountryChange = (event, newValue) => {
        onChange("country", newValue ? newValue.label : '');
        validateCountry(newValue);
    };

    const handleStateChange = (event, newValue) => {
        onChange("state", newValue ? newValue.label : '');
    };

    const handleCollaborationChange = (index, type, value) => {
        const newCollaborations = data.collaborations.map((collaboration, i) => {
            if (i === index) {
                return { ...collaboration, [type]: value || '' };
            }
            return collaboration;
        });
        onChange("collaborations", newCollaborations);
    };

    const addCollaborationField = () => {
        if (data.collaborations.length < 4) {
            const newCollaborations = [...data.collaborations, { platform: '', link: '' }];
            onChange("collaborations", newCollaborations);
        }
    };

    const removeCollaborationField = (index) => {
        if (data.collaborations.length > 1) {
            const filteredCollaborations = data.collaborations.filter((_, i) => i !== index);
            onChange("collaborations", filteredCollaborations);
        }
    };

    useEffect(() => {
        // Add custom validators if needed
        ValidatorForm.addValidationRule('isRequired', (value) => {
            return value && value.length > 0;
        });

        ValidatorForm.addValidationRule('isZipcode', (value) => {
            const regex = /^[0-9]{5}(?:-[0-9]{4})?$/; // US zipcode format
            return regex.test(value);
        });

        return () => {
            // Clean up the rules when the component unmounts
            ValidatorForm.removeValidationRule('isZipcode');
        };
    }, []);

    const handleAgree = () => {
        setIsDialogOpen(false);
        setIsAgreed(true);
        onChange("isAgreed", true);
    };

    const handleDisagree = () => {
        setIsDialogOpen(false);
        setIsAgreed(false);
        onChange("isAgreed", false);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            onChange={handleCountryChange}
                            renderInput={(params) => <TextField {...params} label="Country" required={data.country.length === 0} />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete
                            options={states.filter(state => state.country === data.country)}
                            getOptionLabel={(option) => option.label}
                            onChange={handleStateChange}
                            validators={['required']}
                            errorMessages={['State is required']}
                            renderInput={(params) => <TextField {...params} label="State" required={data.state.length === 0} />}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="City*"
                            name="city"
                            value={data.city}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['City is required']}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Zipcode*"
                            name="zipcode"
                            value={data.zipcode}
                            onChange={handleChange}
                            validators={['required', 'isZipcode']}
                            errorMessages={['Zipcode is required']}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField
                        label="Shipping Address*"
                        name="shippingAddress"
                        value={data.shippingAddress}
                        onChange={handleChange}
                        validators={['required']}
                        errorMessages={['Shipping address is required']}
                    />
                </Grid>
                {/* Collaboration fields */}
                {data.collaborations.map((collab, index) => (
                    <Grid item xs={12} key={index} sx={{ mt: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3}>
                                <Autocomplete
                                    options={collaborationOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={collab.platform || null}
                                    onChange={(event, newValue) => handleCollaborationChange(index, 'platform', newValue)}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Collaboration"
                                            required={collab.platform.length === 0}
                                        />}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    label="Link*"
                                    value={collab.link}
                                    onChange={(e) => handleCollaborationChange(index, 'link', e.target.value)}
                                    validators={['required']}
                                    errorMessages={['Link is required']}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton onClick={() => removeCollaborationField(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                {data.collaborations.length < 4 && (
                    <Grid item xs={12} sx={{ mt: -2, mb: 1 }}>
                        <Box display="flex" alignItems="center">
                            <IconButton onClick={addCollaborationField} color="primary">
                                <AddIcon />
                            </IconButton>
                            <Typography variant="body1" color="primary">
                                Add More
                            </Typography>
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" style={{ color: "#9d9d9d" }}>
                            Niches *
                        </Typography>
                        <OneTooltip title="Niches: Your specific focus area on social media where your content resonates with a dedicated and engaged audience." />
                    </Box>
                    <Autocomplete
                        multiple
                        options={niches}
                        groupBy={(option) => option.group}
                        getOptionLabel={(option) => option.label}
                        value={data.niches}
                        onChange={handleNicheChange}
                        validators={['required']}
                        errorMessages={['Niches are required']}
                        disableCloseOnSelect
                        renderOption={(props, option, { selected }) => (
                            <li {...props} onMouseDown={(event) => event.preventDefault()}>
                                <FormControlLabel
                                    control={<Checkbox checked={selected} />}
                                    label={option.label}
                                />
                            </li>
                        )}
                        renderGroup={(params) => (
                            <React.Fragment key={params.key}>
                                <Grid item xs={12} style={{ paddingLeft: "10px" }}>
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
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Niches"
                                fullWidth
                                required={data.niches.length === 0}
                                onClick={(event) => event.stopPropagation()}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1" style={{ color: "#9d9d9d" }}>
                            Interests *
                        </Typography>
                        <OneTooltip title="Interest: The broader topics or hobbies you explore alongside your niche." />
                    </Box>
                    <Autocomplete
                        multiple
                        options={interests}
                        groupBy={(option) => option.group}
                        getOptionLabel={(option) => option.label}
                        value={data.interests}
                        onChange={handleInterestChange}
                        validators={['required']}
                        errorMessages={['Interests are required']}
                        disableCloseOnSelect
                        renderOption={(props, option, { selected }) => (
                            <li {...props} onMouseDown={(event) => event.preventDefault()}>
                                <FormControlLabel
                                    control={<Checkbox checked={selected} />}
                                    label={option.label}
                                />
                            </li>
                        )}
                        renderGroup={(params) => (
                            <React.Fragment key={params.key}>
                                <Grid item xs={12} style={{ paddingLeft: "10px" }}>
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
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Interests"
                                fullWidth
                                required={data.interests.length === 0}
                                onClick={(event) => event.stopPropagation()}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <TextField
                        label="Bio"
                        name="bio"
                        multiline
                        rows={4}
                        maxRows={10}
                        value={data.bio}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <FormControlLabel
                    required={true}
                    control={<Checkbox name="isAgreed" checked={isAgreed} onChange={() => setIsDialogOpen(true)} />}
                    label="I have read and agree to the terms of service."
                />
                <TermsOfServiceDialog
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onAgree={handleAgree}
                    onDisagree={handleDisagree}
                />
            </Grid>
        </Grid>
    );
};

export default FormStepTwo;
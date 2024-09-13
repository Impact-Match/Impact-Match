import React, {useState} from 'react';
import {Grid, Autocomplete, styled, FormControlLabel, Checkbox} from '@mui/material';
import {TextValidator} from "react-material-ui-form-validator";
import {ageRanges, collaborationOptions, countries, cities, interests, niches} from "../../data/constant"

const TextField = styled(TextValidator)(({theme}) => ({
    width: "100%",
    marginBottom: theme.spacing(2),
}));

const FormStepTwo = () => {
    const [state, setState] = useState({
        country: "",
        cityState: "",
        phone: "",
        password: "",
        confirmPassword: "",
        collaborations: [{platform: 'TikTok', link: ''}],
        date: new Date(),
        usernames: new Set(),
        age_ranges: [],
        niches: [],
        interests: [],
        shippingAddress: '',
        bio: ''
    });
    const handleChange = (event) => {
        const {name, value} = event.target;
        setState(prev => ({
            ...prev,
            [name]: value,
            ...(name === "firstName" || name === "lastName" ? {username: `${state.firstName} ${state.lastName}`} : {})
        }));
    };
    const handleNicheChange = (event, newValue) => {
        setState(prevState => ({...prevState, niches: newValue}));
    };

    const handleInterestChange = (event, newValue) => {
        setState(prevState => ({...prevState, interests: newValue}));
    };

    const handleAgeRangeChange = (event, newValue) => {
        setState(prevState => ({...prevState, age_ranges: newValue}));
    };

    const handleCountryChange = (event, newValue) => {
        setState(prevState => ({...prevState, country: newValue.label}));
    };

    const handleCityStateChange = (event, newValue) => {
        setState(prevState => ({...prevState, cityState: newValue.label}));
    };
    const handleCollaborationChange = (index, type, value) => {
        const newCollaborations = state.collaborations.map((collaboration, i) => {
            if (i === index) {
                return {...collaboration, [type]: value};
            }
            return collaboration;
        });
        setState(prev => ({...prev, collaborations: newCollaborations}));
    };

    const addCollaborationField = () => {
        setState(prev => ({...prev, collaborations: [...prev.collaborations, {platform: '', link: ''}]}));
    };

    return (
        <Grid container spacing={1}>
        <Grid item xs={12}>
            <TextField
                label="Shipping Address"
                name="shippingAddress"
                value={state.shippingAddress}
                onChange={handleChange}
                validators={['required']}
                errorMessages={['Shipping address is required']}
            />
        </Grid>
    <Grid item xs={12}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option.label}
                    onChange={handleCountryChange}
                    renderInput={(params) => <TextField {...params} label="Country"/>}
                />
            </Grid>
            <Grid item xs={6}>
                <Autocomplete
                    options={cities.filter(city => city.country === state.country)}
                    getOptionLabel={(option) => option.label}
                    onChange={handleCityStateChange}
                    renderInput={(params) => <TextField {...params} label="City/State"/>}
                />
            </Grid>
        </Grid>

        <Autocomplete
            multiple
            options={ageRanges}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            value={state.age_ranges}
            onChange={handleAgeRangeChange}
            renderOption={(props, option, {selected}) => (
                <li {...props}>
                    <FormControlLabel
                        control={<Checkbox checked={selected}/>}
                        label={option.label}
                    />
                </li>
            )}
            renderGroup={(params) => (
                <React.Fragment key={params.key}>
                    <Grid item xs={12} style={{paddingLeft: "10px"}}>
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
            renderInput={(params) => <TextField {...params} label="Age Range"
                                                placeholder="Select age ranges" fullWidth/>}
        />

        {state.collaborations.map((collab, index) => (
            <React.Fragment key={index}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Autocomplete
                            options={collaborationOptions}
                            getOptionLabel={(option) => option.label}
                            value={collab.platform}
                            onChange={(event, newValue) => handleCollaborationChange(index, 'platform', newValue)}
                            renderInput={(params) => <TextField {...params} label="Collaboration*"/>}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="Link*"
                            value={collab.link}
                            onChange={(e) => handleCollaborationChange(index, 'link', e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        ))}
        <Autocomplete
            multiple
            options={interests}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            value={state.interests}
            onChange={handleInterestChange}
            renderOption={(props, option, {selected}) => (
                <li {...props}>
                    <FormControlLabel
                        control={<Checkbox checked={selected}/>}
                        label={option.label}
                    />
                </li>
            )}
            renderGroup={(params) => (
                <React.Fragment key={params.key}>
                    <Grid item xs={12} style={{paddingLeft: "10px"}}>
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
                <TextField {...params} label="Select Interests" placeholder="Favorites" fullWidth/>
            )}
        />
        <Autocomplete
            multiple
            options={niches}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            value={state.niches}
            onChange={handleNicheChange}
            renderOption={(props, option, {selected}) => (
                <li {...props}>
                    <FormControlLabel
                        control={<Checkbox checked={selected}/>}
                        label={option.label}
                    />
                </li>
            )}
            renderGroup={(params) => (
                <React.Fragment key={params.key}>
                    <Grid item xs={12} style={{paddingLeft: "10px"}}>
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
                <TextField {...params} label="Select Niches" placeholder="Favorites" fullWidth/>
            )}
        />
        <TextField
            label="Bio"
            name="bio"
            multiline
            rows={4}
            maxRows={10}
            value={state.bio}
            onChange={handleChange}
            variant="outlined"
            fullWidth
        />
        <FormControlLabel
            control={<Checkbox/>}
            label="I have read and agree to the terms of service."
        />
    </Grid>
</Grid>
    );
};

export default FormStepTwo;

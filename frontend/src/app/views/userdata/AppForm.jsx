import React, { useState, useRef } from 'react';
import { Autocomplete, Button, Checkbox, FormControlLabel, Grid, Icon, Stepper, Step, StepLabel, styled } from "@mui/material";
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Span } from "app/components/Typography";
import { MatxLogo } from "app/components";
import FormStepOne from './FormStepOne';
import FormStepTwo from './FormStepTwo';

const UserRegister = () => {
    const formRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [state, setState] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        email: "",
        age: "",
        promoCode: "",
        country: "",
        cityState: "",
        phone: "",
        password: "",
        confirmPassword: "",
        collaborations: [{platform: 'TikTok', link: ''}],
        date: new Date(),
        usernames: new Set(),
        ageRangesSelected: [],
        niches: [],
        shippingAddress: '',
        bio: ''
    });

    const steps = ['', 'Register'];

    const handleNext = async () => {
        // Validate current step fields before moving to next step
        const isValid = await formRef.current.isFormValid(false);
        if (isValid) {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Form submitted:", state);
    };

    return (
        <ValidatorForm ref={formRef} onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{padding: 4}}>
                <Grid item xs={3} container direction="column" alignItems="center" spacing={2}>
                    <Grid item>
                        <MatxLogo/>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" component="label">
                            Upload Image
                            {/*<input type="file" hidden onChange={handleFileChange} />*/}
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={9} container spacing={2} sx={{ marginTop: 0 }}>
                    <Stepper activeStep={currentStep} alternativeLabel sx={{ width: '100%' }}>
                        {steps.map(label => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {currentStep === 0 && <FormStepOne />}
                    {currentStep === 1 && <FormStepTwo />}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        {currentStep > 0 && (
                            <Button onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button color="primary" variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button color="primary" variant="contained" type="submit">
                                <Icon>send</Icon>
                                <Span sx={{ pl: 1 }}>Submit</Span>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </ValidatorForm>
    );
};

export default UserRegister;

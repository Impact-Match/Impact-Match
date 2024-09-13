import React, {useState, useEffect} from 'react';
import {Grid, styled} from '@mui/material';

import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(({theme}) => ({
    width: "100%",
    marginBottom: theme.spacing(2),
}));

const FormStepOne = () => {
    const [state, setState] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        email: "",
        age: "",
        promoCode: "",
        phone: "",
        password: "",
        confirmPassword: "",
        usernames: new Set(),
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setState(prev => ({
            ...prev,
            [name]: value,
            ...(name === "firstName" || name === "lastName" ? {username: `${state.firstName} ${state.lastName}`} : {})
        }));
    };

    useEffect(() => {
        ValidatorForm.addValidationRule('isUsernameUnique', (value) => {
            // Suppose `usernames` is a Set containing already taken usernames
            return !state.usernames.has(value);
        });

        ValidatorForm.addValidationRule('isAge', (value) => {
            const regex = /^\d{}$/;  // Simple example for US phone numbers
            return regex.test(value);
        });

        ValidatorForm.addValidationRule('isPhoneNumber', (value) => {
            const regex = /^\d{10}$/;  // Simple example for US phone numbers
            return regex.test(value);
        });

        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return value === state.password;
        });

        return () => {
            // Clean up the rules when the component unmounts
            ValidatorForm.removeValidationRule('isUsernameUnique');
            ValidatorForm.removeValidationRule('isPhoneNumber');
            ValidatorForm.removeValidationRule('isPasswordMatch');

        };
    }, [state.confirmPassword, state.usernames]);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            label="First Name*"
                            name="firstName"
                            value={state.firstName || ""}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['First name is required']}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Middle Name"
                            name="middleName"
                            value={state.middleName || ""}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Last Name*"
                            name="lastName"
                            value={state.lastName || ""}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['Last name is required']}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Promo Code*"
                            name="promoCode"
                            value={state.promoCode || ""}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['Promo code is required']}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Username*"
                            name="username"
                            value={state.username || ""}
                            onChange={handleChange}
                            validators={['required', 'isUsernameUnique']}
                            errorMessages={['Username is required', 'Username is already taken']}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="Email*"
                            type="email"
                            name="email"
                            value={state.email || ""}
                            onChange={handleChange}
                            validators={['required', 'isEmail']}
                            errorMessages={['Email is required', 'Email is not valid']}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Age*"
                            type="age"
                            name="age"
                            value={state.age || ""}
                            onChange={handleChange}
                            validators={['required', 'isAge']}
                            errorMessages={['Age is required', 'Age is not valid']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone Number*"
                            type="phone"
                            name="phone"
                            value={state.phone || ""}
                            onChange={handleChange}
                            validators={['required', 'isPhoneNumber']}
                            errorMessages={['Phone Number is required', 'Phone Number is not valid']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password*"
                            type="password"
                            name="password"
                            value={state.password || ""}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['Password is required']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Confirm Password*"
                            type="password"
                            name="confirmPassword"
                            value={state.confirmPassword || ""}
                            onChange={handleChange}
                            validators={['required', 'isPasswordMatch']}
                            errorMessages={['Confirm password is required', "Passwords don't match"]}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default FormStepOne;

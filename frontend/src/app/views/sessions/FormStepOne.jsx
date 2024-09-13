import React, { useState, useEffect } from 'react';
import { Grid, styled, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(({ theme }) => ({
    width: "100%",
    marginBottom: theme.spacing(2),
}));

const FormStepOne = ({ data, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const generatePromoCode = async (first, last) => {
        try {
            const response = await axios.post(`${BASE_URL}/promocode`, {
                firstname: first,
                lastname: last
            });
            if (response.status === 200 && response.data.promocode) {
                return response.data.promocode;
            } else {
                throw new Error('Failed to generate promo code');
            }
        } catch (error) {
            console.error('Error generating promo code:', error);
            return '';  // Return empty string or handle error differently
        }
    };

    const handleChange = async (event) => {
        const { name, value } = event.target;
        onChange(name, value);

        // Check if both firstName and lastName are provided
        if (name === "firstName" || name === "lastName") {
            const form = event.target.form;
            const firstName = form.firstName.value.trim();
            const lastName = form.lastName.value.trim();

            if (firstName && lastName) {
                // Generate username
                const username = `${firstName} ${lastName}`;
                onChange("username", username);

                // Generate promo code
                const promoCode = await generatePromoCode(firstName, lastName);
                onChange("promoCode", promoCode);
            }
        }

        // If password is changed, trigger validation for confirmPassword
        if (name === "password") {
            const form = event.target.form;
            const confirmPassword = form.confirmPassword.value.trim();
            onChange("confirmPassword", confirmPassword);
        }
    };

    useEffect(() => {
        ValidatorForm.addValidationRule('isPromocodeUnique', async (value) => {
            try {
                const response = await axios.post(`${BASE_URL}/checkpromocode`, { promocode: value });
                if (response.data.isUnique !== undefined) {
                    return response.data.isUnique;
                }
                throw new Error('No valid response for promocode uniqueness');
            } catch (error) {
                console.error('Error checking promocode uniqueness:', error);
                return false;
            }
        });

        ValidatorForm.addValidationRule('isUsernameUnique', async (value) => {
            try {
                const response = await axios.post(`${BASE_URL}/checkusername`, { username: value });
                if (response.data.isUnique !== undefined) {
                    return response.data.isUnique;
                }
                throw new Error('No valid response for username uniqueness');
            } catch (error) {
                console.error('Error checking username uniqueness:', error);
                return false;
            }
        });

        ValidatorForm.addValidationRule('isEmailUnique', async (value) => {
            try {
                const response = await axios.post(`${BASE_URL}/checkemail`, { email: value });
                if (response.data.isUnique !== undefined) {
                    return response.data.isUnique;
                }
                throw new Error('No valid response for email uniqueness');
            } catch (error) {
                console.error('Error checking email uniqueness:', error);
                return false;
            }
        });

        ValidatorForm.addValidationRule('isAge', (value) => {
            const regex = /^\d{1,3}$/;
            return regex.test(value);
        });

        ValidatorForm.addValidationRule('isPhoneNumber', (value) => {
            const regex = /^(?:\+1[-\s]?)?\(?(?:\d{3})\)?[-\s]?\d{3}[-\s]?\d{4}$/;  // Simple example for US phone numbers
            return regex.test(value);
        });

        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            return value === data.password;
        });

        ValidatorForm.addValidationRule('passwordComplexity', (value) => {
            const complexityRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            return complexityRegex.test(value);
        });

        return () => {
            // Clean up the rules when the component unmounts
            ValidatorForm.removeValidationRule('isUsernameUnique');
            ValidatorForm.removeValidationRule('isPromocodeUnique');
            ValidatorForm.removeValidationRule('isEmailUnique');
            ValidatorForm.removeValidationRule('isPhoneNumber');
            ValidatorForm.removeValidationRule('isPasswordMatch');
            ValidatorForm.removeValidationRule('passwordComplexity');
        };
    }, [data]);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            label="First Name*"
                            name="firstName"
                            value={data.firstName || ""}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['First name is required']}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Middle Name"
                            name="middleName"
                            value={data.middleName || ""}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Last Name*"
                            name="lastName"
                            value={data.lastName || ""}
                            onChange={handleChange}
                            validators={['required']}
                            errorMessages={['Last name is required']}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Promo Code*"
                            name="promoCode"
                            value={data.promoCode || ""}
                            onChange={handleChange}
                            validators={['required', 'isPromocodeUnique']}
                            errorMessages={['Promocode is required', 'Promocode is already taken']}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Username*"
                            name="username"
                            value={data.username || ""}
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
                            value={data.email || ""}
                            onChange={handleChange}
                            validators={['required', 'isEmail', 'isEmailUnique']}
                            errorMessages={['Email is required', 'Email is not valid', 'Email is already taken']}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Age*"
                            type="age"
                            name="age"
                            value={data.age || ""}
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
                            value={data.phone || ""}
                            onChange={handleChange}
                            validators={['required', 'isPhoneNumber']}
                            errorMessages={['Phone Number is required', 'Phone Number is not valid']}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password*"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password || ""}
                            onChange={handleChange}
                            validators={['required', 'passwordComplexity']}
                            errorMessages={['Password is required', 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.']}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Confirm Password*"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={data.confirmPassword || ""}
                            onChange={handleChange}
                            validators={['required', 'isPasswordMatch']}
                            errorMessages={['Confirm password is required', "Passwords don't match"]}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default FormStepOne;
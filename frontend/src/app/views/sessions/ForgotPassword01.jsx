import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, styled, TextField, Typography, Button } from "@mui/material";
import { Formik } from "formik";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import * as Yup from "yup";
import axios from 'axios';
import { MatxLogo, StyledRoot } from "../../components";
import AlertDialog from './AlertDialog';

// STYLED COMPONENTS
const MessageBox = styled(Box)(({ theme, error }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    backgroundColor: error ? '#fdecea' : '#e3fcee',
    color: error ? '#d32f2f' : '#235e3a',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
}));

export default function ForgotPassword() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const resetPassword = async (email) => {
        try {
            const response = await axios.post(`${BASE_URL}/forgot_password`, { email });
            if (response.status === 200) {
                setEmailSent(true);
                setUserEmail(email);
                setCountdown(60); // Start the 60 seconds countdown
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage('User not found');
            } else if (error.response && error.response.status === 415) {
                setErrorMessage('Please contact the administrator to change the password!');
            } else {
                setShowAlertDialog(true);
                setErrorMessage('Failed to send email');
            }
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [countdown]);

    const handleFormSubmit = (values) => {
        localStorage.setItem('userEmail', values.email);
        try {
            resetPassword(values.email);
        } catch (e) {
            console.log(e);
        }
    };

    const initialValues = {
        email: ""
    };

    // form field validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email address").required("Email is required!")
    });

    const handleCloseAlertDialog = () => {
        setShowAlertDialog(false);
    };

    return (
        <StyledRoot>
            <div className="left-half">
                <Grid item className="logo-wrapper">
                    <MatxLogo />
                </Grid>
                <div className="img-wrapper">
                    <img src="/assets/images/illustrations/anm2.gif" alt="Forgot Password Illustration" />
                </div>
            </div>
            <div className="right-half">
                {emailSent ? (
                    <div style={{ width: '70%' }}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: 'black' }}>
                            Check your email inbox
                        </Typography>
                        <MessageBox>
                            <CheckCircleIcon sx={{ color: '#3daf65', mr: 1 }} />
                            <Typography variant="body2" sx={{ textAlign: 'left' }}>
                                A link to reset your password has been emailed to <Box component="span" sx={{ fontWeight: 'bold' }}>{userEmail}</Box>
                            </Typography>
                        </MessageBox>
                        <Typography variant="body2" sx={{ mb: 2, textAlign: 'left', color: 'gray' }}>
                            *Link will expire in 30 minutes
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: '18px', fontWeight: 'bold' }}
                            onClick={() => {
                                if (countdown === 0) {
                                    resetPassword(userEmail);
                                }
                            }}
                            disabled={countdown > 0}
                        >
                            {countdown > 0 ? `Resend link in ${countdown}s` : 'Reset the link'}
                        </Button>
                        <Button
                            fullWidth
                            color="primary"
                            variant="outlined"
                            onClick={() => navigate('/login')}
                            sx={{ mt: 2, borderRadius: '18px', fontWeight: 'bold' }}>
                            Back to login
                        </Button>
                        <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                            *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                        </Typography>
                    </div>
                ) : (
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={validationSchema}>
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit} style={{ width: '70%' }}>
                                <Typography variant="h5" component="h1" sx={{ textAlign: 'left', fontWeight: 'bold', mb: 3 }}>
                                    Forgot your password?
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, textAlign: 'left', color: 'gray' }}>
                                    Enter your email and we will send you a link to reset your password.
                                </Typography>
                                {errorMessage && (
                                    <MessageBox error>
                                        <ErrorIcon sx={{ color: '#d32f2f', mr: 1 }} />
                                        <Typography variant="body2" sx={{ textAlign: 'left' }}>
                                            {errorMessage}
                                        </Typography>
                                    </MessageBox>
                                )}
                                <TextField
                                    type="email"
                                    name="email"
                                    size="small"
                                    label="Email"
                                    value={values.email}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.email && errors.email)}
                                    onChange={handleChange}
                                    helperText={touched.email && errors.email}
                                    variant="outlined"
                                    sx={{ mb: 3, width: "100%" }}
                                />
                                <Button fullWidth variant="contained" color="primary" type="submit" sx={{ borderRadius: '18px', fontWeight: 'bold' }}>
                                    Send reset link
                                </Button>
                                <Button
                                    fullWidth
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => navigate('/login')}
                                    sx={{ mt: 2, borderRadius: '18px', fontWeight: 'bold' }}>
                                    Back to login
                                </Button>
                                <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                                    *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                                </Typography>
                            </form>
                        )}
                    </Formik>
                )}
            </div>
            {showAlertDialog && <AlertDialog open={showAlertDialog} onClose={handleCloseAlertDialog} />}
        </StyledRoot>
    );
}
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Box, Checkbox, Grid, styled, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";
import { MatxLogo, StyledRoot } from "../../components";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AlertDialog from './AlertDialog'; // Import the AlertDialog component

// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
    display: "flex"
}));

const MessageBox = styled(Box)(({ theme, error }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    mb: 2,
    backgroundColor: error ? '#fdecea' : '#e3fcee',
    color: error ? '#d32f2f' : '#235e3a',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
}));

const StyledForm = styled('form')({
    width: '70%'
});

// initial login credentials
const initialValues = {
    email: "",
    password: "",
    remember: false,
};

// form field validation schema
const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Password must be 8 character length")
        .required("Password is required!"),
    email: Yup.string().required("Email or Promo Code is required!"),
});

export default function UserLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [showAlertDialog, setShowAlertDialog] = useState(false); // State for showing AlertDialog
    const message = location.state?.message;

    useEffect(() => {
        if (isAuthenticated) {
            if (user.role === 'ADMIN') {
                navigate("/adminboard/default");
            } else {
                navigate("/userboard/default");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleFormSubmit = async (values) => {
        setLoading(true);
        setEmailError('');
        setPasswordError('');
        setGeneralError('');
        try {
            await login(values.email, values.password);
        } catch (error) {
            if (!error.response) {
                setShowAlertDialog(true); // Show AlertDialog
            } else if (error.response.status === 404) {
                setEmailError('Email or Promo Code not found');
            } else if (error.response && error.response.status === 401) {
                setPasswordError('Invalid password');
            } else if (error.response && error.response.status === 400) {
                setGeneralError('Please Verify Your Email First.');
            } else if (error.response && error.response.status === 415) {
                setGeneralError('Please use Promo Code to log in');
            } else {
                setGeneralError('Login failed. Please check your credentials.');
            }
            setLoading(false);
        }
    };

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
                    <img src="/assets/images/illustrations/anm1.gif" alt="Login Illustration" />
                </div>
            </div>
            <div className="right-half">
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={validationSchema}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <StyledForm onSubmit={handleSubmit}>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Log In
                            </Typography>
                            {message && (
                                <MessageBox>
                                    <CheckCircleIcon sx={{ color: '#3daf65', mr: 1 }} />
                                    <Typography variant="body2" sx={{ textAlign: 'left' }}>
                                        {message}
                                    </Typography>
                                </MessageBox>
                            )}
                            {generalError && (
                                <MessageBox error>
                                    <ErrorIcon sx={{ color: '#d32f2f', mr: 1 }} />
                                    <Typography variant="body2" sx={{ textAlign: 'left' }}>
                                        {generalError}
                                    </Typography>
                                </MessageBox>
                            )}
                            <TextField
                                fullWidth
                                size="small"
                                name="email"
                                label="Email/Promo Code"
                                variant="outlined"
                                onBlur={handleBlur}
                                value={values.email}
                                onChange={handleChange}
                                helperText={(touched.email && errors.email) || emailError}
                                error={Boolean(errors.email && touched.email) || Boolean(emailError)}
                                sx={{ mb: 3 }}
                                autoComplete="username"
                            />

                            <TextField
                                fullWidth
                                size="small"
                                name="password"
                                type="password"
                                label="Password"
                                variant="outlined"
                                onBlur={handleBlur}
                                value={values.password}
                                onChange={handleChange}
                                helperText={(touched.password && errors.password) || passwordError}
                                error={Boolean(errors.password && touched.password) || Boolean(passwordError)}
                                sx={{ mb: 1.5 }}
                                autoComplete="current-password"
                            />

                            <FlexBox justifyContent="space-between" sx={{ mt: 2 }}>
                                <FlexBox gap={1}>
                                    <Checkbox
                                        size="small"
                                        name="remember"
                                        onChange={handleChange}
                                        checked={values.remember}
                                        sx={{ padding: 0 }}
                                    />
                                    <Paragraph>Remember Me</Paragraph>
                                </FlexBox>

                                <NavLink
                                    to="/session/forgot-password"
                                    style={{ color: "#1976d2" }}>
                                    Forgot password?
                                </NavLink>
                            </FlexBox>

                            <LoadingButton
                                type="submit"
                                color="primary"
                                loading={loading}
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, mb: 2, borderRadius: 5, fontWeight: 'bold' }}>
                                Login
                            </LoadingButton>

                            <Paragraph>
                                Don't have an account?
                                <NavLink
                                    to="/signup"
                                    style={{ color: "#1976d2", marginLeft: 5 }}>
                                    Register
                                </NavLink>
                            </Paragraph>
                            <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                                *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                            </Typography>
                        </StyledForm>
                    )}
                </Formik>
            </div>
            {showAlertDialog && <AlertDialog open={showAlertDialog} onClose={handleCloseAlertDialog} />}
        </StyledRoot>
    );
}
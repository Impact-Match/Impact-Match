import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { MatxLogo, StyledRoot } from "../../components";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter")
        .matches(/\d/, "Password must contain at least one number")
        .required("Password is required")
        .test('complexity', 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.',
            value => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value)),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords must match").required("Confirm password is required")
});

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [tokenValid, setTokenValid] = useState(true);
    const [loading, setLoading] = useState(false);
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        // Validate token on load
        const validateToken = async () => {
            try {
                await axios.get(`${BASE_URL}/reset/${token}`);
                setTokenValid(true);
            } catch (error) {
                console.log(error);
                setTokenValid(false);
                navigate('/token-expired');
            }
        };
        validateToken();
    }, [token, BASE_URL, navigate]);

    const handleResetPassword = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/reset/${token}`, {
                password: data.password
            });
            alert('Your password has been reset successfully'); // Handle response according to your needs
            navigate('/login');
        } catch (error) {
            console.error(error);
            // Handle errors e.g., display a notification
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledRoot>
            <div className="left-half">
                <Grid item className="logo-wrapper">
                    <MatxLogo />
                </Grid>
                <div className="img-wrapper">
                    <img src="/assets/images/illustrations/anm2.gif" alt="Reset Password Illustration" />
                </div>
            </div>
            <div className="right-half">
                <Formik
                    initialValues={{ password: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleResetPassword}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit} style={{ width: '70%' }}>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                                Create New Password
                            </Typography>
                            <TextField
                                type="password"
                                name="password"
                                label="New Password"
                                size="small"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2}}
                            />
                            <TextField
                                type="password"
                                name="confirmPassword"
                                label="Confirm New Password"
                                size="small"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 3 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                sx={{ mt: 2, borderRadius: '18px', fontWeight: 'bold' }}>
                                Reset Password
                            </Button>
                            <Button
                                fullWidth
                                color="primary"
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2, borderRadius: '18px', fontWeight: 'bold' }}>
                                Back to Login
                            </Button>
                            <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                                *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                            </Typography>
                        </form>
                    )}
                </Formik>
            </div>
        </StyledRoot>
    );
}
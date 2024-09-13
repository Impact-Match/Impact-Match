import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import axios from 'axios';
import { MatxLogo, StyledRoot } from "../../components";

export default function LinkExpired() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [countdown]);

    const resendEmail = async () => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            try {
                const response = await axios.post(`${BASE_URL}/forgot_password`, { email });
                if (response.status === 200) {
                    setCountdown(60); // Start the 60 seconds countdown
                }
            } catch (error) {
                console.error("Failed to resend email", error);
            }
        }
    };

    return (
        <StyledRoot>
            <div className="left-half">
                <Grid item className="logo-wrapper">
                    <MatxLogo />
                </Grid>
                <div className="img-wrapper">
                    <img width="350" src="/assets/images/illustrations/anm2.gif" alt="Expired Link Illustration" />
                </div>
            </div>
            <div className="right-half">
                <div style={{ width: '70%' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Oops! Your link has expired.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        No worries, we can send another reset link to <strong>{userEmail}</strong>.
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={resendEmail}
                        disabled={countdown > 0}
                        sx={{ mt: 2, borderRadius: '18px', fontWeight: 'bold' }}>
                        {countdown > 0 ? `Resend link in ${countdown}s` : 'Send reset link'}
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
            </div>
        </StyledRoot>
    );
}

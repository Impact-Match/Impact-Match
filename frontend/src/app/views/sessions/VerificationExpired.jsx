import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid, styled, Typography } from "@mui/material";
import axios from 'axios';
import { MatxLogo } from "../../components";

// STYLED COMPONENTS
const StyledRoot = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#1A2038",
    backgroundImage: `url('/assets/images/illustrations/Background.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: "100vh !important",

    "& .card": {
        maxWidth: 800,
        minHeight: 400,
        margin: "1rem",
        borderRadius: 12,
        display: "flex",
        alignItems: "center"
    },

    ".img-wrapper": {
        display: "flex",
        padding: "2rem",
        alignItems: "center",
        justifyContent: "center"
    },

    ".logo-wrapper": {
        position: "absolute",
        top: 20,
        left: 20,
        padding: "1rem"
    }
}));

const ContentBox = styled("div")(({ theme }) => ({
    padding: 32
}));

export default function VerificationExpired() {
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
        const firstName = localStorage.getItem('firstName');
        if (email) {
            try {
                const response = await axios.post(`${BASE_URL}/resend`, { email, firstName });
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
            <Grid item className="logo-wrapper">
                <MatxLogo />
            </Grid>
            <Card className="card">
                <Grid container>
                    <Grid item sm={6} xs={12}>
                        <div className="img-wrapper">
                            <img width="350" src="/assets/images/illustrations/anm2.gif" alt="" />
                        </div>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <ContentBox>
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
                            >
                                {countdown > 0 ? `Resend link in ${countdown}s` : 'Send reset link'}
                            </Button>

                            <Button
                                fullWidth
                                color="primary"
                                variant="outlined"
                                onClick={() => navigate('/login')}
                                sx={{ mt: 2 }}
                            >
                                Back to login
                            </Button>
                            <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                                *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                            </Typography>
                        </ContentBox>
                    </Grid>
                </Grid>
            </Card>
        </StyledRoot>
    );
}

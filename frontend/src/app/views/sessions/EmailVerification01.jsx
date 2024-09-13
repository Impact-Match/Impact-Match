import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import {Grid, Typography} from "@mui/material";
import { MatxLogo, StyledRoot } from "../../components";

export default function EmailVerification() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [tokenValid, setTokenValid] = useState(null);
    const [message, setMessage] = useState('');
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        // Validate token on load
        const validateToken = async () => {
            try {
                await axios.get(`${BASE_URL}/confirm/${token}`);
                setTokenValid(true);
                setMessage("Your email has been verified.");

                // Redirect to login after a short delay
                setTimeout(() => navigate('/login'), 3000);  // 3000 milliseconds = 3 seconds
            } catch (error) {
                console.error('Token validation failed:', error);
                setTokenValid(false);
                navigate('/token-expired');
            }
        };
        validateToken();
    }, [token, navigate, BASE_URL]);

    return (
        <StyledRoot>
            <div className="left-half">
                <Grid item className="logo-wrapper">
                    <MatxLogo />
                </Grid>
                <div className="img-wrapper">
                    <img src="/assets/images/illustrations/anm2.gif" alt="Email Verification Illustration" />
                </div>
            </div>
            <div className="right-half">
                <div style={{ width: '70%' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {tokenValid === null ? "Validating..." : message}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#757575', mt: 2 }}>
                        *Need assistance? Contact <a href="mailto:tech@thenovibox.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>tech@thenovibox.com</a>.
                    </Typography>
                </div>
            </div>
        </StyledRoot>
    );
}

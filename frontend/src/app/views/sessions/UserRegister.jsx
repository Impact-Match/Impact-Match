import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Box,
    Typography,
    styled,
    ThemeProvider,
    createTheme,
    Link
} from "@mui/material";
import { ValidatorForm } from 'react-material-ui-form-validator';
import { MatxLogo, StyledRoot, AvatarUploader } from "app/components";
import FormStepOne from './FormStepOne';
import FormStepTwo from './FormStepTwo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Icon from '@mui/material/Icon';
import { Span } from "app/components/Typography";
import AlertDialog from './AlertDialog';
import ErrorIcon from '@mui/icons-material/Error';

const MessageBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e3fcee',
    color: '#235e3a',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
}));

const theme = createTheme({
    palette: {
        primary: {
            main: '#5c5bfb',
        },
    },
});

const UserRegister = () => {
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const formRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [emailSent, setEmailSent] = useState(false);
    const [formData, setFormData] = useState({
        avatar: null,
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        email: "",
        age: "",
        promoCode: "",
        country: "",
        state: "",
        city: "",
        zipcode: "",
        phone: "",
        password: "",
        confirmPassword: "",
        collaborations: [{ platform: '', link: '' }],
        audience: [],
        niches: [],
        interests: [],
        shippingAddress: '',
        bio: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const steps = ['', 'Register'];
    const [imagePreview, setImagePreview] = useState(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (base64Image) => {
        setFormData(prev => ({
            ...prev,
            avatar: base64Image
        }));
    };

    const handleNext = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        const isValid = await formRef.current.isFormValid(false);
        if (isValid) {
            setCurrentStep(prevStep => prevStep + 1);
        }
        setIsProcessing(false);
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('firstName', formData.firstName);

        const formDataToSend = new FormData();

        // Append each key-value pair to formDataToSend
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'collaborations' || key === 'audience' || key === 'niches' || key === 'interests') {
                formDataToSend.append(key, JSON.stringify(value));
            } else if (key === 'avatar' && value) {
                const byteString = atob(value.split(',')[1]);
                const mimeString = value.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                formDataToSend.append('avatar', blob, 'avatar.png');
            } else {
                formDataToSend.append(key, value);
            }
        });

        try {
            const response = await axios.post(`${BASE_URL}/register`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                navigate('/login', { state: { message: 'Welcome to NOVI BOX.' } });
            } else if (response.status === 201) {
                setEmailSent(true);
            } 
            else {
                throw new Error('Failed to fetch register data');
            }
        } catch (error) {
            if (!error.response) {
                setShowAlertDialog(true); // Show AlertDialog
            }
            if (error.response.data.message === 'Email sending failed'){
                console.log("email send failed")
                setShowAlertDialog(true);
                setErrorMessage('Failed to send email');
            }
            console.error("Submission error", error);
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [countdown]);

    const resentEmail = async (email, firstName) => {
        try {
            const response = await axios.post(`${BASE_URL}/resend`, { email, firstName });
            if (response.status === 200) {
                setCountdown(60); // Start the 60 seconds countdown
            }
        } catch (error) {
            setShowAlertDialog(true);
            console.error("Failed to send email", error);
        }
    };

    const handleCloseAlertDialog = () => {
        setShowAlertDialog(false);
    };

    return (
        emailSent ? (
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
                    <div style={{ width: '70%' }}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left', color: 'black' }}>
                            Check your email inbox
                        </Typography>
                        <MessageBox>
                            <CheckCircleIcon sx={{ color: '#3daf65', mr: 1 }} />
                            <Typography variant="body2" sx={{ textAlign: 'left' }}>
                                A link to verify your email address has been sent to <Box component="span" sx={{ fontWeight: 'bold' }}>{formData.email}</Box>
                            </Typography>
                        </MessageBox>
                        {errorMessage && (
                            <MessageBox error>
                                <ErrorIcon sx={{ color: '#d32f2f', mr: 1 }} />
                                <Typography variant="body2" sx={{ textAlign: 'left' }}>
                                    {errorMessage}
                                </Typography>
                            </MessageBox>
                        )}
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
                                    resentEmail(formData.email, formData.firstName);
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
                    </div>
                </div>
                {showAlertDialog && <AlertDialog open={showAlertDialog} onClose={handleCloseAlertDialog} />}
            </StyledRoot>
        ) : (
            <ThemeProvider theme={theme}>
                {showAlertDialog && <AlertDialog open={showAlertDialog} onClose={handleCloseAlertDialog} />}
                <ValidatorForm ref={formRef} onSubmit={handleSubmit}>
                    <Grid container spacing={2} sx={{ padding: 8 }}>
                        <Grid item xs={12} sm={3} container direction="column" alignItems="center" spacing={0}>
                            <Grid item>
                                <MatxLogo />
                            </Grid>
                            <Grid container direction="column" alignItems="center" justify="center" style={{ marginTop: 150 }}>
                                <AvatarUploader imagePreview={imagePreview} setImagePreview={setImagePreview} handleFileChange={handleFileChange} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={9} container spacing={1} sx={{ marginTop: 0 }}>
                            <Stepper activeStep={currentStep} alternativeLabel sx={{ width: '100%', marginBottom: 3 }}>
                                {steps.map(label => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {currentStep === 0 && <FormStepOne data={formData} onChange={handleChange} />}
                            {currentStep === 1 && <FormStepTwo data={formData} onChange={handleChange} />}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Box display="flex" alignItems="center">
                                    {(
                                        <Typography variant="body2" color="textSecondary">
                                            Already have an account? <Link href="/login">Login</Link>
                                        </Typography>
                                    )}
                                    {currentStep > 0 && (
                                        <Button onClick={handleBack} style={{ borderRadius: 50 }} sx={{ ml: 'auto' }}>
                                            Back
                                        </Button>
                                    )}
                                    {currentStep < steps.length - 1 && (
                                        <Button color="primary" variant="contained" onClick={handleNext} disabled={isProcessing} style={{ borderRadius: 50 }} sx={{ ml: 'auto' }}>
                                            Next
                                        </Button>
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <Button color="primary" variant="contained" type="submit" style={{ borderRadius: 50 }} sx={{ ml: 2 }}>
                                            <Icon>send</Icon>
                                            <Span sx={{ pl: 1 }}>Submit</Span>
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </ThemeProvider>
        )
    );
};

export default UserRegister;
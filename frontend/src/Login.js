import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import googleIcon from './assets/google.png';
import { backend } from './services/service';

const Login = () => {
    const [email, setEmail] = useState('');  // State for storing email input
    const [password, setPassword] = useState('');  // State for storing password input
    const [emailError, setEmailError] = useState('');  // State for handling email errors
    const [passwordError, setPasswordError] = useState('');  // State for handling password errors
    const [message, setMessage] = useState('');  // State for success message

    const navigate = useNavigate();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Function to handle form submission for email/password login
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Trim email and password to remove any leading or trailing spaces
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Validate email format
        if (!emailRegex.test(trimmedEmail)) {
            setEmailError('Please enter a valid email address.');
            return;
        } else {
            setEmailError('');
        }

        // Validate password length
        if (trimmedPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        } else {
            setPasswordError('');
        }

        // Define API endpoint from environment variable
        const apiUrl = backend + '/auth/login';

        try {
            // Log the data being sent to the API
            console.log("Sending login request to:", apiUrl);
            console.log("Request body:", { email: trimmedEmail, password: trimmedPassword });

            // Send POST request to the API with email and password using axios
            const response = await axios.post(apiUrl, {
                email: trimmedEmail,
                password: trimmedPassword,
            }, 
            { withCredentials: true });

            if (response.status === 200) {
                setMessage('User logged in successfully');
                setPasswordError('');  // Clear any password error message
                setEmailError('');     // Clear any email error message
                console.log("Response data:", response.data);

                // Jump to /home page after successful login
                navigate('/profile');
            }
        } catch (error) {
            console.error('Error during login:', error);
            // Check if the error message is related to email verification
            const errorMessage = error.response?.data?.message;

            if (errorMessage && errorMessage.includes('Please verify your email')) {
                // Redirect to email verification page with user's email
                navigate('/email-verification', { state: { email: trimmedEmail } });
            } else {
                // Set other error messages
                setPasswordError(errorMessage || 'An error occurred. Please try again later.');
            }

            setMessage('');  // Clear any success message
        }
    };

    // Function to handle Google OAuth login
    const handleGoogleLogin = () => {
        // Redirect to the Google OAuth initiation route
        const googleAuthUrl = backend + `/auth/google`;
        window.location.href = googleAuthUrl;
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-white">
            <div className="flex-grow flex flex-col justify-center items-center">
                <div className="w-full max-w-md p-10 bg-white">
                    {/* Title for the login form */}
                    <h2 className="text-2xl mb-6 text-gray-600 text-left font-bold">Sign In</h2>
                    <p className="text-sm mb-6 text-gray-400 text-left">
                        Or{' '}
                        <Link to="/signup" className="text-darkBlue hover:underline">create an account</Link>
                    </p>

                    {/* Login form */}
                    <form className="space-y-4 ml-10" onSubmit={handleSubmit}>
                        {/* Email input field */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="EMAIL"
                                className="w-full h-10 px-3 rounded-md border border-gray-300"
                                style={{ fontSize: '12px', color: '#d1d5db' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value.trim())}  // Update email state with trimmed input
                            />
                            {/* Display email error message if validation fails */}
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        {/* Password input field */}
                        <div className="flex flex-col relative">
                            <input
                                type="password"
                                placeholder="PASSWORD"
                                className="w-full h-10 px-3 rounded-md border border-gray-300"
                                style={{ fontSize: '12px', color: '#d1d5db' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value.trim())}  // Update password state with trimmed input
                            />
                            {/* Display password error message if validation fails */}
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            {/* Display success message if login is successful */}
                            {message && <p className="text-green-500 text-sm mt-1">{message}</p>}
                        </div>

                        {/* Remember Me and Forgot Password links */}
                        <div className="flex justify-between items-center text-sm mt-2">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="mr-2" />
                                <label htmlFor="remember" className="text-gray-600">Remember me</label>
                            </div>
                            <Link to="/forgot-password" className="text-darkBlue hover:underline">Forgotten your password?</Link>
                        </div>

                        {/* Submit button for email/password login */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full h-10 text-white bg-darkBlue hover:bg-blue-700 rounded-md transition"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Google login button */}
                        <div className="mt-4">
                            <button
                                type="button"
                                className="w-full h-10 flex items-center justify-center text-black bg-white border border-gray-300 rounded-md transition hover:bg-gray-100"
                                onClick={handleGoogleLogin}  // Handle Google login click
                            >
                                <img src={googleIcon} alt="Google Icon" className="w-5 h-5 mr-2" />
                                Sign in with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';
import googleIcon from './assets/google.png';

const Login = () => {
    const [userType, setUserType] = useState('student');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(''); 

    const handleUserTypeChange = (type) => {
        setUserType(type);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
        } else {
            setError('');
            // submission logic here
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-white">
            <div className="flex-grow flex flex-col justify-center items-center"> 
                <div className="w-full max-w-md p-10 bg-white">
                    <h2 className="text-2xl mb-6 text-gray-600 text-left font-bold">Sign In</h2>
                    <p className="text-sm mb-6 text-gray-400 text-left">
                        Or{' '}
                        <Link to="/signup" className="text-lightBlue hover:underline">create an account</Link>
                    </p>

                    {/* Form */}
                    <form className="space-y-4 ml-10" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <input 
                                type="text" 
                                placeholder="EMAIL"
                                className="w-full h-10 px-3 rounded-md border border-gray-300" 
                                style={{ fontSize: '12px', color: '#d1d5db' }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <input 
                                type="password" 
                                placeholder="PASSWORD"
                                className="w-full h-10 px-3 rounded-md border border-gray-300"
                                style={{ fontSize: '12px', color: '#d1d5db' }}
                                value={password}  
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex justify-between items-center text-sm mt-2">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="mr-2" />
                                <label htmlFor="remember" className="text-gray-600">Remember me</label>
                            </div>
                            <Link to="/forgot-password" className="text-lightBlue hover:underline">Forgotten your password?</Link>
                        </div>

                        {/* Sign In Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full h-10 text-white bg-darkBlue hover:bg-blue-700 rounded-md transition"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Sign in with Google */}
                        <div className="mt-4">
                            <button
                                type="button"
                                className="w-full h-10 flex items-center justify-center text-black bg-white border border-gray-300 rounded-md transition hover:bg-gray-100"
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
}

export default Login;

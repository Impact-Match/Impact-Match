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
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col md:flex-row w-full bg-white">
                {/* Left Section */}
                <div className="w-full md:w-1/3 bg-darkBlue text-white p-10 flex flex-col justify-center items-center min-h-[700px]">
                    <div className="flex mb-20 -mt-36">
                        <button
                            className={`w-32 py-1 rounded-sm font-inter ${userType === 'student' ? 'bg-lightBlue' : 'bg-gray-400'}`}
                            onClick={() => handleUserTypeChange('student')}
                        >
                            Student
                        </button>
                        <button
                            className={`w-32 py-1 rounded-sm ${userType === 'organization' ? 'bg-lightBlue' : 'bg-gray-400'}`}
                            onClick={() => handleUserTypeChange('organization')}
                        >
                            Organization
                        </button>
                    </div>
                    <img src={icon} alt="Impact Match Logo" className="w-32 h-32 mb-4" />
                    <h1 className="text-3xl font-inter">Impact Match</h1>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
                    <div className="w-[55%]">
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Log In</h2>
                        <p className="text-sm mb-6 text-gray-500 text-left">
                            Don't have an account? 
                            <Link 
                                to="/signup" 
                                className="text-darkBlue hover:underline focus:underline active:text-blue-900 inline-block ml-1"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form className="w-[55%] space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="text-gray-600 text-left mb-1 text-[10px] pl-2">PLEASE ENTER YOUR USERNAME/EMAIL</label>
                            <input 
                                type="text" 
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-600 text-left mb-1 text-[10px] pl-2">PLEASE ENTER YOUR PASSWORD</label>
                            <input 
                                type="password" 
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100"
                                value={password}  
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="w-full flex justify-between items-center mt-2 text-sm">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="mr-1" />
                                <label htmlFor="remember" className="text-gray-500">Remember Me</label>
                            </div>
                            <Link to="/forgot-password" className="text-darkBlue hover:underline focus:underline active:text-blue-900 inline-block ml-1">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign in with Google */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="w-full py-1.5 px-2 text-black bg-white border border-gray-400 rounded-2xl text-sm flex items-center justify-center mt-6 transition-shadow duration-150 hover:shadow-lg active:shadow-inner active:bg-gray-200"
                            >
                                <img src={googleIcon} alt="Google" className="w-4 h-4 mr-2" />
                                Sign in with Google
                            </button>
                        </div>

                        {/* Log In Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full py-1.5 px-2 bg-darkBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-800 active:bg-blue-900 active:shadow-inner"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
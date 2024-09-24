import React from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';
import googleIcon from './assets/google.png';

const Login = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Left Section */}
                <div className="w-full md:w-2/5 bg-darkBlue text-white p-10 flex flex-col justify-center items-center min-h-[700px]">
                    <img src={icon} alt="Impact Match Logo" className="w-32 h-32 mb-4" />
                    <h1 className="text-2xl font-inter">Impact Match</h1>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-3/5 p-10 flex flex-col items-center justify-center">
                    {/* Ensure padding aligns with input boxes */}
                    <div className="w-[55%]">
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Log In</h2>
                        <p className="text-sm mb-6 text-gray-400 text-left">
                            Don't have an account? 
                            <Link 
                                to="/signup" 
                                className="text-lightBlue hover:text-blue-500 focus:text-blue-500 active:text-blue-700 inline-block"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form className="w-[55%] space-y-6">
                        <div className="flex flex-col">
                            <label className="text-gray-400 text-left mb-1 text-[10px] pl-2">PLEASE ENTER YOUR USERNAME/EMAIL</label>
                            <input 
                                type="text" 
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-400 text-left mb-1 text-[10px] pl-2">PLEASE ENTER YOUR PASSWORD</label>
                            <input 
                                type="password" 
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100" 
                            />
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="w-full flex justify-between items-center mt-2 text-sm">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="mr-2" />
                                <label htmlFor="remember" className="text-gray-400">Remember Me</label>
                            </div>
                            <Link to="/forgot-password" className="text-lightBlue hover:text-blue-500 focus:text-blue-500 active:text-blue-700">
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
                                className="w-full py-1.5 px-2 bg-lightBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-600 active:bg-gradient-to-r from-blue-500 to-blue-700 active:shadow-inner"
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
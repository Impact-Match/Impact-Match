import React from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';

const ResetPassword = () => {
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
                    {/* Content */}
                    <div className="w-[55%]">
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Reset Your Password</h2>
                        <p className="text-sm mb-6 text-gray-400 text-left">
                            Please enter your new password below to reset your account password.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="w-[55%] space-y-6">
                        <div className="flex flex-col">
                            <label htmlFor="new-password" className="text-gray-400 text-left mb-1 text-[10px] pl-2">
                                NEW PASSWORD
                            </label>
                            <input 
                                type="password" 
                                id="new-password"
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100" 
                                placeholder="New Password"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="confirm-password" className="text-gray-400 text-left mb-1 text-[10px] pl-2">
                                CONFRIM NEW PASSWORD
                            </label>
                            <input 
                                type="password" 
                                id="confirm-password"
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100" 
                                placeholder="Confirm Password"
                            />
                        </div>

                        {/* Reset Password Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full py-1.5 px-2 bg-lightBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-600 active:bg-gradient-to-r from-blue-500 to-blue-700 active:shadow-inner"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>

                    {/* Back to Login */}
                    <div className="w-[55%] mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account? 
                            <Link 
                                to="/login" 
                                className="text-lightBlue hover:text-blue-500 focus:text-blue-500 active:text-blue-700 inline-block ml-1"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
import React from 'react';
import { Link } from 'react-router-dom';
import LeftSection from './LeftSection';

const ExpiredLink = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col md:flex-row w-full bg-white">
                {/* Left Section */}
                <LeftSection />

                {/* Right Section */}
                <div className="w-full md:w-3/5 p-10 flex flex-col items-center justify-center">
                    {/* Content */}
                    <div className="w-[55%]">
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Link Expired</h2>
                        <p className="text-sm mb-6 text-gray-500 text-left">
                            The password reset link has expired. Please request a new one to reset your password.
                        </p>
                    </div>

                    {/* Request New Reset Link Button */}
                    <div className="w-[55%] flex justify-center">
                        <Link 
                            to="/forgot-password"
                            className="w-full h-9 py-1.5 px-2 bg-darkBlue text-white rounded-3xl text-sm transition-shadow duration-150 hover:bg-blue-600 active:bg-gradient-to-r from-blue-500 to-blue-700 active:shadow-inner text-center"
                        >
                            Request New Reset Link
                        </Link>
                    </div>

                    {/* Back to Login */}
                    <div className="w-[55%] mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Remembered your password? 
                            <Link 
                                to="/login" 
                                className="text-darkBlue hover:underline focus:underline active:text-blue-900 inline-block ml-1"
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

export default ExpiredLink;
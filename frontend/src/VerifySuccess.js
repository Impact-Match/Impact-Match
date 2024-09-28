import React from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';

const VerifySuccess = () => {
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
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Email Verified Successfully</h2>
                        <p className="text-sm mb-6 text-gray-400 text-left">
                            Your email address has been successfully verified. You can now log in to your account using the link below.
                        </p>
                    </div>

                    {/* Go to Login Button */}
                    <div className="w-[55%] flex justify-center">
                        <Link 
                            to="/login"
                            className="w-full py-1.5 px-2 bg-lightBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-600 active:bg-gradient-to-r from-blue-500 to-blue-700 active:shadow-inner text-center"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifySuccess;
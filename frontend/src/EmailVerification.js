import React from 'react';
import { Link } from 'react-router-dom';
import LeftSection from './LeftSection';
import emailIcon from './assets/SendEmail.png';

const EmailVerification = ({ userEmail }) => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col md:flex-row w-full bg-white">
                {/* Left Section */}
                <LeftSection />

                {/* Right Section */}
                <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
                    {/* Content */}
                    <div className="w-[70%]">
                        <h2 className="text-2xl text-black text-center mb-8">Please verify your email</h2>
                        <p className="text-black text-sm text-center mb-8">
                        We have sent a verification link to [Email@gmail.com] <span>{userEmail}</span>.
                        </p>
                    </div>

                    {/* Email Icon */}
                    <div className="w-[100%] flex justify-center mb-8">
                        <img src={emailIcon} alt="Email Verification" className="w-48 h-48 object-contain" />
                    </div>

                    {/* Verification Instructions */}
                    <div className="w-[70%]">
                        <p className="text-sm text-black text-center mb-6">
                            Click on the link in your email to complete the verification process. You may need to check your spam folder.
                        </p>
                    </div>

                    {/* Send Email & Return to Site */}
                    <div className="w-[60%] flex justify-between items-center mt-2 text-sm">
                        {/* Send Email Button */}
                        <button
                            type="button"
                            className="py-1.5 px-4 bg-darkBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-800 active:bg-blue-900 active:shadow-inner"
                        >
                            Send Email
                        </button>
                        
                        {/* Return to Site Link */}
                        <Link
                            to="/login"
                            className="text-darkBlue hover:underline focus:underline active:text-blue-900 inline-block ml-1"
                        >
                            Return to Site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
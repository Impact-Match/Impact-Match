import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LeftSection from './LeftSection';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');  // State to store the input email
    const [error, setError] = useState('');  // State to store error messages

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');  // Set error if email format is invalid
        }else {
            setError('');  // Clear error message
            // Add logic to send reset link here
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col md:flex-row w-full bg-white">
                {/* Left Section */}
                <LeftSection />

                {/* Right Section - Forget Password Form */}
                <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
                    <div className="w-[55%]">
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Forgot Password</h2>
                        <p className="text-sm mb-6 text-gray-500 text-left">
                            Don't worry! Just enter your email below and we will send you a reset link.
                        </p>
                    </div>

                    {/* Forget Password Form */}
                    <form className="w-[55%] space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="text-gray-600 text-left mb-1 text-[10px] pl-2">PLEASE ENTER YOUR EMAIL ADDRESS</label>
                            <input 
                                type="text" 
                                className="w-full py-1.5 px-2 rounded-2xl bg-gray-100" 
                                value={email}  // Bind email input field
                                onChange={(e) => setEmail(e.target.value)}  // Update email state
                            />
                            {/* Error message with red color */}
                            {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}
                        </div>

                        {/* Reset Password Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full py-1.5 px-2 bg-darkBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-800 active:bg-blue-900 active:shadow-inner"
                            >
                                Send Reset Link
                            </button>
                        </div>
                    </form>

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

export default ForgetPassword;
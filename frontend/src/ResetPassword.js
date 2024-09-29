import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LeftSection from './LeftSection';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
        } else if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
        } else {
            setError('');
            // Submission logic here
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col md:flex-row w-full bg-white">
                {/* Left Section */}
                <LeftSection />

                {/* Right Section */}
                <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
                    {/* Content */}
                    <div className="w-[55%]">
                        <h2 className="text-2xl mb-6 text-black font-bold font-inter text-left">Reset Your Password</h2>
                        <p className="text-sm mb-6 text-gray-500 text-left">
                            Please enter your new password below to reset your account password.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="w-[55%] space-y-6" onSubmit={handleSubmit}>
                        {/* New Password Input */}
                        <div className="flex flex-col relative">
                            <label htmlFor="new-password" className="text-gray-600 text-left mb-1 text-[10px] pl-2">
                                NEW PASSWORD
                            </label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="new-password"
                                className="w-full h-9 py-1.5 px-2 rounded-2xl bg-gray-100"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[65%] transform -translate-y-[45%] text-gray-400 text-xl"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="flex flex-col relative">
                            <label htmlFor="confirm-password" className="text-gray-600 text-left mb-1 text-[10px] pl-2">
                                CONFIRM NEW PASSWORD
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirm-password"
                                className="w-full h-9 py-1.5 px-2 rounded-2xl bg-gray-100"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[65%] transform -translate-y-[45%] text-gray-400 text-xl"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Reset Password Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full h-9 py-1.5 px-2 bg-darkBlue text-white rounded-2xl text-sm transition-shadow duration-150 hover:bg-blue-800 active:bg-blue-900 active:shadow-inner"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>

                    {/* Back to Login */}
                    <div className="w-[55%] mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account? 
                            <Link to="/login" className="text-darkBlue hover:underline focus:underline active:text-blue-900 inline-block ml-1">
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
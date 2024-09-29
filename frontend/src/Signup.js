import React, { useState } from 'react';
import icon from './assets/ImpactMatchLogo_Transparent.png';
import googleIcon from './assets/google.png'; 

const Signup = () => {
    const [userType, setUserType] = useState('student');
    const handleUserTypeChange = (type) => {
        setUserType(type);
    }

    return (
        <div className="flex flex-col h-screen w-screen">
            <div className="flex-grow flex flex-col">
                <div className="flex flex-col md:flex-row w-full h-full bg-white overflow-hidden">
                    {/* Left Section */}
                    <div className="w-full md:w-1/3 bg-darkBlue text-white p-10 flex flex-col justify-center items-center">
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
                        <h1 className="text-2xl font-inter">Impact Match</h1>
                    </div>
                    {/* Right Section */}
                    <div className="w-full md:w-2/3 p-10 flex flex-col items-center justify-center">
                    <h2 className="text-2xl mb-6 text-gray-600 text-center font-inter">Create New Account</h2>
                    <p className="text-sm mb-28 text-gray-400 text-center">Already Registered? <button className="text-lightBlue">Login</button></p>
                        {userType === 'student' ? (
                            <form className="w-full space-y-4">
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR NAME</label>
                                    <input 
                                        type="text" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR EMAIL</label>
                                    <input 
                                        type="email" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR PASSWORD</label>
                                    <input 
                                        type="password" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR DATE OF BIRTH</label>
                                    <input 
                                        type="date" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100 text-gray-200" 
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="w-[17%] py-2 bg-lightBlue text-black rounded-2xl text-sm mt-6"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button className="min-w-[180px] py-2 flex items-center justify-center bg-white text-black border border-gray-300 rounded-2xl text-sm">
                                        <img src={googleIcon} alt="Google Icon" className="w-5 h-5 mr-2" />
                                        Sign in with Google
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form className="w-full space-y-4">
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR NAME</label>
                                    <input 
                                        type="text" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR COMPANY NAME</label>
                                    <input 
                                        type="text" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR EMAIL</label>
                                    <input 
                                        type="email" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-gray-300 w-[30%] text-left mb-1 ml-10 text-[10px]">PLEASE ENTER YOUR PASSWORD</label>
                                    <input 
                                        type="password" 
                                        className="w-[30%] py-1.5 px-2 rounded-2xl bg-gray-100" 
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="w-[17%] py-2 bg-lightBlue text-black rounded-2xl text-sm mt-6"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button className="min-w-[180px] py-2 flex items-center justify-center bg-white text-black border border-gray-300 rounded-2xl text-sm">
                                        <img src={googleIcon} alt="Google Icon" className="w-5 h-5 mr-2" />
                                        Sign in with Google
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

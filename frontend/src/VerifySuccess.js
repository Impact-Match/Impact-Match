import React from 'react';
import icon from './assets/ImpactMatchLogo_Transparent.png';
import SuccessSendIcon from './assets/SuccessSend.png';

const VerifySuccess = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="flex flex-col items-center w-full h-full bg-darkBlue p-8">
                <img src={icon} alt="Impact Match Logo" className="w-48 h-48" />
                <h1 className="text-4xl font-inter text-white mb-4">Impact Match</h1>
                
                {/* Email Icon */}
                <div className="w-full flex justify-center mb-2">
                    <img src={SuccessSendIcon} alt="Email Success" className="w-32 h-32 object-contain" />
                </div>
                
                <p className="text-sm mb-12 text-white text-center">Your email has been successfully verified</p>
                
                {/* Log In Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="w-48 h-9 py-1.5 px-2 bg-lightBlue text-darkblue rounded-3xl text-sm transition-shadow duration-150 hover:bg-blue-800 hover:text-white active:bg-blue-900 active:shadow-inner"
                    >
                        Finish Account Set Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifySuccess;

import React from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
            {/* Logo */}
            <img src={icon} alt="Impact Match Logo" className="w-28 h-28 mb-6" />

            {/* Error Message */}
            <h1 className="text-7xl font-bold text-darkBlue mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>

            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="px-6 py-3 bg-darkBlue text-white rounded-full text-lg shadow-md transition duration-300 hover:bg-blue-700"
            >
                Go Back to Home
            </Link>

            {/* Decorative Line */}
            <div className="mt-10 w-1/2 border-t-2 border-gray-200"></div>
        </div>
    );
}

export default NotFound;
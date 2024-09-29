import React from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';

const NavigationBar = () => {
    return (
        <nav className="bg-darkBlue h-24 flex items-center justify-between px-10 shadow-md">
            {/* Left Section: Logo + Brand Name */}
            <div className="flex items-center space-x-3">
                <img src={icon} alt="Impact Match Logo" className="w-24 h-24" />
                <span className="text-white text-lg font-semibold">Impact Match</span>
            </div>

            {/* Middle Section: Navigation Links */}
            <div className="border-2 border-white rounded-full px-20 py-3">
                <ul className="flex space-x-20">
                    <li>
                        <Link to="/" className="text-white hover:text-blue-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-white hover:text-blue-300">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="text-white hover:text-blue-300">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="text-white hover:text-blue-300">
                            Profile
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Right Section: Sign Up / Login */}
            <div className="flex space-x-4">
                <Link
                    to="/signup"
                    className="px-4 py-2 text-black bg-lightBlue rounded-3xl hover:bg-blue-500 transition"
                >
                    Sign Up
                </Link>
                <Link
                    to="/login"
                    className="px-4 py-2 text-black bg-lightBlue rounded-3xl hover:bg-blue-500 transition"
                >
                    Login
                </Link>
            </div>
        </nav>
    );
};

export default NavigationBar;

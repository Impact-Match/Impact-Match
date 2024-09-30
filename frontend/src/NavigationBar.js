import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import icon from './assets/ImpactMatchLogo_Transparent.png';
import collapseIcon from './assets/hamburger-menu.png';

const NavigationBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-darkBlue h-24 flex items-center justify-between px-5 md:px-10 shadow-md">
            {/* Left Section: Logo */}
            <div className="flex items-center space-x-2">
                <img src={icon} alt="Impact Match Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0" />
                <span className="hidden lg:block text-white text-lg font-semibold whitespace-nowrap">Impact Match</span> {/* Hide at lg or higher */}
            </div>

            {/* Middle Section: Navigation Links */}
            <div className="hidden md:flex border-2 border-white rounded-full px-6 py-2 md:px-12 md:py-3">
                <ul className="flex space-x-4 md:space-x-10 lg:space-x-20">
                    <li>
                        <Link to="/" className="text-white text-xs md:text-sm lg:text-base hover:text-blue-300">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-white text-xs md:text-sm lg:text-base hover:text-blue-300">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="text-white text-xs md:text-sm lg:text-base hover:text-blue-300">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="text-white text-xs md:text-sm lg:text-base hover:text-blue-300">
                            Profile
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Right Section: Sign Up / Login */}
            <div className="hidden md:flex space-x-3 md:space-x-4">
                <Link
                    to="/signup"
                    className="px-3 py-1 text-xs md:text-sm lg:text-base text-black bg-lightBlue rounded-full hover:bg-blue-500 transition whitespace-nowrap flex items-center"
                >
                    Sign Up
                </Link>
                <Link
                    to="/login"
                    className="px-3 py-1 text-xs md:text-sm lg:text-base text-black bg-lightBlue rounded-full hover:bg-blue-500 transition whitespace-nowrap flex items-center"
                >
                    Login
                </Link>
            </div>

            <div className="md:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
                    <img src={collapseIcon} alt="Menu" className="w-8 h-8" />
                </button>
            </div>

            {menuOpen && (
                <div className="absolute top-24 left-0 w-full bg-darkBlue z-10 flex flex-col items-center md:hidden">
                    <ul className="flex flex-col space-y-4 py-6">
                        <li>
                            <Link to="/" className="text-white text-lg hover:text-blue-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-white text-lg hover:text-blue-300">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="text-white text-lg hover:text-blue-300">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="text-white text-lg hover:text-blue-300">
                                Profile
                            </Link>
                        </li>
                        <li className="flex space-x-4">
                            <Link
                                to="/signup"
                                className="px-4 py-1 text-sm text-black bg-lightBlue rounded-full hover:bg-blue-500 transition whitespace-nowrap flex items-center"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="px-4 py-1 text-sm text-black bg-lightBlue rounded-full hover:bg-blue-500 transition whitespace-nowrap flex items-center"
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default NavigationBar;

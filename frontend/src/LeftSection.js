import React from 'react';
import icon from './assets/ImpactMatchLogo_Transparent.png';

const LeftSection = () => {
    return (
        <div className="w-full md:w-1/3 bg-darkBlue text-white p-10 flex flex-col justify-center items-center min-h-screen"> {/* min-h-screen 确保左侧内容全屏高度 */}
            <img src={icon} alt="Impact Match Logo" className="w-32 h-32 mb-4" />
            <h1 className="text-3xl font-inter">Impact Match</h1>
        </div>
    );
};

export default LeftSection;
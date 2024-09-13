import useAuth from "app/hooks/useAuth";
import React, { useEffect } from 'react';
import axios from 'axios';

const ProfilePhoto = ({ style, name = null}) => {
    const { user } = useAuth();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [imageUrl, setImageUrl] = React.useState('');

    useEffect(() => {
        const influencerName = name || (user && user.influencer_name);
        if (influencerName) {
            async function fetchImage() {
                try {
                    const response = await axios.get(`${BASE_URL}/get_profile_photo/${influencerName}`, { responseType: 'blob' });
                    setImageUrl(URL.createObjectURL(new Blob([response.data])));
                } catch (error) {
                    setImageUrl('/assets/images/illustrations/user.png')
                    console.error("Error fetching image:", error);
                }
            }
            fetchImage();
        }
    }, [user]);

    return (
        <img
            src={imageUrl}
            alt="User Profile"
            style={{ ...style, objectFit: 'cover' }} // Ensures the image fits within the frame without distortion
        />
    );
};
export default ProfilePhoto;
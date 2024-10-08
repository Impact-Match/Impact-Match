import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VerifySuccess from './VerifySuccess';
import ExpiredLink from './ExpiredLink';
import { backend } from './services/service';

const VerifyResult = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
    const [isVerified, setIsVerified] = useState(null); 
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get( backend + `/auth/verify-email?token=${token}`);
                if (response.status === 200) {
                    setIsVerified(true); 
                }
            } catch (error) {
                setIsVerified(false); 
                if (error.response && error.response.data && error.response.data.error) {
                    setErrorMessage(error.response.data.error);
                } else {
                    setErrorMessage('Link expired or invalid.');
                }
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setIsVerified(false);
            setErrorMessage('No token found.');
        }
    }, [token]);

    if (isVerified === null) { // or we can have a loading here
        return null; 
    }

    if (isVerified) {
        return <VerifySuccess />;
    } else {
        return <ExpiredLink message={errorMessage} />;
    }
};

export default VerifyResult;

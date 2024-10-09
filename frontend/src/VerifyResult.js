import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VerifySuccess from './VerifySuccess';
import ExpiredLink from './ExpiredLink';
import { backend } from './services/service';

const VerifyResult = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
    const [isVerified, setIsVerified] = useState(null); // student, ngo user 
    const [errorMessage, setErrorMessage] = useState('');
    const [isNgoVerified, setIsNgoVerified] = useState(false); // admin
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(backend + `/auth/verify-email?token=${token}`);
                if (response.status === 200) {
                    setIsVerified(true); 
                    const userRole = response.data.role;
                    const isNgoRequired = response.data.isNgoRequired;
                    if (userRole === 'ngo' && isNgoRequired) {
                        const ngoResponse = await axios.get(backend + `/auth/verify-ngo?token=${token}`);
                        const isAdmin = ngoResponse.data.isAdmin;
                        if (ngoResponse.status === 200) {
                            if (isAdmin) {
                                setIsNgoVerified(true);
                                setIsAdmin(true);
                                console.log("NGO Verification Successful");
                            }
                        }
                    }
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
        return <VerifySuccess isNgoVerified={isNgoVerified} isAdmin={isAdmin} />;
    } else {
        return <ExpiredLink message={errorMessage} />;
    }
};

export default VerifyResult;

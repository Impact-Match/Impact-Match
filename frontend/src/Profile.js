import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you are using axios for API calls
import { backend } from './services/service'; // Assuming you have a service to manage backend URLs
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation

const Profile = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // To track authentication status
  const navigate = useNavigate(); // To redirect user to login page

  useEffect(() => {
    // Fetch name from backend API when the component mounts
    const fetchName = async () => {
      try {
        const response = await axios.get(backend + '/profile/user', { withCredentials: true });
        setName(response.data.name); // Assuming the response has a 'name' field
      } catch (error) {
        console.error('Error fetching name:', error);
        
        // If there is an authentication error, set isAuthenticated to false
        setIsAuthenticated(false);
        
      }
    };

    fetchName();
  }, []);

  // If not authenticated, prompt the user to login
  if (!isAuthenticated) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hi, {name}</h1>
    </div>
  );
};

export default Profile;


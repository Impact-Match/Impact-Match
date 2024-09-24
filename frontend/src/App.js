import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Signup';
import NavigationBar from './NavigationBar';
import Login from './Login';
import ForgetPassword from './ForgetPassword';
import ExpiredLink from './ExpiredLink';
import ResetPassword from './ResetPassword';
import NotFound from './NotFound';
import EmailVerification from './EmailVerification';
import VerifySuccess from './VerifySuccess';

function App() {
  return (
    // only for demo signup page, we can change it later
    <Router>
      <div className="App">

        <NavigationBar />
      
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/expire-link" element={<ExpiredLink />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

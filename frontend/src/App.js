import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Signup';

function App() {
  return (
    // only for demo signup page, we can change it later
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/signup">
            <button className="py-2 px-4 bg-blue-500 text-white rounded-lg">
              Sign Up
            </button>
          </Link>
        </header>
        <Routes>
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

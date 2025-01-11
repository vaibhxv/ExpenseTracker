import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import { Dashboard } from './pages/dashboard';
import { Navbar } from './components/navbar';
import LandingPage from './pages/landingpage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {<Navbar token={token} setToken={setToken} />}
        <Routes>
          <Route
            path="/signup"
            element={!token ? <Signup /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/login"
            element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<LandingPage/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
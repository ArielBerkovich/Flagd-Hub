import React, { useState } from 'react';
import LoginRequest from '../../models/LoginRequest';
import FeatureFlagsService from '../../services/feature-flags-service';
import './login.css';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const loginRequest: LoginRequest = {
        username,
        password,
      };
      const response = await FeatureFlagsService.login(loginRequest);
      const token: string = response.token;
      localStorage.setItem('flagd-hub-token', token);
      onLoginSuccess(token);
    } catch (error) {
      setError('Invalid');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="./flagd-hub-logo.png" alt="FlagD Hub Logo" className="login-logo" />
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="error-container">
          <p className={`error-message ${!error ? 'hidden' : ''}`}>{error}</p>
        </div>
      </div>
    </div>
  );
  
};

export default Login;

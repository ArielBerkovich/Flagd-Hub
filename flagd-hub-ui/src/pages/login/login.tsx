import React, { useState } from 'react';
import { LoginRequest } from '../../models';
import * as featureFlagsService from '../../services/feature-flags.service';
import { STORAGE_KEYS } from '../../constants/storage.constants';
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
      const response = await featureFlagsService.login(loginRequest);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      onLoginSuccess(response.token);
    } catch (error: any) {
      const errorMessage = error.response?.status === 401
        ? 'Invalid username or password'
        : 'Login failed. Please try again.';
      setError(errorMessage);
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

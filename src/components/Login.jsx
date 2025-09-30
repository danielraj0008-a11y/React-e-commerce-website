import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5003/api/login', { email, password });
      localStorage.setItem('token', res.data.token); // Save JWT to localStorage
      navigate('/'); // Redirect to home
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minBlockSize: '80vh' }}>
      <div className="card p-4 shadow" style={{ maxInlineSize: '400px', inlineSize: '100%' }}>
        <h3 className="text-center mb-4">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

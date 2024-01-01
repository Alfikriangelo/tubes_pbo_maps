// Login.js
import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import Button from '@mui/material/Button';
import './Login.css';

import user_icon from '../Components/Assets/person.png';
import password_icon from '../Components/Assets/password.png';

const Login = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = { name: 'admin', password: 'admin' };

    // Bandingkan data dengan input pengguna
    if (user && user.name === name && user.password === password) {
      console.log('Login berhasil', user);
      setError(null);
      login();
      navigate('/maps');
    } else {
      console.error('Login gagal');
      setError('Login gagal. Periksa kembali nama pengguna dan kata sandi.');
    }
  };

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Login</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <img src={user_icon} alt='' />
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='input'>
          <img src={password_icon} alt='' />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className='submit-container'>
        <Button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '220px',
            height: '59px',
            color: '#fff',
            background: '#4c00b4',
            borderRadius: '50px',
            fontSize: '19px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
          variant='contained'
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
      {error && <div className='error-message'>{error}</div>}
    </div>
  );
};

export default Login;

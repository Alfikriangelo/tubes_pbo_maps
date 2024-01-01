import React, { useState } from 'react'
import Button from '@mui/material/Button';
import './Login.css'

import user_icon from '../Components/Assets/person.png'
import email_icon from '../Components/Assets/email.png'
import password_icon from '../Components/Assets/password.png'

const Login = () => {

  const [action, setAction] = useState("Sign Up");

  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>
          {action}
        </div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        {action === 'Login' ? null : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder='Name' />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder='Email' />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder='Password' />
        </div>
      </div>
      {action==='Sign Up'? null :<div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
      </div>
      <Button variant="contained" href='/maps'>Maps</Button>
    </div>
  )
}

export default Login
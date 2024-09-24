import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {

  const  Navigate=new useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, { username, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      
      
      // Navigate('/dashboard');
      toast.success(response.data.message,{autoClose: 1200});

      setTimeout(() => {
        Navigate('/dashboard');
      }, 1800); 
      
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data && error.response.data.message ? error.response.data.message : 'Server Error';
        toast.error(errMessage,{autoClose: 2000});
      } else if (error.request) {
        console.error(error.request);  
        alert('No response received from the server. Please try again.',{autoClose: 2000});
      } else {
        console.error('Error', error.message);
        alert('An unexpected error occurred: ' + error.message,{autoClose: 2000});
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
   <div style={{position:"absolute", zIndex:10010 }}>
   <ToastContainer />
   </div>
      
    </div>
  );
};

export default Login;

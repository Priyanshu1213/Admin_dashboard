import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signup = () => {

  const  Navigate=new useNavigate()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    var response={};
    try {
      response =await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/signup`, { username, password });
      toast.success(response.data.message,{autoClose: 1200});
      // Navigate('/');
      setTimeout(() => {
        Navigate('/');
      }, 1800);
    } catch (error) {
      if (error.response) {
        const errMessage = error.response.data && error.response.data.message ? error.response.data.message : 'Server Error';
        toast.error(errMessage,{autoClose: 2000});
      } else if (error.request) {
        console.error(error.request); 
        toast.error('No response received from the server. Please try again.',{autoClose: 2000});
      } else {
        console.error('Error', error.message);
        toast.error('An unexpected error occurred: ' + error.message,{autoClose: 2000});
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <div style={{position:"absolute", zIndex:10010 }}>
   <ToastContainer />
   </div>
    </div>
  );
};

export default Signup;

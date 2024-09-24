
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Navbar = () => {
  const navigate = useNavigate();
  

  useEffect(() => {
  const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token); 
      const currentTime = Date.now() / 1000; 

      if (decodedToken.exp < currentTime) {
        
        localStorage.removeItem('token'); 
        
        navigate("/"); 
      } 
    }
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    toast.success('You are Logout',{autoClose: 1200}) ; 
    // navigate("/"); 
    setTimeout(() => {
      navigate('/');
    }, 1800);
       
  };

  return (
    <>
    <nav>
      <ul>
        <li style={{ color: "#fff" }}>LOGO</li>

        {(localStorage.getItem('token')) ? (
          <li>
            <li><Link to="/dashboard">Home</Link></li>
             <li><Link to="/employees">EmployeeList</Link></li>
             <li style={{ color: "#FFA500" }}>{(localStorage.getItem('username'))}</li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <li><Link to="/">Login</Link></li>
            
          </li>
        )}
      </ul>
      
    </nav>
    <div style={{position:"absolute", zIndex:10010 }}>
   <ToastContainer />
   </div>
    </>
  );
};

export default Navbar;

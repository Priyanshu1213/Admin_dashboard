import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateEmployee = () => {

  const  Navigate=new useNavigate()

  const username=localStorage.getItem('username');

  const [employeeData, setEmployeeData] = useState({ username:username, name: '', email: '', mobile: '', designation: '', gender: '', course: [] });
  const [image, setImage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const newCourse = checked ? [...employeeData.course, value]: employeeData.course.filter((course) => course !== value);
      setEmployeeData({ ...employeeData, course: newCourse });
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // console.log(token)

    const formData = new FormData();
      formData.append('image', image);
      Object.keys(employeeData).forEach((key) => {
        if(key==="course"){
          employeeData[key].forEach((course2) => {
            formData.append('course', course2); 
          });
          
        }else {
          formData.append(key, employeeData[key]);
        }
      
    });
  
  
    var response={}
    try {
     response= await axios.post(`${process.env.REACT_APP_BASE_URL}/api/employees`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
     
      toast.success(response.data.message,{autoClose: 1200})//;
      // Navigate('/employees');
      setTimeout(() => {
        Navigate('/employees');
      }, 1800);

    } catch (error) {
     
      if (error.response) {
        const errMessage = error.response.data && error.response.data.message ? error.response.data.message : 'Server Error';
        toast.error(errMessage,{autoClose: 2000});
      } else if (error.request) {
        console.error(error.request); 
        toast.error('No response received from the server. Please try again.',{autoClose: 2000});
      } else {
        // console.error('Error', error.message);
        toast.error('An unexpected error occurred: ' + error.message,{autoClose: 2000});
      }
    }
  };

  return (
    <div>
     
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile" onChange={handleChange} required />
        <select name="designation" onChange={handleChange} required>
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        
        <div className="checkbox-group">

        <input type="checkbox" name="course" value="MCA" onChange={handleChange} /> MCA
        <input type="checkbox" name="course" value="BCA" onChange={handleChange} /> BCA
        <input type="checkbox" name="course" value="BSC" onChange={handleChange} /> BSC
        </div>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Create</button>
      </form>
      <div style={{position:"absolute", zIndex:10010 }}>
   <ToastContainer />
   </div>
    </div>
  );
};

export default CreateEmployee;

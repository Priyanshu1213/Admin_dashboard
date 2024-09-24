import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [],
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeData(response.data);
      setCurrentImage(response.data.image || '');
    };

    fetchEmployee();
  }, [id]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
 
    if (type === 'checkbox') {
      const newCourse = checked ? [...employeeData.course, value] : employeeData.course.filter((course) => course !== value);
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
var response={};

    try {
      response=await axios.put(`${process.env.REACT_APP_BASE_URL}/api/employees/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
     
      toast.success(response.data.message,{autoClose: 1200});
      // navigate('/employees' );

      setTimeout(() => {
        navigate('/employees');
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
        toast.error('An unexpected error occurred: ' + error.message ,{autoClose: 2000});
      }
    }
  };

  return (
    <div>
     
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={employeeData.name} onChange={handleChange} required />
        <input name="email" value={employeeData.email} onChange={handleChange} required />
        <input name="mobile" value={employeeData.mobile} onChange={handleChange} required />
        <select name="designation" value={employeeData.designation} onChange={handleChange} required>
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        <select name="gender" value={employeeData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <div className="checkbox-group">
        <input type="checkbox" name="course" value="MCA" checked={employeeData.course.includes('MCA')} onChange={handleChange} /> MCA
        <input type="checkbox" name="course" value="BCA" checked={employeeData.course.includes('BCA')} onChange={handleChange} /> BCA
        <input type="checkbox" name="course" value="BSC" checked={employeeData.course.includes('BSC')} onChange={handleChange} /> BSC
        </div>
        {currentImage && (
          <div>
            <img src={`${process.env.REACT_APP_BASE_URL}/${currentImage}`} alt="Current Employee" style={{ width: '50px', height: '50px',borderRadius:'10px' }} />
            
          </div>
        )}
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Update</button>
      </form>
      <div style={{position:"absolute", zIndex:10010 }}>
   <ToastContainer />
   </div>
    </div>
  );
};

export default EditEmployee;

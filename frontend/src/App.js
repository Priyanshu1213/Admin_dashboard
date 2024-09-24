import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Login from './components/Login';
import Signup from './components/Signup';
import EmployeeList from './components/EmployeeList';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />
    <Routes>
      <Route path="/" exact element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/employees" exact element={<EmployeeList/>} />
      <Route path="/employees/create" element={<CreateEmployee/>} />
      <Route path="/employees/edit/:id" element={<EditEmployee/>} />
    </Routes>
    </Router>
  );
}

export default App;

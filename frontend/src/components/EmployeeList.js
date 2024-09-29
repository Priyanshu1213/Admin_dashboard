
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalemp, setTotalemp] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const username=localStorage.getItem('username');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            username:username,
            page: currentPage,
            search: searchTerm,
            sortField,
            sortOrder,

          },
        });
        setEmployees(response.data.employees || []); 
        setTotalPages(response.data.totalPages || 1);
      setTotalemp(response.data.totalEmployees)
        setLoading(false);

      } catch (error) {
        toast.error("Error fetching employees:", error,{autoClose: 2000});
        setEmployees([]); 
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage, searchTerm, sortField, sortOrder]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const response=await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEmployees(employees.filter(employee => employee._id !== id));
    setTotalemp(totalemp-1)
    toast.success(response.data.message,{autoClose: 2000})
  };

  
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <h2 style={{alignItems:"center",marginTop:"10px"}}>Loading...</h2>;
  }

  return (
    <div className='editemployee'>
      <h3>Employee List</h3>
      <div className='createmp'>
        <h4>Total Employees : {totalemp}</h4>
      <input
        type="search"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearch}
      />
     <button><Link to="/employees/create">Create Employee</Link></button>
      </div>

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table>
          <thead>
            <tr>
            <th>Id </th>
              <th>Image</th>
              <th onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('email')}>Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th onClick={() => handleSort('createdAt')}>Create Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp ,index)=> (
              <tr key={emp._id}>
                <td >{index+1}</td>
                <td><img src={`${process.env.REACT_APP_BASE_URL}/${emp.image}`} alt={emp.name} style={{ width: '50px' }} /></td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.designation}</td>
                <td>{emp.gender}</td>
                <td>{emp.course.join(', ')}</td>
                <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                <td>
                  <button><Link to={`/employees/edit/${emp._id}`}>Edit</Link></button>
                  <button style={{backgroundColor: "red",}} onClick={() => handleDelete(emp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

<div className="paging">
 
  <button 
    onClick={() => handlePageChange(currentPage - 1)} 
    disabled={currentPage === 1} 
  >
    &laquo; Previous
  </button>


  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => handlePageChange(index + 1)}
      className={index + 1 === currentPage ? 'active' : ''}
    >
      {index + 1}
    </button>
  ))}

 
  <button 
    onClick={() => handlePageChange(currentPage + 1)} 
    disabled={currentPage === totalPages} 
  >
    Next &raquo;
  </button>
</div>

<div style={{position:"absolute", zIndex:10010 }}>
   <ToastContainer />
   </div>

    </div>
  );
};

export default EmployeeList;

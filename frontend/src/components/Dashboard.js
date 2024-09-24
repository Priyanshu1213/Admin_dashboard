import React from 'react';
import { ToastContainer } from 'react-toastify';

export default function Dashboard() {
  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '2rem',
      animation: 'fadeIn 1s ease-in-out',
    },
    heading: {
      fontSize: '2.5rem',
      color: '#333',
      fontWeight: 'bold',
    },
    welcomeText: {
      fontSize: '1.5rem',
      color: '#666',
      marginTop: '1rem',
      animation: 'fadeInUp 1.5s ease-in-out',
    },
  };

  return (
    <>
      
      <div style={styles.container}>
        <h1 style={styles.heading}>Dashboard</h1>
        <div style={styles.welcomeText}>Welcome Admin Panel</div>
        <ToastContainer />
      </div>
    </>
  );
}


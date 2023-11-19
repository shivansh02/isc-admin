'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated import statement
import NavSignUp from 'components/NavSignUp.jsx';
import styles from './page.module.css';
import img from 'public/landing.png';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [username, setUsername] = useState(null);

  const styling = {
    background: '#FEF7ED',
    height: '100vh',
    backgroundImage: `url(${img.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: '-1',
  };

  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove the login logic

    // Redirect to the "/bookings" page
    router.push('/bookings');
  };

  return (
    <div style={styling}>
      <div className='py-8'>
        <NavSignUp />
      </div>

      <div className='flex items-center justify-center mt-28'>
        <div className={`border rounded p-8 bg-white ${styles.mainClass}`}>
          <h2 className='text-4xl text-center font-semibold mt-12 mb-12 text-emerald-900'>Login</h2>
          {username && <p className='text-emerald-500'>Hi, {username}</p>}
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <input
              placeholder='Email'
              name='email'
              onChange={handleChange}
              className='mb-4 p-3 border border-gray-300 rounded-md w-64'
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleChange}
              className='mb-4 p-3 border border-gray-300 rounded-md w-64'
            />
            <button
              type='submit'
              className='bg-emerald-500 text-white p-3 rounded-md hover:bg-emerald-600 w-64'
            >
              Login
            </button>
            {/* Remove the Sign Out button */}
          </form>
        </div>
      </div>
    </div>
  );
}

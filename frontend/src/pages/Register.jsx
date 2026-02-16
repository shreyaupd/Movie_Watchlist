import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const Register = () => {
  const [email, setEmail]= useState("");
  const[name, setName]= useState("");
  const [password, setPassword]= useState("");
  const[loading, setLoading]= useState(false);
  const [error, setError]= useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const handelSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    setLoading(true);
    try{
      await register(name, email, password);
      navigate('/login'); // Redirect to login after successful registration
    }
    catch(err){
      setError(err.response?.data?.message || 'Registration failed');
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-400'>
         <div className='bg-gray-500 p-8 rounded-lg shadow-lg w-full max-w-md'>
         <h1 className='font-bold text-white text-3xl'>Register</h1>
          {error && (
            <div className='text-red-500 mb-4'>{error}</div>
          )}
         <form onSubmit={handelSubmit}>
             <div className='my-4'>
              <label htmlFor="name" className='text-white'>Name</label>
              <input 
              type="text"
              id='name'
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded'/>
             </div>
              <div className='mb-4'> 
              <label htmlFor="email" className='text-white'>Email</label>
              <input 
              type="email"
              id='email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded'/>
              </div>
              <div className='mb-4'>
              <label htmlFor="password" className='text-white'>Password</label>
              <input 
              type="password"
              id='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded'/>
              </div>
              <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed' disabled={loading}>
                  {loading? 'Registering...':'Register'}
              </button>

         </form>
    </div>
  </div>
  )
}

export default Register
//if error is occured then 
//1. show the error message if registration fails.
// 2.you have to disable the register button.
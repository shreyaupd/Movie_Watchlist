import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const Login = () => {
  const [email, setEmail]= useState("")
  const [password, setPassword]= useState("")
  const[loading, setLoading]= useState(false)
  const [error, setError]= useState("")
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");
    setLoading(true);
    try{
      await login(email, password);
    }
    catch(err){
      setError(err.response?.data?.message || 'Login failed');
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-400'>
      <div className='bg-gray-500 p-8 rounded-lg shadow-lg w-full max-w-md'>
         <h1 className='font-bold text-white text-3xl'>Login</h1>
            {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4">
                        {error}
                    </div>
                )}
         <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label htmlFor="email" className='text-white'> Email </label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded border bg-white border-gray-300"
              />
          
          </div>
          <div className="mb-4">
            <label htmlFor="password" className='text-white'> Password </label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full  bg-white p-2 rounded border border-gray-300"
              />
          
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {loading ? 'Logging in...' : 'Login'}
          </button>
         </form>
         <p className="text-white text-center mt-4">Don't have an account? <Link to="/register" className='text-white hover:underline'>Register</Link></p>
      </div>

    </div>
  )
}

export default Login
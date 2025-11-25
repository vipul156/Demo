import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>
        <input 
          className="block w-full p-2 mb-2 border" 
          placeholder="Email" 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          className="block w-full p-2 mb-4 border" 
          type="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Sign In</button>
      </form>
    </div>
  );
}
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <p className="mt-2 text-gray-600">You are securely logged in.</p>
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold">Your Data:</h3>
        <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
      </div>
      <button 
        onClick={logout} 
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  // Check if user is logged in (simple check for now, ideally use context)
  // Since we use httpOnly cookies, we can't check the cookie directly.
  // We'll rely on the API or local state. For now, let's assume if we are on dashboard we are logged in.
  // Or better, we can check if we have user info in localStorage (if we saved it there on login)
  
  const userInfo = localStorage.getItem('userInfo');

  const logoutHandler = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Scalable App
        </Link>
        <nav>
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {JSON.parse(userInfo).name}</span>
              <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

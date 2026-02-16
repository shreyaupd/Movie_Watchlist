import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="h-screen flex justify-center items-center">Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
      return children;
};

const App = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} /> //replace is used to prevent going back to login page after successful login
            <Route path="/register" element={user ? <Navigate to="/login" replace /> : <Register />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default App

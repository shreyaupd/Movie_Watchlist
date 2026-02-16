import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navbar */}
            <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold text-white">🎬 Movie Watchlist</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300">Welcome, {user?.name || user?.email}</span>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6">Your Watchlist</h2>
                    
                    {/* Empty State */}
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <p className="text-gray-400 text-lg mb-4">Your watchlist is empty</p>
                        <p className="text-gray-500">Start adding movies to keep track of what you want to watch!</p>
                    </div>

                    {/* TODO: Add movie search and watchlist display here */}
                </div>
            </main>
        </div>
    );
};

export default Home;

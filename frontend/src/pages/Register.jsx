import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4 text-[var(--text)]">
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[var(--accent)] blur-3xl" />
                <div className="absolute right-[-140px] bottom-16 h-80 w-80 rounded-full bg-[var(--accent-2)] blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[var(--panel)] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Create Account</p>
                <h1 className="mt-2 text-4xl font-black">Register</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">Start your personal movie tracking journey.</p>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm text-[var(--muted)]">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-base w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm text-[var(--muted)]">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-base w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm text-[var(--muted)]">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-base w-full"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[var(--accent)] py-2.5 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[var(--muted)]">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

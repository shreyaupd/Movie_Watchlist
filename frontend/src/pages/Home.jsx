import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Movie from './Movie';
import Watchlist from './Watchlist';

const Home = () => {
    const { user, logout } = useAuth();
    const { hash } = useLocation();
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

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        if (!hash) return;
        const id = hash.replace('#', '');
        requestAnimationFrame(() => scrollToSection(id));
    }, [hash]);

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
            <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[var(--accent)] blur-3xl" />
                <div className="absolute -right-24 top-56 h-80 w-80 rounded-full bg-[var(--accent-2)] blur-3xl" />
            </div>

            <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-lg">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="font-display text-2xl tracking-[0.16em] text-[var(--text)]">
                        CINELOG
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/#movies"
                            onClick={() => scrollToSection('movies')}
                            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
                        >
                            Movies
                        </Link>
                        <Link
                            to="/#watchlist"
                            onClick={() => scrollToSection('watchlist')}
                            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
                        >
                            Watchlist
                        </Link>
                        <span className="hidden rounded-full bg-white/5 px-3 py-2 text-xs text-[var(--muted)] sm:inline">
                            {user?.name || user?.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="rounded-full bg-[var(--danger)] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 px-6 py-8">
                <div className="mx-auto max-w-6xl space-y-10">
                    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(120deg,rgba(13,17,23,0.85),rgba(9,12,20,0.75))] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] md:p-12">
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">Movie Command Center</p>
                        <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                            Build your watchlist like a film curator.
                        </h2>
                        <p className="mt-4 max-w-2xl text-[var(--muted)]">
                            Add titles with posters, maintain your library, and manage watch status from a single dashboard.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/#movies"
                                onClick={() => scrollToSection('movies')}
                                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                            >
                                Explore Movies
                            </Link>
                            <Link
                                to="/#watchlist"
                                onClick={() => scrollToSection('watchlist')}
                                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            >
                                Open Watchlist
                            </Link>
                        </div>
                    </section>

                    <section id="movies">
                        <Movie />
                    </section>

                    <section id="watchlist">
                        <Watchlist />
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Home;

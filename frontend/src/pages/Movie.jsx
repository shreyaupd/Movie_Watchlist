import { useEffect, useState } from 'react';
import { addMovie, getAllMovies, deleteMovie } from '../services/movies';

const initialForm = {
    title: '',
    description: '',
    releaseDate: '',
    runTime: '',
    genere: '',
    posterUrl: ''
};

const Movie = () => {
    const [movies, setMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [deletingMovieId, setDeletingMovieId] = useState(null);
    const [submittingMovie, setSubmittingMovie] = useState(false);
    const [showAddMovie, setShowAddMovie] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loadMovies = async () => {
        setLoadingMovies(true);
        setError('');
        try {
            const response = await getAllMovies();
            setMovies(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load movies');
        } finally {
            setLoadingMovies(false);
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateMovie = async (e) => {
        e.preventDefault();
        setSubmittingMovie(true);
        setError('');
        setSuccess('');

        try {
            await addMovie(
                form.title,
                form.description || undefined,
                form.releaseDate,
                form.genere ? form.genere.split(',').map((g) => g.trim()).filter(Boolean) : [],
                form.posterUrl || undefined,
                Number(form.runTime)
            );

            setForm(initialForm);
            setShowAddMovie(false);
            setSuccess('Movie created successfully');
            await loadMovies();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create movie');
        } finally {
            setSubmittingMovie(false);
        }
    };

    const handleRequestAddToWatchlist = (movieId) => {
        setError('');
        setSuccess('');
        window.dispatchEvent(new CustomEvent('watchlist:add-request', { detail: { movieId } }));
        setSuccess('Sent to watchlist');
    };

    const handleDeleteMovie = async (id) => {
        setDeletingMovieId(id);
        setError('');
        setSuccess('');
        try {
            await deleteMovie(id);
            setSuccess('Movie deleted successfully');
            setMovies((prev) => prev.filter((movie) => movie.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete movie');
        } finally {
            setDeletingMovieId(null);
        }
    };

    return (
        <section className="space-y-6 rounded-3xl border border-white/10 bg-[var(--panel)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Catalog</p>
                    <h3 className="mt-1 text-3xl font-bold">Known Movies</h3>
                </div>
                <button
                    onClick={() => setShowAddMovie((prev) => !prev)}
                    className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
                >
                    {showAddMovie ? 'Close' : 'Add Movies'}
                </button>
            </div>

            {showAddMovie && (
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                    <form onSubmit={handleCreateMovie} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input-base" required />
                        <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="input-base" required />
                        <input type="number" name="runTime" placeholder="Run time (minutes)" min="1" value={form.runTime} onChange={handleChange} className="input-base" required />
                        <input type="text" name="genere" placeholder="Genres (comma separated)" value={form.genere} onChange={handleChange} className="input-base" />
                        <input type="text" name="posterUrl" placeholder="Poster URL" value={form.posterUrl} onChange={handleChange} className="input-base md:col-span-2" />
                        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} className="input-base md:col-span-2" />
                        <button type="submit" disabled={submittingMovie} className="rounded-xl bg-[var(--accent-2)] py-2.5 font-semibold text-black transition hover:brightness-110 disabled:opacity-50 md:col-span-2">
                            {submittingMovie ? 'Creating...' : 'Create Movie'}
                        </button>
                    </form>
                </div>
            )}

            {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-red-300">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-300">{success}</p>}

            {loadingMovies ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-[var(--muted)]">Loading movies...</div>
            ) : movies.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-[var(--muted)]">No movies available yet.</div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {movies.map((movie) => (
                        <article key={movie.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-lg transition hover:-translate-y-1 hover:border-[var(--accent)]/60">
                            {movie.posterUrl ? (
                                <img
                                    src={movie.posterUrl}
                                    alt={`${movie.title} poster`}
                                    className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="flex h-72 w-full items-center justify-center bg-black/30 text-[var(--muted)]">No poster</div>
                            )}

                            <div className="space-y-2 p-4">
                                <h4 className="line-clamp-1 text-lg font-semibold">{movie.title}</h4>
                                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                    {new Date(movie.releaseDate).toLocaleDateString()} | {movie.runTime} min
                                </p>
                                {movie.description && <p className="line-clamp-3 text-sm text-[var(--muted)]">{movie.description}</p>}
                                {Array.isArray(movie.genere) && movie.genere.length > 0 && (
                                    <p className="text-sm text-[var(--accent)]">{movie.genere.join(', ')}</p>
                                )}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleRequestAddToWatchlist(movie.id)}
                                        className="rounded-xl bg-[var(--accent)] py-2 text-sm font-semibold text-black transition hover:brightness-110"
                                    >
                                        Watchlist
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMovie(movie.id)}
                                        disabled={deletingMovieId === movie.id}
                                        className="rounded-xl bg-[var(--danger)] py-2 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50"
                                    >
                                        {deletingMovieId === movie.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Movie;

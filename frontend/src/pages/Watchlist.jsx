import { useEffect, useState } from 'react';
import { addToWatchlist, deleteFromWatchlist, getWatchlist, updateWatchlist } from '../services/watchlist';

const STATUS_OPTIONS = ['PLANNED', 'WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED'];

const Watchlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ review: '', rating: '', status: 'PLANNED' });
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const loadWatchlist = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getWatchlist();
            setItems(Array.isArray(response.data?.data) ? response.data.data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load watchlist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWatchlist();

        const onChanged = () => loadWatchlist();

        const onAddRequest = async (event) => {
            const movieId = event?.detail?.movieId;
            if (!movieId) return;

            setError('');
            setSuccess('');
            try {
                await addToWatchlist(movieId);
                setSuccess('Movie added to watchlist');
                await loadWatchlist();
            } catch (err) {
                setError(err.response?.data?.message || err.response?.data?.error || 'Failed to add movie to watchlist');
            }
        };

        window.addEventListener('watchlist:changed', onChanged);
        window.addEventListener('watchlist:add-request', onAddRequest);

        return () => {
            window.removeEventListener('watchlist:changed', onChanged);
            window.removeEventListener('watchlist:add-request', onAddRequest);
        };
    }, []);

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditForm({ review: item.review || '', rating: item.rating ?? '', status: item.status || 'PLANNED' });
        setError('');
        setSuccess('');
    };

    const handleUpdate = async (item) => {
        setUpdatingId(item.id);
        setError('');
        setSuccess('');
        try {
            await updateWatchlist(
                item.movieId,
                editForm.review || undefined,
                editForm.rating === '' ? undefined : Number(editForm.rating),
                editForm.status
            );

            setItems((prev) =>
                prev.map((entry) =>
                    entry.id === item.id
                        ? {
                              ...entry,
                              review: editForm.review || null,
                              rating: editForm.rating === '' ? null : Number(editForm.rating),
                              status: editForm.status
                          }
                        : entry
                )
            );

            setEditingId(null);
            setSuccess('Watchlist item updated');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update watchlist item');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (item) => {
        setDeletingId(item.id);
        setError('');
        setSuccess('');
        try {
            await deleteFromWatchlist(item.movieId);
            setItems((prev) => prev.filter((entry) => entry.id !== item.id));
            setSuccess('Removed from watchlist');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to delete watchlist item');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section className="space-y-6 rounded-3xl border border-white/10 bg-[var(--panel)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:p-8">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Collection</p>
                <h3 className="mt-1 text-3xl font-bold">My Watchlist</h3>
            </div>

            {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-red-300">{error}</p>}
            {success && <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-300">{success}</p>}

            {loading ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-[var(--muted)]">Loading watchlist...</div>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-[var(--muted)]">Your watchlist is empty.</div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-lg">
                            {item.movie?.posterUrl ? (
                                <img src={item.movie.posterUrl} alt={`${item.movie.title} poster`} className="h-64 w-full object-cover" />
                            ) : (
                                <div className="flex h-64 w-full items-center justify-center bg-black/30 text-[var(--muted)]">No poster</div>
                            )}

                            <div className="space-y-2 p-4">
                                <h4 className="line-clamp-1 text-lg font-semibold">{item.movie?.title}</h4>
                                <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Status: {item.status}</p>
                                <p className="text-sm text-[var(--muted)]">Rating: {item.rating ?? '-'}</p>
                                {item.review && <p className="line-clamp-3 text-sm text-[var(--muted)]">{item.review}</p>}

                                {editingId === item.id ? (
                                    <div className="mt-3 space-y-2">
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                                            className="input-base"
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="Rating (1-10)"
                                            value={editForm.rating}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, rating: e.target.value }))}
                                            className="input-base"
                                        />
                                        <textarea
                                            rows={2}
                                            placeholder="Review"
                                            value={editForm.review}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, review: e.target.value }))}
                                            className="input-base"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleUpdate(item)}
                                                disabled={updatingId === item.id}
                                                className="rounded-xl bg-[var(--accent)] py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
                                            >
                                                {updatingId === item.id ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="rounded-xl border border-white/30 py-2 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="rounded-xl bg-[var(--accent)] py-2 text-sm font-semibold text-black transition hover:brightness-110"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            disabled={deletingId === item.id}
                                            className="rounded-xl bg-[var(--danger)] py-2 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50"
                                        >
                                            {deletingId === item.id ? 'Removing...' : 'Remove'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Watchlist;

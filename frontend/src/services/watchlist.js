import { api } from "../utils/axios";

export const addToWatchlist = (movieId) =>
    api.post("/watchlist", { movieId });

export const updateWatchlist = (movieId, review, rating, status) =>
    api.put("/watchlist", { movieId, review, rating, status });

export const deleteFromWatchlist = (movieId) =>
    api.delete("/watchlist", {
        data: { movieId }
    });

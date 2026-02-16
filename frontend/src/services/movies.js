import { api } from "../utils/axios";

export const getAllMovies = () =>
    api.get("/movies");

export const addMovie = (title, description, releaseDate, genere, posterUrl, runTime) =>
    api.post("/movies/add", { title, description, releaseDate, genere, posterUrl, runTime });

export const getMovieById = (id) =>
    api.get(`/movies/${id}`);

export const deleteMovie = (id) =>
    api.delete(`/movies/${id}`);

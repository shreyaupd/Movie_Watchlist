import express from 'express';
import { getAllMovies, addMovie, getMovieById, deleteMovie } from '../controllers/movieController.js';
import { authentication } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMovies);  // Public - get all movies
router.get('/:id', getMovieById);  // Public - get single movie
router.post('/add', authentication, addMovie);  // Protected - add movie
router.delete('/:id', authentication, deleteMovie);  // Protected - delete movie

export default router;

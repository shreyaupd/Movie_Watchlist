import express from 'express';
import {addToWatchlist, updateWatchlist, deleteFromWatchlist  } from "../controllers/watchlistController.js";
import { authentication} from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(authentication);
router.post('/',addToWatchlist);
router.put('/', updateWatchlist);
router.delete('/', deleteFromWatchlist);
export default router;
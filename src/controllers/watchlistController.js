import { prisma } from "../config/db.js";
const addToWatchlist = async (req, res) => {
  try {
    const { movieId, review, createdAt, updatedAt, rating, status, userId } =
      req.body;
    //verify if this movie is there in movies table
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    // redundancy check
    const alreadyExists = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: userId,
          movieId: movieId,
        },
      },
    });
    if (alreadyExists) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    const addMovies = await prisma.watchlist.create({
      data: {
        userId,
        movieId,
        rating,
        status,
        review,
        createdAt,
        updatedAt,
      },
    });
    res
      .status(201)
      .json({ message: "Movie added to watchlist", data: addMovies });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export { addToWatchlist };

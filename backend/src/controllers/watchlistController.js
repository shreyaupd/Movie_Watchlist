import { prisma } from "../config/db.js";
const addToWatchlist = async (req, res) => {
  try {
    const { movieId, review, rating, status} = req.body;
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
          userId: req.user.id,
          movieId: movieId,
        },
      },
    });
    if (alreadyExists) {
      return res.status(400).json({ message: "Movie already in watchlist" });
    }

    const addMovies = await prisma.watchlist.create({
      data: {
        userId: req.user.id,
        movieId,
        rating,
        status,
        review,
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

const updateWatchlist = async (req, res)=>{
  try {
    const {movieId, review, rating, status}= req.body
    const userId = req.user.id;
    
    if(!movieId){
      return res.status(400).json({error: "movieId is required"});
    }
    
    const WatchListRecordExists = await prisma.watchlist.findUnique({
      where:{
        userId_movieId:{
          userId,
          movieId
        }
      }
    })
    
    if(!WatchListRecordExists){
      return res.status(404).json({error: "Watchlist record not found"});
    }
    // if(!review || !rating || !status){
    //   return res.status(400).json({error: "Enterin data before updating is needed"});
    // }
    const updateRecord = await prisma.watchlist.update({
      where:{
        userId_movieId:{
          userId,
          movieId
        }
      },
      data:{
        review: review?? WatchListRecordExists.review, // review: undefined ?? "Great movie!"  // do not update if unot updated in postman or frontend
        rating: rating ?? WatchListRecordExists.rating,// rating: 4 ?? 5 // update 4 instead of 5
        status: status ?? WatchListRecordExists.status// status: undefined ?? "COMPLETED"  // do not update if unot updated in postman or frontend
      }
    });
    res.status(200).json({ message: "Watchlist updated", data: updateRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const deleteFromWatchlist = async (req, res)=>{
  try {
     const {movieId}= req.body
     const userId = req.user.id;
      if(!movieId){
        return res.status(400).json({error: "movieId is required"});
      }
      const WatchListRecordExists = await prisma.watchlist.findUnique({
        where:{
          userId_movieId:{
            userId,
            movieId
          }
        }
      })
      if(!WatchListRecordExists){
        return res.status(404).json({error: "Watchlist record not found"});
      }
      const deleterRecord = await prisma.watchlist.delete({
        where:{
          userId_movieId:{
            userId,
            movieId
          }
        }
      })
      res.status(200).json({ message: "Watchlist deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export { addToWatchlist, updateWatchlist, deleteFromWatchlist };

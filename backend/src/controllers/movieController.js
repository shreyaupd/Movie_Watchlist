import { prisma } from '../config/db.js';
//get all movies
export const getAllMovies = async(req, res)=>{
  try {
    const movies= await prisma.movie.findMany({
        orderBy:{createdAt:"desc"}
    })
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({message:"Error fetching movies", error});
  }
} 
//add movie to watchlist
export const addMovie= async(req,res)=>{
    try {
         const body = req.body ?? {};
         const {title, description, releaseDate, genere, posterUrl, runTime}= body;
         const userId= req.user.id;
         if (!req.body) {
            return res.status(400).json({
                message: "Request body is missing. Send JSON with Content-Type: application/json"
            });
         }
         if(!title ||!releaseDate||!runTime){
            return res.status(400).json({message:" Title, release date and run time are required"});
         }
        const newMovie=await prisma.movie.create({
            data:{
                title,
                description,
                releaseDate: new Date(releaseDate), 
                createdBy: userId,
                genere,
                posterUrl,
                runTime,
               
            }
        })
        res.status(201).json({message:"Movie Created", data:newMovie});
        
    } catch (error) {
        console.log("Add movie error:", error);
        res.status(500).json({message:"Internal server error", error: error.message});
        
    }
};

// Get single movie
export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await prisma.movie.findUnique({
            where: { id: parseInt(id) }
        });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.status(200).json({ data: movie });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//delete movie from watchlist
export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const movie = await prisma.movie.findUnique({
            where: { id: parseInt(id) }
        });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        if (movie.createdBy !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        await prisma.movie.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

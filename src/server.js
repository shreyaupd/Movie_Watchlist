import express from 'express';
import {config} from 'dotenv'; //
import {connectDB,disconnectDB} from './config/db.js'; 
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
config(); 
connectDB();
const app= express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const PORT=5001;
app.use('/movies',movieRoutes);
app.use('/auth',authRoutes);
app.use('/watchlist',watchlistRoutes);
app.get('/',(req,res)=>{
    res.json({message:"Hello, World!"});
})
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", async (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async()=>{
        await disconnectDB();
        process.exit(1);
    })
});

process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
  });

process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    await disconnectDB();
    server.close(async()=>{
        await disconnectDB();
        process.exit(0);
    })
});
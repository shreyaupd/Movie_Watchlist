import { PrismaClient } from '../src/generated/client.js';
const prisma = new PrismaClient();
const creatorId="a510dc07-d3f2-4795-a5be-29ba4809b1c6"
const movies = [
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space to ensure humanity’s survival.",
    releaseDate: new Date("2014-11-07"),
    createdBy: creatorId,
    genere: ["Sci-Fi", "Drama", "Adventure"],
    posterUrl: "https://resizing.flixster.com/7c3qnZfPzZgID7Ft97PccFwEf9U=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg",
    runTime: 169
  },
  {
    title: "Inception",
    description: "A skilled thief is given a chance at redemption if he can successfully perform inception.",
    releaseDate: new Date("2010-07-16"),
    createdBy: creatorId,
    genere: ["Sci-Fi", "Action", "Thriller"],
    posterUrl: "https://resizing.flixster.com/2HAZD3mRXq8DSdsOvBiGf5Kn8HI=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7825626_p_v10_ae.jpg",
    runTime: 148
  },
  {
    title: "Parasite",
    description: "A poor family schemes to infiltrate a wealthy household with unexpected consequences.",
    releaseDate: new Date("2019-05-30"),
    createdBy: creatorId,
    genere: ["Thriller", "Drama"],
    posterUrl: "https://resizing.flixster.com/DgA7bEJqWSBJmHBhmIb375_VLxE=/206x305/v2/https://resizing.flixster.com/0nQ2niq2j-E4gdW_kB5H606atmc=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzZlZWEwMmY4LTk1OWUtNGEyOS04ODRmLTA0OWRjMzhlYWZkNi53ZWJw",
    runTime: 132
  },
  {
    title: "The Dark Knight",
    description: "Batman faces his greatest psychological and physical tests against the Joker.",
    releaseDate: new Date("2008-07-18"),
    createdBy: creatorId,
    genere: ["Action", "Crime", "Drama"],
    posterUrl: "https://resizing.flixster.com/dJM7TJzf7qEp9NA2Kni0Cug9myc=/206x305/v2/https://resizing.flixster.com/Wg25mLoPWxjcxXzNyaSF4VGgGE4=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2ZiNjZiNWFkLWVhNzEtNDRhMC1iNGIwLTFmY2FkNzllNTJlMi5qcGc=",
    runTime: 152
  },
  {
    title: "Spirited Away",
    description: "A young girl enters a mysterious spirit world and must find her way back.",
    releaseDate: new Date("2001-07-20"),
    createdBy: creatorId,
    genere: ["Animation", "Fantasy", "Adventure"],
    posterUrl: "https://resizing.flixster.com/eAzq-iZ27I0GSxCkkpl8Oz_Mnxo=/206x305/v2/https://resizing.flixster.com/toMzSC_5b1NF7MxJ5-CJeL1S-Z8=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRlY2RiZDcyLWU5ZmEtNDliMy1iOTMyLTYzNzhjY2RjOWIxNy5qcGc=",
    runTime: 125
  }
];

const main = async ()=>{
    console.log("Seeding in progress...");
    try {
        for(const movie of movies){
        await prisma.movie.create({
            data: movie
        })
        console.log(`Added movie: ${movie.title}`);
    }
    console.log("seeding successful");
    
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    } 
    finally{
        await prisma.$disconnect();
    }
}
   main()  

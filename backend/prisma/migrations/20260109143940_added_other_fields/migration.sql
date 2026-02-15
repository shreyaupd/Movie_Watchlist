/*
  Warnings:

  - Added the required column `createdBy` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runTime` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Made the column `releaseDate` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WatchlistStatus" AS ENUM ('PLANNED', 'WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "genere" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "posterUrl" TEXT,
ADD COLUMN     "runTime" INTEGER NOT NULL,
ALTER COLUMN "releaseDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "review" TEXT,
ADD COLUMN     "status" "WatchlistStatus" NOT NULL DEFAULT 'PLANNED',
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

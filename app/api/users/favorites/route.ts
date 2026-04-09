import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Movie from "@/models/Movie";
import UserPreference from "@/models/UserPreference";
import MovieInteraction from "@/models/MovieInteractions";

export async function POST(req: Request) {
  try {
    const { userId, movieId } = await req.json();

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    let updatedFavorites = (user.favoriteMovies || [])
      .filter((id: any) => id) // remove nulls
      .map((id: any) => id.toString());

    let isNowFavorite: boolean;
    if (updatedFavorites.includes(movieId)) {
      // remove 
      updatedFavorites = updatedFavorites.filter((id) => id !== movieId);
      isNowFavorite = false;
    } else {
      // add 
      updatedFavorites.push(movieId);
      isNowFavorite = true;
    }

    user.favoriteMovies = updatedFavorites;
    await user.save();

    // Update user preferences
    let prefs = await UserPreference.findOne({ userId });
    if (!prefs) {
      // create new preferences
      prefs = await UserPreference.create({
        userId,
        likedMovies: isNowFavorite ? [movieId] : [],
        favoriteGenres: isNowFavorite ? movie.genre : [],
      });
    } else {
      // update liked movies
      if (isNowFavorite && !prefs.likedMovies.includes(movieId)) {
        prefs.likedMovies.push(movieId);
      } else if (!isNowFavorite) {
        prefs.likedMovies = prefs.likedMovies.filter(
          (id) => id.toString() !== movieId
        );
      }

      // update genres
      if (isNowFavorite) {
        movie.genre.forEach((g: string) => {
          if (!prefs.favoriteGenres.includes(g)) {
            prefs.favoriteGenres.push(g);
          }
        });
      }

      await prefs.save();
    }

    // Log the movie interaction
    await MovieInteraction.create({
      userId,
      movieId,
      action: isNowFavorite ? "favorite" : "view", // must match enum: 'view', 'favorite', 'purchase'
    });

    return NextResponse.json({
      success: true,
      favoriteMovies: updatedFavorites,
      message: isNowFavorite
        ? "Movie added to favorites!"
        : "Movie removed from favorites!",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
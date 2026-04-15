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
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      );
    }

    let favorites = (user.favoriteMovies || [])
      .filter(Boolean)
      .map((id: any) => id.toString());

    const isAlreadyFavorite = favorites.includes(movieId);

    if (isAlreadyFavorite) {
      favorites = favorites.filter((id) => id !== movieId);
    } else {
      favorites.push(movieId);
    }

    user.favoriteMovies = favorites;
    await user.save();

    let prefs = await UserPreference.findOne({ userId });

    if (!prefs) {
      prefs = await UserPreference.create({
        userId,
        likedMovies: [],
        favoriteGenres: [],
      });
    }

    if (!isAlreadyFavorite) {
      if (!prefs.likedMovies.map(String).includes(movieId)) {
        prefs.likedMovies.push(movieId);
      }

      movie.genre.forEach((g: string) => {
        if (!prefs.favoriteGenres.includes(g)) {
          prefs.favoriteGenres.push(g);
        }
      });
    } else {
      prefs.likedMovies = prefs.likedMovies.filter(
        (id) => id.toString() !== movieId
      );

      const remainingMovies = await Movie.find({
        _id: { $in: prefs.likedMovies },
      });

      const genreSet = new Set<string>();

      remainingMovies.forEach((m) => {
        m.genre.forEach((g: string) => genreSet.add(g));
      });

      prefs.favoriteGenres = Array.from(genreSet);
    }

    await prefs.save();

    // FIXED MovieInteraction logic
    if (!isAlreadyFavorite) {
      // FAVORITE → CREATE interaction
      await MovieInteraction.create({
        userId,
        movieId,
        action: "favorite",
      });
    } else {
      // UNFAVORITE → DELETE interaction
      await MovieInteraction.deleteOne({
        userId,
        movieId,
        action: "favorite",
      });
    }

    return NextResponse.json({
      success: true,
      isFavorite: !isAlreadyFavorite,
      favoriteMovies: favorites,
    });

  } catch (err) {
    console.error("Favorites API error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
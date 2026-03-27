import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/types/User";

export async function POST(req: Request) {
  try {
    const { userId, movieId } = await req.json();

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let updatedFavorites = (user.favoriteMovies || [])
      .filter((id: any) => id) // remove nulls
      .map((id: any) => id.toString());

    if (updatedFavorites.includes(movieId)) {
      // remove
      updatedFavorites = updatedFavorites.filter((id) => id !== movieId);
    } else {
      // add
      updatedFavorites.push(movieId);
    }

    user.favoriteMovies = updatedFavorites;
    await user.save();

    return NextResponse.json({
      success: true,
      favoriteMovies: updatedFavorites,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
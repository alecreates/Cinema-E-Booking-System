import { NextRequest, NextResponse } from "next/server";
import { getMovieById } from "@/services/MovieService";

export async function GET(req: NextRequest, context: { params: any }) {
    try {
        // UNWRAP params first
        const params = await context.params;
        const id = params.id as string;

        console.log("movie id:", id);

        const movie = await getMovieById(id);

        if (!movie) {
            return NextResponse.json(
                { success: false, message: "Movie not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: movie,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import * as MovieService from "@/services/MovieService";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const movie = await MovieService.getMovieById(id);

        if (!movie) {
            return NextResponse.json(
                { success: false, message: `Movie with id ${id} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: movie });
    } catch (err: unknown) {
        // type-safe error handling
        let message = "Unknown error";
        if (err instanceof Error) message = err.message;
        else if (typeof err === "string") message = err;

        return NextResponse.json(
            { success: false, message, data: null },
            { status: 500 }
        );
    }
}

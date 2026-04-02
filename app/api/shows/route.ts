import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import Show from "@/models/Show";

export async function GET() {
    try {
        await dbConnect();

        console.log("DB NAME:", Show.db.name);
        console.log("COLLECTION:", Show.collection.name);

        const shows = await Show.find()
            .sort({ showTime: 1 })
            .lean();

        return NextResponse.json(shows, { status: 200 });
    } catch (error) {
        console.error("GET /api/shows error:", error);
        return NextResponse.json(
            { message: "Failed to fetch shows" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        const { showRoomId, movieId, showTime } = body;

        // basic validation
        if (!showRoomId || !movieId || !showTime) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const newShow = await Show.create({
            showRoomId,
            movieId,
            showTime,
        });

        return NextResponse.json(newShow, { status: 201 });
    } catch (error) {
        console.error("POST /api/shows error:", error);
        return NextResponse.json(
            { message: "Failed to create show" },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import Show from "@/models/Show";
import mongoose from "mongoose";

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
        const { showRoomId, movieId, timeSlot, date } = body;

        // Basic validation
        if (!showRoomId || !movieId || !timeSlot || !date) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(showRoomId) ||
            !mongoose.Types.ObjectId.isValid(movieId)
        ) {
            return NextResponse.json(
                { message: "Invalid movie or showroom ID" },
                { status: 400 }
            );
        }

        // Normalize date to check conflicts
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

        // Conflict check
        const existingShow = await Show.findOne({
            showRoomId,
            timeSlot,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        if (existingShow) {
            return NextResponse.json(
                {
                    message:
                        "This time slot is already booked for the selected room on this date.",
                },
                { status: 400 }
            );
        }

        // Create show
        const newShow = await Show.create({
            showRoomId,
            movieId,
            timeSlot,
            date: selectedDate,
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
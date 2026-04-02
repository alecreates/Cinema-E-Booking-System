import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import ShowRoom from "@/models/ShowRoom";

export async function GET() {
    try {
        await dbConnect();

        const showRooms = await ShowRoom.find({});

        return NextResponse.json(showRooms, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed" },
            { status: 500 }
        );
    }
}
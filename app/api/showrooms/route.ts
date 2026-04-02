import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/mongodb";
import ShowRoom from "@/models/ShowRoom";

export async function GET() {
    try {
        await dbConnect();

        console.log("DB NAME:", ShowRoom.db.name);
        console.log("COLLECTION:", ShowRoom.collection.name);

        const count = await ShowRoom.countDocuments();
        console.log("COUNT:", count);

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
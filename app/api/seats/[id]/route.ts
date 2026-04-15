import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Seat from "@/models/Seat";
import Ticket from "@/models/Ticket";
import Show from "@/models/Show";

type RouteParams = {
    params: Promise<{id: string}>;
};

export async function GET(_request: Request, {params} : RouteParams){
    try{
        const {id} = await params;
        await dbConnect();
        const show = await Show.findById(id);
        if (!show) {
            return NextResponse.json({ message: "Show not found" }, { status: 404 });
        }
        const seats = await Seat.find({showRoomId: show.showRoomId});
        const tickets = await Ticket.find({showId: id});

        return NextResponse.json({seats, tickets}, {status: 200})
    }
    catch(error){
        console.error("GET /api/seats/[id] error:", error);
        return NextResponse.json(
            { message: "Failed to fetch" },
            { status: 500 }
        );
    }
}
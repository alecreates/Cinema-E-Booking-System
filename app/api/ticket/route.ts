import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

export async function POST(request:NextRequest){
    try{
        await dbConnect();
        const {bookingId,seatId,showId,type} = await request.json();
        const newTicket = await Ticket.create({bookingId,seatId,showId,type});
        return NextResponse.json(newTicket,{status:201})
    }catch(error){
    console.error("POST /api/ticket error:", error);
    return NextResponse.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
    }
}
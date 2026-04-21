import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Booking from "@/models/Booking";


export async function POST(reqest: NextRequest){
    try{
        await dbConnect();
        const {customerId,promotionId,paymentCardId,showId,total,bookingDate} = await reqest.json();
        const newBooking = await Booking.create({customerId,promotionId,paymentCardId,showId,total,bookingDate});
        return NextResponse.json(newBooking,{status:201});
    }catch(error){
        console.error("POST /api/ticket error:", error);
            return NextResponse.json(
              { message: "Failed to create ticket" },
              { status: 500 }
            )
        }
    }


export async function GET() {
    try {
        await dbConnect();

        const bookings = await Booking.find()
            .sort({ bookingDate: -1 })
            .lean();

        return NextResponse.json(bookings, { status: 200 });
    
    } catch(error) {
        console.error("GET /api/booking error:", error);
        return NextResponse.json(
            { message: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}


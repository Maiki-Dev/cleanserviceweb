
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// PATCH - Update booking status (Cleaner only)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "CLEANER") {
      return NextResponse.json({ error: "Cleaner access required" }, { status: 401 });
    }

    const bookingId = params.id;
    const { status } = await req.json();

    // Check if booking exists and is assigned to this cleaner
    const existingBooking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (existingBooking.cleanerId !== session.user.id) {
      return NextResponse.json({ error: "Not assigned to this booking" }, { status: 403 });
    }

    // Only allow certain status transitions
    const allowedStatuses = ["IN_PROGRESS", "COMPLETED"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: status as BookingStatus,
        updatedAt: new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        cleaner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        payments: true,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

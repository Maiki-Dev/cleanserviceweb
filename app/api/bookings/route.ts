
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ServiceType, BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET - Fetch user's bookings
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authorized user required" }, { status: 401 });
    }

    let bookings;

    if (session.user.role === "ADMIN") {
      // Admin can see all bookings
      bookings = await db.booking.findMany({
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (session.user.role === "CLEANER") {
      // Cleaner can see assigned bookings
      bookings = await db.booking.findMany({
        where: {
          cleanerId: session.user.id,
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
        orderBy: {
          scheduledAt: "asc",
        },
      });
    } else {
      // Customer can see only their bookings
      bookings = await db.booking.findMany({
        where: {
          customerId: session.user.id,
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
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Create new booking
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Customer access required" }, { status: 401 });
    }

    const { serviceType, serviceName, scheduledAt, address, specialInstructions, totalPrice, duration } = await req.json();

    if (!serviceType || !serviceName || !scheduledAt || !address || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if scheduled time is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 });
    }

    // Create or find service
    let service = await db.service.findFirst({
      where: {
        type: serviceType as ServiceType,
        name: serviceName,
      },
    });

    if (!service) {
      service = await db.service.create({
        data: {
          name: serviceName,
          nameEn: serviceType === "HOME_CLEANING" ? "Home Cleaning" : "Office Cleaning",
          description: serviceType === "HOME_CLEANING" 
            ? "Таны гэрийг гялалзуулж, эрүүл ахуйн стандартыг дээшлүүлье"
            : "Таны ажлын орчинд мэргэжлийн цэвэрлэгээний үйлчилгээ",
          type: serviceType as ServiceType,
          basePrice: totalPrice,
          duration: duration || 120,
        },
      });
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        customerId: session.user.id,
        serviceId: service.id,
        scheduledAt: scheduledDate,
        duration: duration || service.duration,
        totalPrice,
        address,
        specialInstructions: specialInstructions || undefined,
        status: BookingStatus.PENDING,
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

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

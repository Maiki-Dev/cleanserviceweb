
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password, fullName, phone, role, address } = await req.json();

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: "Имэйл, нууц үг, нэр, утасны дугаар шаардлагатай" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ имэйл хаягаар бүртгэгдсэн хэрэглэгч байна" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Validate and set role
    const validRoles = ['ADMIN', 'CUSTOMER', 'CLEANER'];
    const userRole = (role && validRoles.includes(role)) ? role as UserRole : UserRole.CUSTOMER;

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        name: fullName,
        phone: phone,
        role: userRole,
        address: address || undefined,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "Амжилттай бүртгэгдлээ",
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Сервэрийн алдаа гарлаа" },
      { status: 500 }
    );
  }
}

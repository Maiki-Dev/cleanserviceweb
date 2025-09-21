
import { PrismaClient, UserRole, ServiceType, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create test users
  const hashedPassword = await bcrypt.hash("johndoe123", 12);

  // Admin user (hidden test account)
  const admin = await prisma.user.create({
    data: {
      email: "john@doe.com",
      password: hashedPassword,
      fullName: "John Doe",
      name: "John Doe",
      phone: "99001122",
      role: UserRole.ADMIN,
      address: "Admin Office, Ulaanbaatar",
      isActive: true,
    },
  });

  // Test customer
  const customer = await prisma.user.create({
    data: {
      email: "customer@test.com",
      password: await bcrypt.hash("customer123", 12),
      fullName: "Батбаяр Болд",
      name: "Батбаяр Болд",
      phone: "99112233",
      role: UserRole.CUSTOMER,
      address: "Чингэлтэй дүүрэг, 3-р хороо, Улаанбаатар",
      isActive: true,
    },
  });

  // Test cleaners
  const cleaner1 = await prisma.user.create({
    data: {
      email: "cleaner1@test.com",
      password: await bcrypt.hash("cleaner123", 12),
      fullName: "Цэрэнпилийн Оюунчимэг",
      name: "Цэрэнпилийн Оюунчимэг",
      phone: "99223344",
      role: UserRole.CLEANER,
      address: "Баянзүрх дүүрэг, Улаанбаатар",
      isActive: true,
    },
  });

  const cleaner2 = await prisma.user.create({
    data: {
      email: "cleaner2@test.com",
      password: await bcrypt.hash("cleaner123", 12),
      fullName: "Доржийн Энхбаяр",
      name: "Доржийн Энхбаяр",
      phone: "99334455",
      role: UserRole.CLEANER,
      address: "Сонгинохайрхан дүүрэг, Улаанбаатар",
      isActive: true,
    },
  });

  // Additional customers
  const customer2 = await prisma.user.create({
    data: {
      email: "customer2@test.com",
      password: await bcrypt.hash("customer123", 12),
      fullName: "Гантулгын Анхбаяр",
      name: "Гантулгын Анхбаяр",
      phone: "99445566",
      role: UserRole.CUSTOMER,
      address: "Хан-Уул дүүрэг, 15-р хороо, Улаанбаатар",
      isActive: true,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: "customer3@test.com",
      password: await bcrypt.hash("customer123", 12),
      fullName: "Мөнхбатын Сувдаа",
      name: "Мөнхбатын Сувдаа",
      phone: "99556677",
      role: UserRole.CUSTOMER,
      address: "Баянгол дүүрэг, 22-р хороо, Улаанбаатар",
      isActive: true,
    },
  });

  console.log("👥 Created users");

  // Create services
  const homeCleaningService = await prisma.service.create({
    data: {
      name: "Гэрийн цэвэрлэгээ",
      nameEn: "Home Cleaning",
      description: "Таны гэрийг гялалзуулж, эрүүл ахуйн стандартыг дээшлүүлье",
      type: ServiceType.HOME_CLEANING,
      basePrice: 25000,
      duration: 120,
      isActive: true,
    },
  });

  const officeCleaningService = await prisma.service.create({
    data: {
      name: "Оффисын цэвэрлэгээ",
      nameEn: "Office Cleaning",
      description: "Таны ажлын орчинд мэргэжлийн цэвэрлэгээний үйлчилгээ",
      type: ServiceType.OFFICE_CLEANING,
      basePrice: 45000,
      duration: 180,
      isActive: true,
    },
  });

  console.log("🏠 Created services");

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer.id,
      cleanerId: cleaner1.id,
      serviceId: homeCleaningService.id,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 120,
      totalPrice: 25000,
      address: "Чингэлтэй дүүрэг, 3-р хороо, Улаанбаатар хот, Mongol Apartments, 5 давхар, 12 тоот",
      specialInstructions: "Гал тогооны өрөөнд тусгай анхаарна уу. Хүүхдийн тоглоомууд байгаа.",
      status: BookingStatus.CONFIRMED,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer2.id,
      cleanerId: cleaner2.id,
      serviceId: officeCleaningService.id,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 180,
      totalPrice: 45000,
      address: "Хан-Уул дүүрэг, Central Tower, 15 давхар, Улаанбаатар",
      specialInstructions: "Конференц танхимыг тусгайлан цэвэрлэнэ үү. Компьютерийн тоног төхөөрөмжөөс болгоомжилно уу.",
      status: BookingStatus.CONFIRMED,
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      customerId: customer3.id,
      serviceId: homeCleaningService.id,
      scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      duration: 120,
      totalPrice: 25000,
      address: "Баянгол дүүрэг, 22-р хороо, Sky Tower, 8 давхар, 05 тоот",
      specialInstructions: "Унтлагын өрөөг анхлан цэвэрлэнэ үү.",
      status: BookingStatus.PENDING,
    },
  });

  // Completed booking for statistics
  const completedBooking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      cleanerId: cleaner1.id,
      serviceId: homeCleaningService.id,
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      duration: 120,
      totalPrice: 25000,
      address: "Чингэлтэй дүүрэг, 3-р хороо, Улаанбаатар хот",
      specialInstructions: "Энгийн цэвэрлэгээ",
      status: BookingStatus.COMPLETED,
    },
  });

  console.log("📅 Created sample bookings");

  // Create sample payments
  await prisma.payment.create({
    data: {
      bookingId: completedBooking.id,
      userId: customer.id,
      amount: 12500, // 50% prepayment
      method: "QPAY",
      status: "PAID",
      transactionId: "TXN_001_" + Date.now(),
    },
  });

  console.log("💳 Created sample payments");

  console.log("✅ Database seeding completed!");
  console.log("\n📊 Seeded data summary:");
  console.log(`- Admin: 1 user`);
  console.log(`- Customers: 3 users`);
  console.log(`- Cleaners: 2 users`);
  console.log(`- Services: 2 services`);
  console.log(`- Bookings: 4 bookings`);
  console.log(`- Payments: 1 payment`);
  
  console.log("\n🔐 Test login credentials:");
  console.log(`Admin: john@doe.com / johndoe123`);
  console.log(`Customer: customer@test.com / customer123`);
  console.log(`Cleaner: cleaner1@test.com / cleaner123`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

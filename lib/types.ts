
import { UserRole, ServiceType, BookingStatus, PaymentStatus, PaymentMethod, User as PrismaUser } from "@prisma/client";

export interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: UserRole;
      phone?: string;
    };
  }

  interface User {
    role: UserRole;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    phone?: string;
  }
}

export interface ServiceWithBookings {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  type: ServiceType;
  basePrice: number;
  duration: number;
  isActive: boolean;
  bookings?: BookingWithDetails[];
}

export interface BookingWithDetails {
  id: string;
  customerId: string;
  cleanerId?: string;
  serviceId: string;
  scheduledAt: Date;
  duration: number;
  totalPrice: number;
  address: string;
  specialInstructions?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
  };
  cleaner?: {
    id: string;
    fullName?: string;
    email: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    type: ServiceType;
  };
  payments: PaymentWithDetails[];
}

export interface PaymentWithDetails {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  qpayInvoiceId?: string;
  createdAt: Date;
}

export interface CreateBookingData {
  serviceId: string;
  scheduledAt: Date;
  address: string;
  specialInstructions?: string;
}

export interface CleaningService {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  type: ServiceType;
  basePrice: number;
  duration: number;
  features: string[];
}

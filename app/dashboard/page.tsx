
import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CustomerDashboard from "@/components/customer-dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "CUSTOMER") {
    // Redirect based on role
    switch (session.user.role) {
      case "ADMIN":
        redirect("/admin");
      case "CLEANER":
        redirect("/cleaner");
      default:
        redirect("/");
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerDashboard user={session.user} />
    </Suspense>
  );
}

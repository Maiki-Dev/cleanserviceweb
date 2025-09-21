
import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HomePage from "@/components/home-page";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    // Redirect based on user role
    switch (session.user.role) {
      case "ADMIN":
        redirect("/admin");
      case "CLEANER":
        redirect("/cleaner");
      case "CUSTOMER":
      default:
        redirect("/dashboard");
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}

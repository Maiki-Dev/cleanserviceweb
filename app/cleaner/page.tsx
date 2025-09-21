
import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CleanerDashboard from "@/components/cleaner-dashboard";

export default async function CleanerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "CLEANER") {
    redirect("/");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CleanerDashboard user={session.user} />
    </Suspense>
  );
}

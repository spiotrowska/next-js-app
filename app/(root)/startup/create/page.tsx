import React, { Suspense } from "react";
import StartupForm from "@/components/StartupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

async function CreatePageContent() {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup</h1>
      </section>

      <StartupForm />
    </>
  );
}

const Page = async () => {
  return (
    <Suspense fallback={<Skeleton className="w-full h-screen" />}>
      <CreatePageContent />
    </Suspense>
  );
};

export default Page;

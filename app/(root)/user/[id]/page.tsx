import React, { Suspense } from "react";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import { StartupCardSkeleton } from "@/components/StartupCard";
import { ReactElement } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type UserPageProps = {
  params: Promise<{ id: string }>;
};

async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  if (!user) notFound();

  return (
    <section className="profile_container">
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black uppercase text-center">{user.name}</h3>
        </div>

        <Image
          src={user.image}
          alt={user.name}
          width={220}
          height={220}
          className="profile_image"
        />

        <p className="text-30-extrabold mt-7 text-center">@{user?.username}</p>
        <p className="text-14-normal mt-1 text-center">{user?.bio}</p>
      </div>

      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <h1 className="text-30-bold">
          {session?.user?.id === id ? "Your" : "All"} Startups
        </h1>

        <div className="card_grid-sm">
          <Suspense fallback={<StartupCardSkeleton />}>
            <UserStartups id={id} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

const Page = async ({
  params,
}: UserPageProps): Promise<ReactElement<UserPageProps>> => {
  return (
    <Suspense fallback={<Skeleton className="w-full h-screen" />}>
      <UserProfile params={params} />
    </Suspense>
  );
};

export default Page;

import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { ReactElement, Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

type HomeProps = { searchParams: Promise<{ query?: string }> };

async function StartupsList({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  return (
    <>
      {posts?.length > 0 ? (
        posts.map((post: StartupTypeCard) => (
          <StartupCard key={post?._id} post={post} />
        ))
      ) : (
        <p className="no-results">No startups found</p>
      )}
    </>
  );
}

async function Hero({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  return (
    <>
      <section className="hero_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect with entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit ideas, vote on pitches and get noticed in virtual competitions.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <h1 className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All startups"}
        </h1>

        <div className="mt-7 pl-0 card_grid">
          <Suspense fallback={<StartupCardSkeleton />}>
            <StartupsList searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

export default async function Home({
  searchParams,
}: HomeProps): Promise<ReactElement<HomeProps>> {
  return (
    <>
      <Suspense fallback={<div className="w-full h-screen" />}>
        <Hero searchParams={searchParams} />
      </Suspense>

      <SanityLive />
    </>
  );
}

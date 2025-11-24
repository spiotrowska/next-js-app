import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import markdownit from "markdown-it";
import { ReactElement } from "react";

// Define isSpace function globally for markdown-it
declare global {
  function isSpace(code: number): boolean;
}

// Define the isSpace function
globalThis.isSpace = function (code: number): boolean {
  return (
    code === 0x20 ||
    code === 0x09 ||
    code === 0x0a ||
    code === 0x0b ||
    code === 0x0c ||
    code === 0x0d
  );
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function StartupContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const md = markdownit();

  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }, { next: { revalidate: 300 } }),
    client.fetch(
      PLAYLIST_BY_SLUG_QUERY,
      { slug: "editor-picks" },
      { next: { revalidate: 300 } }
    ),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post.pitch);

  return (
    <>
      <section className="hero_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>

        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <Image
          src={post.image}
          alt="thumbnail"
          width={300}
          height={300}
          className="w-auto h-auto rounded-xl mx-auto"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author?.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium !text-black-300 !dark:text-white">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            <Link href={`/?query=${post.category.toLowerCase()}`}>
              <p className="category-tag">{post.category}</p>
            </Link>
          </div>

          <h3 className="text-30-bold">Startup Details</h3>

          {parsedContent ? (
            <article
              className="markdown-text max-w-4xl font-work-sans break-all dark:text-white"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-results">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {editorPosts?.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Other startups</p>

            <div className="mt-7 pl-0 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard) => (
                <StartupCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        ) : null}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
}

const Page = async ({
  params,
}: PageProps): Promise<ReactElement<PageProps>> => {
  return (
    <Suspense fallback={<Skeleton className="w-full h-screen" />}>
      <StartupContent params={params} />
    </Suspense>
  );
};

export default Page;

// Incremental static regeneration for startup pages.

// Pre-generate startup IDs for static rendering; fallback to on-demand if large dataset.
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const ids: string[] = await client.fetch(
      '*[_type == "startup" && defined(_id)][]._id'
    );
    return ids.slice(0, 50).map((val) => ({ id: val }));
  } catch {
    return [];
  }
}

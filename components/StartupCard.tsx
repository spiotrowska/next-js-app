import React, { ReactElement } from "react";
import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";

export type StartupTypeCard = Omit<Startup, "author"> & { author: Author };

type StartupCardProps = { post: StartupTypeCard };

const StartupCard = ({
  post,
}: StartupCardProps): ReactElement<StartupCardProps> => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;

  return (
    <li className="startup-card group">
      <Link href={`/startup/${_id}`}>
        <div className="flex-between">
          <p className="startup_card_date">{formatDate(_createdAt)}</p>

          <div className="flex gap-1.5">
            <EyeIcon className="size-6 text-primary" />

            <span className="text-16-medium">{views}</span>
          </div>
        </div>

        <div className="flex-between mt-5 gap-5">
          <div className="flex-1">
            <p className="text-16-medium line-clamp-1">
              {author?.name || author?.username || author?.email}
            </p>

            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </div>

          <Image
            src={author.image!}
            alt={author?.name || "author"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>

        <p className="startup-card_desc">{description}</p>

        {image && title ? (
          <Image
            src={image}
            alt={title}
            width={164}
            height={164}
            className="startup-card_img"
          />
        ) : null}

        <div className="flex-between gap-3 mt-5">
          <p className="category-tag">{category}</p>

          <Button className="startup-card_btn" asChild>
            <span>Details</span>
          </Button>
        </div>
      </Link>
    </li>
  );
};

export const StartupCardSkeleton = (): ReactElement => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;

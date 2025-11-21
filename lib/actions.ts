"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (form: FormData, pitch: string) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Unauthorized",
      status: "ERROR",
    });
  }

  const { title, description, category, link } = Object.fromEntries(form);

  const rawTitle = title as string;
  const slug = slugify(rawTitle, { lower: true, strict: true });

  try {
    let authorRef: string | undefined;

    if (
      session.user &&
      typeof session.user.id === "string" &&
      session.user.id.length > 0
    ) {
      authorRef = session.user.id;
    } else {
      authorRef = undefined;
    }

    const slugField = { _type: "slug", current: slug };
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: slugField,
      author: { _type: "reference", _ref: authorRef },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });

    return parseServerActionResponse({
      ...result,
      error: null,
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    let message: string | undefined;

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (typeof error === "number") {
      message = String(error);
    } else {
      try {
        message = JSON.stringify(error);
      } catch {
        message = undefined;
      }
    }

    return parseServerActionResponse({
      error: message,
      status: "ERROR",
    });
  }
};

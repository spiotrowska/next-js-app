"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect, ReactElement } from "react";

type GlobalErrorProps = { error: Error & { digest?: string } };

export default function GlobalError({
  error,
}: GlobalErrorProps): ReactElement<GlobalErrorProps> {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}

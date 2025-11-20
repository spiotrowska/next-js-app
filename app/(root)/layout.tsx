import { ReactNode, ReactElement, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

type LayoutProps = Readonly<{ children: ReactNode }>;

export default function Layout({
  children,
}: LayoutProps): ReactElement<LayoutProps> {
  return (
    <main className="font-work-sans">
      <Suspense
        fallback={<Skeleton className="w-full h-16 fixed top-0 z-50" />}
      >
        <Navbar />
      </Suspense>

      <div className="pt-16">{children}</div>
    </main>
  );
}

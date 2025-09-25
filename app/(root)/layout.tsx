import { ReactNode, ReactElement } from "react";
import Navbar from "@/components/Navbar";

type LayoutProps = Readonly<{ children: ReactNode }>;

export default function Layout({
  children,
}: LayoutProps): ReactElement<LayoutProps> {
  return (
    <main className="font-work-sans">
      <Navbar />

      <div className="pt-16">{children}</div>
    </main>
  );
}

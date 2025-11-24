import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReactElement } from "react";

const Navbar = async (): Promise<ReactElement> => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white dark:bg-black-200 shadow-sm font-works-sans fixed w-full top-0 z-50 transition-colors">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={144}
            height={30}
            className="h-[40px] w-auto rounded-full"
          />

          <span className="uppercase text-xl font-semibold text-black dark:text-white">
            Startups<span className="text-primary">Lib</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 text-black dark:text-white">
          <ThemeToggle />

          {(() => {
            if (session && session.user) {
              return (
                <>
                  <Link href="/startup/create" aria-label="Create startup">
                    <span className="max-sm:hidden">Create</span>
                    <BadgePlus className="size-6 sm:hidden text-primary" />
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button type="submit" aria-label="Logout">
                      <span className="max-sm:hidden">Logout</span>
                      <LogOut className="size-6 sm:hidden text-primary" />
                    </button>
                  </form>

                  <Link
                    href={`/user/${session.user.id}`}
                    aria-label="User profile"
                  >
                    <Avatar className="size-10">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || "User avatar"}
                      />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              );
            }

            return (
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button type="submit">Login</button>
              </form>
            );
          })()}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

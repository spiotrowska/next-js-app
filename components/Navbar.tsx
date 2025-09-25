import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactElement } from "react";

const Navbar = async (): Promise<ReactElement> => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-works-sans fixed w-full top-0 z-50">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={144}
            height={30}
            className="h-[40px] w-auto"
          />

          <span className="uppercase text-xl font-semibold text-black">
            Startups<span className="text-primary">Lib</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden text-primary" />
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>

                  <LogOut className="size-6 sm:hidden text-primary" />
                </button>
              </form>

              <Link href={`/user/${session?.id}`}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />

                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

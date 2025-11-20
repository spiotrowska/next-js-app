import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  type Session = DefaultSession & {
    user: DefaultSession["user"] & {
      id: string;
    };
  }

  type User = {
    id: string;
  }
}

declare module "next-auth/jwt" {
  type JWT = {
    id: string;
  }
}

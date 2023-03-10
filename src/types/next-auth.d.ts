import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: number;
    jwt: string;
    expiration: number;
    role: string;
  }
}
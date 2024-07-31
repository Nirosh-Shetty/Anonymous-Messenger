import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { dbConect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await dbConect();
          console.log(credentials.email, credentials.identifier);
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.identifier },
            ],
          });
          if (!user) throw new Error("User not found");
          if (!user.isVerified) throw new Error("user is not verified");
          // console.log("hi");
          const passwordComapred = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!passwordComapred) throw new Error("Incorrect Passowrd");
          return user;
        } catch (err: any) {
          throw new Error("error in logingIn", err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log(token);
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log(session);
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      // console.log(session)
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

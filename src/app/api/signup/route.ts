import User from "@/models/User";
import { dbConect } from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { mailer } from "@/helpers/mailer";

export async function POST(req: Request) {
  try {
    await dbConect();
    const { email, username, password } = await req.json();
    const existingVerifiedUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      console.log("username aready exists");
      return NextResponse.json(
        {
          success: true,
          message: "username is already taken",
        },
        {
          status: 201,
        }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.log("user aready exists");
        return NextResponse.json(
          {
            success: true,
            message: "user already exists",
          },
          {
            status: 201,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.username = username;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        existingUserByEmail.password = hashedPassword;
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const codeExpiry = new Date();
      codeExpiry.setHours(codeExpiry.getHours() + 1);
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: codeExpiry,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await mailer(email, username, verifyCode);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "signed up succesfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error in siging up", error);
    return NextResponse.json(
      {
        success: false,
        message: "error in sigin up , please try again",
      },
      {
        status: 500,
      }
    );
  }
}

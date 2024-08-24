import { dbConect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { request } from "http";
import { Message } from "@/models/User";
export const POST = async (request: Request) => {
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 400,
        }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "user not accepting any messages currently",
        },
        {
          status: 400,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "falied to send Messagess",
      },
      {
        status: 500,
      }
    );
  }
};

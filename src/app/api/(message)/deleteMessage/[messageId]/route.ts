import { dbConect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export const DELETE = async (
  request: Request,
  {
    params,
  }: {
    params: { messageId: string };
  }
) => {
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 400,
      }
    );
  }
  const messageId = params.messageId;
  try {
    await dbConect();
    const sam = await UserModel.findOne({ _id: user._id });
    console.log(sam);
    const dbResponse = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    console.log(dbResponse);
    if (dbResponse.modifiedCount == 0) {
      //   console.log("sorry");
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("falied to delete message");
    return Response.json(
      {
        success: false,
        message: "falied to delete message",
      },
      {
        status: 500,
      }
    );
  }
};

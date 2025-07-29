import { dbConect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
  console.log("mike test");
  // const session = await getServerSession(authOptions);
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

  try {
    await dbConect();
    const userId = new mongoose.Types.ObjectId(user._id);
    const getUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!getUser || getUser.length == 0) {
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

    return Response.json(
      { messages: getUser[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "falied to fetch Messages",
      },
      {
        status: 500,
      }
    );
  }
};

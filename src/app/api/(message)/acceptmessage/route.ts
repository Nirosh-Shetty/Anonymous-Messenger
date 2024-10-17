import { dbConect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    // console.log(session?.user);

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

    const user_id = user._id;
    const { acceptingMessage } = await request.json();

    await dbConect();

    const updatedUser = await UserModel.findByIdAndUpdate(
      user_id,
      { isAcceptingMessages: acceptingMessage },
      { new: true }
    );

    if (!updatedUser) {
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
      {
        success: true,
        message: `updated acceptingMessage status to ${updatedUser.isAcceptingMessages}`,
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("falied to update status");
    return Response.json(
      {
        success: false,
        message: "falied to update acceptingMessage status",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (request: Request) => {
  try {
    await dbConect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    // console.log(user);
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

    const user_id = user.id;
    const userFound = await UserModel.findById(user._id);
    if (!userFound) {
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
      {
        success: true,
        isAcceptingMessages: userFound.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("falied to fetch status");
    return Response.json(
      {
        success: false,
        message: "falied to fetch acceptingMessage status",
      },
      {
        status: 500,
      }
    );
  }
};

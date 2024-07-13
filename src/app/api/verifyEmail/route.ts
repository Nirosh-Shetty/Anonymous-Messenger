import { dbConect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const POST = async (request: Request) => {
  try {
    await dbConect();
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username); //it's used to decode the code which is fectched from the url(where space are encoded as %20 or something)(also here it's just used , but has no use)
    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 400 }
      );
    }
    const isCodeValid = user.verifyCode == code;
    const isCodeExpiryValid = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeExpiryValid) {
      return Response.json(
        {
          success: true,
          message: "User is verified",
        },
        { status: 200 }
      );
    } else if (!isCodeExpiryValid) {
      return Response.json(
        {
          success: false,
          message: "Verify code is expired",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verify code entered is invalid",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error in checking verify code",
      },
      { status: 500 }
    );
  }
};

import UserModel from "@/models/User";
import { dbConect } from "@/lib/dbConnect";
import { z } from "zod";
import { usernameSchema } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameSchema,
});

export const GET = async (Request: Request) => {
  try {
    const { searchParams } = new URL(Request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log(usernameErrors);
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    await dbConect();
    const verifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (verifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error in checking username",
      },
      { status: 500 }
    );
  }
};

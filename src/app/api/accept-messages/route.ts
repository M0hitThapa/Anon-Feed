import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { User, UserModel } from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = await user._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status for accepting messages",
        },
        {
          status: 401,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "message status updated successfully",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("failed to updated user status for accepting messages", error);

    return Response.json(
      {
        success: false,
        message: "failed to updated user status for accepting messages",
      },
      {
        status: 401,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await auth();

  const user = await session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = await user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("Error is getting message accepting status", error);
    return Response.json(
      {
        success: false,
        message: "error is getting message acceptance status",
      },
      {
        status: 401,
      }
    );
  }
}

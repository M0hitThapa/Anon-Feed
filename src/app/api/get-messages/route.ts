import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET() {
  await dbConnect();

  const session = await auth();

  const user: User = await session?.user;

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

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 401,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          messages: user[0].messages,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 401,
      }
    );
  }
}

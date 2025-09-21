import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { userNameValidation } from "@/schema/signUpSchema";
import z from "zod";

const userNameQuerySchema = z.object({
    username:userNameValidation
})

export default async function(request:Request) {

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get("username")
        }
        const result = userNameQuerySchema.safeParse(queryParam)
        console.log(result)

        if(!result.success) {

              const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:"Invalid query Parameter"
            }, {
                status:400
            })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(!existingVerifiedUser) {
            return Response.json({
                success:false,
                message:"user is not verified"
            }, {
                status:400
            })
        }

        return Response.json({
            success:true,
            message:"username is available"
        }, {
            status:200
        })
    } catch (error) {
        console.log("error registering user", error)
        return Response.json({
            success:false,
            message:"error checking username"
        }, {
            status:500
        })
        
    }

}
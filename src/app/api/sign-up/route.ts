import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";


export async function POST(request:Request) {
await dbConnect()

try {
    const {username, email, password} = await request.json()
    const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified:true
    })

    if(existingUserVerifiedByUsername) {
        return Response.json({
            message:"username is already taken"
        }, {
            status:400
        })

    }

    const existingUserVerifiedByEmail = await UserModel.findOne({
        email
    })

    const verifyCode = Math.floor(100000  + Math.random() + 90000).toString()


    if(existingUserVerifiedByEmail) {

        if(existingUserVerifiedByEmail.isVerified) {
            return Response.json({
                success:true,
                message:"user already exist"
            }, {
                status:201
            })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserVerifiedByEmail.password = hashedPassword
            existingUserVerifiedByEmail.verifyCode = verifyCode
            existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserVerifiedByEmail.save()
        }

    } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)
        const newUser = new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages:[]

        })

        await newUser.save()


    }

    const emailResponses = await sendVerificationEmail(
        username, 
        email,
        verifyCode
    )

    if(!emailResponses.success) {
        return Response.json({
            success:false,
            message:emailResponses.message
        }, {
            status:401
        })
    } else {
        return Response.json({
            success:true,
            message:"user registerd succesfully"
        }, {
            status:201
        })
    }












    
} catch (error) {
    console.log("error registering user", error)

    return Response.json({
        success:false,
        message:"Error registering user",
    }, {
        status:500
    })
}
}
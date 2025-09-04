import dbConnect from "@/lib/dbConnect";

export async function POST(request:Request) {
await dbConnect()

try {
    const {username, email, password} = await request.json()
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
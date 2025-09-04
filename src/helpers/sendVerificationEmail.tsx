import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../email/VerificationEmail";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse> {
    try {
        
await resend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  react: VerificationEmail({
    username, otp:verifyCode
  }),
});

return{success:true, message:"email send successfully"}
    } catch (error) {
        console.error("email not sent", error)
        return{success:false, message:"email not sent"}
    }


}
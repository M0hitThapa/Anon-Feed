import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect"
import { UserModel } from "./model/user"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials:{
            email:{label:"Email", type:"text"},
            password:{label:"Password", type:"password"}
        },

         authorize: async (credentials:any):Promise<any> => {
            await dbConnect()

            const user = await UserModel.findOne({
                $or:[
                   (credentials.email)
                   (credentials.password)
                ]
            })
if(!user) {
    throw new Error("user not found")
}

if(!user.isVerified) {
    throw new Error("user is not verified")
}

const isPassportVerified = await bcrypt.compare(credentials.password, user.password)

if(isPassportVerified) {
    return user
} else {
    throw new Error("passort is wrong")
}


         }
    })


    
  ],
  callbacks:{
    async jwt({token,user}) {
        if(user) {
            token._id = user.id
            token.isVerified =  user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }
        return token

    },

    async session({session, token}) {
        if(token) {
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
    }

  },

  pages:{
    signIn:'/sign-up'
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.AUTH_SECRET
})
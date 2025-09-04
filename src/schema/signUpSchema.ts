import {z} from "zod";


const userNameValidation = z.string().min(3, "username must have at least 3 character").max(20, "username shouldnot have more than 20 characters")

export const signUpValidation = z.object({
    username:userNameValidation,
    email:z.email({message:"invalid email address"}),
    password:z.string().min(6, "password must contain 6 character")

})
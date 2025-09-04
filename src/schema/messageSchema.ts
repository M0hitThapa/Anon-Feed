import {z} from "zod";


export const messageSchema = z.object({
    content:z.string().min(10, "content should have minimum 10 character").max(300,"content should have at least 300 character")
})
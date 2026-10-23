import { z } from "zod"

export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(4000),
  }).strict()).min(1).max(20),
}).strict().refine(({ messages }) => messages.reduce((total, message) => total + message.content.length, 0) <= 16000, "Conversation is too long")
  .refine(({ messages }) => messages[messages.length - 1]?.role === "user", "The final message must be from the user")

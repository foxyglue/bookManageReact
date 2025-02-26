import { z } from "zod";

export const UserModel = z.object({
  data: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
  }),
});

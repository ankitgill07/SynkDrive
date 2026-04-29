import { email, z } from "zod/v4";

export const loginValidate = z.object({
  email: z.email(),
  password: z.string(),
});

export const registerValidate = loginValidate.extend({
  name: z.string(),
  otp: z.string().regex(/^\d{6}$/),
  trems: z.boolean(),
});

export const shareEamilValidate = z.object({
  email: z.email(),
  permission: z.string(),
});


import * as z from 'zod';

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(6).max(12),
  password: z.string().min(5),
  avatar: z.string().optional(),
});

export type UserPayload = z.infer<typeof UserSchema>;

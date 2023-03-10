import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
  let message = '';
  error.issues.forEach(
    (issue) => (message = `${issue.path[0]} ${issue.message}`.toLowerCase()),
  );

  return message;
};

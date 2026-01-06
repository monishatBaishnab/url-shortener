import { z } from 'zod';

const createLinkSchema = z.object({
  original_link: z
    .string()
    .url('Invalid URL format')
    .min(1, 'Original link is required'),
});

export const LinkValidation = {
  createLinkSchema,
};

import prismaClient from '../lib/prisma.js';

const generateShortCode = (length: number = 6): string => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

export const generateUniqueShortCode = async (
  length: number = 6,
): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const shortCode = generateShortCode(length);

    // Check if code already exists
    const existingLink = await prismaClient.link.findUnique({
      where: { keyword: shortCode },
    });

    if (!existingLink) {
      return shortCode;
    }

    attempts++;
  }

  // If all attempts failed, try with longer code
  return generateUniqueShortCode(length + 1);
};

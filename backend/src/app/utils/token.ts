import type { User } from '@prisma/client';
import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string | undefined;
}

export const createToken = (payload: User, secret: Secret, expiresIn: any) => {
  // Create an object for token
  const tokenData: TokenPayload = {
    id: payload?.id,
    email: payload?.email,
  };

  // Create a JWT token
  const token = jwt.sign(tokenData, secret, {
    expiresIn,
  });

  return token;
};

// Function to verify the provided token and extract the payload data
export const verifyToken = (token: string, secret: Secret): TokenPayload => {
  const verifiedUser = jwt.verify(token, secret);
  return verifiedUser as TokenPayload;
};

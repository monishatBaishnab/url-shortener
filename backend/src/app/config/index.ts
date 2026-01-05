import env from 'dotenv';
import path from 'path';

env.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  PORT: process.env.PORT || 3000,
  BCRYPT_SALT: process.env.BCRYPT_SALT,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

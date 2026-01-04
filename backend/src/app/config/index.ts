import env from "dotenv";
import path from "path";

env.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: process.env.PORT || 3000,
  bcrypt_salt: process.env.BCRYPT_SALT,
  jwt_secret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV,
};

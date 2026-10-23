import jwt from "jsonwebtoken";

export const signToken = async (payload, options = {}) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not configured");
  }
  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = async (token) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not configured");
  }
  return jwt.verify(token, SECRET_KEY);
};

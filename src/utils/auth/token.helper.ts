import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "1H";
//for token generate
//@param payload :object
export const _generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
//for token verify
//@param  token:string
export const _verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
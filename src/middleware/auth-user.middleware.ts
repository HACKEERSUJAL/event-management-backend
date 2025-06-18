import { Request, Response, NextFunction } from "express";
import { response } from "../utils/response";
import { _verifyToken } from "../utils/auth/token.helper";
import { HttpStatus } from "../utils/http-status";
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return response(
      res,
      HttpStatus.UNAUTHORIZED,
      {
        message: "Access Forbidden",
        success: false,
        data: null,
      },
      true
    );
  }
  const [_, token] = authHeader.split(" ");
  try {
    const decode = _verifyToken(token);
    (req as any).user = decode.userId;
    next();
  } catch (error) {
    response(
      res,
      HttpStatus.UNAUTHORIZED,
      {
        message: "Invalid token",
        success: false,
        data: null,
      },
      true
    );
  }
};

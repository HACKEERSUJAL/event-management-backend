import { Request, Response } from "express";
import { HttpStatus } from "../utils/http-status";
import { response } from "../utils/response";
import {
  _createUser,
  _getUser,
  _getUserById,
  _updateUser,
} from "../services/user.service";
import { cloudinary } from "../utils/cloudinary";
import { validateRegisterData } from "../validateSchema/auth-userSchema";
import { UserModel } from "../models/user.model";
import { _comparePassword, _hashPassword } from "../utils/auth/hasher";
import { _generateToken } from "../utils/auth/token.helper";
import { uploadImg } from "../utils/avatarHelper";

export const userController = async (req: Request, res: Response) => {
  try {
    const validateData = await validateRegisterData.validate(req.body, {
      abortEarly: false,
    });
    const { username, email, password } = validateData;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response(res, HttpStatus.BAD_REQUEST, {
        message: "Email already exists",
        data: null,
        success: false,
      });
    }

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      username
    )}&background=random`;

    const cloudinaryResult = await uploadImg(avatarUrl);

    const hashedPassword = await _hashPassword(password);

    const user = await _createUser({
      username,
      email,
      password: hashedPassword,
      avatar: cloudinaryResult.secure_url,
      avatarPublicId: cloudinaryResult.public_id,
    });

    return response(res, HttpStatus.CREATED, {
      message: "User created successfully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    console.error("Error in userController:", error);
    return response(res, HttpStatus.BAD_REQUEST, {
      message: "Unexpected error occurred",
      data: error.errors || null,
      success: false,
    });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const existingUser = await _getUserById(id);
    if (!existingUser) {
      return response(res, HttpStatus.NOT_FOUND, {
        message: "User not found",
        data: null,
        success: false,
      });
    }

    let avatar = existingUser.avatar;
    let avatarPublicId = existingUser.avatarPublicId;

    if (req.file && req.file.path) {
      if (avatarPublicId) {
        await cloudinary.uploader.destroy(avatarPublicId);
      }
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);
      avatar = cloudinaryResult.secure_url;
      avatarPublicId = cloudinaryResult.public_id;
    }
    const updateUser = await _updateUser(id, {
      username,
      email,
      avatar,
      avatarPublicId,
    });
    return response(res, HttpStatus.OK, {
      message: "User updated successfully",
      data: updateUser,
      success: true,
    });
  } catch (error: any) {
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Unexpected error occurred",
      success: false,
      data: error.errors,
    });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const data = await _getUser();
    return response(res, HttpStatus.OK, {
      message: "User found successfully",
      data: data,
      success: true,
    });
  } catch (error: any) {
    response(res, HttpStatus.BAD_REQUEST, {
      message: "User not found",
      success: false,
      data: null,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return response(res, HttpStatus.BAD_REQUEST, {
        message: "Email with this Not Found Go to Register",
        data: null,
        success: false,
      });
    }
    const isValidPassword = await _comparePassword(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return response(res, HttpStatus.UNAUTHORIZED, {
        message: "Invalid Password",
        data: null,
        success: false,
      });
    }

    const payload = { userId: existingUser._id };
    const token = _generateToken(payload);
    return response(res, HttpStatus.OK, {
      message: "Login Success",
      data: { token },
      success: true,
    });
  } catch (error: any) {
    console.log("Error logging in user:", error);
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Internal Server Error",
      data: null,
      success: false,
    });
  }
};

import {
  _createCategories,
  _getAllCategories,
} from "../services/category.service";
import { HttpStatus } from "../utils/http-status";
import { response } from "../utils/response";
import { Request, Response } from "express";

export const categoryController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return response(res, HttpStatus.UNAUTHORIZED, {
        message: "Category name is required",
        success: false,
        data: null,
      });
    }
    const category = await _createCategories({ name });
    return response(res, HttpStatus.CREATED, {
      message: "Category created successfully",
      data: category,
      success: true,
    });
  } catch (error: any) {
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Error creating category",
      data: error.message,
      success: false,
    });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await _getAllCategories();
    return response(res, HttpStatus.OK, {
      message: "Categories retrieved successfully",
      data: categories,
      success: true,
    });
  } catch (error: any) {
    return response(res, HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Error retrieving categories",
      data: error.message,
      success: false,
    });
  }
};

import { CategoriesModel } from "../models/categories.models";
import { CategoryType } from "../types/categories.type";

export const _createCategories = async (data: CategoryType) => {
  try {
    const addCategory = await CategoriesModel.create(data);
    return addCategory;
  } catch (error: any) {
    console.log("error in creating categories service", error);
    throw error;
  }
};

export const _getAllCategories = async () => {
  try {
    const categories = await CategoriesModel.find();
    return categories;
  } catch (error: any) {
    console.log("error in getting all categories service", error);
    throw error;
  }
};

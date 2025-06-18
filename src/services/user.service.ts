import { UserModel } from "../models/user.model";
import { UserType } from "../types/userType";

export const _createUser = async (data: UserType) => {
  try {
    const addUser = await UserModel.create(data);
    return await addUser.save();
  } catch (error: any) {
    console.log("Error in creating user in service :", error);
    throw error;
  }
};

export const _updateUser = async (id: string, data: Partial<UserType>) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateUser;
  } catch (error: any) {
    console.log("Error in updating user in service :", error);
    throw error;
  }
};

export const _getUser = async () => {
  try {
    const users = await UserModel.find({}).select("-password");
    return users;
  } catch (error: any) {
    console.log("Error  getting all users from service:", error);
    throw error;
  }
};

export const _getUserById = async (id: string) => {
  try {
    const getUsers = await UserModel.findById(id).select("-password");
    return getUsers;
  } catch (error: any) {
    console.log("Error in getting users by id in service", error);
    throw error;
  }
};

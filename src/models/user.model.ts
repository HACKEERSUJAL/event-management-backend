import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    avatarPublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);

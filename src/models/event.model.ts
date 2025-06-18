import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true,
      },
    ],

    banner: {
      type: String,
      required: true,
    },
    bannerPublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);

import axios from "axios";
import { cloudinary } from "./cloudinary";
import streamifier from "streamifier";

type CloudinaryFile = {
  secure_url: string;
  public_id: string;
};

export const uploadImg = async (imgUrl: string): Promise<CloudinaryFile> => {
  try {
    const res = await axios.get<ArrayBuffer>(imgUrl, {
      responseType: "arraybuffer",
    });

    const fileBuffer = Buffer.from(res.data);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatar",
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Upload from URL failed:", error);
    throw error;
  }
};

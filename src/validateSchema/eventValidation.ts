import * as Yup from "yup";

export const EventSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  categories: Yup.array().of(Yup.string()).required("Categories are required"),
  createdBy: Yup.string().required("CreatedBy is required"),
});

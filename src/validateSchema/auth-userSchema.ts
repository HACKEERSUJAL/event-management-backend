import * as Yup from "yup";
export const validateRegisterData = Yup.object({
  username: Yup.string()
    .required("Name must be required")
    .min(3, "Name at least 3 char")
    .max(20, "Name must be less than 20 char"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email must be required"),
  password: Yup.string()
    .required("Password must be required")
    .min(6, "Password must be at least 6 characters"),
//   avatar: Yup.string().required("avatar must be required"),
});



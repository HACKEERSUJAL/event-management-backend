import { Response } from "express";


type ResponseDataType = {
  message: string;
  success: boolean;
  data: any;
};


export const response = (
  res: Response,
  statusCode: number,
  data: ResponseDataType = { message: "An error occured", success: false , data:null},
  isError: boolean = false
): void => {
  if (isError) res.status(statusCode).send(JSON.stringify(data));
  else res.status(statusCode).send(JSON.stringify(data));
};

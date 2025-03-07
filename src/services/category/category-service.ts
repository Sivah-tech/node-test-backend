import { Response } from "express";
import { errorResponseHandler } from "../../lib/errors/error-response-handler";
import { httpStatusCode } from "../../lib/constant";
import { queryBuilder } from "../../utils";
import { usersModel } from "src/models/user/user-schema";
import { categoryModel } from "src/models/category/category-schema";
import { customAlphabet } from "nanoid";




export const getAllcategoryService = async (payload: any) => {
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 0;
  const offset = (page - 1) * limit;
  const { query, sort } = queryBuilder(payload, ["name"]);
  const totalDataCount =
    Object.keys(query).length < 1
      ? await categoryModel.countDocuments()
      : await categoryModel.countDocuments(query);
  const results = await categoryModel
    .find(query)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .select("-__v");
  if (results.length)
    return {
      page,
      limit,
      success: true,
      total: totalDataCount,
      data: results,
    };
  else {
    return {
      data: [],
      page,
      limit,
      success: false,
      total: 0,
    };
  }
};



export const getACategoryService = async (id: string, res: Response) => {
  const user = await categoryModel.findById(id);
  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );

  return {
    success: true,
    message: "User retrieved successfully",
    data: {
      user,
    },
  };
};



export const updateACategoryrService = async (
  id: string,
  payload: any,
  res: Response
) => {
  const user = await categoryModel.findById(id);
  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );
  // const countryCode = "+45";
  // payload.phoneNumber = `${countryCode}${payload.phoneNumber}`;
  const updateduser = await categoryModel.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true }
  );

  return {
    success: true,
    message: "category updated successfully",
    data: updateduser,
  };
};



export const createcategoryService = async (payload: any, res: Response) => {

  const user = new categoryModel({
    ...payload,
  });

  await user.save();

  return {
    success: true,
    message: "Category created successfully",
  };
};

export const deleteACategoryService = async (id: string, res: Response) => {
  const user = await categoryModel.findById(id);
  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );

  // Delete user ----
  await categoryModel.findByIdAndDelete(id);

  return {
    success: true,
    message: "User deleted successfully",
  };
};










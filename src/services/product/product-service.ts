import { Response } from "express";
import { errorResponseHandler } from "../../lib/errors/error-response-handler";
import { httpStatusCode } from "../../lib/constant";
import { queryBuilder } from "../../utils";
import { usersModel } from "../../models/user/user-schema";
import { categoryModel } from "../../models/category/category-schema";
import { productModel } from "../../models/product/product-schema";
import { customAlphabet } from "nanoid";




export const getAllProductService = async (payload: any) => {
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 0;
  const offset = (page - 1) * limit;
  const { query, sort } = queryBuilder(payload, ["name"]);
  const totalDataCount =
    Object.keys(query).length < 1
      ? await productModel.countDocuments()
      : await productModel.countDocuments(query);
  const results = await productModel
    .find(query)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .select("-__v")
    .populate('category_id'); // Populate category_id field here;

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



export const getAProductService = async (id: string, res: Response) => {
  const user = await productModel.findById(id);
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


  export const getAProductByCategoryService = async (id: string, res: Response) => {
    // Find products by category_id
    const products = await productModel
      .find({ category_id: id }) // Filter by category_id
      .populate('category_id'); // Populate the category details

    if (!products || products.length === 0) {
      return errorResponseHandler(
        "No products found for this category",
        httpStatusCode.NOT_FOUND,
        res
      );
    }

    return {
      success: true,
      message: "Products retrieved successfully",
      data: products,
    };
};









export const updateAProductrService = async (
  id: string,
  payload: any,
  res: Response
) => {
  const user = await productModel.findById(id);
  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );
  // const countryCode = "+45";
  // payload.phoneNumber = `${countryCode}${payload.phoneNumber}`;
  const updateduser = await productModel.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true }
  );

  return {
    success: true,
    message: "User updated successfully",
    data: updateduser,
  };
};



export const createProductService = async (payload: any, res: Response) => {
  // Proceed with creating the user
  const currentUserId = payload.currentUser;

  const user = new productModel({
    ...payload,
  });

  await user.save();

  return {
    success: true,
    message: "Product created successfully",
  };
};

export const deleteAProductService = async (id: string, res: Response) => {
  const user = await productModel.findById(id);
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










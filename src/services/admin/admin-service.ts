import { adminModel } from "../../models/admin/admin-schema";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { errorResponseHandler } from "../../lib/errors/error-response-handler";
import { httpStatusCode } from "../../lib/constant";
import { queryBuilder } from "../../utils";
import { sendPasswordResetEmail } from "src/utils/mails/mail";
import {
  generatePasswordResetToken,
  getPasswordResetTokenByToken,
  generatePasswordResetTokenByPhone,
} from "src/utils/mails/token";
import { generatePasswordResetTokenByPhoneWithTwilio } from "../../utils/sms/sms";
import { passwordResetTokenModel } from "src/models/password-token-schema";
import { usersModel } from "src/models/user/user-schema";
import { faqModel } from "src/models/faq/faq-schema";
import { suggestionModel } from "src/models/suggestions/suggestion-schema";
import { testimonialModel } from "src/models/testimonail/testimonial-schema";
import { contactusModel } from "src/models/contactus/contact-schema";
import { customAlphabet } from "nanoid";

export const loginService = async (payload: any, res: Response) => {
  const { username, password } = payload;
  const countryCode = "+45";
  const toNumber = Number(username);
  const isEmail = isNaN(toNumber);
  let user: any = null;

  if (isEmail) {
    user = await adminModel.findOne({ email: username }).select("+password");
    if (!user) {
      user = await usersModel.findOne({ email: username }).select("+password");
    }
  } else {
    const formattedPhoneNumber = `${countryCode}${username}`;
    user = await adminModel
      .findOne({ phoneNumber: formattedPhoneNumber })
      .select("+password");
    if (!user) {
      user = await usersModel
        .findOne({ phoneNumber: formattedPhoneNumber })
        .select("+password");
    }
  }

  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponseHandler(
      "Invalid password",
      httpStatusCode.UNAUTHORIZED,
      res
    );
  }
  const userObject = user.toObject();
  delete userObject.password;

  return {
    success: true,
    message: "Login successful",
    data: {
      user: userObject,
    },
  };
};

export const forgotPasswordService = async (payload: any, res: Response) => {
  const { username } = payload;
  const countryCode = "+91";
  const toNumber = Number(username);
  const isEmail = isNaN(toNumber);
  let user: any = null;
  if (isEmail) {
    user = await adminModel.findOne({ email: username }).select("+password");
    if (!user) {
      user = await usersModel.findOne({ email: username }).select("+password");
    }
    if (!user)
      return errorResponseHandler(
        "User not found",
        httpStatusCode.NOT_FOUND,
        res
      );

    const passwordResetToken = await generatePasswordResetToken(username);
    if (passwordResetToken) {
      await sendPasswordResetEmail(username, passwordResetToken.token);
      return { success: true, message: "Password reset email sent with OTP" };
    }
  } else {
    const formattedPhoneNumber = `${countryCode}${username}`;
    user = await adminModel
      .findOne({ phoneNumber: formattedPhoneNumber })
      .select("+password");
    if (!user) {
      user = await usersModel
        .findOne({ phoneNumber: formattedPhoneNumber })
        .select("+password");
    }
    if (!user)
      return errorResponseHandler(
        "User not found",
        httpStatusCode.NOT_FOUND,
        res
      );

    const passwordResetTokenBySms = await generatePasswordResetTokenByPhone(
      formattedPhoneNumber
    );
    if (passwordResetTokenBySms) {
      await generatePasswordResetTokenByPhoneWithTwilio(
        formattedPhoneNumber,
        passwordResetTokenBySms.token
      );
      return { success: true, message: "Password reset SMS sent with OTP" };
    }
  }

  return errorResponseHandler(
    "Failed to generate password reset token",
    httpStatusCode.INTERNAL_SERVER_ERROR,
    res
  );
};

export const newPassswordAfterOTPVerifiedService = async (
  payload: { password: string; otp: string },
  res: Response
) => {
  // console.log('payload: ', payload);
  const { password, otp } = payload;

  const existingToken = await getPasswordResetTokenByToken(otp);
  if (!existingToken)
    return errorResponseHandler("Invalid OTP", httpStatusCode.BAD_REQUEST, res);

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired)
    return errorResponseHandler("OTP expired", httpStatusCode.BAD_REQUEST, res);

  let existingAdmin: any;

  if (existingToken.email) {
    existingAdmin = await adminModel.findOne({ email: existingToken.email });
  } else if (existingToken.phoneNumber) {
    existingAdmin = await adminModel.findOne({
      phoneNumber: existingToken.phoneNumber,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await adminModel.findByIdAndUpdate(
    existingAdmin._id,
    { password: hashedPassword },
    { new: true }
  );
  await passwordResetTokenModel.findByIdAndDelete(existingToken._id);

  return {
    success: true,
    message: "Password updated successfully",
    data: response,
  };
};

export const getAllUsersService = async (payload: any) => {
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 0;
  const offset = (page - 1) * limit;
  const { query, sort } = queryBuilder(payload, ["fullName"]);
  const totalDataCount =
    Object.keys(query).length < 1
      ? await usersModel.countDocuments()
      : await usersModel.countDocuments(query);
  const results = await usersModel
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

export const getAllsuggestionService = async (payload: any) => {
  // Set pagination defaults if not provided
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 10; // Default to 10 if not specified
  const offset = (page - 1) * limit;

  // Build query and sort objects using the updated queryBuilder
  const { query, sort } = queryBuilder(payload, ["text"]);

  // Get the total count of documents based on the query filter (if any)
  const totalDataCount =
    Object.keys(query).length < 1
      ? await suggestionModel.countDocuments() // If no query, count all documents
      : await suggestionModel.countDocuments(query); // If query exists, count filtered documents

  // Fetch the filtered and paginated results from the database
  const results = await suggestionModel
    .find(query)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .select("-__v"); // Exclude __v field

  // Return the results or an empty array if no results found
  if (results.length) {
    return {
      page,
      limit,
      success: true,
      total: totalDataCount,
      data: results,
    };
  } else {
    return {
      data: [],
      page,
      limit,
      success: false,
      total: 0,
    };
  }
};

export const createcontactService = async (payload: any, res: Response) => {
  const user = new contactusModel({
    ...payload,
  });

  await user.save();

  return {
    success: true,
    message: "message successfully sent.",
  };
};

export const getAlltestimonailService = async (payload: any) => {
  // Set pagination defaults if not provided
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 10; // Default to 10 if not specified
  const offset = (page - 1) * limit;

  // Build query and sort objects using the updated queryBuilder
  const { query, sort } = queryBuilder(payload, ["text"]);

  // Get the total count of documents based on the query filter (if any)
  const totalDataCount =
    Object.keys(query).length < 1
      ? await testimonialModel.countDocuments() // If no query, count all documents
      : await testimonialModel.countDocuments(query); // If query exists, count filtered documents

  // Fetch the filtered and paginated results from the database
  const results = await testimonialModel
    .find(query)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .select("-__v"); // Exclude __v field

  // Return the results or an empty array if no results found
  if (results.length) {
    return {
      page,
      limit,
      success: true,
      total: totalDataCount,
      data: results,
    };
  } else {
    return {
      data: [],
      page,
      limit,
      success: false,
      total: 0,
    };
  }
};

export const getAllFaqService = async (payload: any) => {
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 0;
  const offset = (page - 1) * limit;
  const { query, sort } = queryBuilder(payload, ["fullName"]);
  const totalDataCount =
    Object.keys(query).length < 1
      ? await faqModel.countDocuments()
      : await faqModel.countDocuments(query);
  const results = await faqModel
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

export const getUserInfoService = async (id: string, res: Response) => {
  const user = await usersModel.findById(id);
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

export const getAlluserService = async (payload: any) => {
  const page = parseInt(payload.page as string) || 1;
  const limit = parseInt(payload.limit as string) || 0;
  const offset = (page - 1) * limit;
  const { query, sort } = queryBuilder(payload, ["fullName"]);
  const totalDataCount =
    Object.keys(query).length < 1
      ? await usersModel.countDocuments()
      : await usersModel.countDocuments(query);
  const results = await usersModel
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

export const getAUserService = async (id: string, res: Response) => {
  //   const user = await usersModel.findById(id);
  //   if (!user) return errorResponseHandler("User not found", httpStatusCode.NOT_FOUND, res);
  //   const userProjects = await projectsModel.find({ userId: id }).select("-__v");
  //   return {
  //       success: true,
  //       message: "User retrieved successfully",
  //       data: {
  //           user,
  //           projects: userProjects.length > 0 ? userProjects : [],
  //       }
  //   };
};

export const updateAUserService = async (
  id: string,
  payload: any,
  res: Response
) => {
  const user = await usersModel.findById(id);
  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );
  // const countryCode = "+45";
  // payload.phoneNumber = `${countryCode}${payload.phoneNumber}`;
  const updateduser = await usersModel.findByIdAndUpdate(
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

export const createuserService = async (payload: any, res: Response) => {
  // Check if the email already exists
  const existingUser = await usersModel.findOne({ email: payload.email });

  if (existingUser) {
    return errorResponseHandler(
      "Email already exists",
      httpStatusCode.BAD_REQUEST,
      res
    );
  }

  // Proceed with creating the user
  const currentUserId = payload.currentUser;

  const identifier = customAlphabet("0123456789", 3);
  payload.identifier = identifier();
  const user = new usersModel({
    ...payload,
  });

  await user.save();

  return {
    success: true,
    message: "User created successfully",
  };
};

export const deleteAUserService = async (id: string, res: Response) => {
  const user = await usersModel.findById(id);
  if (!user)
    return errorResponseHandler(
      "User not found",
      httpStatusCode.NOT_FOUND,
      res
    );

  // Delete user ----
  await usersModel.findByIdAndDelete(id);

  return {
    success: true,
    message: "User deleted successfully",
  };
};

// DashboardgetAlluserService

export const getDashboardStatsService = async (payload: any, res: Response) => {
  const currentDate = new Date();

  const totalusers = await usersModel.countDocuments();

  // Prepare response data
  const response = {
    success: true,
    message: "Dashboard stats fetched successfully",
    data: {
      totalusers,
    },
  };

  return response;
};


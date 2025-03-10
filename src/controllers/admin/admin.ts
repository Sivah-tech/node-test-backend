import { Request, Response } from "express"
import { formatZodErrors } from "../../validation/format-zod-errors";
import {
    loginService, newPassswordAfterOTPVerifiedService, forgotPasswordService,getAlluserService,getUserInfoService,createuserService,createcontactService,
    getAUserService, updateAUserService, deleteAUserService, getDashboardStatsService,getAllFaqService , getAllsuggestionService, getAlltestimonailService

} from "../../services/admin/admin-service";
import { errorParser } from "../../lib/errors/error-response-handler";
import { httpStatusCode } from "../../lib/constant";
import { z } from "zod";
import mongoose from "mongoose";


//Auth Controllers
export const login = async (req: Request, res: Response) => {
    try {

        const response = await loginService(req.body, res)
        return res.status(httpStatusCode.OK).json(response)

    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const forgotPassword = async (req: Request, res: Response) => {

    try {
        const response = await forgotPasswordService(req.body, res)
        return res.status(httpStatusCode.OK).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const newPassswordAfterOTPVerified = async (req: Request, res: Response) => {
    try {
        const response = await newPassswordAfterOTPVerifiedService(req.body, res)
        return res.status(httpStatusCode.OK).json(response)
    }
    catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}



export const getAllfaq = async (req: Request, res: Response) => {
    try {
        const response = await getAllFaqService(req.query)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getAllsuggestion = async (req: Request, res: Response) => {
    try {
        const response = await getAllsuggestionService(req.query)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getAlltestimonail = async (req: Request, res: Response) => {
    try {
        const response = await getAlltestimonailService(req.query)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const contactUs = async (req: Request, res: Response) => {
    try {
        const response = await createcontactService({ currentUser: (req as any).currentUser, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}



export const getAUser = async (req: Request, res: Response) => {
    try {
        const response = await getAUserService(req.params.id, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const deleteAUser = async (req: Request, res: Response) => {
    try {
        const response = await deleteAUserService(req.params.id, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const updateAUser = async (req: Request, res: Response) => {
    try {
        const response = await updateAUserService(req.params.id, req.body, res);
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const response = await getDashboardStatsService(req, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // console.log(req.query);
        const response = await getAlluserService(req.query)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}



export const createbid = async (req: Request, res: Response) => {
    try {
        const response = await createbidService({ currentUser: (req as any).currentUser, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


export const updateAbid = async (req: Request, res: Response) => {
    try {
        const response = await updateABidService(req.params.id, req.body, res);
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


export const dashboardOverviewstat = async (req: Request, res: Response) => {
    try {
       const { month, year } = req.query;

        const response = await dashboardOverviewstatservice(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const dashboardchartstat = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        const response = await dashboardchartstatservice(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


export const getAllusertech = async (req: Request, res: Response) => {
    try {
        // const response = await getAllusertechService({ currentUser: (req as any).currentUser, ...req.body }, res)
        const { month, year } = req.query;

        const response = await getAllusertechService(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const gettargetDashboardstats = async (req: Request, res: Response) => {
    try {
        const response = await gettargetDashboardstatsService(req, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const createtarget = async (req: Request, res: Response) => {
    try {
        const response = await createtargetService({ currentUser: (req as any).currentUser, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const response = await createuserService({ currentUser: (req as any).currentUser, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}



export const updatetarget = async (req: Request, res: Response) => {
    try {
        const response = await updatetargetService({ currentUser: (req as any).currentUser, ...req.body }, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}


export const targetstat = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        const response = await targetstatservice(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const targetpercentstat = async (req: Request, res: Response) => {
    try {

        const { month, year } = req.query;

        const response = await targetpercentstatservice(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const response = await getUserInfoService(req.params.id, res)
        return res.status(httpStatusCode.OK).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const targetteamstat = async (req: Request, res: Response) => {
    try {
        // const response = await targetteamstatservice({ currentUser: (req as any).currentUser, ...req.body }, res)
        const { month, year } = req.query;

        const response = await targetteamstatservice(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}

export const targetrevenuestat = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;

        const response = await targetrevenuestatservice(
            { 
                currentUser: (req as any).currentUser,
                month: month ? parseInt(month as string) : undefined, 
                year: year ? parseInt(year as string) : undefined 
            }, 
            res
        );
        
        // const response = await targetrevenuestatservice({ currentUser: (req as any).currentUser, ...req.body }, res)
        return res.status(httpStatusCode.CREATED).json(response)
    } catch (error: any) {
        const { code, message } = errorParser(error)
        return res.status(code || httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: message || "An error occurred" });
    }
}



import { Response, Request, NextFunction } from "express";
import { invalidateCache } from "../utils/functions.js";

export type genderTypes = "male" | "female";
export type roleTypes = "admin" | "user";


export interface postRegisterUserTypes {

    name: string,
    email: string,
    password: string,
    user: string,
    photo: string,
    gender: genderTypes,
    _id: string,
    dob: Date,
}



export interface newProductReqType {

    name: string,
    category: string,
    price: number,
    stock: number,
}




export type CatchAsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;




export interface SearchRequestQuery {
    category?: string,
    price?: string,
    search?: string,
    sort?: string,
    page?: string,
};



export interface BaseQueryType {
    name?: {
        $regex: string,
        $options: string,
    },
    price?: {
        $lte: number,
    },
    category?: string,
}




export type invalidateCacheType = {
    products?: boolean,
    admin?: boolean,
    order?: boolean,
}
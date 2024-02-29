import { Response, Request, NextFunction } from "express";

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




export type CatchAsyncController = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;





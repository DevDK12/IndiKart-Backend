import { NextFunction, Request, Response } from "express";
import { CatchAsyncController } from "../types/types.js";

const CatchAsync = (
    fn: CatchAsyncController) => async (req: Request, res: Response, next: NextFunction) => {

    return Promise.resolve(fn(req, res, next))
    .catch(error => next(error));

}




//_ DO this later

// const CatchAsync = <T extends Request, U extends Response, V extends NextFunction> (
//     fn: (req: T, res: U, next: V) => Promise<unknown>) => async (req: T, res: U, next: V) => {

//     return Promise.resolve(fn(req, res, next))
//     .catch(error => next(error));

// }



export default CatchAsync;

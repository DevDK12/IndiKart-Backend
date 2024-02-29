import { NextFunction, Request, Response } from "express";
import { CatchAsyncController } from "../types/types.js";

const CatchAsync = (
    fn: CatchAsyncController) => async (req: Request, res: Response, next: NextFunction) => {

    return Promise.resolve(fn(req, res, next))
    .catch(error => next(error));

}


export default CatchAsync;
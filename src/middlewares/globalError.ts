import { NextFunction, Request, Response } from "express";

import { handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB } from "../error/errorHandler.js";
import AppError from "../error/appError.js";



const snedDevelopmentError = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
}




const sendProductionError = (err: AppError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } 

    else {
        //* 1) Log error
        console.error('ERROR 💥', err);

        //* 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
}










const globalError = (err: AppError | any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // console.log('ERR CAUGHT IN GLOBAL MIDDLEWARE'.red.bold);
    console.log('ERR CAUGHT IN GLOBAL MIDDLEWARE');
    console.log(`ERR ${err}`);
    console.log(err.stack);

    if (process.env.NODE_ENV === 'development') {
        snedDevelopmentError(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {

        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.name === 'ValidationError')  err = handleValidationErrorDB(err);
        if (err.code === '11000') err = handleDuplicateFieldsDB(err);


        sendProductionError(err, res);
    }


    next();

}

export default globalError;
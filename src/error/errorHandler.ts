import AppError from "./appError.js";

export const handleCastErrorDB = (err : AppError |  any ) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};




export const handleDuplicateFieldsDB = (err : AppError | any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};




export const handleValidationErrorDB = (err : AppError | any) => {
    const errors = Object.values(err.errors).map((el : any) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

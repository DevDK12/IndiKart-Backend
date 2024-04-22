import AppError from "../error/appError.js";
import CatchAsync from "../error/catchAsync.js";
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import { JWTPayload } from "../types/types.js";




//_ Extract this into custom.d.ts file and include it in tsconfig.json

//* Anything that goes thorugh this middleware will definitely have userId on req

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}



export const auth = CatchAsync(async (req, res, next) => {

    const AuthHeader = req.headers.authorization;

    if (!AuthHeader) throw new AppError('Authorization header not found', 401);

    const token = AuthHeader;

    if (!token) throw new AppError('Token not found', 401);

    const access_secret = process.env.ACCESS_SECRET;
    if(!access_secret) throw new AppError('Access secret not defined', 401);

    let decodedToken: JWTPayload | undefined;
    try {
        decodedToken = jwt.verify(token, access_secret) as JWTPayload;
    } catch (err) {
        return next(new AppError('Invalid token', 401));
    }

    console.log(decodedToken);

    const user = await User.findById(decodedToken.userData._id);

    if (!user) {
        return next(new AppError('User no longer exists', 401));
    }

    req.userId = user._id;

    
    next();

})



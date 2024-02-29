import { NextFunction, Request, Response } from "express";
import { postRegisterUserTypes } from "../types/types.js";
import User from '../models/user.js'
import CatchAsync from "../error/catchAsync.js";





export const postRegisterUser = CatchAsync( async (
    req: Request<{}, {}, postRegisterUserTypes>,
    res: Response,
    next: NextFunction
) => {

        const { name, email, password, user, photo, gender, _id, dob } = req.body;

        // console.log(name, email, password, user, photo, gender, _id, dob);

        const newUser = new User({
            username: name,
            email,
            _id,
            image: photo,
            password,
            role: 'user',
            dob: new Date(dob),
            gender,
        });

        await newUser.save();


        res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
        });


});








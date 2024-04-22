import { Request} from "express";

import User from '../models/user.js'
import CatchAsync from "../error/catchAsync.js";
import AppError from "../error/appError.js";






export const getAllUsers = CatchAsync(async (req: Request, res, next) => {


    const users = await User.find({});

    if (!users) throw new AppError('No users found', 400);

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })

});






export const getUser = CatchAsync(async (req, res, next) => {

    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) throw new AppError('No user found', 400);


    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })

});





export const deleteUser = CatchAsync(async (req, res, next) => {

    const { userId } = req.params;

    const response = await User.findByIdAndDelete(userId);

    if (!response) throw new AppError('No user found', 400);

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
    })

});












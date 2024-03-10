import { NextFunction, Request, Response } from "express";


import { postLoginUserTypes, postRegisterUserTypes } from "../types/UserTypes.js";
import User from '../models/user.js'
import CatchAsync from "../error/catchAsync.js";
import { genHashedPassword, verifyPassword } from "../utils/functions.js";
import AppError from "../error/appError.js";





export const postRegisterUser = CatchAsync(async (
    req: Request<{}, {}, postRegisterUserTypes>,
    res: Response,
    next: NextFunction
) => {

    const { name, email, password, image, gender, _id, dob } = req.body;

    console.log(name, email, password, image, gender, _id, dob);

    // Check if user already exists
    // Check if email already exists

    const hashedPassword = await genHashedPassword(password);

    const newUser = new User({
        name,
        email,
        _id,
        image,
        password: hashedPassword,
        role: 'user',
        dob: new Date(dob),
        gender,
    });

    await newUser.save();


    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
    });


});






export const postLoginUser = CatchAsync(async (
    req: Request<{}, {}, postLoginUserTypes>,
    res: Response,
    next: NextFunction
) => {

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) throw new AppError('No user found', 400);
    

    //_ Do this part later as type checking remaining

    // const {password: hashedPassword } = user;
    // const match = await verifyPassword(password, hashedPassword);


    res.status(201).json({
        status: 'success',
        message: 'User Loggedin successfully',
    });


});








export const getAllUsers = CatchAsync(async (req, res, next) => {

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












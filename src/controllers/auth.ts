import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import CatchAsync from "../error/catchAsync.js";
import { postLoginUserTypes, postRegisterUserTypes } from "../types/UserTypes.js";
import { genHashedPassword, verifyPassword } from "../utils/functions.js";
import User from "../models/user.js";
import AppError from "../error/appError.js";


export const postSignup = CatchAsync(async (
    req: Request<{}, {}, postRegisterUserTypes>,
    res: Response,
    next: NextFunction
) => {

    const { name, email, password, image, gender, _id, dob } = req.body;

    console.log(name, email, password, image, gender, _id, dob);

    // Check if user already exists
    // Check if email already exists
    //_ These are already handled by Schema Validation in Models

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






export const postLogin = CatchAsync(async (
    req: Request<{}, {}, postLoginUserTypes>,
    res: Response,
    next: NextFunction
) => {

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) throw new AppError('No user found', 400);
    


    const {password: hashedPassword } = user;
    const match = await verifyPassword(password, hashedPassword);

    if(!match) throw new AppError('Wrong password', 401);


    const access_secret = process.env.ACCESS_SECRET;
    if (access_secret === undefined) {
        throw new AppError('Access secret not defined', 401);
    }

    const access_token = jwt.sign({
        userData: {
            _id: user._id,
            email: user.email,
        }
    },
        access_secret,
        { expiresIn: '10m', }
    )

    res.status(201).json({
        status: 'success',
        message: 'User Loggedin successfully',
        token: {
            userId: user._id,
            access_token,
            expiry: new Date(Date.now() + 10*60*1000), //* 10 min time
        }
    });


});













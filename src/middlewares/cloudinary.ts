import { RequestHandler } from "express"

import {v2 as cloudinary} from 'cloudinary';
import CatchAsync from "../error/catchAsync.js";




export const singleImageUpload = (isRequired : boolean) : RequestHandler => CatchAsync(async (req, res, next) => {


    const photo = req.file.photo;


    if (!photo && isRequired) throw new Error('Please upload a photo');
    if (!photo) return next();

    if(Array.isArray(photo)) {
        throw new Error('Please upload only one photo');
    }

    const cloudRes = await cloudinary.uploader.upload(photo.filepath, {
        folder: 'mern-ecommerce/products',
        use_filename: true,
        unique_filename: true,
        overwrite: true,    
    });


    req.body.photoPublicId =  cloudRes.public_id,
    req.body.photoUrl =  cloudRes.secure_url,


    next();
});



//_ Implement later
export const multipleImageUpload : RequestHandler = (req, res, next) => {


    next();
}
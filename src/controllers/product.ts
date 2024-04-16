import { NextFunction, Request, Response } from "express";


import Product from '../models/product.js'
import CatchAsync from "../error/catchAsync.js";
import AppError from "../error/appError.js";
import { BaseQueryType, IProduct, SearchRequestQuery, newProductReqType } from "../types/ProductTypes.js";
import { invalidateCache } from "../utils/functions.js";
import { myCache } from "../app.js";

import { PRODUCTS_PER_PAGE } from "../utils/constants.js";
import {v2 as cloudinary} from 'cloudinary';








export const postNewProduct = CatchAsync(async (
    req: Request<{}, {}, newProductReqType>,
    res: Response,
    next: NextFunction
) => {


    const { name, price, category, stock, user } = req.body;
    const photo = req.file.photo ;

    if (!photo) throw new AppError('Please upload a photo', 400);


    if(Array.isArray(photo)) {
        throw new AppError('Please upload only one photo', 400);
    }


    const cloudRes = await cloudinary.uploader.upload(photo.filepath, {
        folder: 'mern-ecommerce/products',
        use_filename: true,
        unique_filename: true,
        overwrite: true,    
    });


    try {
        await Product.create({
            photo: cloudRes.secure_url,
            photoPublicId: cloudRes.public_id,
            name,
            stock,
            category: category.toLowerCase(),
            price,
            user,
        });

        await invalidateCache({ products: true, admin: true });
    }
    catch (err: any) {
        cloudinary.uploader.destroy(cloudRes.public_id);
        throw new AppError(err.message, 400);
    }

    res.status(201).json({
        status: 'success',
        message: 'Product registered successfully',
    });

});









export const getSingleProduct = CatchAsync(async (req, res, next) => {

    
    const { productId } = req.params;

    const cacheKey = `product-${productId}`;

    let product;
    if (myCache.has(cacheKey)) {
        product = JSON.parse(myCache.get(cacheKey) as string);
    }
    else {
        product = await Product.findById(productId);
        if (product) myCache.set(cacheKey, JSON.stringify(product));
    }


    if (!product) throw new AppError('No product found', 400);


    res.status(200).json({
        status: 'success',
        data: {
            product,
        }
    })

});





export const deleteProduct = CatchAsync(async (req, res, next) => {

    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) throw new AppError('No product found', 400);

    await Product.deleteOne({
        _id: productId,
    });

    await invalidateCache({ products: true, admin: true });

    // deleteImage(product.photo, () => console.log('Old Image deleted'));
    await cloudinary.uploader.destroy(product.photoPublicId);

    res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
    })

});






export const getLatestProducts = CatchAsync(async (req, res, next) => {

    let products = [];
    const {product_per_page} = req.query;
    
    products = await Product.find().sort({ createdAt: -1 }).limit(Number(product_per_page) || 5);


    res.status(200).json({
        status: 'success',
        data: {
            products,
        }
    })

})




export const getAllCategories = CatchAsync(async (req, res, next) => {

    const cacheKey = 'product-categories'

    let categories;
    if (myCache.has(cacheKey)) {
        categories = JSON.parse(myCache.get(cacheKey) as string);
    }
    else {
        categories = await Product.find().distinct('category');
        myCache.set(cacheKey, JSON.stringify(categories));
    }


    res.status(200).json({
        status: 'success',
        data: {
            categories,
        }
    })

});




export const getAdminProducts = CatchAsync(async (req, res, next) => {

    const {userId} = req.params;

    const cacheKey = 'product-all'

    let products;
    if (myCache.has(cacheKey)) {
        products = JSON.parse(myCache.get(cacheKey) as string);
    }
    else {
        products = await Product.find({user: userId});
        myCache.set(cacheKey, JSON.stringify(products));
    }


    res.status(200).json({
        status: 'success',
        data: {
            products,
        }
    })
});




export const putUpdateProduct = CatchAsync(async (req, res, next) => {

    const { productId } = req.params;


    const { name, price, category, stock } = req.body;
    const photo = req.file.photo;

    const product = await Product.findById(productId);

    if (!product) throw new AppError('No product found', 400);


    let publicId = product.photoPublicId;
    let photoUrl = product.photo;


    if(photo &&  !Array.isArray(photo)) {
        // deleteImage(product.photo);
        await cloudinary.uploader.destroy(product.photoPublicId);

        const cloudRes = await cloudinary.uploader.upload(photo.filepath, {
            folder: 'mern-ecommerce/products',
            use_filename: true,
            unique_filename: true,
            overwrite: true,    
        });
        publicId = cloudRes.public_id;
        photoUrl = cloudRes.secure_url;
    }



    product.name = name ?? product.name;
    product.photo = photoUrl;
    product.photoPublicId = publicId;
    product.stock = stock ?? product.stock;
    product.category = category.toLowerCase() ?? product.category;
    product.price = price ?? product.price;

    await product.save();
    await invalidateCache({ products: true, admin: true });


    res.status(201).json({
        status: 'success',
        message: 'Product Updated successfully',
    });
});





export const getQueryProducts = CatchAsync(async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {

    const { search, category, sort, price, product_per_page } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = product_per_page || Number(PRODUCTS_PER_PAGE);
    const skip = (page - 1) * limit;



    const baseQuery: BaseQueryType = {};
    if (search) baseQuery.name = {
        $regex: search,
        $options: 'i',
    };
    if (price) baseQuery.price = { $lte: Number(price) };
    if (category) baseQuery.category = category;

    const allFilteredProductsPerPagePromise = Product.find(baseQuery)
        .sort(sort && { price: sort === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit )

    const allFilteredProductsPromise = Product.find(baseQuery);

    const [products, allFilteredProducts] = await Promise
        .all(
            [
                allFilteredProductsPerPagePromise,
                allFilteredProductsPromise
            ]
        );

    const totalPage = Math.ceil(allFilteredProducts.length / limit );



    res.status(200).json({
        status: 'success',
        data: {
            products,
            totalPage,
        }
    })

});

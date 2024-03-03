import { NextFunction, Request, Response } from "express";


import Product from '../models/product.js'
import CatchAsync from "../error/catchAsync.js";
import AppError from "../error/appError.js";
import { BaseQueryType, SearchRequestQuery, newProductReqType } from "../types/types.js";
import { deleteImage } from "../utils/functions.js";





export const postNewProduct = CatchAsync(async (
    req: Request<{}, {}, newProductReqType>,
    res: Response,
    next: NextFunction
) => {

    const { name, price, category, stock } = req.body;
    const photo = req.file as Express.Multer.File;

    console.log(photo);

    if (!photo) throw new AppError('Please upload a photo', 400);


    try {
        await Product.create({
            photo: photo?.path,
            name,
            stock,
            category: category.toLowerCase(),
            price,
        });
    }
    catch (err: any) {
        deleteImage(photo.path);
        throw new AppError(err.message, 400);
    }

    res.status(201).json({
        status: 'success',
        message: 'Product registered successfully',
    });

});













export const getSingleProduct = CatchAsync(async (req, res, next) => {

    const { productId } = req.params;

    const product = await Product.findById(productId);

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

    deleteImage(product.photo, () => console.log('Old Image deleted'));

    res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
    })

});






export const getLatestProducts = CatchAsync(async (req, res, next) => {

    const products = await Product.find().sort({ createdAt: -1 }).limit(5);


    res.status(200).json({
        status: 'success',
        message: 'Latest Products fetched successfully',
        data: {
            products,
        }
    })

})




export const getAllCategories = CatchAsync(async (req, res, next) => {

    const categories = await Product.find().distinct('category');


    res.status(200).json({
        status: 'success',
        message: 'Latest Products fetched successfully',
        data: {
            categories,
        }
    })

});




export const getAdminProducts = CatchAsync(async (req, res, next) => {

    const products = await Product.find({ role: 'admin' });


    res.status(200).json({
        status: 'success',
        message: 'Latest Products fetched successfully',
        data: {
            products,
        }
    })
});




export const putUpdateProduct = CatchAsync(async (req, res, next) => {

    const { productId } = req.params;

    console.log(productId);

    const { name, price, category, stock } = req.body;
    const photo = req.file as Express.Multer.File;


    const product = await Product.findById(productId);

    if (!product) throw new AppError('No product found', 400);

    // await Product.updateOne(
    //     { _id: productId },
    //     {
    //         ...product,
    //         photo: photo?.path,
    //         name : name ?? product.name,
    //         stock : stock ?? product.stock,
    //         category: category.toLowerCase() ?? product.category,
    //         price : price ?? product.price,
    //     }
    // );

    if (photo) {
        deleteImage(product.photo);
    }

    product.photo = photo?.path ?? product.photo;
    product.name = name ?? product.name;
    product.stock = stock ?? product.stock;
    product.category = category.toLowerCase() ?? product.category;
    product.price = price ?? product.price;

    await product.save();


    res.status(201).json({
        status: 'success',
        message: 'Product Updated successfully',
    });
});





export const getQueryProducts = CatchAsync(async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {

    const { search, category, sort, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.ITEMS_PER_PAGE) || 10;
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
        .limit(limit)

    const allFilteredProductsPromise = Product.find(baseQuery);

    const [products, allFilteredProducts] = await Promise
        .all(
            [
                allFilteredProductsPerPagePromise,
                allFilteredProductsPromise
            ]
        );

    const totalPage = Math.ceil(allFilteredProducts.length / limit);



    res.status(200).json({
        status: 'success',
        data: {
            products,
            totalPage,
        }
    })

});

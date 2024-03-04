import AppError from "../error/appError.js";
import CatchAsync from "../error/catchAsync.js";
import Coupon from "../models/coupon.js";




export const postNewCoupon = CatchAsync(async (req, res, next) => {

    const { coupon, amount, expiry } = req.body;

    if (!coupon || amount === undefined || !expiry) {
        throw new AppError('All fields are required', 400)
    }



    await Coupon.create({
        code: coupon,
        amount,
        expiry: new Date(expiry),
    });


    res.status(201).json({
        status: 'success',
        message: 'Coupon created'
    })

});



export const getAllCoupons = CatchAsync(async (req, res, next) => {

    const coupons = await Coupon.find({});

    res.status(200).json({
        status: 'success',
        message: 'All coupons',
        data: {
            coupons
        }
    });

});



export const deleteCoupon = CatchAsync(async (req, res, next) => {

    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) throw new AppError('Coupon not found', 404);


    res.status(200).json({
        status: 'success',
        message: 'Coupon deleted'
    });

});





export const getApplyDiscount = CatchAsync(async (req, res, next) => {

    const { coupon } = req.query;

    if (!coupon) throw new AppError('Coupon code is required', 400);

    const discount = await Coupon.findOne({ code: coupon });
    if (!discount) throw new AppError('Invalid Coupon code', 400);

    const { amount, expiry } = discount;

    if (new Date(expiry) < new Date()) throw new AppError('Coupon expired', 400);

    res.status(200).json({
        status: 'success',
        message: 'Coupon applied',
        data: {
            discount: amount,
        }
    });


});



import CatchAsync from "../error/catchAsync.js";
import Order from "../models/order.js";
import { NewOrderRequestType } from "../types/OrderTypes.js";
import { Request } from "express";
import { invalidateCache} from "../utils/functions.js";
import AppError from "../error/appError.js";
import { myCache } from "../app.js";
import Product from "../models/product.js";






export const getMyOrders = CatchAsync(async (req, res, next) => {

    const { userId } = req.query;

    const key = `my-orders-${userId}`;


    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    } else {
        orders = await Order.find({ user: userId });
        myCache.set(key, JSON.stringify(orders));
    }


    res.status(200).json({
        status: 'success',
        data: {
            orders,
        }
    })
})




export const getAllOrders = CatchAsync(async (req, res, next) => {

    const key = `all-orders`;

    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    } else {
        orders = await Order.find().populate('user', "name email");

        myCache.set(key, JSON.stringify(orders));
    }


    res.status(200).json({
        status: 'success',
        data: {
            orders,
        }
    })
});



export const getSingleOrder = CatchAsync(async (req, res, next) => {

    const { orderId } = req.params;

    const key = `order-${orderId}`;

    let order;
    if (myCache.has(key)) {
        order = JSON.parse(myCache.get(key) as string);
    } else {
        order = await Order.findById(orderId).populate('user', "name email");
        if (!order) throw new AppError('No order found', 404);
        myCache.set(key, JSON.stringify(order));
    }


    res.status(200).json({
        status: 'success',
        data: {
            order,
        }
    })
});


export const deleteOrder = CatchAsync(async (req, res, next) => {

    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('No order found', 404);

    await Order.findByIdAndDelete(orderId);

    invalidateCache({ products: true, order: true, admin: true });

    res.status(200).json({
        status: 'success',
        message: 'Order deleted successfully'
    })
});





export const postNewOrder = CatchAsync(async (
    req: Request<{}, {}, NewOrderRequestType>,
    res,
    next
) => {

    const {
        shippingInfo,
        user,
        tax,
        shippingCharges,
        total,
        subtotal,
        discount,
        orderItems,
    } = req.body;


    if (!shippingCharges === undefined || !shippingInfo || !user || tax === undefined || total === undefined || subtotal === undefined || discount === undefined || !orderItems) {
        throw new AppError('Please provide all the required fields', 400);
    }


    try {
        await Promise.all(orderItems.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (!product) throw new AppError('Some Product in Order does not exist', 400);
            product.stock -= item.quantity;
            await product.save();
        }));
    } catch (error) {
        const err = error as AppError;
        throw new AppError(err.message, 400);
    }

    await Order.create({
        shippingInfo,
        user,
        tax,
        shippingCharges,
        total,
        subtotal,
        discount,
        orderItems,
    });



    invalidateCache({ products: true, order: true, admin: true });


    res.status(201).json({
        status: 'success',
        message: 'Order placed successfully'
    })

});




export const putProcessOrder = CatchAsync(async (req, res, next) => {

    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('No order found', 404);

    const oldStatus = order.status;


    switch (order.status) {
        case 'processing':
            order.status = 'shipped';
            break;
        case 'shipped':
            order.status = 'delivered';
            break;
        //_ Need to develop diferent api to cancel order
        // case 'delivered':
        //     order.status = 'cancelled';
        //     break;
        default:
            order.status = order.status;
    }

    order.save();
    invalidateCache({ products: true, order: true, admin: true });


    res.status(200).json({
        status: 'success',
        message: `Order ${oldStatus} -> ${order.status} successfully`
    })

});







import express from 'express';
import CatchAsync from '../error/catchAsync.js';
import { deleteRandomsProducts, generateRandomProducts } from '../utils/generateRandomProducts.js';
import { deleteRandomOrders, generateRandomOrders } from '../utils/generateRandomeOrders.js';
import { invalidateCache } from '../utils/functions.js';





const router = express.Router();


router.use('/create-data', CatchAsync(async (req, res, next) => {

    const url = "uploads\\0a3123b8-39ac-4289-b23a-ff9941730971.jpg";
    // const userId = "asdfsdffdadsasdfsdsdfsadffsff";

    const { type, name, amount, userId } = req.query
    if (type === 'new') {
        if (name === "products") generateRandomProducts(Number(amount), url, userId as string);
        if (name === "orders") generateRandomOrders(Number(amount), userId as string);
    }
    else {
        if (name === "products") deleteRandomsProducts(Number(amount));
        if (name === "orders") deleteRandomOrders(Number(amount));
    }

    await invalidateCache({ products: true });

    return res.status(200).json({
        status: 'success',
        message: `Data ${type === 'new' ? 'created' : 'deleted'} successfully`,
    })
})
);

router.get('/revalidate', CatchAsync(async (req, res, next) => {
    await invalidateCache({ products: true, admin: true, order: true });
    res.status(200).json({
        status: 'success',
        message: 'Cache invalidated successfully',
    })
})
);

export default router;
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; dotenv.config({ path: './.env' });
import NodeCache from 'node-cache';
import morgan from 'morgan';


import globalError from './middlewares/globalError.js';

import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import orderRouter from './routes/order.js';
import { deleteRandomsProducts, generateRandomProducts } from './utils/generateRandomProducts.js';
import { invalidateCache } from './utils/functions.js';


const app = express();

export const myCache = new NodeCache();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"))


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        status: 'success',
        message: 'API working',
    })
})


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(process.env.NODE_ENV === 'production' ? 'Production' : 'Development');
    next();
})



app.use('/uploads', express.static('uploads'));


app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/order', orderRouter);


app.use('/api/v1/create-data', async (req, res, next) => {

    const { type, name, amount } = req.query
    if (type === 'new') {
        if (name === "products") generateRandomProducts(Number(amount));
    }
    else {
        if (name === "products") deleteRandomsProducts(Number(amount));
    }

    await invalidateCache({ products: true });

    return res.status(200).json({
        status: 'success',
        message: `Data ${type === 'new' ? 'created' : 'deleted'} successfully`,
    })
});





app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: 'Page not found',
    })
})


app.use(globalError);


export default app;
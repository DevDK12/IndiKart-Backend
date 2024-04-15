import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; dotenv.config({ path: './.env' });
import NodeCache from 'node-cache';
import morgan from 'morgan';
import cors from 'cors';

import globalError from './middlewares/globalError.js';

import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import orderRouter from './routes/order.js';
import paymentRouter from './routes/payment.js';
import statsRouter from './routes/stats.js';
import testingRouter from './routes/testing.js';

import Stripe from 'stripe';


const app = express();

const stripe_key = process.env.STRIPE_SECRET_KEY as string;
export const stripe = new Stripe(stripe_key);
export const myCache = new NodeCache();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"))


app.use(cors());

app.get('/api/v1', (req: Request, res: Response, next: NextFunction) => {
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
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/dashboard', statsRouter);

app.use('/api/v1/testing', testingRouter);




app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: 'API not found',
    })
})


app.use(globalError);


export default app;
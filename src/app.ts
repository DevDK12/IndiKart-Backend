import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; dotenv.config({ path: './.env' });
import NodeCache from 'node-cache';
import morgan from 'morgan';
import cors from 'cors';

import globalError from './middlewares/globalError.js';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import orderRouter from './routes/order.js';
import paymentRouter from './routes/payment.js';
import statsRouter from './routes/stats.js';
import testingRouter from './routes/testing.js';

import Stripe from 'stripe';
import {v2 as cloudinary} from 'cloudinary';


const app = express();

const stripe_key = process.env.STRIPE_SECRET_KEY as string;
export const stripe = new Stripe(stripe_key);
export const myCache = new NodeCache();


app.use(express.json()); //_ parse json
app.use(express.urlencoded({ extended: true })); //_ parse what ?

app.use(morgan("dev"));


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



app.use(cors());

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        status: 'success',
        message: 'Server is up',
    })
})

app.get('/api/v1', (req: Request, res: Response, next: NextFunction) => {
    res.json({
        status: 'success',
        message: 'API v1 working',
    })
})


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(process.env.NODE_ENV === 'production' ? 'Production' : 'Development');
    next();
})



app.use('/uploads', express.static('uploads'));


app.use('/api/v1/auth', authRouter);
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
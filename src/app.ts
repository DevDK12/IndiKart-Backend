import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; dotenv.config()


import userRouter from './routes/user.js';
import globalError from './middlewares/globalError.js';


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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



app.use('/api/v1/user', userRouter);





app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: 'Page not found',
    })
})


app.use(globalError);


export default app;
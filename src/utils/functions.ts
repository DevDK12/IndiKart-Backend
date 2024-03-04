import fs from 'fs';
import bcrypt from 'bcryptjs';
import { myCache } from '../app.js';
import { invalidateCacheType } from '../types/types.js';
import { IOrder, OrderItemType } from '../types/OrderTypes.js';
import Product from '../models/product.js';
import AppError from '../error/appError.js';

export const genHashedPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}

// export const genHashedPassword = (password: string) => bcrypt.hash(password, 12);





export const deleteImage = (filePath: string, cb?: () => void) => {
    fs.unlink(filePath, (err: NodeJS.ErrnoException | null) => {
        if (err) console.error('There was an error deleting image:', err);
        else cb?.() || console.log('Image deleted successfully');
    });
};




export const invalidateCache = async ({
    products,
    order,
    admin,
}: invalidateCacheType) => {

    if (products) {

        const productCacheKeys = myCache.keys().filter(key => key.includes('product'));
        myCache.del(productCacheKeys);
        
    };
    
    if(order){
        const orderCacheKeys = myCache.keys().filter(key => key.includes('order'));
        myCache.del(orderCacheKeys);
    }

    if(admin){
        const adminCacheKeys = myCache.keys().filter(key => key.includes('admin'));
        myCache.del(adminCacheKeys);
    }
}




export const reduceStock = async (orderItems: [OrderItemType]) => {
    orderItems.forEach(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new AppError('No product found', 400);
        product.stock -= item.quantity;
        await product.save();
    });
}



export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};


export const getLastSixMonthsChartData = (lastSixMonthsOrders : IOrder[])=>{
    const lastSixMonthsRevenue = new Array(6).fill(0);
    const lastSixMonthsOrdersCount = new Array(6).fill(0);

    lastSixMonthsOrders.forEach( (order : any) => {
        const today = new Date();
        const creationDate = new Date(order.createdAt);

        const monthsDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if(monthsDiff < 6){
            lastSixMonthsRevenue[6 - monthsDiff - 1] += order.total;
            lastSixMonthsOrdersCount[6 - monthsDiff - 1] += 1;
        }
    });

    return {
        lastSixMonthsOrdersCount,
        lastSixMonthsRevenue,
    }
}
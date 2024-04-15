import fs from 'fs';
import bcrypt from 'bcryptjs';
import { myCache } from '../app.js';
import { invalidateCacheType } from '../types/types.js';

export const genHashedPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
}

// export const genHashedPassword = (password: string) => bcrypt.hash(password, 12);



export const verifyPassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}



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
    stats,
}: invalidateCacheType) => {

    if (products) {

        const productCacheKeys = myCache.keys().filter(key => key.includes('product'));
        myCache.del(productCacheKeys);

    };

    if (order) {
        const orderCacheKeys = myCache.keys().filter(key => key.includes('order'));
        myCache.del(orderCacheKeys);
    }

    if (admin) {
        const adminCacheKeys = myCache.keys().filter(key => key.includes('admin'));
        myCache.del(adminCacheKeys);
    }

    if(stats){
        const statsCacheKeys = myCache.keys().filter(key => key.includes('stats'));
        myCache.del(statsCacheKeys);
    }
}






export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};










interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
}

type getChartDataProps = {
    months: number;
    docArray: MyDocument[];
    property?: "discount" | "total";
};

export const getChartData = ({
    docArray,
    months,
    property,
} : getChartDataProps) => {
    const data = new Array(months).fill(0);
    const today = new Date();

    docArray.forEach((doc) => {
        const creationDate = new Date(doc.createdAt);

        const monthsDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthsDiff < months) {
            if (property)
                data[months - monthsDiff - 1] += doc[property];
            else
                data[months - monthsDiff - 1] += 1;
        }
    });

    return data;
}
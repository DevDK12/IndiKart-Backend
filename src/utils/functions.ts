import fs from 'fs';
import bcrypt from 'bcryptjs';
import { myCache } from '../app.js';
import { invalidateCacheType } from '../types/types.js';

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

        const productCacheKeys = myCache.keys();
        myCache.del(productCacheKeys);

    };
}






import {faker} from '@faker-js/faker';
import Product from "../models/product.js";
import { mongo } from 'mongoose';




export const generateRandomProducts = async (count: number = 10, url: string, userId: string) => {
    const products = [];

    for (let i = 0; i < count; i++) {
        const product = {
            name: faker.commerce.productName(),
            photo:url,
            price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
            stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
            category: faker.commerce.department().toLowerCase(),
            // user: new mongo.ObjectId(userId),
            user: userId,
            createdAt: new Date(faker.date.past()),
            updatedAt: new Date(faker.date.recent()),
            __v: 0,
        };

        products.push(product);
    }

    await Product.create(products);

    console.log({ succecss: true });
};




export const deleteRandomsProducts = async (count: number = 10) => {
    const products = await Product.find({}).skip(2);

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        await product.deleteOne();
    }

    console.log({ succecss: true });
};
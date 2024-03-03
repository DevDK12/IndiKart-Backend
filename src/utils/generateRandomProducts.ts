import {faker} from '@faker-js/faker';
import CatchAsync from "../error/catchAsync.js";
import Product from "../models/product.js";




export const generateRandomProducts = async (count: number = 10) => {
    const products = [];

    for (let i = 0; i < count; i++) {
        const product = {
            name: faker.commerce.productName(),
            photo: "uploads\\0a3123b8-39ac-4289-b23a-ff9941730971.jpg",
            price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
            stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
            category: faker.commerce.department().toLowerCase(),
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
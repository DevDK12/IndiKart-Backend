import {faker} from '@faker-js/faker';
import Order from '../models/order.js';




export const generateRandomOrders = async (count: number = 10,  userId: string) => {
    const orders = [];

    for (let i = 0; i < count; i++) {
        const order = {
            shippingInfo: {
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                pinCode: faker.number.int,
                country: faker.location.country(),
                state : faker.location.state(),
            },

            user: userId,
            tax: faker.commerce.price({ min: 0, max: 1000}),
            shippingCharges: faker.commerce.price({ min: 0, max: 400}),
            total: faker.commerce.price({ min: 1000, max: 100000}),
            subtotal: faker.commerce.price({ min: 1000, max: 100000}),
            discount: faker.commerce.price({ min: 0, max: 500}),

            orderItems: [
                {
                    name: "Mac book",
                    quantity: 2,
                    photo: "uploads\\0a3123b8-39ac-4289-b23a-ff9941730971.jpg",
                    price: 125000,
                    productId: "65e4336a90f330e383721a97"
                }
            ],

            __v: 0,
        };

        orders.push(order);
    }

    await Order.create(orders);

    console.log({ succecss: true });
};




export const deleteRandomOrders = async (count: number = 10) => {
    const orders = await Order.find({}).skip(2);

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        await order.deleteOne();
    }

    console.log({ succecss: true });
};
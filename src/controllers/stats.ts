import { myCache } from "../app.js";
import CatchAsync from "../error/catchAsync.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { IOrder } from "../types/OrderTypes.js";
import { IUser } from "../types/UserTypes.js";
import { calculatePercentage, getLastSixMonthsChartData } from "../utils/functions.js";



export const getDashboardStats = CatchAsync(async (req, res, next) => {

    const key = "dashboard-stats";

    if (myCache.has(key)) {
        const stats = JSON.parse(myCache.get(key) as string);
        return res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    }



    const today = new Date();

    const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
    };

    const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
    };



    const [
        thisMonthProducts,
        lastMonthProducts,
        thisMonthUsers,
        lastMonthUsers,
        thisMonthOrders,
        lastMonthOrders,
        productsCount,
        usersCount,
        allOrders,
        lastSixMonthsOrders,
        males,
        females,
        latestTransactions,
        categoriesStats,
    ] = await Promise.all([
        Product.getMonthProducts(thisMonth),
        Product.getMonthProducts(lastMonth),
        User.getMonthUsers(thisMonth),
        User.getMonthUsers(lastMonth),
        Order.getMonthOrders(thisMonth),
        Order.getMonthOrders(lastMonth),
        Product.countDocuments(),
        User.countDocuments(),
        Order.find().select('total'),
        Order.getLastSixMonthsOrders(),
        User.find({ gender: 'male' }).countDocuments(),
        User.find({ gender: 'female' }).countDocuments(),
        Order.getLatestTransactions(),
        Product.getAllCategoriesStats(),
    ])



    const revenue = allOrders.reduce((sum, order: IOrder) => sum + order.total, 0)

    const changePercent = {
        revenue,
        orders: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        users: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
        products: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
    }

    const totalCount = {
        revenue: 0,
        orders: allOrders.length,
        users: usersCount,
        products: productsCount,
    }


    const lastSixMonthsChart = getLastSixMonthsChartData(lastSixMonthsOrders);


    const userRatio = {
        male: males,
        female: females,
    }

    const transformedLatestTransaction = latestTransactions.map((trans: IOrder & { _id: string }) => ({
        _id: trans._id,
        id: trans._id,
        discount: trans.discount,
        total: trans.total,
        status: trans.status,
        items: trans.orderItems.length,
    }));




    const stats = {
        changePercent,
        count: totalCount,
        chart: lastSixMonthsChart,
        categories: categoriesStats,
        userRatio,
        latestTransactions: transformedLatestTransaction,
    };

    myCache.set(key, JSON.stringify(stats));

    return res.status(200).json({
        status: "success",
        data: {
            stats
        }
    });

});






export const getPieCharts = CatchAsync(async (req, res, next) => {

    const key = 'admin-pie-chart';

    if (myCache.has(key)) {
        const charts = JSON.parse(myCache.get(key) as string);

        return res.status(200).json({
            status: "success",
            data: {
                charts,
            }
        })
    }

    const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        cancelledOrder,
        categoriesStats,
        outOfStock,
        productCount,
        allOrders,
        allUsersDOB,
        adminUsers,
        customerUsers,
    ] = await Promise.all([
        Order.find({ status: 'processing' }).countDocuments(),
        Order.find({ status: 'shipped' }).countDocuments(),
        Order.find({ status: 'delivered' }).countDocuments(),
        Order.find({ status: 'cancelled' }).countDocuments(),
        Product.getAllCategoriesStats(),
        Product.find({ stock: 0 }).countDocuments(),
        Product.find().countDocuments(),
        Order.find(),
        User.find().select("dob"),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
    ]);

    const orderFullfilment = {
        processing: processingOrder,
        shipped: shippedOrder,
        delivered: deliveredOrder,
        cancelled: cancelledOrder,
    }


    const stockAvailablity = {
        inStock: productCount - outOfStock,
        outOfStock,
    }



    const grossIncome = allOrders.reduce((prev: number, order: IOrder) => prev + (order.total || 0), 0);
    const discount = allOrders.reduce((prev: number, order: IOrder) => prev + (order.discount || 0), 0);
    const productionCost = allOrders.reduce((prev: any, order: IOrder) => prev + (order.shippingCharge || 0), 0);
    const burnt = allOrders.reduce((prev: any, order: IOrder) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
    }


    const usersAgeGroup = {
        teen: allUsersDOB.filter((user: IUser) => user.age < 20).length,
        adult: allUsersDOB.filter((user: IUser) => user.age >= 20 && user.age < 40).length,
        old: allUsersDOB.filter((user: IUser) => user.age >= 40).length,
    };

    const adminCustomer = {
        admin: adminUsers,
        customer: customerUsers,
    };


    const charts = {
        orderFullfilment,
        categories: categoriesStats,
        stockAvailablity,
        revenueDistribution,
        usersAgeGroup,
        adminCustomer,
    }


    myCache.set(key, JSON.stringify(charts));


    return res.status(200).json({
        status: "success",
        data: {
            charts,
        }
    })

});




export const getBarCharts = CatchAsync(async (req, res, next) => {

    const key = 'admin-pie-chart';

    if (myCache.has(key)) {
        const charts = JSON.parse(myCache.get(key) as string);

        return res.status(200).json({
            status: "success",
            data: {
                charts,
            }
        })
    }



    



    const charts = {

    }

    myCache.set(key, JSON.stringify(charts));


    return res.status(200).json({
        status: "success",
        data: {
            charts,
        }
    })


});




export const getLineCharts = CatchAsync(async (req, res, next) => {


});






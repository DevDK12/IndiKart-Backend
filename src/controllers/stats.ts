import { myCache } from "../app.js";
import CatchAsync from "../error/catchAsync.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
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
        allCategories,
        males,
        females,
        latestTransactions,
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
        Product.find().distinct('category'),
        User.find({ gender: 'male' }).countDocuments(),
        User.find({ gender: 'female' }).countDocuments(),
        Order.getLatestTransactions(),
    ])

    const categoriesCount = await Promise.all(allCategories.map((category: any) => Product.find({ category }).countDocuments()));
    const categories = allCategories.map((category: any, index: number) => ({ name: category, count: categoriesCount[index] }));


    const revenue = allOrders.reduce((sum, order) => sum + order.total, 0)

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

    const transformedLatestTransaction = latestTransactions.map((trans: any) => ({
        _id: trans._id,
        discount: trans.discount,
        total: trans.total,
        status: trans.status,
        items: trans.orderItems.length,
    }));



    const stats = {
        changePercent,
        count: totalCount,
        chart: lastSixMonthsChart,
        categories,
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


});




export const getBarCharts = CatchAsync(async (req, res, next) => {


});




export const getLineCharts = CatchAsync(async (req, res, next) => {


});






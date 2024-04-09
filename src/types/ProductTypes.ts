import mongoose from "mongoose";


export interface IProduct {
    photo: string;
    name: string;
    stock: number;
    price: number;
    // user: typeof mongoose.Schema.ObjectId;
    user: string;
    category: string;
    createdAt: Date;
}





export interface newProductReqType {
    user: string,
    name: string,
    category: string,
    price: number,
    stock: number,
}







export interface SearchRequestQuery {
    category?: string,
    price?: string,
    search?: string,
    sort?: string,
    page?: string,
    product_per_page?: number,
};



export interface BaseQueryType {
    name?: {
        $regex: string,
        $options: string,
    },
    price?: {
        $lte: number,
    },
    category?: string,
}



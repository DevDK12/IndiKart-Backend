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



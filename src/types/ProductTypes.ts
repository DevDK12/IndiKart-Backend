
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



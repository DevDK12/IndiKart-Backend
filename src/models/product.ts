import mongoose, { Model } from "mongoose";
import { IProduct } from "../types/ProductTypes.js";




const Schema = mongoose.Schema;

interface ProductModel extends Model<IProduct> {
    getMonthProducts : ({start, end}: {start: Date, end: Date}) => Promise<any>,
}


const ProductSchema = new Schema<IProduct, ProductModel>({

    photo: {
        type: String,
        required: [true, 'Photo is required'],
    },

    name: {
        type: String,
        required: [true, 'Productname is required'],
    },

    stock: {
        type: Number,
        required: [true, 'Stock is required'],
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
},

    {
        timestamps: true
    }
)





//_ Static Methods
ProductSchema.static('getMonthProducts', ({start, end}) => {
    return Product.find({
        createdAt: {
            $gte: start,
            $lte: end,
        },
    });
});






const Product = mongoose.model<IProduct, ProductModel>('Product', ProductSchema);


export default Product;



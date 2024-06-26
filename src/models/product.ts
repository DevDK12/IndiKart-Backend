import mongoose, { Model } from "mongoose";
import { IProduct } from "../types/ProductTypes.js";




const Schema = mongoose.Schema;

interface ProductModel extends Model<IProduct> {
    getMonthProducts : ({start, end}: {start: Date, end: Date}) => Promise<any>,
    getAllCategoriesStats: () => Promise<any>,
}


const ProductSchema = new Schema<IProduct, ProductModel>({

    photo: {
        type: String,
        required: [true, 'Photo is required'],
    },

    photoPublicId: {
        type: String,
        required: [true, 'Expected public id'],
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

    user: {
        type: String,
        ref: "User",
        required: true,
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


ProductSchema.static('getAllCategoriesStats', async () => {
    const allCategories = await Product.find().distinct('category');

    const categoriesCount = await Promise.all(allCategories.map((category: any) => Product.find({ category }).countDocuments()));
    const categories = allCategories.map((category: any, index: number) => ({ name: category, count: categoriesCount[index] }));

    return categories;
});






const Product = mongoose.model<IProduct, ProductModel>('Product', ProductSchema);


export default Product;



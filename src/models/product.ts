import mongoose from "mongoose";




const Schema = mongoose.Schema;



const ProductSchema = new Schema({

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




const Product = mongoose.model('Product', ProductSchema);


export default Product;



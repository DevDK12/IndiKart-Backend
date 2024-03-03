import mongoose from "mongoose";
import { OrderSchemaType } from "../types/OrderTypes.js";




const Schema = mongoose.Schema;



const OrderSchema = new Schema<OrderSchemaType>({

    shippingInfo: {
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
        },
        pincode: {
            type: Number,
            required: [true, 'Pincode is required'],
        },
    },

    user: {
        type: String,
        ref: 'User',
        required: true,
    },

    subtotal: {
        type: Number,
        required: [true, 'Subtotal is required'],
    },

    tax: {
        type: Number,
        required: [true, 'Tax is required'],
    },

    shippingCharge: {
        type: Number,
        required: [true, 'ShippingCharge is required'],
    },

    discount: {
        type: Number,
        required: [true, 'Discount is required'],
    },

    total: {
        type: Number,
        required: [true, 'Total is required'],
    },

    status: {
        type: String,
        enum: {
            values: [
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ],
            message: 'Please select correct status for order',
        },
        default: 'processing',
    },

    orderItems: [
        {
            name: String,
            quantity: Number,
            photo: String,
            price: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },

},

    {
        timestamps: true
    }
)




const Order = mongoose.model<OrderSchemaType>('Order', OrderSchema);


export default Order;



import mongoose, { Model } from "mongoose";
import { IOrder } from "../types/OrderTypes.js";




const Schema = mongoose.Schema;



interface OrderModel extends Model<IOrder> {
    getMonthOrders: ({ start, end }: { start: Date, end: Date }) => Promise<any>,
    getLastSixMonthsOrders: () => Promise<any>,
    getLatestTransactions: () => Promise<any>,
}


const OrderSchema = new Schema<IOrder, OrderModel>({

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
        pinCode: {
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

    shippingCharges: {
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
            productId: String,
            OrderId: {
                type: mongoose.Types.ObjectId,
                ref: 'Order',
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




//_ Static Methods
OrderSchema.static('getMonthOrders', ({ start, end }) => {
    return Order.find({
        createdAt: {
            $gte: start,
            $lte: end,
        },
    });
});


// OrderSchema.static('getLastSixMonthsOrders', () => {
//     const today = new Date();
//     const start = new Date(today.setMonth(today.getMonth() - 6));
//     const end = new Date();

//     return Order.find({
//         createdAt: {
//             $gte: start,
//             $lte: end,
//         },
//     })
//         .select(['total', 'createdAt'])
// });


OrderSchema.static('getLatestTransactions', () => {
    return Order.find().select(["orderItems", "discount", "total", "status"]).limit(4)
});



const Order = mongoose.model<IOrder, OrderModel>('Order', OrderSchema);


export default Order;



import mongoose from "mongoose";
import { CouponSchemaType } from "../types/PaymentTypes.js";


const CouponSchema = new mongoose.Schema<CouponSchemaType>({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, 'Coupon amount is required'],
    },
    expiry: {
        type: Date,
        required: true,
    },
});



const Coupon =  mongoose.model('Coupon', CouponSchema);

export default Coupon;






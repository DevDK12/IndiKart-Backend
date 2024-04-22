import express from "express";
import { getAllCoupons, getApplyDiscount, postNewCoupon, deleteCoupon } from "../controllers/payment.js";
import { postCreatePaymentIntent } from "../controllers/payment.js";
import { auth } from "../middlewares/auth.js";



const app = express.Router();


app.get("/discount", auth, getApplyDiscount);

app.post("/coupon/new", auth, postNewCoupon);

app.get("/coupon/all", auth, getAllCoupons);

app.delete("/coupon/:couponId", auth, deleteCoupon);

app.post("/create", auth, postCreatePaymentIntent);

export default app;
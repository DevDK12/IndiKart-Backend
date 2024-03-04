import express from "express";
import { getAllCoupons, getApplyDiscount, postNewCoupon, deleteCoupon } from "../controllers/payment.js";



const app = express.Router();


app.get("/discount", getApplyDiscount);

app.post("/coupon/new", postNewCoupon);

app.get("/coupon/all", getAllCoupons);

app.delete("/coupon/:couponId", deleteCoupon);

export default app;
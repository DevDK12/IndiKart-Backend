import express from 'express';

import {getSingleOrder, getAllOrders, getMyOrders, postNewOrder, deleteOrder, putProcessOrder } from '../controllers/order.js';
import { auth } from '../middlewares/auth.js';




const router = express.Router();



router.post('/new', auth, postNewOrder );
router.get('/my-orders', auth, getMyOrders);
router.get('/all', auth, getAllOrders );


router.route('/:orderId')
    .get(auth, getSingleOrder)
    .delete(auth, deleteOrder)
    .put(auth, putProcessOrder)







export default router;

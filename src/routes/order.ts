import express from 'express';

import {getSingleOrder, getAllOrders, getMyOrders, postNewOrder, deleteOrder, putProcessOrder } from '../controllers/order.js';




const router = express.Router();



router.post('/new', postNewOrder );
router.get('/my-orders', getMyOrders);
router.get('/all', getAllOrders );


router.route('/:orderId')
    .get(getSingleOrder)
    .delete(deleteOrder)
    .put(putProcessOrder)







export default router;

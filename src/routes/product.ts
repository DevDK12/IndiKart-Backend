import express from 'express';

import {deleteProduct, getAdminProducts, getAllCategories, getQueryProducts, getLatestProducts, getSingleProduct, postNewProduct, putUpdateProduct} from '../controllers/product.js';
import { uploadSingle } from '../middlewares/multer.js';




const router = express.Router();



router.post('/new', uploadSingle, postNewProduct );
router.get('/latest', getLatestProducts);
router.get('/categories', getAllCategories);
router.get('/admin-products/:userId', getAdminProducts);

router.get('/all', getQueryProducts );


router.route('/:productId')
    .get(getSingleProduct)
    .delete(deleteProduct)
    .put(uploadSingle, putUpdateProduct)







export default router;

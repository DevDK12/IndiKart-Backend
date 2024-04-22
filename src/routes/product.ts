import express from 'express';

import {deleteProduct, getAdminProducts, getAllCategories, getQueryProducts, getLatestProducts, getSingleProduct, postNewProduct, putUpdateProduct} from '../controllers/product.js';
import { uploadSingle } from '../middlewares/multer.js';
import fileParser from '../middlewares/fileParser.js';
import { singleImageUpload } from '../middlewares/cloudinary.js';
import { auth } from '../middlewares/auth.js';




const router = express.Router();



router.post('/new', auth, fileParser, singleImageUpload(true), postNewProduct );
router.get('/latest', getLatestProducts);
router.get('/categories', getAllCategories);
router.get('/admin-products/:userId', auth, getAdminProducts);

router.get('/all', getQueryProducts );


router.route('/:productId')
    .get(auth, getSingleProduct)
    .delete(auth, deleteProduct)
    .put(auth, fileParser, singleImageUpload(false), putUpdateProduct)







export default router;

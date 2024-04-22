import express from 'express';

import {deleteUser, getAllUsers, getUser} from '../controllers/user.js';
import { auth } from '../middlewares/auth.js';




const router = express.Router();




router.get('/all', auth,  getAllUsers );


// router.get('/:userId', getUser );
// router.delete('/:userId', deleteUser );
router.route('/:userId')
    .get(auth, getUser)
    .delete(auth, deleteUser);







export default router;

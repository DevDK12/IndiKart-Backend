import express from 'express';

import {deleteUser, getAllUsers, getUser, postRegisterUser} from '../controllers/user.js';




const router = express.Router();



router.post('/register', postRegisterUser );
router.get('/all', getAllUsers );


// router.get('/:userId', getUser );
// router.delete('/:userId', deleteUser );
router.route('/:userId')
    .get(getUser)
    .delete(deleteUser);







export default router;
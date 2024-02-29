import express from 'express';

import {postRegisterUser} from '../controllers/user.js';




const router = express.Router();



router.post('/register', postRegisterUser );






export default router;

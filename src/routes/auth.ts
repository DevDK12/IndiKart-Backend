import express from 'express';
import { postLogin, postSignup } from '../controllers/auth.js';


const router = express.Router();

router.post('/register', postSignup );
router.post('/login', postLogin );


export default router;

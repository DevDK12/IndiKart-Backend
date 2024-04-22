import express from 'express';
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from '../controllers/stats.js';
import { auth } from '../middlewares/auth.js';



const router = express.Router();



router.get("/stats", auth, getDashboardStats);

router.get("/pie", auth, getPieCharts);

router.get("/bar", auth, getBarCharts);

router.get("/line", auth, getLineCharts);



export default router;
import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getReports } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/', protect, getReports);

export default router;

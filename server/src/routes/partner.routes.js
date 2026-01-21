import express from 'express';
import { createPartner, getPartners, updatePartner, deletePartner, updatePartnerStatus } from '../controllers/partner.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createPartner);
router.get('/', protect, getPartners);
router.patch('/:id', protect, updatePartner);
router.delete('/:id', protect, deletePartner);

export default router;

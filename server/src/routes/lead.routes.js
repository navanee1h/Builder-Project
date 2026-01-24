import express from 'express';
import { createLead, getLeads, updateLeadStatus, assignPartner, deleteLead, notifyPartner } from '../controllers/lead.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createLead);
router.get('/', protect, getLeads);
router.put('/:id/status', protect, updateLeadStatus);
router.put('/:id/assign', protect, assignPartner);
router.put('/:id/notify', protect, notifyPartner);
router.delete('/:id', protect, deleteLead);

export default router;

import express from 'express';
import { getProjects, createProject, seedProjects } from '../controllers/project.controller.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.post('/seed', seedProjects);

export default router;

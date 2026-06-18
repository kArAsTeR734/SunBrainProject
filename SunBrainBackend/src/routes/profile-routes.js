import express from 'express';
import ProfileController from '../controllers/profile-controller.js';
import {authMiddleware} from '../middleware/auth-middleware.js';
import {AvatarController} from "../controllers/avatar-controller.js";
import { uploadSingle } from '../middleware/upload-middleware.js';

const router = express.Router();

router.get('/me', authMiddleware, ProfileController.getProfile);
router.post('/me/avatar', authMiddleware, uploadSingle, AvatarController.uploadAvatar);

export default router;

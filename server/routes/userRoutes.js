import express from 'express';
import { register, login, claimCoins } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);

router.post('/claim', protect, claimCoins);

export default router;
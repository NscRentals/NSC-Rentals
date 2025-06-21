import express from 'express';
import { 
  createCoupon, 
  getAllCoupons, 
  getUserCoupons, 
  applyCoupon, 
  deleteCoupon,
  deactivateCoupon 
} from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin routes (protected + admin only)
router.post('/', protect, isAdmin, createCoupon);
router.get('/all', protect, isAdmin, getAllCoupons);
router.delete('/:id', protect, isAdmin, deleteCoupon);
router.patch('/:id/deactivate', protect, isAdmin, deactivateCoupon);

// User routes (protected)
router.get('/my-coupons', protect, getUserCoupons);
router.post('/apply', protect, applyCoupon);

export default router; 
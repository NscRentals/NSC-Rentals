import Coupon from '../models/Coupon.js';
import User from '../models/user.js';
import { sendCouponEmail } from '../utils/emailService.js';

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      couponName,
      couponCode,
      discountType,
      discountAmount,
      expiryDate,
      eligibilityType,
      minimumLoyaltyPoints
    } = req.body;

    // Find eligible users based on criteria
    let eligibleUsers = [];
    const userQuery = { type: 'Customer' }; // Only include customers

    if (eligibilityType === 'selected') {
      userQuery.loyaltyPoints = { $gte: minimumLoyaltyPoints };
    }

    const users = await User.find(userQuery);
    eligibleUsers = users.map(user => user._id);

    const coupon = new Coupon({
      couponName,
      couponCode,
      discountType,
      discountAmount,
      expiryDate,
      eligibilityType,
      minimumLoyaltyPoints,
      eligibleUsers
    });

    await coupon.save();

    // Generate QR code URL - make sure this points to your frontend
    const qrCodeUrl = `http://localhost:5173/apply-coupon/${couponCode}`; 

    // Send emails to all eligible users with better error handling
    const emailPromises = users.map(async user => {
      try {
        await sendCouponEmail(user, coupon, qrCodeUrl);
        console.log(`Email sent successfully to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
       
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    res.status(201).json({
      success: true,
      message: 'Coupon created and emails sent successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error in createCoupon:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create coupon and send emails'
    });
  }
};

// Get all coupons(admin only function)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('eligibleUsers', 'firstName lastName email')
      .populate('usedBy.userId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get available coupons for a specific user
export const getUserCoupons = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all active coupons where the user is eligible
    const coupons = await Coupon.find({
      eligibleUsers: userId,
      expiryDate: { $gt: new Date() },
      isActive: true,
      // Check that the user hasn't used the coupon yet using $not and $elemMatch
      usedBy: {
        $not: {
          $elemMatch: {
            userId: userId
          }
        }
      }
    });

    // Map the coupons to include only necessary data
    const formattedCoupons = coupons.map(coupon => ({
      _id: coupon._id,
      couponName: coupon.couponName,
      couponCode: coupon.couponCode,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount,
      expiryDate: coupon.expiryDate,
      isActive: coupon.isActive
    }));

    res.status(200).json({
      success: true,
      data: formattedCoupons
    });
  } catch (error) {
    console.error('Error in getUserCoupons:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch coupons'
    });
  }
};

// Apply a coupon
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const { couponCode } = req.body;

    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    if (!coupon.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not available'
      });
    }

    if (!coupon.canUserUse(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot use this coupon'
      });
    }

    // Add user to usedBy array
    coupon.usedBy.push({ userId });
    await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a coupon (admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Deactivate a coupon (admin only)
export const deactivateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deactivated successfully',
      data: coupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 
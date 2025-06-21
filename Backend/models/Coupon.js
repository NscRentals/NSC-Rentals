import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  couponName: {
    type: String,
    required: [true, 'Coupon name is required'],
    unique: true,
    trim: true
  },
  couponCode: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['fixed', 'percentage']
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  eligibilityType: {
    type: String,
    required: true,
    enum: ['all', 'selected']
  },
  minimumLoyaltyPoints: {
    type: Number,
    default: 0
  },
  eligibleUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual field to check if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual field to check if coupon is fully used
couponSchema.virtual('isFullyUsed').get(function() {
  return this.eligibleUsers.length > 0 && this.usedBy.length >= this.eligibleUsers.length;
});

// Virtual field to check if coupon is available
couponSchema.virtual('isAvailable').get(function() {
  return this.isActive && !this.isExpired && !this.isFullyUsed;
});

// Method to check if a user can use this coupon
couponSchema.methods.canUserUse = function(userId) {
  // Check if coupon is available
  if (!this.isAvailable) return false;

  // Check if user has already used the coupon
  const hasUsed = this.usedBy.some(usage => usage.userId.toString() === userId.toString());
  if (hasUsed) return false;

  // Check if user is eligible
  return this.eligibleUsers.some(eligibleId => eligibleId.toString() === userId.toString());
};

// Pre-save middleware to ensure uniqueness of coupon name and code
couponSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('couponName') || this.isModified('couponCode')) {
    const existingCoupon = await this.constructor.findOne({
      $or: [
        { couponName: this.couponName },
        { couponCode: this.couponCode }
      ]
    });

    if (existingCoupon) {
      if (existingCoupon.couponName === this.couponName) {
        throw new Error('Coupon name already exists');
      }
      if (existingCoupon.couponCode === this.couponCode) {
        throw new Error('Coupon code already exists');
      }
    }
  }
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon; 
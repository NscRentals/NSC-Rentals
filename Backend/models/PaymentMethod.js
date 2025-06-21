import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bank', 'card'],
    required: true
  },
  // Common fields
  holderName: {
    type: String,
    required: true
  },
  // Bank account specific fields
  accountNumber: {
    type: String,
    required: function() {
      return this.type === 'bank';
    }
  },
  bankName: {
    type: String,
    required: function() {
      return this.type === 'bank';
    }
  },
  // Card specific fields
  cardNumber: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  cvv: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  expiryDate: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash sensitive data before saving
paymentMethodSchema.pre('save', async function(next) {
  if (this.type === 'card') {
    // Only store last 4 digits of card number
    this.cardNumber = '****' + this.cardNumber.slice(-4);
    // Don't store CVV
    this.cvv = undefined;
  }
  next();
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod; 
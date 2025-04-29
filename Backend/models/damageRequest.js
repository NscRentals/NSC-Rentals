import mongoose from 'mongoose';

const usedPartSchema = new mongoose.Schema({
  partId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'sparePartsInventory',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
});

const damageRequestSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  description: {
    type: String,
    required: true
  },

  requestSubmittedDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  attachments: [String],       // e.g. array of image URLs
  
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },

  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Scheduling fields
  scheduledDate: {
    type: Date,
    default: null
  },
  
  scheduledTimeSlot: {
    type: String,
    default: null
  },
  
  estimatedDuration: {
    type: Number,  // in hours
    default: null
  },

  // Report generation fields
  usedParts: [usedPartSchema],
  
  completedAt: {
    type: Date,
    default: null
  },

  laborHours: {
    type: Number,
    default: 0
  },

  totalCost: {
    type: Number,
    default: 0
  },

  repairNotes: {
    type: String,
    default: ''
  }

}, { timestamps: true });

export default mongoose.model('damageRequest', damageRequestSchema);

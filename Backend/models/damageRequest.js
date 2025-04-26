import mongoose from 'mongoose';

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

  attachments: [String],       // e.g. array of image URLs
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Assigned', 'Completed'],
    default: 'Pending'
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }

}, { timestamps: true });

export default mongoose.model('damageRequest', damageRequestSchema);

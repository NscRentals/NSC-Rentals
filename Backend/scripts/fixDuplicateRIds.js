import mongoose from 'mongoose';
import Reservation from '../models/reservation.js';
import dotenv from 'dotenv';

dotenv.config();

const fixDuplicateRIds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all reservations
    const reservations = await Reservation.find({});
    console.log(`Found ${reservations.length} reservations`);

    // Track used rIds
    const usedRIds = new Set();
    let updatedCount = 0;

    // Update reservations with duplicate rIds
    for (const reservation of reservations) {
      if (usedRIds.has(reservation.rId)) {
        // Generate new unique rId
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const newRId = `RES-${timestamp}-${random}`;
        
        // Update the reservation
        await Reservation.updateOne(
          { _id: reservation._id },
          { $set: { rId: newRId } }
        );
        updatedCount++;
        console.log(`Updated reservation ${reservation._id} with new rId: ${newRId}`);
      } else {
        usedRIds.add(reservation.rId);
      }
    }

    console.log(`Updated ${updatedCount} reservations with duplicate rIds`);
    process.exit(0);
  } catch (error) {
    console.error('Error fixing duplicate rIds:', error);
    process.exit(1);
  }
};

fixDuplicateRIds(); 
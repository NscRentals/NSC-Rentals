import DriverAvailability from '../models/driveravailability.js';
import driver from '../models/DriverModel.js';

// Set driver availability
export const setAvailability = async (req, res) => {
    try {
        const { driverId, date, availability } = req.body;

        // Check if driver exists
        const driverExists = await driver.findById(driverId);
        if (!driverExists) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Check if availability record already exists for this date
        let availabilityRecord = await DriverAvailability.findOne({
            driverId,
            date
        });

        if (availabilityRecord) {
            // Update existing record
            availabilityRecord.availability = availability;
            await availabilityRecord.save();
        } else {
            // Create new record
            availabilityRecord = new DriverAvailability({
                driverId,
                date,
                availability
            });
            await availabilityRecord.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Availability updated successfully',
            data: availabilityRecord
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get driver availability for a specific date
export const getAvailability = async (req, res) => {
    try {
        const { date } = req.params;
        const availabilityRecords = await DriverAvailability.find({ date })
            .populate('driverId', 'DriverName DriverPhone DriverEmail');

        return res.status(200).json({
            success: true,
            data: availabilityRecords
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all available drivers for a specific date
export const getAvailableDrivers = async (req, res) => {
    try {
        const { date } = req.params;
        const availableDrivers = await DriverAvailability.find({
            date,
            availability: true
        }).populate('driverId', 'DriverName DriverPhone DriverEmail');

        return res.status(200).json({
            success: true,
            data: availableDrivers
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get driver's availability schedule
export const getDriverSchedule = async (req, res) => {
    try {
        const { driverId } = req.params;
        console.log('Fetching schedule for driver:', driverId);

        // Validate driverId
        if (!driverId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Driver ID is required' 
            });
        }

        // Check if driver exists
        const driverExists = await driver.findById(driverId);
        if (!driverExists) {
            return res.status(404).json({ 
                success: false, 
                error: 'Driver not found' 
            });
        }

        // Get schedule
        const schedule = await DriverAvailability.find({ driverId })
            .sort({ date: 1 });

        console.log('Found schedule:', schedule);

        return res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}; 
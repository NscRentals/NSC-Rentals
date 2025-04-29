import DriverAvailability from '../models/driveravailability.js';
import driver from '../models/DriverModel.js';

// Set driver availability
export const setAvailability = async (req, res) => {
    try {
        const { driverId, date, availability } = req.body;
        console.log('Setting availability with data:', { driverId, date, availability });
        console.log('Request body:', req.body);

        // Check if driver exists
        const driverExists = await driver.findById(driverId);
        console.log('Driver exists:', !!driverExists);
        
        if (!driverExists) {
            console.log('Driver not found in database');
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Check if availability record already exists for this date
        let availabilityRecord = await DriverAvailability.findOne({
            driverId,
            date
        });
        console.log('Existing availability record:', availabilityRecord);

        if (availabilityRecord) {
            // Update existing record
            console.log('Updating existing record');
            availabilityRecord.availability = availability;
            await availabilityRecord.save();
        } else {
            // Create new record
            console.log('Creating new record');
            availabilityRecord = new DriverAvailability({
                driverId,
                date,
                availability
            });
            await availabilityRecord.save();
        }
        console.log('Saved availability record:', availabilityRecord);

        return res.status(200).json({
            success: true,
            message: 'Availability updated successfully',
            data: availabilityRecord
        });
    } catch (error) {
        console.error('Error setting availability:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
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
        console.log('Request params:', req.params);

        // Validate driverId
        if (!driverId) {
            console.log('No driver ID provided');
            return res.status(400).json({ 
                success: false, 
                error: 'Driver ID is required' 
            });
        }

        // Check if driver exists
        const driverExists = await driver.findById(driverId);
        console.log('Driver exists:', !!driverExists);
        
        if (!driverExists) {
            console.log('Driver not found in database');
            return res.status(404).json({ 
                success: false, 
                error: 'Driver not found' 
            });
        }

        // Get schedule
        console.log('Querying schedule with driverId:', driverId);
        const schedule = await DriverAvailability.find({ driverId })
            .sort({ date: 1 });

        console.log('Found schedule:', schedule);
        console.log('Number of schedule entries:', schedule.length);

        return res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}; 
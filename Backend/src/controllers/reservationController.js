import Reservation from '../models/reservation.js';

export const getUserReservations = async (req, res) => {
  try {
    console.log('User from request:', req.user); // Debug log
    
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userEmail = req.user.email;
    console.log('Searching reservations for email:', userEmail); // Debug log
    
    const reservations = await Reservation.find({ email: userEmail });
    console.log('Found reservations:', reservations); // Debug log
    
    res.status(200).json({
      success: true,
      data: reservations
    });
  } catch (error) {
    console.error('Error in getUserReservations:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
}; 
import Reservation from '../models/reservation.js';
import nodemailer from 'nodemailer';

export const getUserReservations = async (req, res) => {
  try {
    console.log('User from request:', req.user); // Debug log
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user._id;
    console.log('Searching reservations for userId:', userId); // Debug log
    
    const reservations = await Reservation.find({ userId: userId.toString() });
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

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethodId, finalAmount } = req.body;

    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reservation'
      });
    }

    reservation.isPaid = true;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

export const sendBillEmail = async (req, res) => {
  try {
    const { reservationId, amount, discount, finalAmount, paymentMethod } = req.body;
    
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: `Bill Receipt for Reservation #${reservation.rId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Payment Receipt</h1>
          <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2>Reservation Details</h2>
            <p><strong>Reservation ID:</strong> ${reservation.rId}</p>
            <p><strong>Vehicle:</strong> ${reservation.vehicleNum}</p>
            <p><strong>Service:</strong> ${reservation.service}</p>
            <p><strong>Dates:</strong> ${new Date(reservation.startDate).toLocaleDateString()} - ${new Date(reservation.endDate).toLocaleDateString()}</p>
            
            <h2>Payment Details</h2>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Original Amount:</strong> $${amount}</p>
            <p><strong>Discount Applied:</strong> $${discount}</p>
            <p><strong>Final Amount Paid:</strong> $${finalAmount}</p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p>Thank you for choosing our service!</p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Bill sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending bill',
      error: error.message
    });
  }
}; 
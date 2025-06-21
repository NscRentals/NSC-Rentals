import PaymentMethod from '../models/PaymentMethod.js';

// Add a new payment method
export const addPaymentMethod = async (req, res) => {
  try {
    const { type, holderName, accountNumber, bankName, cardNumber, cvv, expiryDate } = req.body;
    const userId = req.user._id; // Assuming this comes from auth middleware

    // Check if this is the first payment method for the user
    const existingMethods = await PaymentMethod.countDocuments({ userId });
    const isDefault = existingMethods === 0;

    const paymentMethod = new PaymentMethod({
      userId,
      type,
      holderName,
      accountNumber,
      bankName,
      cardNumber,
      cvv,
      expiryDate,
      isDefault
    });

    await paymentMethod.save();

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      data: paymentMethod
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding payment method',
      error: error.message
    });
  }
};

// Get all payment methods for a user
export const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming this comes from auth middleware
    const paymentMethods = await PaymentMethod.find({ userId });

    res.status(200).json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching payment methods',
      error: error.message
    });
  }
};

// Delete a payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const paymentMethod = await PaymentMethod.findOneAndDelete({
      _id: id,
      userId
    });

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting payment method',
      error: error.message
    });
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Remove default status from all other payment methods
    await PaymentMethod.updateMany(
      { userId },
      { isDefault: false }
    );

    // Set the selected payment method as default
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: id, userId },
      { isDefault: true },
      { new: true }
    );

    if (!paymentMethod) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Default payment method updated successfully',
      data: paymentMethod
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating default payment method',
      error: error.message
    });
  }
}; 
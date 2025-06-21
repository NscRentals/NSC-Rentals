import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendCouponEmail = async (user, coupon, qrCodeUrl) => {
  try {
    // Generate QR code as base64
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
    
    // Remove the data:image/png;base64, prefix for email embedding
    const qrCodeBase64 = qrCodeDataUrl.split(',')[1];

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .logo {
          text-align: center;
          padding: 20px;
          background-color: #2f4f2f;
          color: white;
          font-size: 24px;
          font-weight: bold;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .coupon-details {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .qr-code {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
        }
        .qr-code img {
          width: 200px;
          height: 200px;
        }
        .steps {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding: 20px;
          border-top: 1px solid #eee;
        }
        .highlight {
          color: #2f4f2f;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="logo">
        NSC-RENTALS®
      </div>
      
      <p>Dear ${user.firstName},</p>
      
      <p>Thank you for choosing NSC-RENTALS for your car rental needs! We're excited to offer you an exclusive discount on your next booking as a token of our appreciation.</p>
      
      <div class="coupon-details">
        <h2>Your Special Discount</h2>
        <p class="highlight">
          ${coupon.discountAmount}${coupon.discountType === 'percentage' ? '%' : ' LKR'} OFF
        </p>
        <p>Use code: <strong>${coupon.couponCode}</strong></p>
        <p>Valid until: ${new Date(coupon.expiryDate).toLocaleDateString()}</p>
      </div>

      <div class="qr-code">
        <p>Scan this QR code to redeem your discount:</p>
        <img src="cid:qrcode" alt="QR Code" style="width: 200px; height: 200px;">
      </div>

      <div class="steps">
        <h3>How to redeem your discount:</h3>
        <ol>
          <li>Scan the QR code above using your smartphone.</li>
          <li>Browse our wide selection of vehicles and pick the one that suits your needs.</li>
          <li>Enter the discount code <strong>${coupon.couponCode}</strong> at checkout.</li>
          <li>Enjoy the savings and get ready for your next adventure!</li>
        </ol>
      </div>

      <p>If you need assistance or have any questions, feel free to contact us at support@nsc-rentals.com</p>

      <div class="footer">
        <p>Thank you for being a valued customer, and we look forward to serving you again soon!</p>
        <p>Best regards,<br>The NSC-RENTALS Team</p>
      </div>
    </body>
    </html>
  `;

    const mailOptions = {
      from: {
        name: 'NSC-RENTALS',
        address: process.env.EMAIL_USER
      },
      to: user.email,
      subject: `Your Exclusive NSC-RENTALS Discount: ${coupon.discountAmount}${coupon.discountType === 'percentage' ? '%' : ' LKR'} Off!`,
      html: htmlContent,
      attachments: [{
        filename: 'qrcode.png',
        content: qrCodeBase64,
        encoding: 'base64',
        cid: 'qrcode' // This is referenced in the HTML with cid:qrcode
      }]
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 
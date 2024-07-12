const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
dotenv.config();

let productInfo = {};
let userData = {};
let userInfo;
let totalAmount;

const checkout = async (req, res) => {
  try {
    const { amount, userId, productDetails, userDetails } = req.body;
    totalAmount = Number(amount);
    userInfo = userId;
    productInfo = JSON.parse(productDetails);
    userData = JSON.parse(userDetails);

    // Send email directly without Razorpay initialization
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: userData.userEmail,
      subject: "Order Confirm",
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: black; }
          h1 { font-size: 24px; margin-bottom: 20px; color: black; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { text-align: left; padding: 10px; background-color: #eee; }
          td { padding: 10px; border: 1px solid #ddd; }
          .address { margin-bottom: 20px; color: black; }
          .address h2 { font-size: 20px; margin-bottom: 10px; }
          .address p { margin: 0; }
          .thanks { font-size: 18px; margin-top: 20px; color: black; }
          .signature { margin-top: 40px; color: black; }
          .signature p { margin: 0; }
        </style>
      </head>
      <body>
        <h1>Order Confirmation</h1>
        <p style="color:black;">Dear <b>${userData.firstName} ${userData.lastName}</b>,</p>
        <p>Thank you for your recent purchase on our website. We have received your order.</p>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${productInfo.map((product) => `
              <tr>
                <td>${product.productId.name}</td>
                <td>${product.quantity}</td>
                <td>৳${product.productId.price}</td>
              </tr>
            `).join('')}
            <tr>
              <td>Shipping Charge</td>
              <td></td>
              <td>৳100</td>
            </tr>
            <tr>
              <td>Total</td>
              <td></td>
              <td>৳${totalAmount}</td>
            </tr>
          </tbody>
        </table>
        <div class="address">
          <h2>Shipping Address</h2>
          <p>${userData.firstName} ${userData.lastName}</p>
          <p>${userData.address}</p>
          <p>${userData.city}-${userData.zipCode}</p>
          <p>${userData.userState}</p>
        </div>
        <p class="thanks">Thank you for choosing our website. If you have any questions or concerns, please don't hesitate to contact us.</p>
        <div class="signature">
          <p>Best regards,</p>
          <p><a href="https://e-shopit.vercel.app/" target="_blank">ShopIt.com</a></p>
        </div>
      </body>
      </html>`
    };

    transport.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Email sending failed' });
      } else {
        await Payment.create({
          user: userInfo,
          productData: productInfo,
          userData,
          totalAmount
        });
        await Cart.deleteMany({ user: userInfo });
        res.status(200).json({ success: true, message: 'Order placed and email sent' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const paymentVerification = async (req, res) => {
  // Not used in this scenario
  res.status(200).json({ success: true });
};

module.exports = { checkout, paymentVerification };

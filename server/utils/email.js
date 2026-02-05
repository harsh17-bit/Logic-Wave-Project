/**
 * Email Service Module
 * Handles all email notifications for the UrbanStay.com platform
 * Uses Nodemailer with Gmail SMTP for sending emails
 * 
 * @module utils/email
 * @requires nodemailer
 */

const nodemailer = require('nodemailer');

/**
 * Creates and configures the email transporter
 * Uses Gmail SMTP service with credentials from environment variables
 * 
 * @returns {Object} Configured nodemailer transporter
 * @throws {Error} If EMAIL_USER or EMAIL_PASSWORD is not configured
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Sends an email notification to property owners when they receive a new inquiry
 * Email includes inquirer details, message, and optional visit scheduling information
 * 
 * @param {Object} data - Inquiry notification data
 * @param {string} data.ownerEmail - Email address of the property owner
 * @param {string} data.propertyTitle - Title of the property being inquired about
 * @param {string} data.inquiryType - Type of inquiry (e.g., 'buy-inquiry', 'rent-inquiry')
 * @param {string} data.userName - Name of the person making the inquiry
 * @param {string} data.userEmail - Email of the inquirer
 * @param {string} data.phone - Phone number of the inquirer
 * @param {string} data.message - Inquiry message content
 * @param {string} [data.preferredVisitDate] - Optional preferred visit date
 * @param {string} [data.preferredVisitTime] - Optional preferred visit time
 * 
 * @returns {Promise<Object>} Success object with messageId
 * @throws {Error} If email sending fails
 */
const sendInquiryNotification = async (data) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Logic Wave Property" <${process.env.EMAIL_USER}>`,
      to: data.ownerEmail,
      subject: `New ${data.inquiryType} Inquiry for ${data.propertyTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .info-box { background: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
            .label { font-weight: bold; color: #4b5563; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 New Property Inquiry</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have received a new <strong>${data.inquiryType.replace(/-/g, ' ')}</strong> inquiry for your property.</p>
              
              <div class="info-box">
                <p><span class="label">Property:</span> ${data.propertyTitle}</p>
                <p><span class="label">Inquiry Type:</span> ${data.inquiryType.replace(/-/g, ' ').toUpperCase()}</p>
              </div>
              
              <h3>Inquirer Details:</h3>
              <div class="info-box">
                <p><span class="label">Name:</span> ${data.userName}</p>
                <p><span class="label">Email:</span> ${data.userEmail}</p>
                <p><span class="label">Phone:</span> ${data.phone}</p>
              </div>
              
              <h3>Message:</h3>
              <div class="info-box">
                <p>${data.message}</p>
              </div>
              
              ${data.preferredVisitDate ? `
              <h3>Preferred Visit:</h3>
              <div class="info-box">
                <p><span class="label">Date:</span> ${new Date(data.preferredVisitDate).toLocaleDateString()}</p>
                ${data.preferredVisitTime ? `<p><span class="label">Time:</span> ${data.preferredVisitTime}</p>` : ''}
              </div>
              ` : ''}
              
              <p>Please respond to the inquirer as soon as possible.</p>
              <p>
                <a href="mailto:${data.userEmail}" class="button">Reply via Email</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Inquiry notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(' Error sending email:', error.message);
    throw error;
  }
};

/**
 * Sends a welcome email to newly registered users
 * Email content varies based on user role (seller vs regular user)
 * Includes platform features, getting started guide, and support information
 * 
 * @param {Object} data - User registration data
 * @param {string} data.email - User's email address
 * @param {string} data.name - User's full name
 * @param {string} data.role - User's role ('seller' or 'user')
 * 
 * @returns {Promise<Object>} Success object with messageId
 * @throws {Error} If email sending fails
 */
const sendWelcomeEmail = async (data) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"UrbanStay.com" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: 'Welcome to UrbanStay.com!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .welcome-box { background: #f0fdf4; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px; }
            .features { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature-item { margin: 15px 0; padding-left: 25px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 18px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">Welcome to UrbanStay.com!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your journey to finding the perfect property starts here</p>
            </div>
            <div class="content">
              <div class="welcome-box">
                <h2 style="margin-top: 0; color: #10b981;">Hello ${data.name}! 👋</h2>
                <p style="margin-bottom: 0;">Thank you for joining UrbanStay.com. We're excited to have you as part of our community!</p>
              </div>
              
              <p>As a <strong>${data.role === 'seller' ? 'Property Seller' : 'Property Seeker'}</strong>, you now have access to:</p>
              
              <div class="features">
                ${data.role === 'seller' ? `
                  <div class="feature-item">List unlimited properties for sale or rent</div>
                  <div class="feature-item">Manage property inquiries in one place</div>
                  <div class="feature-item">Track property views and analytics</div>
                  <div class="feature-item">Connect with genuine buyers and renters</div>
                  <div class="feature-item">Professional property showcase tools</div>
                ` : `
                  <div class="feature-item">Browse thousands of verified properties</div>
                  <div class="feature-item">Save your favorite listings</div>
                  <div class="feature-item">Get instant inquiry responses</div>
                  <div class="feature-item">Schedule property visits</div>
                  <div class="feature-item">Receive personalized property alerts</div>
                `}
              </div>
              
              <p><strong>Getting Started:</strong></p>
              <ul>
                ${data.role === 'seller' ? `
                  <li>Complete your seller profile</li>
                  <li>Post your first property listing</li>
                  <li>Set up notifications for inquiries</li>
                ` : `
                  <li>Explore properties in your preferred locations</li>
                  <li>Set up your search preferences</li>
                  <li>Save properties you're interested in</li>
                `}
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Start Exploring</a>
              </div>
              
              <div class="footer">
                <p>Need help? Our support team is here to assist you.</p>
                <p>Contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #10b981;">${process.env.EMAIL_USER}</a></p>
                <p style="margin-top: 20px;">© 2026 UrbanStay.com. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    throw error;
  }
};

module.exports = {
  sendInquiryNotification,
  sendWelcomeEmail,
};
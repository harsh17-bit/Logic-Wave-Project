// Email Service - Disabled
// Email functionality has been removed from the application

export const emailService = {
  // Send inquiry notification to property owner
  sendInquiryEmail: async (inquiryData) => {
    console.log('Email service disabled - Inquiry would have been sent:', inquiryData);
    return { success: true, message: 'Email service disabled' };
  },

  // Send welcome email to new users
  sendWelcomeEmail: async (userData) => {
    console.log('Email service disabled - Welcome email would have been sent to:', userData.email);
    return true;
  },

  // Send password reset email
  sendPasswordResetEmail: async (userData) => {
    console.log('Email service disabled - Password reset email would have been sent to:', userData.email);
    return true;
  }
};



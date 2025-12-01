const recoveryPasswordEmail = (userData) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4CAF50;">Password Recovery</h1>
      </div>
      <div style="margin-bottom: 20px;">
        <p>Hi <strong>${userData.fullName}</strong>,</p>
        <p>We have received a request to recover your password on <strong>Buggle</strong>. Below is your new temporary password:</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">New Password:</h3>
        <p style="font-size: 18px; font-weight: bold; text-align: center; margin: 15px 0; color: #4CAF50;">${userData.newPassword}</p>
        <p>Please use this password to log in. For security reasons, we recommend that you change your password after logging in.</p>
      </div>
      <div style="margin-bottom: 20px;">
        <p>If you did not request this password recovery, please contact our support team immediately.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
        <p>This is an automated message, please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} Buggle. All rights reserved.</p>
      </div>
    </div>
  `;
};

module.exports = { recoveryPasswordEmail };

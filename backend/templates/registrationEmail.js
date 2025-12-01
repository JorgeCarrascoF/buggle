const registrationEmail = (userData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4CAF50;">¡Welcome to Buggle!</h1>
      </div>
      <div style="margin-bottom: 20px;">
        <p>Hi <strong>${userData.fullName}</strong>,</p>
        <p>We are pleased to inform you that your registration on <strong>Buggle</strong> has been successfully completed. Below are the details of your account:</p>
      </div>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Account Details:</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;"><strong>Full Name:</strong> ${userData.fullName}</li>
          <li style="margin-bottom: 10px;"><strong>Username:</strong> ${userData.username}</li>
          <li style="margin-bottom: 10px;"><strong>Role:</strong> ${userData.role === 'admin' ? 'Administrator' : userData.role === 'superadmin' ? 'Super Administrator' : 'User'}</li>
          <li style="margin-bottom: 10px;"><strong>Password:</strong> ${userData.password}</li>
        </ul>
      </div>
      <div style="margin-bottom: 20px;">
        <p>We recommend that you change your password frequently for added security.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #777; font-size: 12px;">
        <p>This is an automated message, please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} Buggle. All rights reserved.</p>
      </div>
    </div>
  `;
};

module.exports = { registrationEmail };

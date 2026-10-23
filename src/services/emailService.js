import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false,
});

export const buildWelcomeEmail = ({ userName, userEmail }) => ({
  from: "noreply@react-movie.com",
  to: userEmail,
  subject: "Welcome Email",
  html: `
    <h1 style="color: #333;">Welcome to React Movie, ${userName}!</h1>
    <p style="font-size: 16px;">Thank you for signing up for our movie platform. We're excited to have you on board!</p>
    <p style="font-size: 16px;">Explore our vast collection of movies, create your watchlist, and enjoy a seamless movie-watching experience.</p>
    <p style="font-size: 16px;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p style="font-size: 16px;">Happy watching!</p>
    <p style="font-size: 16px;">Best regards,<br>The React Movie Team</p>
    `,
});

export const sendWelcomeEmail = async (user) => {
  const mail = buildWelcomeEmail({
    userName: user.username,
    userEmail: user.email,
  });

  try {
    await transporter.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    });
    // console.log(`Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send welcome email: ${error.message}`);
    return false;
  }
};

export const buildPasswordResetEmail = ({ userName, email, resetToken }) => ({
  from: "NOVACART <no-reply@novacart.com>",
  to: email,
  subject: "Password Reset Request",
  html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
  <h2>Password Reset Request</h2>
  <p>Hi ${userName},</p>
  <p>You have requested to reset your password. Please click the link below to reset your password:</p>
  <p><a style="text-decoration: none; color: #007bff;" href="http://127.0.0.1:5500/resetpassword.html?token=${resetToken}" target="_blank">Reset Password</a></p>
  <p>This link will expire in 5 minutes.</p>
  <p>If you did not request a password reset, please ignore this email.</p>
  </div>`,
});

export const sendPasswordResetEmail = async ({
  userName,
  email,
  resetToken,
}) => {
  const mail = buildPasswordResetEmail({
    userName,
    email,
    resetToken,
  });

  try {
    await transporter.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    });
    // console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email: ", error.message);
    return false;
  }
};

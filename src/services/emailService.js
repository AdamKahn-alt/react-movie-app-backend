import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "localhost",
  port: Number(process.env.EMAIL_PORT || 1025),
  secure: Number(process.env.EMAIL_PORT) === 465,
  ...(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
    ? {
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      }
    : {}),
});

export const buildWelcomeEmail = ({ userName, userEmail }) => ({
  from: process.env.EMAIL_FROM || '"noreply@support.reelix.com"',
  to: userEmail,
  subject: "Welcome Email",
  html: `
  <div style="background-color: #0b0d13; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif; color: #e5e7eb;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #141824; border-radius: 12px; overflow: hidden; border: 1px solid #23293a; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header / Logo Banner -->
    <div style="background-color: #1c2232; border-bottom: 2px solid #00e0ff; padding: 28px 24px; text-align: center; position: relative;">
      <img src="https://adam.florintechdevs.com/reelix-logo.png" alt="Reelix Logo" style="max-height: 54px; width: auto; max-width: 67px; position: absolute; top: 28px; left: 19px;" />

      <h2 style="color: #ffffff; font-size: 22px; font-family: sans-serif; display: block; margin: 0 0 4px 0;">Reelix</h2>
      <span style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #00e0ff; font-weight: 600;">Your Ultimate Movie Hub</span>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 28px;">
      <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 16px 0;">Welcome to Reelix, <strong style="text-transform: capitalize; color: #00e0ff;">${userName}!</strong> 🎬</h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
        Thank you for signing up! Your front-row seat to trending movies, top-rated series, and personalized watchlists is officially ready.
      </p>

      <!-- Feature Highlights Box -->
      <div style="background-color: #1c2232; border-left: 4px solid #e040fb; padding: 16px 20px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff; font-weight: 600;">Here is what you can do right away:</p>
        <ul style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 14px; line-height: 1.7;">
          <li>Discover blockbuster movies and binge-worthy series</li>
          <li>Save favorites to your personal watchlist</li>
          <li>Track ratings, trailers, and details in one place</li>
        </ul>
      </div>

      <!-- Call to Action Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://adam.florintechdevs.com" target="_blank" style="background: linear-gradient(90deg, #2979ff 0%, #e040fb 100%); background-color: #2979ff; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
          Start Exploring Reelix
        </a>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0;">
        Need help or have feedback? Reach out anytime to <a href="mailto:adamsonobodozie@gmail.com" style="color: #00e0ff; text-decoration: none;">our support team</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f121b; padding: 20px 28px; text-align: center; border-top: 1px solid #23293a;">
      <p style="margin: 0; font-size: 13px; color: #64748b;">
        Happy watching,<br>
        <strong style="color: #94a3b8;">The Reelix Team</strong>
      </p>
    </div>

  </div>
</div>

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
    return true;
  } catch (error) {
    console.error(`Failed to send welcome email: ${error.message}`);
    return false;
  }
};

export const buildPasswordResetEmail = ({ userName, email, resetToken }) => ({
  from: process.env.EMAIL_FROM || "noreply@support.reelix.com",
  to: email,
  subject: "Password Reset Request",
  html: `
  <div style="background-color: #0b0d13; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif; color: #e5e7eb;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #141824; border-radius: 12px; overflow: hidden; border: 1px solid #23293a; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header / Logo Banner -->
    <div style="background-color: #1c2232; padding: 24px; text-align: center; border-bottom: 2px solid #e040fb; position: relative;">
      <img src="https://adam.florintechdevs.com/reelix-logo.png" alt="Reelix Logo" style="max-height: 54px; width: auto; max-width: 67px; position: absolute; top: 28px; left: 19px;" />
      <h2 style="color: #ffffff; font-size: 22px; font-family: sans-serif; margin: 0;">Reelix</h2>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 28px;">
      <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 16px 0;">Reset Your Password 🔒</h2>
      
      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 16px 0;">
        Hi <strong style="color: #00e0ff; text-transform: capitalize;">${userName}</strong>,
      </p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px 0;">
        We received a request to reset the password for your Reelix account. Click the button below to choose a new password:
      </p>

      <!-- Call to Action Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.RESET_PASSWORD_LOCATION}?token=${resetToken}" target="_blank" style="background: linear-gradient(90deg, #2979ff 0%, #e040fb 100%); background-color: #2979ff; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
          Reset Password
        </a>
      </div>

      <!-- Expiration Warning Box -->
      <div style="background-color: #25162d; border: 1px solid #6b21a8; padding: 12px 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0; font-size: 13px; color: #f5d0fe;">
          ⏳ <strong>Heads up:</strong> This reset link will expire in <strong>5 minutes</strong> for your security.
        </p>
      </div>

      <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin: 0 0 16px 0;">
        If you did not request a password reset, you can safely ignore this email—your password will remain unchanged.
      </p>

      <!-- Fallback Plain Link (Good practice in case button is blocked) -->
      <p style="font-size: 13px; line-height: 1.5; color: #64748b; border-top: 1px solid #23293a; padding-top: 16px; margin: 16px 0 0 0; word-break: break-all;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <a href="${process.env.RESET_PASSWORD_LOCATION}?token=${resetToken}" style="color: #00e0ff; text-decoration: none;">${process.env.RESET_PASSWORD_LOCATION}?token=${resetToken}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f121b; padding: 18px 28px; text-align: center; border-top: 1px solid #23293a;">
      <p style="margin: 0; font-size: 13px; color: #64748b;">
        © ${new Date().getFullYear()} Reelix • Sent securely via adam.florintechdevs.com
      </p>
    </div>

  </div>
</div>

  `,
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

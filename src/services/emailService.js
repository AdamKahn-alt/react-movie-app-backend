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

const responsiveEmailStyles = `
<style>
  @media only screen and (max-width: 480px) {
    .email-outer { padding: 1.25rem 4% !important; }
    .email-card { width: 100% !important; border-radius: 0.625rem !important; }
    .email-header { padding: 1.25rem 1rem !important; }
    .email-header-logo { top: 1.125rem !important; left: 0.75rem !important; max-width: 2.5rem !important; }
    .email-header-title { font-size: 1.25rem !important; }
    .email-header-subtitle { font-size: 0.6875rem !important; letter-spacing: 0.1rem !important; }
    .email-content { padding: 1.5rem 1.25rem !important; }
    .email-title { font-size: 1.25rem !important; line-height: 1.35 !important; }
    .email-button { padding: 0.75rem 1rem !important; font-size: 0.875rem !important; }
    .email-footer { padding: 1rem 1.25rem !important; }
  }
</style>
`;

export const buildWelcomeEmail = ({ userName, userEmail }) => ({
  from: process.env.EMAIL_FROM || '"noreply@support.reelix.com"',
  to: userEmail,
  subject: "Welcome Email",
  html: `
  ${responsiveEmailStyles}
  <div class="email-outer" style="background-color: #0b0d13; padding: 2.5rem 5%; font-family: 'Segoe UI', Arial, sans-serif; color: #e5e7eb; font-size: 1rem;">
  <div class="email-card" style="width: 100%; max-width: 35rem; box-sizing: border-box; margin: 0 auto; background-color: #141824; border-radius: 0.75rem; overflow: hidden; border: 1px solid #23293a; box-shadow: 0 0.625rem 1.5625rem rgba(0,0,0,0.5);">
    
    <!-- Header / Logo Banner -->
    <div class="email-header" style="background-color: #1c2232; border-bottom: 0.125rem solid #00e0ff; padding: 1.75rem 1.5rem; text-align: center; position: relative;">
      <img class="email-header-logo" src="https://adam.florintechdevs.com/reelix-logo.png" alt="Reelix Logo" style="max-height: 3.375rem; width: auto; max-width: 4.1875rem; position: absolute; top: 1.75rem; left: 1.1875rem;" />

      <h2 class="email-header-title" style="color: #ffffff; font-size: 1.375rem; font-family: sans-serif; display: block; margin: 0 0 0.25rem 0;">Reelix</h2>
      <span class="email-header-subtitle" style="font-size: 0.75rem; letter-spacing: 0.125rem; text-transform: uppercase; color: #00e0ff; font-weight: 600;">Your Ultimate Movie Hub</span>
    </div>

    <!-- Main Content -->
    <div class="email-content" style="padding: 2rem 1.75rem;">
      <h1 class="email-title" style="color: #ffffff; font-size: 1.5rem; line-height: 1.35; margin: 0 0 1rem 0;">Welcome to Reelix, <strong style="text-transform: capitalize; color: #00e0ff;">${userName}!</strong> 🎬</h1>
      
      <p style="font-size: 0.9375rem; line-height: 1.6; color: #cbd5e1; margin: 0 0 1rem 0;">
        Thank you for signing up! Your front-row seat to trending movies, top-rated series, and personalized watchlists is officially ready.
      </p>

      <!-- Feature Highlights Box -->
      <div style="background-color: #1c2232; border-left: 0.25rem solid #e040fb; padding: 1rem 1.25rem; border-radius: 0.375rem; margin: 1.5rem 0;">
        <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #ffffff; font-weight: 600;">Here is what you can do right away:</p>
        <ul style="margin: 0; padding-left: 1.125rem; color: #cbd5e1; font-size: 0.875rem; line-height: 1.7;">
          <li>Discover blockbuster movies and binge-worthy series</li>
          <li>Save favorites to your personal watchlist</li>
          <li>Track ratings, trailers, and details in one place</li>
        </ul>
      </div>

      <!-- Call to Action Button -->
      <div style="text-align: center; margin: 2rem 0;">
        <a class="email-button" href="https://adam.florintechdevs.com" target="_blank" style="background: linear-gradient(90deg, #2979ff 0%, #e040fb 100%); background-color: #2979ff; color: #ffffff; text-decoration: none; padding: 0.875rem 2rem; border-radius: 0.375rem; font-weight: 600; font-size: 0.9375rem; display: inline-block;">
          Start Exploring Reelix
        </a>
      </div>

      <p style="font-size: 0.875rem; line-height: 1.6; color: #94a3b8; margin: 0;">
        Need help or have feedback? Reach out anytime to <a href="mailto:adamsonobodozie@gmail.com" style="color: #00e0ff; text-decoration: none;">our support team</a>.
      </p>
    </div>

    <!-- Footer -->
    <div class="email-footer" style="background-color: #0f121b; padding: 1.25rem 1.75rem; text-align: center; border-top: 1px solid #23293a;">
      <p style="margin: 0; font-size: 0.8125rem; color: #64748b;">
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
  ${responsiveEmailStyles}
  <div class="email-outer" style="background-color: #0b0d13; padding: 2.5rem 5%; font-family: 'Segoe UI', Arial, sans-serif; color: #e5e7eb; font-size: 1rem;">
  <div class="email-card" style="width: 100%; max-width: 35rem; box-sizing: border-box; margin: 0 auto; background-color: #141824; border-radius: 0.75rem; overflow: hidden; border: 1px solid #23293a; box-shadow: 0 0.625rem 1.5625rem rgba(0,0,0,0.5);">
    
    <!-- Header / Logo Banner -->
    <div class="email-header" style="background-color: #1c2232; padding: 1.5rem; text-align: center; border-bottom: 0.125rem solid #e040fb; position: relative;">
      <img class="email-header-logo" src="https://adam.florintechdevs.com/reelix-logo.png" alt="Reelix Logo" style="max-height: 3.375rem; width: auto; max-width: 4.1875rem; position: absolute; top: 1.5rem; left: 1.1875rem;" />
      <h2 class="email-header-title" style="color: #ffffff; font-size: 1.375rem; font-family: sans-serif; margin: 0;">Reelix</h2>
    </div>

    <!-- Main Content -->
    <div class="email-content" style="padding: 2rem 1.75rem;">
      <h2 class="email-title" style="color: #ffffff; font-size: 1.375rem; line-height: 1.35; margin: 0 0 1rem 0;">Reset Your Password 🔒</h2>
      
      <p style="font-size: 0.9375rem; line-height: 1.6; color: #cbd5e1; margin: 0 0 1rem 0;">
        Hi <strong style="color: #00e0ff; text-transform: capitalize;">${userName}</strong>,
      </p>
      
      <p style="font-size: 0.9375rem; line-height: 1.6; color: #cbd5e1; margin: 0 0 1.5rem 0;">
        We received a request to reset the password for your Reelix account. Click the button below to choose a new password:
      </p>

      <!-- Call to Action Button -->
      <div style="text-align: center; margin: 1.875rem 0;">
        <a class="email-button" href="${process.env.RESET_PASSWORD_LOCATION}?token=${resetToken}" target="_blank" style="background: linear-gradient(90deg, #2979ff 0%, #e040fb 100%); background-color: #2979ff; color: #ffffff; text-decoration: none; padding: 0.875rem 2rem; border-radius: 0.375rem; font-weight: 600; font-size: 0.9375rem; display: inline-block;">
          Reset Password
        </a>
      </div>

      <!-- Expiration Warning Box -->
      <div style="background-color: #25162d; border: 1px solid #6b21a8; padding: 0.75rem 1rem; border-radius: 0.375rem; margin: 1.5rem 0;">
        <p style="margin: 0; font-size: 0.8125rem; color: #f5d0fe;">
          ⏳ <strong>Heads up:</strong> This reset link will expire in <strong>5 minutes</strong> for your security.
        </p>
      </div>

      <p style="font-size: 0.8125rem; line-height: 1.6; color: #94a3b8; margin: 0 0 1rem 0;">
        If you did not request a password reset, you can safely ignore this email—your password will remain unchanged.
      </p>

      <!-- Fallback Plain Link (Good practice in case button is blocked) -->
      <p style="font-size: 0.8125rem; line-height: 1.5; color: #64748b; border-top: 1px solid #23293a; padding-top: 1rem; margin: 1rem 0 0 0; word-break: break-all;">
        If the button above doesn't work, copy and paste this link into your browser:<br>
        <a href="${process.env.RESET_PASSWORD_LOCATION}?token=${resetToken}" style="color: #00e0ff; text-decoration: none;">${process.env.RESET_PASSWORD_LOCATION}?token=${resetToken}</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="email-footer" style="background-color: #0f121b; padding: 1.125rem 1.75rem; text-align: center; border-top: 1px solid #23293a;">
      <p style="margin: 0; font-size: 0.8125rem; color: #64748b;">
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

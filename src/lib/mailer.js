import nodemailer from "nodemailer";

// Lazy-loaded transporter singleton
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  } else {
    // Development fallback mock transporter if SMTP is not provided in env
    transporter = {
      sendMail: async (mailOptions) => {
        console.log("-----------------------------------------");
        console.log("📧 [MOCK EMAIL TRANSPORTER] Outgoing Email:");
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Text / Body: ${mailOptions.text}`);
        console.log("-----------------------------------------");
        return { messageId: "mock-" + Date.now() };
      },
    };
  }

  return transporter;
}

/**
 * Sends a clean, professional HTML OTP email for password reset
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP
 */
export async function sendOtpEmail(toEmail, otp) {
  const mailer = getTransporter();
  const fromAddress =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    `"Murlidhar Studio Admin" <${process.env.SMTP_USER || "noreply@murlidharstudio.in"}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset OTP</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827; }
          .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #111827; padding: 32px 24px; text-align: center; }
          .header h1 { color: #d4af37; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
          .header p { color: #9ca3af; margin: 6px 0 0 0; font-size: 13px; }
          .content { padding: 32px 28px; }
          .otp-box { background: #fdf8e6; border: 1.5px dashed #d4af37; border-radius: 12px; text-align: center; padding: 24px; margin: 24px 0; }
          .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111827; margin: 0; font-family: monospace; }
          .footer { background: #f9fafb; padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Murlidhar Studio</h1>
            <p>Admin Portal Security</p>
          </div>
          <div class="content">
            <h2 style="font-size: 20px; color: #111827; margin-top: 0;">Password Reset Request</h2>
            <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">
              We received a request to reset your admin account password. Use the verification code below to complete the reset process:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.4;">
              ⏳ This code is valid for <strong>10 minutes</strong>. For your security, the code will be invalidated after 3 failed attempts.
            </p>
            <p style="font-size: 13px; color: #9ca3af; margin-top: 24px;">
              If you did not initiate this request, you can safely ignore this email. Your account remains secure.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Murlidhar Studio &bull; Bhuj, Kutch, Gujarat
          </div>
        </div>
      </body>
    </html>
  `;

  return mailer.sendMail({
    from: fromAddress,
    to: toEmail,
    subject: `Your Admin Verification Code: ${otp} - Murlidhar Studio`,
    text: `Your Murlidhar Studio admin verification code is: ${otp}. It expires in 10 minutes.`,
    html: htmlContent,
  });
}

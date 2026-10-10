import bcrypt from "bcryptjs";
import Admin from "./models/Admin";

export const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const DEFAULT_ADMIN_PASSWORD = "msStud!o805";
export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "murlidharstudio28@gmail.com";

let hasCheckedSeed = false;

/**
 * Automatically ensures default admin credentials exist in MongoDB
 */
export async function ensureAdminUserSeeded() {
  if (hasCheckedSeed) return;

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log("⚡ No admin account found. Auto-seeding default admin credentials...");
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
      await Admin.create({
        username: DEFAULT_ADMIN_USERNAME,
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
      });
      console.log(`✅ Default admin created: username="${DEFAULT_ADMIN_USERNAME}", email="${DEFAULT_ADMIN_EMAIL}"`);
    }
    hasCheckedSeed = true;
  } catch (err) {
    console.error("Warning: Failed to auto-seed admin:", err.message);
  }
}

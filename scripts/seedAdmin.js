if (!global.crypto) global.crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGO_URI;

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    otpAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seedAdmin() {
  if (!uri) {
    console.error("❌ Error: MONGO_URI is not defined in .env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const username = process.env.ADMIN_USERNAME || "admin";
    const email = process.env.ADMIN_EMAIL || "murlidharstudio28@gmail.com";
    const passwordRaw = "msStud!o805";

    let admin = await Admin.findOne({ username });

    const hashedPassword = await bcrypt.hash(passwordRaw, 10);

    if (!admin) {
      admin = await Admin.create({
        username,
        email,
        password: hashedPassword,
      });
      console.log(`✅ Created default admin:`);
      console.log(`   Username: ${username}`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${passwordRaw}`);
    } else {
      // Ensure email and default password are updated
      admin.password = hashedPassword;
      if (!admin.email) admin.email = email;
      await admin.save();
      console.log(`✅ Admin updated with default password & email:`);
      console.log(`   Username: ${username}`);
      console.log(`   Email:    ${admin.email}`);
      console.log(`   Password: ${passwordRaw}`);
    }
  } catch (error) {
    console.error("❌ Seed Admin error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedAdmin();

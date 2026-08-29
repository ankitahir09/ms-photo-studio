const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGO_URI;

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  route: { type: String, required: true },
  type: { type: String, enum: ["photo", "video"], default: "photo" },
  coverImage: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const legacyCategories = [
  {
    title: "Hero Backgrounds",
    slug: "homeBg",
    route: "/",
    type: "photo",
    coverImage: "",
    description: "Manage the hero slider images on the landing page.",
    order: 0,
    isActive: false, // Don't show in the public carousel grid, but it exists for admin uploads
  },
  {
    title: "Wedding Photography",
    slug: "weddingphotos",
    route: "/weddingphotos",
    type: "photo",
    coverImage: "https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/01catMenu_hycovb.jpg",
    description: "Your wedding day is a once-in-a-lifetime celebration of love.",
    order: 1,
    isActive: true,
  },
  {
    title: "Pre-wedding Photography",
    slug: "prewedphotos",
    route: "/prewed",
    type: "photo",
    coverImage: "https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/01_jfu9mr.jpg",
    description: "Before the big day arrives, your love story deserves to be celebrated.",
    order: 2,
    isActive: true,
  },
  {
    title: "Kids Photography",
    slug: "childphotos",
    route: "/kidsphotography",
    type: "photo",
    coverImage: "https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/9R2A4637_COMPRESS_oqx4a7.jpg",
    description: "Every child’s world is full of wonder, curiosity, and charm.",
    order: 3,
    isActive: true,
  },
  {
    title: "Engagement Photography",
    slug: "engagephotos",
    route: "/engagephotos",
    type: "photo",
    coverImage: "https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/02_mtlkgx.jpg",
    description: "An engagement marks the beginning of forever.",
    order: 4,
    isActive: true,
  },
  {
    title: "Maternity Photography",
    slug: "maternityshoot",
    route: "/maternityshoot",
    type: "photo",
    coverImage: "https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/10_10000_wr0njm.jpg",
    description: "Motherhood is a beautiful journey filled with love.",
    order: 5,
    isActive: true,
  },
  {
    title: "Modelling Photography",
    slug: "modellingshoot",
    route: "/modellingshoot",
    type: "photo",
    coverImage: "https://res.cloudinary.com/dkmv3uyvz/image/upload/f_auto,q_auto,w_1200/01_COMP_vztxut.jpg",
    description: "Step into the spotlight with confidence.",
    order: 6,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(uri);
    
    for (const cat of legacyCategories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created: ${cat.title}`);
      } else {
        console.log(`Already exists: ${cat.title}`);
      }
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

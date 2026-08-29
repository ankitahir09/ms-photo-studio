export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://murlidharstudio.in';

  // Get dynamic categories directly from DB or fallback
  let categories = [];
  try {
    const { connectToDatabase } = await import("@/lib/db");
    await connectToDatabase();
    const CategoryModel = (await import("@/lib/models/Category")).default;
    const dbCategories = await CategoryModel.find({ isActive: true }).lean();
    categories = JSON.parse(JSON.stringify(dbCategories));
  } catch (error) {
    console.error("Failed to query categories for sitemap:", error.message);
  }

  const dynamicRoutes = categories.map((cat) => ({
    url: `${baseUrl}${cat.route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/contactus',
    '/workwithus',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}

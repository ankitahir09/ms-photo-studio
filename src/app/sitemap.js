export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://murlidharstudio.in';

  // Get dynamic categories
  let categories = [];
  try {
    const res = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      categories = data.categories.filter(c => c.isActive);
    }
  } catch (error) {
    console.error("Failed to fetch categories for sitemap");
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

#!/usr/bin/env node

/**
 * Sitemap Update Script for Murlidhar Studio
 * This script can be run to update the sitemap.xml with current dates
 */

const fs = require('fs');
const path = require('path');

const routes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/prewed', priority: '0.8', changefreq: 'monthly' },
  { url: '/weddingphotos', priority: '0.9', changefreq: 'monthly' },
  { url: '/engagephotos', priority: '0.8', changefreq: 'monthly' },
  { url: '/kidsphotography', priority: '0.8', changefreq: 'monthly' },
  { url: '/maternityshoot', priority: '0.8', changefreq: 'monthly' },
  { url: '/kidvideos', priority: '0.7', changefreq: 'monthly' },
  { url: '/cinvideos', priority: '0.8', changefreq: 'monthly' },
  { url: '/prewedvideos', priority: '0.8', changefreq: 'monthly' },
  { url: '/modellingshoot', priority: '0.7', changefreq: 'monthly' },
  { url: '/contactus', priority: '0.6', changefreq: 'monthly' },
  { url: '/workwithus', priority: '0.5', changefreq: 'monthly' }
];

const baseUrl = 'https://murlidharstudio.com';
const currentDate = new Date().toISOString().split('T')[0];

const generateSitemap = () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  routes.forEach(route => {
    sitemap += `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

const updateSitemap = () => {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const sitemapContent = generateSitemap();
  
  try {
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log('✅ Sitemap updated successfully!');
    console.log(`📅 Last modified: ${currentDate}`);
    console.log(`🔗 Total URLs: ${routes.length}`);
  } catch (error) {
    console.error('❌ Error updating sitemap:', error.message);
  }
};

// Run the update
updateSitemap();

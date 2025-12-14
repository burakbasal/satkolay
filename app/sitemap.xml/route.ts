export async function GET() {
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.satkolay.com/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.satkolay.com/sitemap-products.xml</loc>
  </sitemap>
</sitemapindex>`.trim();

    return new Response(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

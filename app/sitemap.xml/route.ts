export async function GET() {
    const sitemapIndex = `
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.satkolay.com/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://www.satkolay.com/sitemap-products.xml</loc>
  </sitemap>
</sitemapindex>
  `.trim();

    return new Response(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

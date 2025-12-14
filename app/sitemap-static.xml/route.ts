export async function GET() {
    const baseUrl = 'https://www.satkolay.com';
    const routes = [
        '',
        '/kurumsal/hakkimizda',
        '/kurumsal/kariyer',
        '/yasal/gizlilik',
        '/yasal/kullanim-kosullari',
        '/iletisim',
        '/rehber/nasil-satilir',
        '/rehber/nasil-alinir'
    ];

    const currentDate = new Date().toISOString().split('T')[0];

    const urls = routes.map(route => {
        return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
    `.trim();
    }).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

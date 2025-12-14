import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = await createClient();
    const baseUrl = 'https://www.satkolay.com';

    const { data: products } = await supabase
        .from('items')
        .select('id, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10000);

    const urls = (products || []).map(product => {
        return `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
    `.trim();
    }).join('');

    const sitemap = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
  `.trim();

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

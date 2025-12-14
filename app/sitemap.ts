import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = 'https://www.satkolay.com'

    // 1. Fetch Products (Limit to 5000 for performance)
    const { data: products } = await supabase
        .from('items')
        .select('id, updated_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5000)

    const productUrls = (products || []).map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    // 2. Fetch Profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, updated_at')
        .limit(1000)

    const profileUrls = (profiles || []).map((profile) => ({
        url: `${baseUrl}/profile/${profile.username || profile.id}`,
        lastModified: new Date(profile.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // 3. Static Routes
    const staticRoutes = [
        '', '/search', '/sell', '/login', '/register',
        '/kurumsal/hakkimizda', '/kurumsal/kariyer',
        '/yasal/gizlilik', '/yasal/kullanim-kosullari',
        '/iletisim', '/rehber/nasil-satilir', '/rehber/nasil-alinir'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.6,
    }))

    return [...staticRoutes, ...productUrls, ...profileUrls]
}

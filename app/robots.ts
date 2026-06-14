import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/agent/',
                '/driver/',
                '/dashboard/',
            ],
        },
        sitemap: 'https://truckdorkar.com/sitemap.xml',
    }
}

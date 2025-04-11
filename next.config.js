/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'image.tmdb.org'
            },
            {
                protocol: 'https',
                hostname: 'static.tvmaze.com'
            },
            {
                protocol: 'https',
                hostname: 'artworks.thetvdb.com'
            }
        ]
    }
}

module.exports = nextConfig

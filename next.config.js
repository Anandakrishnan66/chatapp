/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        NEXTAUTH_SECRET:"superset"
    },
   images:{
    domains:['lh3.googleusercontent.com']
   }
}

module.exports = nextConfig

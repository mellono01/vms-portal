/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/vms/portal",
    output: "standalone",
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL
    },
};

export default nextConfig;

// Use Next.js provided flat config directly to avoid circular refs with FlatCompat + ESLint v9.
// See: https://nextjs.org/docs/app/building-your-application/configuring/eslint#eslint-config
import nextConfig from "eslint-config-next";

const config = [
  ...Array.isArray(nextConfig) ? nextConfig : [nextConfig],
  {
    rules: {
      "@next/next/no-img-element": "warn",
    },
  },
];

export default config;

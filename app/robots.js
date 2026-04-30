export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://your-vercel-domain.vercel.app/sitemap.xml", // Make sure to replace this if you get a custom domain
  };
}

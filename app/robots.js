export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://linke-app.vercel.app/sitemap.xml",
  };
}

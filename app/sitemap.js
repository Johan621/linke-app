export default function sitemap() {
  const baseUrl = 'https://linke-app.vercel.app';
  
  const routes = [
    '',
    '/features/offline-sync',
    '/features/tags-search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}

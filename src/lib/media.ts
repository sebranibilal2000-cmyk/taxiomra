// Stable, crawlable public URL for a media-library object.
// The storage bucket stays private; this proxies through our own cached route.
export function publicMediaUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `/api/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}

export function isMediaProxyUrl(url: string) {
  return url.startsWith("/api/public/media/");
}

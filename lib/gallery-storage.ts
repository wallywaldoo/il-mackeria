export function getGalleryStoragePath(url: string): string | null {
  const marker = "/storage/v1/object/public/gallery/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

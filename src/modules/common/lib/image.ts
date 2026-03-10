type ImageLike = {
  url?: string | null;
};

export function resolveImageUrl(image?: ImageLike | null): string | null {
  if (!image) return null;
  return image.url ?? null;
}

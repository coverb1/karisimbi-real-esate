export function parsePropertyImages(value: string | null | undefined): string[] {
  if (!value) return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((url): url is string => typeof url === "string" && url.trim().length > 0);
    }
  } catch {
    return [trimmed];
  }

  return [trimmed];
}

export function getPrimaryPropertyImage(value: string | null | undefined): string | null {
  return parsePropertyImages(value)[0] ?? null;
}

export function serializePropertyImages(urls: string[]): string | null {
  const cleanUrls = urls.filter((url) => typeof url === "string" && url.trim().length > 0);
  if (cleanUrls.length === 0) return null;
  return JSON.stringify(cleanUrls);
}

export function resolveAssetPath(
  value: string | undefined,
  fallbackDir?: "brands" | "banners"
) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;

  const cleaned = trimmed
    .replace(/^\.?\/?public\//, "")
    .replace(/^\.?\/?src\//, "")
    .replace(/^\.?\/?assets\//, "")
    .replace(/^\.\.\/\.\.\/assets\//, "")
    .replace(/^\.?\/?/, "");

  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(cleaned);
  if (!looksLikeFile) return null;

  if (cleaned.startsWith("brands/") || cleaned.startsWith("banners/")) {
    return `/${cleaned}`;
  }

  if (fallbackDir) return `/${fallbackDir}/${cleaned}`;
  return `/${cleaned}`;
}

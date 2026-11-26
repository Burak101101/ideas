/** Pure helpers for shrinking photos before they are embedded in the page. */

export const MAX_EDGE = 1600;
/** Below this file size an image that already fits is left exactly as picked. */
export const LIGHT_BYTES = 300 * 1024;
export const QUALITY = 0.82;

export type ImageInfo = { type: string; size: number; width: number; height: number };
export type ResizePlan = { action: "keep" } | { action: "resize"; width: number; height: number; mime: "image/jpeg" | "image/webp"; quality: number };

export function planResize(img: ImageInfo, opts: { maxEdge?: number } = {}): ResizePlan {
  const maxEdge = opts.maxEdge ?? MAX_EDGE;
  const type = img.type.toLowerCase();
  // Vector art and (possibly animated) GIFs would be damaged by a canvas round-trip.
  if (type === "image/svg+xml" || type === "image/gif") return { action: "keep" };
  if (!(img.width > 0 && img.height > 0)) return { action: "keep" };
  const longest = Math.max(img.width, img.height);
  if (longest <= maxEdge && img.size <= LIGHT_BYTES) return { action: "keep" };
  const scale = Math.min(1, maxEdge / longest);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  // JPEG stays JPEG (no alpha to lose); everything else goes to WebP, which keeps transparency.
  const mime = type === "image/jpeg" || type === "image/jpg" ? "image/jpeg" : "image/webp";
  return { action: "resize", width, height, mime, quality: QUALITY };
}

export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  const meta = dataUrl.slice(0, comma);
  const body = dataUrl.slice(comma + 1);
  if (!/;base64$/i.test(meta)) return body.length;
  const pad = body.endsWith("==") ? 2 : body.endsWith("=") ? 1 : 0;
  return Math.floor((body.length * 3) / 4) - pad;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function shrinkNotice(name: string, before: number, after: number, width: number, height: number): string {
  return `"${name}" küçültüldü: ${formatBytes(before)} → ${formatBytes(after)} (${width}×${height} px). Orijinal boyut gerekiyorsa "Büyük görselleri küçült" seçeneğini kapatıp yeniden seçin.`;
}

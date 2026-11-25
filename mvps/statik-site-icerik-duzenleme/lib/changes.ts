import type { Edit } from "./html";
import { parseRepo } from "./github";

export type Change =
  | { id: number; kind: "text"; tag: string; oldLabel: string; newLabel: string; newRaw: string }
  | { id: number; kind: "image"; tag: "img"; oldLabel: string; newLabel: string; newSrc: string; oldThumb?: string };

export function upsertChange(list: Change[], c: Change): Change[] {
  const i = list.findIndex((x) => x.id === c.id);
  if (i === -1) return [...list, c];
  const next = list.slice();
  next[i] = c;
  return next;
}

export function removeChange(list: Change[], id: number): Change[] {
  return list.filter((c) => c.id !== id);
}

export function toEdits(list: Change[]): Edit[] {
  return list.map((c) => (c.kind === "text" ? { id: c.id, kind: "text", newRaw: c.newRaw } : { id: c.id, kind: "image", newSrc: c.newSrc }));
}

export function fileLabel(src: string): string {
  if (src.startsWith("data:")) return "gömülü görsel";
  const clean = src.split(/[?#]/)[0];
  return clean.split("/").filter(Boolean).pop() ?? src;
}

export function rawGithubBase(repo: string, branch: string, path: string): string {
  const r = parseRepo(repo);
  if (!r) return "";
  const dir = path.trim().replace(/^\/+/, "").split("/").slice(0, -1).join("/");
  return `https://raw.githubusercontent.com/${r.owner}/${r.name}/${branch.trim()}/${dir ? dir + "/" : ""}`;
}

/** Stable fingerprint of the pending edits; used to tell whether the page has unsaved work. */
export function changesKey(list: Change[]): string {
  return list
    .slice()
    .sort((x, y) => x.id - y.id)
    .map((c) => `${c.id}:${c.kind === "text" ? c.newRaw : `${c.newSrc.length}:${c.newSrc.slice(-64)}`}`)
    .join("\u0000");
}

export const LARGE_IMAGE_BYTES = 1024 * 1024;

export function imageCheck(file: { name: string; type: string; size: number }): { ok: boolean; message?: string } {
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: `"${file.name}" bir görsel değil. PNG, JPG, WebP, GIF ya da SVG seçin.` };
  }
  if (file.size > LARGE_IMAGE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { ok: true, message: `"${file.name}" ${mb} MB; sayfaya gömülünce siteyi yavaşlatabilir. Mümkünse 1 MB altına küçültün.` };
  }
  return { ok: true };
}

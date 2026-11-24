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

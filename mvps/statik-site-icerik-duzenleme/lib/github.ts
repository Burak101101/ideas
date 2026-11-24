/**
 * Minimal GitHub Contents API client. Runs in the browser only: the token goes
 * straight from the user's tab to api.github.com and is never sent to our server.
 */

export type Target = { token: string; repo: string; branch: string; path: string };
type Fetch = typeof fetch;

const API = "https://api.github.com";

export class GitHubError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

const LABELS: [keyof Target, string][] = [
  ["token", "Token"],
  ["repo", "Repo"],
  ["branch", "Dal"],
  ["path", "Dosya yolu"],
];

export function missingFields(t: Target): string[] {
  return LABELS.filter(([k]) => !t[k].trim()).map(([, label]) => label);
}

export function parseRepo(input: string): { owner: string; name: string } | null {
  const s = input
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
  const m = /^([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)$/.exec(s);
  return m ? { owner: m[1], name: m[2] } : null;
}

export function encodeBase64Utf8(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\s+/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function messageFor(status: number, ghMessage: string): string {
  switch (status) {
    case 401:
      return "GitHub token'ı reddetti (401): token geçersiz ya da süresi dolmuş. Yeni bir token oluşturup tekrar deneyin.";
    case 403:
      return `GitHub bu işleme izin vermedi (403): token'ın bu repoda "Contents: write" izni olmayabilir ya da istek sınırı aşıldı.${ghMessage ? ` (${ghMessage})` : ""}`;
    case 404:
      return "Repo, dal ya da dosya bulunamadı (404). Adları kontrol edin; özel repolarda token'ın bu repoya erişimi olmalı.";
    case 409:
      return "Dosya GitHub'da bu arada değişti (409). Dosyayı GitHub'dan yeniden açıp değişiklikleri tekrar yapın.";
    case 422:
      return `GitHub isteği kabul etmedi (422)${ghMessage ? `: ${ghMessage}` : ""}. Dal adını kontrol edin.`;
    default:
      return `GitHub beklenmeyen bir hata döndürdü (${status})${ghMessage ? `: ${ghMessage}` : ""}.`;
  }
}

function resolve(t: Target) {
  const repo = parseRepo(t.repo);
  if (!repo) throw new GitHubError(0, 'Repo "kullanıcı/repo" biçiminde olmalı (ör. ayse/kafe-sitesi).');
  const path = t.path
    .trim()
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  return `${API}/repos/${repo.owner}/${repo.name}/contents/${path}`;
}

async function call(f: Fetch, url: string, token: string, init: RequestInit = {}) {
  let r: Response;
  try {
    r = await f(url, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token.trim()}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch {
    throw new GitHubError(0, "GitHub'a ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
  }
  let body: Record<string, unknown> = {};
  try {
    body = await r.json();
  } catch {
    /* empty body */
  }
  return { status: r.status, ok: r.ok, body };
}

export async function getFile(t: Target, f: Fetch = fetch): Promise<{ content: string; sha: string } | null> {
  const url = `${resolve(t)}?ref=${encodeURIComponent(t.branch.trim())}`;
  const r = await call(f, url, t.token);
  if (r.status === 404) return null;
  if (!r.ok) throw new GitHubError(r.status, messageFor(r.status, String(r.body.message ?? "")));
  if (Array.isArray(r.body)) throw new GitHubError(0, "Bu yol bir klasör; bir .html dosyası yolu girin.");
  return { content: decodeBase64Utf8(String(r.body.content ?? "")), sha: String(r.body.sha) };
}

export async function commitFile(t: Target, content: string, message: string, f: Fetch = fetch): Promise<{ url: string; sha: string }> {
  const url = resolve(t);
  const existing = await getFile(t, f);
  const payload: Record<string, string> = { message, content: encodeBase64Utf8(content), branch: t.branch.trim() };
  if (existing) payload.sha = existing.sha;
  const r = await call(f, url, t.token, { method: "PUT", body: JSON.stringify(payload) });
  if (!r.ok) throw new GitHubError(r.status, messageFor(r.status, String(r.body.message ?? "")));
  const commit = (r.body.commit ?? {}) as { html_url?: string; sha?: string };
  return { url: String(commit.html_url ?? ""), sha: String(commit.sha ?? "") };
}

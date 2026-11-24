import { describe, expect, it, vi } from "vitest";
import { commitFile, decodeBase64Utf8, encodeBase64Utf8, getFile, GitHubError, missingFields, parseRepo } from "../lib/github";

const target = { token: "tok", repo: "ayse/kafe-sitesi", branch: "main", path: "site/index.html" };

function res(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("missingFields", () => {
  it("lists every empty field by its label", () => {
    expect(missingFields({ token: "", repo: " ", branch: "", path: "" })).toEqual(["Token", "Repo", "Dal", "Dosya yolu"]);
    expect(missingFields(target)).toEqual([]);
  });
});

describe("parseRepo", () => {
  it("accepts owner/name and github URLs", () => {
    expect(parseRepo("ayse/kafe")).toEqual({ owner: "ayse", name: "kafe" });
    expect(parseRepo("https://github.com/ayse/kafe.git")).toEqual({ owner: "ayse", name: "kafe" });
    expect(parseRepo("kafe")).toBeNull();
  });
});

describe("base64", () => {
  it("round-trips UTF-8 text", () => {
    const s = "Şişli’de çay ☕ & simit";
    expect(decodeBase64Utf8(encodeBase64Utf8(s))).toBe(s);
    expect(encodeBase64Utf8("ğ")).toBe("xJ8=");
  });
  it("decodes GitHub's line-wrapped base64", () => {
    expect(decodeBase64Utf8("xJ8=\n")).toBe("ğ");
  });
});

describe("getFile", () => {
  it("returns content and sha", async () => {
    const f = vi.fn().mockResolvedValue(res(200, { content: encodeBase64Utf8("<h1>a</h1>"), sha: "abc" }));
    expect(await getFile(target, f)).toEqual({ content: "<h1>a</h1>", sha: "abc" });
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://api.github.com/repos/ayse/kafe-sitesi/contents/site/index.html?ref=main");
    expect(init.headers.Authorization).toBe("Bearer tok");
  });
  it("returns null on 404", async () => {
    expect(await getFile(target, vi.fn().mockResolvedValue(res(404, { message: "Not Found" })))).toBeNull();
  });
});

describe("commitFile", () => {
  it("sends the existing sha and base64 content", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(res(200, { content: "", sha: "old" }))
      .mockResolvedValueOnce(res(200, { commit: { html_url: "https://github.com/c/1", sha: "new" } }));
    const out = await commitFile(target, "<h1>ğ</h1>", "Başlık güncellendi", f);
    expect(out).toEqual({ url: "https://github.com/c/1", sha: "new" });
    const [url, init] = f.mock.calls[1];
    expect(url).toBe("https://api.github.com/repos/ayse/kafe-sitesi/contents/site/index.html");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({ message: "Başlık güncellendi", content: encodeBase64Utf8("<h1>ğ</h1>"), branch: "main", sha: "old" });
  });

  it("creates the file when it does not exist yet", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(res(404, {}))
      .mockResolvedValueOnce(res(201, { commit: { html_url: "u", sha: "s" } }));
    await commitFile(target, "x", "m", f);
    expect(JSON.parse(f.mock.calls[1][1].body).sha).toBeUndefined();
  });

  it("turns 401 into a clear message", async () => {
    const f = vi.fn().mockResolvedValue(res(401, { message: "Bad credentials" }));
    const err = await commitFile(target, "x", "m", f).catch((e) => e);
    expect(err).toBeInstanceOf(GitHubError);
    expect(err.status).toBe(401);
    expect(err.message).toMatch(/GitHub token'ı reddetti \(401\)/);
  });

  it("explains a conflict", async () => {
    const f = vi
      .fn()
      .mockResolvedValueOnce(res(200, { content: "", sha: "old" }))
      .mockResolvedValueOnce(res(409, { message: "is at x but expected y" }));
    const err = await commitFile(target, "x", "m", f).catch((e) => e);
    expect(err.status).toBe(409);
    expect(err.message).toMatch(/değişti/);
  });

  it("reports network failures without throwing raw errors", async () => {
    const f = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const err = await commitFile(target, "x", "m", f).catch((e) => e);
    expect(err).toBeInstanceOf(GitHubError);
    expect(err.status).toBe(0);
    expect(err.message).toMatch(/ulaşılamadı/);
  });

  it("rejects a malformed repo before calling GitHub", async () => {
    const f = vi.fn();
    const err = await commitFile({ ...target, repo: "kafe" }, "x", "m", f).catch((e) => e);
    expect(err.message).toMatch(/kullanıcı\/repo/);
    expect(f).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";
import { changesKey, fileLabel, imageCheck, removeChange, rawGithubBase, toEdits, upsertChange, type Change } from "../lib/changes";

const a: Change = { id: 0, kind: "text", tag: "h1", oldLabel: "Eski", newLabel: "Yeni", newRaw: "Yeni" };
const b: Change = { id: 3, kind: "image", tag: "img", oldLabel: "a.png", newLabel: "b.png", newSrc: "data:x" };

describe("changes", () => {
  it("adds new changes at the end and updates existing ones in place", () => {
    let list = upsertChange([], a);
    list = upsertChange(list, b);
    list = upsertChange(list, { ...a, newLabel: "Daha yeni", newRaw: "Daha yeni" });
    expect(list.map((c) => c.id)).toEqual([0, 3]);
    expect(list[0].newLabel).toBe("Daha yeni");
  });

  it("removes by id", () => {
    expect(removeChange([a, b], 0)).toEqual([b]);
  });

  it("converts to edits for the writer", () => {
    expect(toEdits([a, b])).toEqual([
      { id: 0, kind: "text", newRaw: "Yeni" },
      { id: 3, kind: "image", newSrc: "data:x" },
    ]);
  });

  it("passes a changed alt text along with the image", () => {
    expect(toEdits([{ ...b, newAlt: "Taze simit" }])).toEqual([{ id: 3, kind: "image", newSrc: "data:x", newAlt: "Taze simit" }]);
  });

  it("labels files by their last path segment", () => {
    expect(fileLabel("gorseller/ekmek.svg?v=2")).toBe("ekmek.svg");
    expect(fileLabel("data:image/png;base64,AAAA")).toBe("gömülü görsel");
  });

  it("builds a raw.githubusercontent base for the file's folder", () => {
    expect(rawGithubBase("ayse/kafe", "main", "site/index.html")).toBe("https://raw.githubusercontent.com/ayse/kafe/main/site/");
    expect(rawGithubBase("ayse/kafe", "main", "index.html")).toBe("https://raw.githubusercontent.com/ayse/kafe/main/");
    expect(rawGithubBase("kafe", "main", "index.html")).toBe("");
  });
});

describe("changesKey", () => {
  const t = (id: number, newRaw: string): Change => ({ id, kind: "text", tag: "h1", oldLabel: "a", newLabel: newRaw, newRaw });
  it("boş liste boş anahtar verir; içerik değişince anahtar değişir", () => {
    expect(changesKey([])).toBe("");
    expect(changesKey([t(1, "x")])).not.toBe(changesKey([t(1, "y")]));
    expect(changesKey([t(1, "x"), t(2, "y")])).toBe(changesKey([t(2, "y"), t(1, "x")]));
  });
  it("alt metni değişince anahtar değişir", () => {
    expect(changesKey([{ ...b, newAlt: "x" }])).not.toBe(changesKey([b]));
    expect(changesKey([{ ...b, newAlt: "x" }])).not.toBe(changesKey([{ ...b, newAlt: "y" }]));
  });
  it("aynı içerikli yeni liste aynı anahtarı verir", () => {
    expect(changesKey([t(1, "x")])).toBe(changesKey([t(1, "x")]));
  });
});

describe("imageCheck", () => {
  it("görsel olmayan dosyayı reddeder", () => {
    expect(imageCheck({ name: "not.txt", type: "text/plain", size: 10 })).toEqual({ ok: false, message: expect.stringContaining("görsel değil") });
  });
  it("büyük görseli kabul eder ama uyarır", () => {
    const r = imageCheck({ name: "b.jpg", type: "image/jpeg", size: 3 * 1024 * 1024 });
    expect(r.ok).toBe(true);
    expect(r.message).toContain("3.0 MB");
  });
  it("küçük görsel için mesaj yok", () => {
    expect(imageCheck({ name: "k.png", type: "image/png", size: 2000 })).toEqual({ ok: true });
  });
});

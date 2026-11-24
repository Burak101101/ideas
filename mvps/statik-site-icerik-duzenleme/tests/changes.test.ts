import { describe, expect, it } from "vitest";
import { fileLabel, removeChange, rawGithubBase, toEdits, upsertChange, type Change } from "../lib/changes";

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

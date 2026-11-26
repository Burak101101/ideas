import { describe, expect, it } from "vitest";
import { applyEdits, buildPreview, escapeText, scanEditable } from "../lib/html";

const page = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>Fırın <b>değil</b></title>
  <link rel="stylesheet" href="style.css">
  <style>h1 { color: red; } /* <p>yorum</p> */</style>
  <script>const x = "<h2>yok</h2>";</script>
</head>
<body>
  <!-- <h3>yorum içi</h3> -->
  <h1 class="hero">Taze Ekmek &amp; Simit</h1>
  <p>Her sabah <strong>06:00</strong>'da açığız.</p>
  <p>Bize <a href="/iletisim">yazın</a> ya da arayın.</p>
  <ul><li>Simit<li>Poğaça</ul>
  <img src=kapak.jpg alt="Kapak">
  <img src="a.png" srcset="a@2x.png 2x" alt="">
  <div class="kutu"><div>   </div></div>
  <svg><text>çizim</text></svg>
</body>
</html>`;

const textOf = (src: string, r: { innerStart: number; innerEnd: number }) => src.slice(r.innerStart, r.innerEnd);

describe("scanEditable", () => {
  const regions = scanEditable(page);
  const texts = regions.filter((r) => r.kind === "text");
  const images = regions.filter((r) => r.kind === "image");

  it("finds headings, paragraphs, list items and links in the body", () => {
    expect(texts.map((r) => textOf(page, r))).toEqual([
      "Taze Ekmek &amp; Simit",
      "Her sabah <strong>06:00</strong>'da açığız.",
      'Bize <a href="/iletisim">yazın</a> ya da arayın.',
      "Simit",
      "Poğaça",
    ]);
  });

  it("marks plain text elements as pure and formatted ones as mixed", () => {
    expect(texts.map((r) => r.kind === "text" && r.pure)).toEqual([true, false, false, true, true]);
  });

  it("ignores head content, comments, scripts, styles, svg and empty elements", () => {
    const all = texts.map((r) => textOf(page, r)).join("|");
    expect(all).not.toContain("yok");
    expect(all).not.toContain("yorum");
    expect(all).not.toContain("çizim");
    expect(all).not.toContain("değil");
  });

  it("finds images with src ranges, including unquoted values and srcset", () => {
    expect(images).toHaveLength(2);
    const [a, b] = images;
    if (a.kind !== "image" || b.kind !== "image") throw new Error();
    expect(page.slice(a.srcStart, a.srcEnd)).toBe("kapak.jpg");
    expect(a.srcQuoted).toBe(false);
    expect(page.slice(b.srcStart, b.srcEnd)).toBe("a.png");
    expect(b.srcset && page.slice(b.srcset[0], b.srcset[1])).toBe(' srcset="a@2x.png 2x"');
  });

  it("gives sequential ids in document order", () => {
    expect(regions.map((r) => r.id)).toEqual(regions.map((_, i) => i));
  });

  it("handles uppercase tags and self-closing images", () => {
    const src = `<BODY><H2>Merhaba</H2><IMG SRC='x.png'/></BODY>`;
    const r = scanEditable(src);
    expect(r.map((x) => x.kind)).toEqual(["text", "image"]);
    expect(textOf(src, r[0] as never)).toBe("Merhaba");
  });

  it("closes an unclosed paragraph at the next block and trims trailing whitespace", () => {
    const src = `<body><p>Birinci\n  <p>İkinci\n</body>`;
    const r = scanEditable(src);
    expect(r.map((x) => textOf(src, x as never))).toEqual(["Birinci", "İkinci"]);
  });

  it("works on fragments without html/body tags", () => {
    expect(scanEditable("<h1>Tek</h1>")).toHaveLength(1);
  });
});

describe("applyEdits", () => {
  const regions = scanEditable(page);

  it("returns the source unchanged with no edits", () => {
    expect(applyEdits(page, regions, [])).toBe(page);
  });

  it("changes only the edited element's content", () => {
    const out = applyEdits(page, regions, [{ id: 0, kind: "text", newRaw: "Yeni Başlık" }]);
    expect(out).toBe(page.replace("Taze Ekmek &amp; Simit", "Yeni Başlık"));
  });

  it("applies several edits regardless of order", () => {
    const out = applyEdits(page, regions, [
      { id: 4, kind: "text", newRaw: "Açma" },
      { id: 0, kind: "text", newRaw: "A" },
    ]);
    expect(out).toBe(page.replace("Taze Ekmek &amp; Simit", "A").replace("Poğaça", "Açma"));
  });

  it("replaces an unquoted image src and quotes it", () => {
    const img = regions.find((r) => r.kind === "image")!;
    const out = applyEdits(page, regions, [{ id: img.id, kind: "image", newSrc: "data:image/png;base64,AAA" }]);
    expect(out).toBe(page.replace("src=kapak.jpg", 'src="data:image/png;base64,AAA"'));
  });

  it("removes srcset when the image is replaced so the new image shows", () => {
    const img = regions.filter((r) => r.kind === "image")[1];
    const out = applyEdits(page, regions, [{ id: img.id, kind: "image", newSrc: "b.png" }]);
    expect(out).toBe(page.replace('<img src="a.png" srcset="a@2x.png 2x" alt="">', '<img src="b.png" alt="">'));
  });

  it("escapes quotes in a new src", () => {
    const img = regions.filter((r) => r.kind === "image")[1];
    const out = applyEdits(page, regions, [{ id: img.id, kind: "image", newSrc: 'x"y&z.png' }]);
    expect(out).toContain('src="x&quot;y&amp;z.png"');
  });

  it("changes an existing alt text together with the image", () => {
    const img = regions.filter((r) => r.kind === "image")[1];
    const out = applyEdits(page, regions, [{ id: img.id, kind: "image", newSrc: "b.png", newAlt: 'Taze "simit" & çay' }]);
    expect(out).toBe(page.replace('<img src="a.png" srcset="a@2x.png 2x" alt="">', '<img src="b.png" alt="Taze &quot;simit&quot; &amp; çay">'));
  });

  it("adds an alt attribute when the image had none", () => {
    const doc = "<p>x</p><img src=kapak.jpg><IMG class=a src='b.png'/>";
    const rs = scanEditable(doc);
    const out = applyEdits(doc, rs, [
      { id: 1, kind: "image", newSrc: "k.png", newAlt: "Kapak" },
      { id: 2, kind: "image", newSrc: "c.png", newAlt: "C" },
    ]);
    expect(out).toBe('<p>x</p><img alt="Kapak" src="k.png"><IMG alt="C" class=a src=\'c.png\'/>');
  });

  it("reports the original alt text of each image", () => {
    const [a, b] = regions.filter((r) => r.kind === "image");
    if (a.kind !== "image" || b.kind !== "image") throw new Error();
    expect(a.alt).toBe("Kapak");
    expect(b.alt).toBe("");
    const r = scanEditable('<p>x</p><img src="a.png" alt=\'Fırın &amp; ekmek\'><img src=b.png alt=Tek><img src=c.png>');
    expect(r.filter((x) => x.kind === "image").map((x) => (x.kind === "image" ? x.alt : 0))).toEqual(["Fırın & ekmek", "Tek", null]);
  });

  it("leaves alt untouched when newAlt is not given", () => {
    const img = regions.filter((r) => r.kind === "image")[1];
    const out = applyEdits(page, regions, [{ id: img.id, kind: "image", newSrc: "b.png" }]);
    expect(out).toContain('alt=""');
  });

  it("ignores edits for unknown ids", () => {
    expect(applyEdits(page, regions, [{ id: 999, kind: "text", newRaw: "x" }])).toBe(page);
  });
});

describe("buildPreview", () => {
  const src = `<html><head><title>t</title></head><body><h1>Merhaba</h1><img src="a.png"></body></html>`;
  const regions = scanEditable(src);

  it("tags editable elements with data-se-id without touching the rest", () => {
    const out = buildPreview(src, regions);
    expect(out).toContain('<h1 data-se-id="0">Merhaba</h1>');
    expect(out).toContain('<img data-se-id="1" src="a.png">');
  });

  it("injects the highlight style into the head", () => {
    expect(buildPreview(src, regions)).toMatch(/<style data-se-preview>[^<]*\[data-se-id\]:hover[^<]*<\/style><\/head>/);
  });

  it("adds a base href when given and none exists", () => {
    expect(buildPreview(src, regions, { baseHref: "/ornek/" })).toContain('<head><base href="/ornek/" data-se-preview>');
    const withBase = `<head><base href="/x/"></head><body><p>a</p></body>`;
    expect(buildPreview(withBase, scanEditable(withBase), { baseHref: "/y/" })).not.toContain("/y/");
  });

  it("works when the document has no head", () => {
    const out = buildPreview("<h1>a</h1>", scanEditable("<h1>a</h1>"), { baseHref: "/b/" });
    expect(out.startsWith('<base href="/b/" data-se-preview><style data-se-preview>')).toBe(true);
    expect(out).toContain('<h1 data-se-id="0">a</h1>');
  });
});

describe("escapeText", () => {
  it("escapes markup characters and non-breaking spaces", () => {
    expect(escapeText("a < b & c > d e")).toBe("a &lt; b &amp; c &gt; d&nbsp;e");
  });
});

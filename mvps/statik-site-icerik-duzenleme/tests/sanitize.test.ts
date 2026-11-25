import { describe, expect, it } from "vitest";
import { sanitizeInline } from "../lib/sanitize";

const original = `Her sabah <strong>06:30</strong>'da ilk tepsi çıkar. <a href="/iletisim" class="bag">yazın</a>`;

describe("sanitizeInline", () => {
  it("orijinal satır içi etiketleri ve metni olduğu gibi bırakır", () => {
    expect(sanitizeInline(original, original)).toBe(original);
    const edited = `Her gün <strong>07:00</strong>'de açığız. <a href="/iletisim" class="bag">bize yazın</a>`;
    expect(sanitizeInline(edited, original)).toBe(edited);
  });

  it("yapıştırılan görsel ve olay özniteliklerini atar", () => {
    const edited = `Her sabah <img src="x" onerror="alert(1)"><strong>06:30</strong>`;
    expect(sanitizeInline(edited, original)).toBe(`Her sabah <strong>06:30</strong>`);
  });

  it("yeni stil/öznitelikli öğeleri açar, metnini korur", () => {
    const edited = `a <span style="color:red">kırmızı</span> b <font face="Arial">c</font>`;
    expect(sanitizeInline(edited, original)).toBe(`a kırmızı b c`);
  });

  it("orijinaldeki etiket farklı özniteliklerle gelirse açılır", () => {
    const edited = `<a href="javascript:alert(1)">tıkla</a> <a href="/iletisim" class="bag" onclick="x()">yazın</a>`;
    expect(sanitizeInline(edited, original)).toBe(`tıkla yazın`);
  });

  it("script, style, iframe ve svg içeriğiyle birlikte silinir", () => {
    const edited = `x<script>alert(1)</script><style>p{}</style><iframe src="//k"></iframe><svg><text>t</text></svg>y`;
    expect(sanitizeInline(edited, original)).toBe("xy");
  });

  it("biçimlendirme kısayollarının ürettiği yalın etiketlere izin verir", () => {
    const edited = `<b>kalın</b> <i>eğik</i> <em>vurgu</em><br>son`;
    expect(sanitizeInline(edited, "düz")).toBe(edited);
    expect(sanitizeInline(`<b class="x">k</b>`, "düz")).toBe("k");
  });

  it("yapıştırılan blok öğeleri metne indirger", () => {
    const edited = `<div><p>bir</p><p>iki</p></div>`;
    expect(sanitizeInline(edited, original)).toBe("biriki");
  });

  it("öznitelik sırası ve tırnak biçimi farkı orijinal etiketi bozmaz", () => {
    const orig = `<a class=bag href='/x?a=1&amp;b=2'>k</a>`;
    expect(sanitizeInline(`<a href="/x?a=1&amp;b=2" class="bag">k2</a>`, orig)).toBe(`<a href="/x?a=1&amp;b=2" class="bag">k2</a>`);
  });

  it("metindeki kaçışlı karakterleri ve yorumları bozmaz, açık etiket bırakmaz", () => {
    expect(sanitizeInline(`&lt;b&gt; &amp; "q"`, "x")).toBe(`&lt;b&gt; &amp; "q"`);
    expect(sanitizeInline(`a<span>b`, "x")).toBe("ab");
  });
});

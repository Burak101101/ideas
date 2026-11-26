import { describe, expect, it } from "vitest";
import { MAX_EDGE, dataUrlBytes, formatBytes, planResize, shrinkNotice } from "../lib/image";

describe("planResize", () => {
  it("telefon fotoğrafını uzun kenarı 1600 px olacak şekilde JPEG'e küçültür", () => {
    const p = planResize({ type: "image/jpeg", size: 4_000_000, width: 4032, height: 3024 });
    expect(p).toEqual({ action: "resize", width: 1600, height: 1200, mime: "image/jpeg", quality: 0.82 });
  });

  it("dikey görselde yüksekliği sınırlar", () => {
    const p = planResize({ type: "image/jpeg", size: 3_000_000, width: 3000, height: 4000 });
    expect(p).toMatchObject({ action: "resize", width: 1200, height: 1600 });
  });

  it("PNG/WebP gibi saydamlık taşıyabilen görselleri WebP'ye çevirir", () => {
    expect(planResize({ type: "image/png", size: 2_000_000, width: 2400, height: 1200 })).toMatchObject({ mime: "image/webp", width: 1600, height: 800 });
    expect(planResize({ type: "image/webp", size: 900_000, width: 2000, height: 2000 })).toMatchObject({ mime: "image/webp" });
  });

  it("küçük ve hafif görsele dokunmaz", () => {
    expect(planResize({ type: "image/png", size: 70, width: 1, height: 1 })).toEqual({ action: "keep" });
    expect(planResize({ type: "image/jpeg", size: 200_000, width: 1200, height: 800 })).toEqual({ action: "keep" });
  });

  it("boyutu küçük ama dosyası ağır görseli aynı boyutta yeniden sıkıştırır (büyütmez)", () => {
    expect(planResize({ type: "image/jpeg", size: 2_500_000, width: 1400, height: 900 })).toEqual({
      action: "resize",
      width: 1400,
      height: 900,
      mime: "image/jpeg",
      quality: 0.82,
    });
  });

  it("SVG ve GIF'e dokunmaz (vektör / animasyon bozulmasın)", () => {
    expect(planResize({ type: "image/svg+xml", size: 5_000_000, width: 5000, height: 5000 })).toEqual({ action: "keep" });
    expect(planResize({ type: "image/gif", size: 5_000_000, width: 3000, height: 3000 })).toEqual({ action: "keep" });
  });

  it("boyutları okunamayan görsele dokunmaz", () => {
    expect(planResize({ type: "image/jpeg", size: 5_000_000, width: 0, height: 0 })).toEqual({ action: "keep" });
  });

  it("sınır özelleştirilebilir ve en az 1 px kalır", () => {
    expect(planResize({ type: "image/jpeg", size: 5_000_000, width: 10000, height: 2 }, { maxEdge: 800 })).toMatchObject({ width: 800, height: 1 });
    expect(MAX_EDGE).toBe(1600);
  });
});

describe("dataUrlBytes", () => {
  it("base64 data: URI'nin çözülmüş bayt sayısını verir", () => {
    expect(dataUrlBytes("data:image/png;base64,AAAA")).toBe(3);
    expect(dataUrlBytes("data:image/png;base64,AAA=")).toBe(2);
    expect(dataUrlBytes("data:image/png;base64,AA==")).toBe(1);
  });
  it("base64 olmayan girdide uzunluğu döndürür", () => {
    expect(dataUrlBytes("data:image/svg+xml,<svg/>")).toBe(6);
  });
});

describe("formatBytes", () => {
  it("okunur birimler", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(312 * 1024)).toBe("312 KB");
    expect(formatBytes(4.2 * 1024 * 1024)).toBe("4.2 MB");
  });
});

describe("shrinkNotice", () => {
  it("önce/sonra boyutlarını ve piksel ölçüsünü söyler", () => {
    expect(shrinkNotice("vitrin.jpg", 4 * 1024 * 1024, 300 * 1024, 1600, 1200)).toBe(
      '"vitrin.jpg" küçültüldü: 4.0 MB → 300 KB (1600×1200 px). Orijinal boyut gerekiyorsa "Büyük görselleri küçült" seçeneğini kapatıp yeniden seçin.',
    );
  });
});

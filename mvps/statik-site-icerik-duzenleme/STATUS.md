---
status: in-progress
day: 3
---
## Son oturum (2026-11-26)
- Build: geçti · Birim: 69/69 · E2E: 21/21
- **Ö1 düzeltildi** (telefon fotoğrafı HTML'i şişiriyor): görseller sayfaya gömülmeden önce tarayıcıda canvas ile küçültülüyor (`lib/image.ts` saf plan + `lib/shrink.ts`). Uzun kenar ≤ 1600 px, JPEG → JPEG / diğerleri → WebP, kalite 0.82, EXIF yönü uygulanıyor; SVG/GIF'e dokunulmuyor, sonuç büyükse orijinal kalıyor. Araç çubuğunda "Büyük görselleri küçült" (varsayılan açık); bildirim önce/sonra boyutu ve piksel ölçüsünü yazıyor, değişiklik listesinde gömülen boyut görünüyor. 12 birim testi + 3 e2e: tarayıcıda üretilen ~4032×3024 gürültülü JPEG (> 2 MB) 1600×1200'e iniyor ve indirilen HTML 1.5 MB altında / fotoğrafın yarısından küçük; seçenek kapalıyken orijinal gömülüp uyarı çıkıyor; 1×1 PNG bayt bayt aynı kalıyor.
- **Yeni: alt metni düzenleme** (Sıradaki işlerden): değiştirilen görselin değişiklik kartında "Görsel açıklaması" alanı; çıktıda mevcut `alt` değiştirilir ya da yoksa eklenir (kaynak koruyan splice, `lib/html.ts`), "Geri al" eski `alt`'a döner, görsel yeniden seçilince yazılan alt korunur. 6 birim + 1 e2e.

## Sıradaki işler
- Değiştirilen görseli repoya ayrı dosya olarak yükleme seçeneği (Git Data API ile tek commit) — Ö1 küçültmeyle çözüldü, bu artık iyileştirme
- Bağlantı `href` düzenleme (küçük bir yan panel); değiştirilmemiş görsellerde de `alt` düzenleme
- Y1: paragraf içindeki bağlantı metnini ayrı öğe olarak düzenleme
- Y2: çok satırlı öğelerde Shift+Enter ile `<br>` (şimdilik bilinçli olarak yok)
- Y3: bozuk iç içe etiketlerle `insertHTML` sonrası metin kaybı (yalnızca betikle üretilebilir)

## Bilinen sorunlar
- Karışık öğelerde düzenlenen öğenin iç HTML'i (temizlendikten sonra) tarayıcı serileştirmesiyle yazılır.
- `<picture><source>` desteklenmiyor; yalnızca `<img src>` değişir.
- GitHub'dan açılan sayfada harici CSS önizlemede uygulanmayabilir (raw sunucusu `text/plain` döndürür).
- Küçültülen görsel yine `data:` URI olarak gömülür; tarayıcı ayrı önbelleğe alamaz (bkz. Sıradaki işler).
- Safari'nin eski sürümleri canvas'tan WebP üretemezse PNG döner; PNG orijinalden büyükse orijinal kullanılır (yani küçültme o tarayıcıda PNG/WebP girdide etkisiz kalabilir).
- Aynı dosyayı başka sekmede değiştirmek izlenmez.

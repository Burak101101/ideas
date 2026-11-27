---
status: in-progress
day: 4
---
## Son oturum (2026-11-27)
- Build: geçti · Birim: 72/72 · E2E: 22/22
- **K1 düzeltildi** (tek tırnaklı `alt`'ta `'` kaçışlanmıyordu → öznitelik enjeksiyonu): `escapeAttr` artık `'` karakterini de `&#39;` olarak kaçışlıyor (`lib/html.ts:293`). Böylece tek tırnaklı, çift tırnaklı ve tırnaksız (çıktıda çift tırnakla sarılır) öznitelik değerlerinin hepsi güvenli; aynı fonksiyon `src` ve önizleme `<base href>` için de kullanıldığından kural genel.
  - 3 yeni birim testi: tek tırnaklı `alt` + "Ayşe'nin vitrini" (çıktı + yeniden taramada değer aynen geri okunuyor), dört farklı `alt` biçiminde (tek/çift tırnak, tırnaksız, yok) `Vitrin' onload='…` yükünün tek bir `alt` değeri olarak kalması, tek tırnaklı `src`.
  - 1 yeni e2e: tek tırnaklı `alt` içeren sayfa yüklenip görsel değiştiriliyor, `Ayşe'nin vitrini' onload='document.title="XSS"` yazılıyor; indirilen HTML ayrı bir sayfada açılınca `img`'nin yalnızca `alt` ve `src` özniteliği var, `alt` değeri yazılanla aynı, başlık değişmiyor. Düzeltme geri alındığında bu test kalıyor (`Received: "Ayşe"`) — doğrulandı.

## Sıradaki işler
- Y1: paragraf içindeki bağlantı metnini ayrı öğe olarak düzenleme (iç içe bölgeler + çakışmayan splice gerektiriyor)
- Değiştirilmemiş görsellerde de `alt` düzenleme; bağlantı `href` düzenleme (küçük bir yan panel)
- Değiştirilen görseli repoya ayrı dosya olarak yükleme seçeneği (Git Data API ile tek commit) — iyileştirme
- Y2: çok satırlı öğelerde Shift+Enter ile `<br>` (şimdilik bilinçli olarak yok)
- Y3: bozuk iç içe etiketlerle `insertHTML` sonrası metin kaybı (yalnızca betikle üretilebilir)

## Bilinen sorunlar
- Karışık öğelerde düzenlenen öğenin iç HTML'i (temizlendikten sonra) tarayıcı serileştirmesiyle yazılır.
- `<picture><source>` desteklenmiyor; yalnızca `<img src>` değişir.
- GitHub'dan açılan sayfada harici CSS önizlemede uygulanmayabilir (raw sunucusu `text/plain` döndürür).
- Küçültülen görsel yine `data:` URI olarak gömülür; tarayıcı ayrı önbelleğe alamaz (bkz. Sıradaki işler).
- Safari'nin eski sürümleri canvas'tan WebP üretemezse PNG döner; PNG orijinalden büyükse orijinal kullanılır.
- Aynı dosyayı başka sekmede değiştirmek izlenmez.

---
status: ready
day: 1
---
## Son oturum (2026-11-24)
- Build: geçti · Birim: 37/37 · E2E: 10/10
- Proje kuruldu; MVP kapsamındaki 5 çekirdek özelliğin hepsi ilk sürümüyle yapıldı:
  - Kaynak koruyan HTML tarayıcı (`lib/html.ts`): düzenlenebilir metin/görsel bölgeleri, ofsetle yama, önizleme işaretleme
  - Yerinde metin düzenleme, görsel değiştirme, değişiklik listesi + geri al
  - İndirme (düzenlenmeyen kısımlar bayt bayt aynı; e2e tam karşılaştırma)
  - GitHub Contents API ile aç/commit et; eksik alan ve 401 mesajları
- Her kabul kriterine karşılık e2e testi var (`e2e/open`, `edit`, `download`, `github`).

## Sıradaki işler
- Değiştirilen görseli repoya ayrı dosya olarak yükleme seçeneği (Git Data API ile tek commit)
- Görsel `alt` metni ve bağlantı `href` düzenleme (küçük bir yan panel)
- Büyük görseller için yükleme öncesi boyut uyarısı / küçültme
- Mobil düzende önizleme yüksekliği ve dokunmatik düzenleme denemesi
- Kaydedilmemiş değişiklik varken sayfadan çıkarken uyarı (`beforeunload`)

## Bilinen sorunlar
- Karışık (metin + satır içi etiket) öğelerde düzenlenen öğenin iç HTML'i tarayıcı serileştirmesiyle yazılır.
- `<picture><source>` desteklenmiyor; yalnızca `<img src>` değişir.
- GitHub'dan açılan sayfada harici CSS önizlemede uygulanmayabilir (raw sunucusu `text/plain` döndürür).

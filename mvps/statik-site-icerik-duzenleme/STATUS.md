---
status: in-progress
day: 2
---
## Son oturum (2026-11-25)
- Build: geçti · Birim: 51/51 · E2E: 17/17
- **K1 düzeltildi** (zengin yapıştırma): `paste` ve `drop` olayları yalnızca `text/plain` ekliyor (`insertText`). Ek savunma olarak karışık öğelerin iç HTML'i kayıttan önce ve düzenleme bitince `lib/sanitize.ts` ile temizleniyor: orijinalde aynı özniteliklerle bulunan etiketler + özniteliksiz biçim etiketleri kalır; `img/script/style/iframe/svg…` içerikleriyle silinir; stilli `span`, `font`, `javascript:` bağlantılar, `on*` öznitelikli öğeler açılır. 9 birim testi + 2 e2e (yapıştırma ve `insertHTML`) çıktıda `onerror`/`color:red` olmadığını doğruluyor.
- **Ö2 düzeltildi**: son indirme/commit'ten sonra değişiklik varsa `beforeunload` uyarısı; yükleme / örnek açma / GitHub'dan açma öncesi `confirm`. Yan panelde "Kaydedilmemiş değişiklikler var" / "Tüm değişiklikler kaydedildi" durumu. 3 e2e testi.
- **Y1 düzeltildi**: görsel olmayan dosyada açıklayıcı hata; 1 MB üstü görselde boyut uyarısı (STATUS'taki "büyük görsel uyarısı" işinin ilk adımı).
- **Y2 düzeltildi**: Esc o düzenleme oturumundaki değişikliği geri alıp bitiriyor.

## Sıradaki işler
- Değiştirilen görseli repoya ayrı dosya olarak yükleme seçeneği (Git Data API ile tek commit)
- Görsel `alt` metni ve bağlantı `href` düzenleme (küçük bir yan panel)
- Büyük görselleri yüklemeden önce tarayıcıda küçültme (şu an yalnızca uyarı)
- Y3: paragraf içindeki bağlantı metnini ayrı öğe olarak düzenleme
- Y4: çok satırlı öğelerde Shift+Enter ile `<br>` (şimdilik bilinçli olarak yok)

## Bilinen sorunlar
- Karışık öğelerde düzenlenen öğenin iç HTML'i (temizlendikten sonra) tarayıcı serileştirmesiyle yazılır.
- `<picture><source>` desteklenmiyor; yalnızca `<img src>` değişir.
- GitHub'dan açılan sayfada harici CSS önizlemede uygulanmayabilir (raw sunucusu `text/plain` döndürür).
- Kaydedildi durumu değişikliklerin parmak izine göre tutulur; kaydettikten sonra bir değişiklik yapıp geri almak "kaydedildi"ye döner (doğru), ama aynı dosyayı başka sekmede değiştirmek izlenmez.

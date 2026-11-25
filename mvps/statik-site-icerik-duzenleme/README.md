# Rötuş — statik HTML sitede tıkla, düzenle, commit'le

Fikir: `ideas/in-progress/2026-11-24-statik-site-icerik-duzenleme.md`

Küçük işletmelere düz HTML/CSS site kuran geliştiriciler ve müşterileri için tek sayfalık, tamamen tarayıcıda çalışan düzenleyici. Arayüz Türkçe.

## Ne yapıyor
1. **Aç:** `.html` dosyası yüklenir, "Örnek siteyi aç" ile hazır örnek açılır ya da GitHub'dan (token + repo + dal + yol) çekilir. Hiçbir yapılandırma ya da etiketleme gerekmez: başlıklar, paragraflar, liste öğeleri, bağlantı/düğme metinleri, yalnızca metin içeren `div`/`span`'ler ve `src`'si olan görseller otomatik bulunur (`lib/html.ts`). Önizlemede üzerine gelince kesikli turuncu çerçeve çıkar.
2. **Düzenle:** Metne tıklayınca yerinde düzenlenir (Enter kaydeder, Esc o düzenlemeden vazgeçer). Yalnızca düz metin içeren öğeler `plaintext-only` modda düzenlenir; `<strong>`, `<a>` gibi satır içi etiket barındıran paragraflarda bu etiketler korunur. Yapıştırma ve sürükle-bırak her zaman **düz metin** ekler. Ayrıca karışık öğelerin içeriği kaydedilmeden önce temizlenir (`lib/sanitize.ts`): yalnızca orijinalde aynı özniteliklerle bulunan etiketler ve özniteliksiz `b/strong/i/em/u/s/small/sub/sup/mark/br` kalır; `img`, `script`, `style`, `iframe`, `svg` vb. içerikleriyle silinir, diğer etiketler (stilli `span`, `font`, yeni `href`'li `a`, olay öznitelikleri) açılıp yalnızca metinleri bırakılır. Görsele tıklayınca dosya seçici açılır; seçilen görsel önizlemede hemen değişir. Görsel olmayan dosyada hata, 1 MB üstü görselde boyut uyarısı gösterilir.
3. **Değişiklik listesi:** Her öğe için "eski → yeni" (görsellerde küçük resim + dosya adı) ve "Geri al".
4. **İndir:** Çıktı, orijinal kaynağa yalnızca değişen aralıklar eklenerek üretilir (tüm belge yeniden serileştirilmez). Doctype, boşluklar, yorumlar, `<style>`, `<link>`, öznitelik tırnakları ve düzenlenmeyen her şey bayt bayt aynı kalır. E2E testi bunu tam karşılaştırmayla doğrular.
5. **GitHub'a commit:** Contents API ile (`GET` → mevcut `sha`, sonra `PUT`). Token yalnızca React durumunda (sekme belleği) tutulur; `localStorage`'a yazılmaz, istekler doğrudan `api.github.com`'a gider — bu uygulamanın sunucusu yok. 401/403/404/409/422 ve ağ hataları Türkçe, anlaşılır mesajlara çevrilir.

"Site adresi" alanı yalnızca önizleme içindir: göreli görsel/CSS yollarının yüklenmesi için önizlemeye `<base href>` ekler (indirilen dosyaya eklenmez). GitHub'dan açılan dosyada otomatik olarak `raw.githubusercontent.com` klasörü doldurulur (görseller görünür; raw sunucusu CSS'i `text/plain` verdiği için harici CSS önizlemede uygulanmayabilir).

**Kaydedilmemiş değişiklikler:** Son indirme/commit'ten sonra değişiklik varsa yan panelde belirtilir; sekmeyi kapatma/yenileme tarayıcı uyarısı (`beforeunload`), başka dosya açma (yükleme, örnek, GitHub'dan aç) ise onay sorusu çıkarır.

## Teknik notlar
- Önizleme `srcdoc` + `sandbox="allow-same-origin"` iframe'i: sitenin kendi script'leri çalışmaz, bağlantı/form tıklamaları engellenir; düzenleyici iframe DOM'una üst sayfadan erişir.
- Düzenlenebilir öğeler önizleme kopyasında `data-se-id` ile işaretlenir; kayıt/indirme ise orijinal metin üzerindeki ofsetlerle yapılır.
- Değiştirilen görsel, çıktıya `data:` URI olarak gömülür; görselde `srcset` varsa yeni görselin görünmesi için `srcset` özniteliği kaldırılır.

## Stack ve gerekçe
Next.js 15 (App Router) + TypeScript + Tailwind v4. **Prisma/SQLite kullanılmadı:** kapsam "kullanıcı hesabı yok, kendi barındırma yok, token sunucuya gitmez" diyor; saklanacak sunucu verisi yok. Bu yüzden temiz kurulumda `npx prisma migrate deploy` adımı **yoktur**.

## Çalıştırma
```bash
cp .env.example .env   # değişken gerekmiyor
npm ci
npm run build && npm start   # http://localhost:3000
npm test                     # Vitest birim testleri (lib/)
npm run test:e2e             # Playwright; kendi build + start'ını 3123 portunda yapar
```
E2E ortamdaki Chromium'u kullanır (`PW_CHROMIUM`, varsayılan `/opt/pw-browsers/chromium`). GitHub testleri `page.route` ile `api.github.com`'u taklit eder; gerçek ağa çıkmaz.

## Ortam değişkenleri
Yok. GitHub token'ını kullanıcı arayüzde girer (ince ayarlı token, yalnızca ilgili repo, "Contents: Read and write").

## Eksikler
- Değiştirilen görseller repoya ayrı dosya olarak yüklenmiyor, HTML'e `data:` URI olarak gömülüyor (büyük görsellerde dosya şişer).
- `<picture><source>` içindeki alternatif kaynaklar güncellenmiyor; `alt` metni ve bağlantı adresleri (`href`) düzenlenemiyor.
- Metin ve satır içi etiket karışık öğelerde (ör. `<p>… <a>…</a> …</p>`) düzenlenen öğenin iç HTML'i (temizlendikten sonra) tarayıcı serileştirmesiyle yazılır (yalnızca o öğe; öznitelik tırnakları normalleşebilir). Böyle bir paragraftaki bağlantı metni ayrı öğe olarak değil, paragrafla birlikte düzenlenir.
- Tek satırlık öğelerde satır sonu girilemez (Enter ve Shift+Enter düzenlemeyi bitirir).
- Kapanmamış `<p>`/`<li>` gibi isteğe bağlı bitiş etiketleri desteklenir, ama tarayıcının tüm hata düzeltme kuralları taklit edilmez.
- Tek dosya; çok sayfalı site gezinme yok (kapsam dışı).

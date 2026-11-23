# Move-Out Ledger — depozito iade hesabı ve yasal süre takibi

Fikir: `ideas/in-progress/2026-11-23-depozito-iade-hesaplama.md`

ABD'deki küçük ev sahipleri için tek sayfalık araç. Arayüz İngilizce (hedef kullanıcı ABD).

## Ne yapıyor
1. Kiracı adı, depozito, çıkış tarihi ve eyalet girilince eyaletin yasal iade/itemize liste son tarihini ve kalan günü gösterir; her eyalet satırı resmi kaynağa linklidir (`lib/states.ts`, 11 eyalet: CA, FL, MA, MI, NV, NY, NC, OH, OR, VA, WA — her satır 2026-11-23'te linkteki sayfayla doğrulandı). Florida'da kesinti yoksa 15, varsa 30 gün uygulanır.
2. Kesinti kalemleri (açıklama, kategori, tutar) eklenip silinir; iade anında hesaplanır (sent cinsinden, kayan nokta hatası yok). Kesinti depozitoyu aşarsa iade $0 ve "Owed by tenant" gösterilir. Elle girilen faiz iadeye eklenir.
3. "Create statement" yazdırılabilir itemize mektup açar (tarih, kalemler, toplamlar, son tarih ve yasa atfı); "Print" tarayıcı yazdırma diyaloğunu açar, baskıda yalnızca mektup çıkar.
4. Kaydedilen çıkışlar son tarihe göre sıralı listelenir: geçmiş olanlar **Overdue** (= "süre geçti"), ≤ 3 gün kalanlar **Due soon** (= "yaklaşıyor"), diğerleri **On track**. Veriler `localStorage`'da (`deposit-tracker:v1`) saklanır; düzenleme ve silme var.

Sayfada "Not legal advice" uyarısı bulunur.

## Stack ve gerekçe
Next.js 15 (App Router) + TypeScript + Tailwind v4. **Prisma/SQLite kullanılmadı:** MVP kapsamı "sunucu ve hesap yok, veriler tarayıcıda" diyor; tüm durum `localStorage`'da. Bu yüzden temiz kurulumda `npx prisma migrate deploy` adımı **yoktur**.

## Çalıştırma
```bash
cp .env.example .env   # değişken gerekmiyor
npm ci
npm run build && npm start   # http://localhost:3000
npm test                     # Vitest birim testleri (lib/)
npm run test:e2e             # Playwright; kendi build + start'ını 3123 portunda yapar
```
E2E, ortamdaki Chromium'u kullanır (`PW_CHROMIUM`, varsayılan `/opt/pw-browsers/chromium`) ve tarihi `page.clock` ile 2026-11-23'e sabitler.

## Ortam değişkenleri
Yok. Ücretli API veya gizli anahtar gerekmez.

## Eksikler
- Yalnızca 11 eyalet; şehir düzeyi kurallar (ör. bazı şehirlerde faiz zorunluluğu) yok.
- Eyalete özgü otomatik faiz hesabı yok (faiz elle girilir).
- Kaydedilmemiş form değişiklikleri sayfa yenilenince kaybolur.
- Texas tablodan çıkarıldı: resmi tüzük sayfası bu oturumda metin döndürmedi, doğrulanamadı.

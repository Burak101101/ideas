---
status: in-progress
day: 1
---
## Son oturum (2026-11-23)
- Build: geçti · Birim: 18/18 · E2E: 7/7
- Proje kuruldu (Next.js 15 + TS + Tailwind v4, localStorage; Prisma bilinçli olarak yok — README'de gerekçe).
- Çekirdek özellik 1: 11 eyalet için kaynaklı son tarih tablosu + kalan gün (FL için kesintisiz 15 / kesintili 30 gün).
- Çekirdek özellik 2: kesinti ekle/sil, faiz, iade ve kiracıdan alacak hesabı (sent hassasiyeti).
- Çekirdek özellik 3: yazdırılabilir itemize mektup (Print düğmesi, baskı CSS'i).
- Çekirdek özellik 4: son tarihe göre sıralı liste, Overdue / Due soon / On track etiketleri, localStorage kalıcılığı, düzenle/sil.
- Tüm kabul kriterleri için e2e testi var (`e2e/deadline|totals|letter|list.spec.ts`).

## Sıradaki işler
- Tester review'ındaki maddeler.
- Kaydedilmemiş değişiklik uyarısı (form kirliyken başka kayda geçince/çıkarken).
- Mobil düzen kontrolü ve mektup baskı önizlemesinin ekran görüntüsüyle doğrulanması.
- Daha fazla eyalet (yalnızca resmi kaynak doğrulanabilenler; Texas sayfası bu oturumda açılmadı).

## Bilinen sorunlar
- Arayüz etiketleri İngilizce: "Overdue" = süre geçti, "Due soon" = yaklaşıyor.
- Formdaki kaydedilmemiş değişiklikler yenilemede kaybolur.

## Yeniden açılış (2026-11-24)
`ready` kuralı sıkılaştırıldığı için yeniden açıldı ve kuyruğa (priority 1) geri kondu. Sıra gelince proje yeniden kurulmaz; `reviews/2026-11-23.md`'deki **Ö1** (negatif tutarlar) ve **Ö2** (kaydedilmemiş değişiklik kaybı) önce düzeltilir.

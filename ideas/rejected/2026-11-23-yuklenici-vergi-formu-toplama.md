---
slug: yuklenici-vergi-formu-toplama
found: 2026-11-23
category: fintech
source: auto
score: 2.33
---
# Serbest çalışan/usta ödemelerinde W-9 toplama ve yıl sonu 1099 hazırlığı

## Sorun
Küçük işletmeler ve ev sahipleri usta/serbest çalışanlara yıl boyu ödeme yapıp vergi formunu (W-9) almadan geçiyor; Ocak'taki 1099 son tarihinde (31 Ocak) aylar önce ödeme yaptıkları kişileri kovalıyor. Muhasebeciler de her yıl aynı eksik bilgiyle uğraşıyor.

## Kanıtlar
- https://www.biggerpockets.com/posts/7318887 — (27 Ekim 2026) "A lot of landlords only realize this in January and end up chasing down someone they paid months ago." / "A system that asks for the W-9 before the first payment and tracks totals per vendor through the year would solve a real problem."
- https://report.woodard.com/articles/when-clients-dont-send-w-9s-a-1099-standoff-opawr — (15 Ocak 2026, muhasebeci yazar) "Same blanks, same missing W-9s, same contractors with first names only." / "Every accountant I know has at least one client doing the 1099 version of hide-and-seek."
- https://www.wingspan.app/articles/stop-chasing-w-9s-why-smart-companies-automate-contractor-validation-before-tax-season-2 — ücretli bir rakip bu sorunu doğrudan pazarlıyor (arama özeti: "Manually chasing contractors for W-9s is time-consuming and frustrating."; sayfa açılmadı, doğrulanmadı)

## Hedef kullanıcı
Yılda 5–50 serbest çalışan/ustaya ödeme yapan ABD'li küçük işletmeler, bireysel ev sahipleri ve onların muhasebecileri.

## Mevcut çözümler ve eksikleri
- Yüklenici ödeme/uyum platformları — fiyat: veri yok — ödemeyi de kendi üzerinden yaptırmak istiyor; ara sıra usta çalıştıran biri için ağır.
- Muhasebe/ödeme yazılımlarındaki 1099 modülleri — fiyat: veri yok — W-9'u ödeme öncesinde zorunlu kılmıyor, kişi başı yıllık toplam eşik uyarısı sınırlı.
- E-posta ile PDF form isteme + tablo — ücretsiz — takip, hatırlatma ve eksik alan kontrolü yok.

## Değerlendirme (2026-11-23)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR fintech: 28/504, oran %5.6 (zayıfa yakın; pipeline/logs/2026-11-23-trustmrr.md). Dosyada güncel bir BiggerPockets başlığı ve muhasebeci yazısı. |
| büyüme | 2 | Büyüme verisi yok; ihtiyaç Ocak'ta yoğunlaşan mevsimsel bir ihtiyaç. |
| rekabet | 1 | Ücretsiz seçenekler bol: TaxBandits sınırsız ücretsiz W-9 toplama (https://www.taxbandits.com/w9-forms/), Holdings ücretsiz ödeme/eşik takibi (https://getholdings.com/tools/contractor-payments), Zoho Books W-9/1099 modülü (https://zoho.com/us/books/accounting-software-features/1099-tracking-w9-forms/), $10–$17 Etsy tabloları. |
| farklılaşma | 2 | "İlk ödemeden önce W-9 iste + kişi başı yıllık toplam" önerisi ücretsiz araçlarda zaten mevcut (yukarıdaki kaynaklar). |
| dağıtım | 3 | BiggerPockets ve muhasebeci kanalları mevcut; ücretsiz rakipler SEO'yu tutuyor. |
| yapılabilirlik | 3 | Çekirdek kolay ama vergi kimlik numarası (TIN) gibi hassas veriyi güvenle saklama yükü tek kişilik MVP için ağır. |

**Ortalama:** 2.33 — **Karar:** kaldı

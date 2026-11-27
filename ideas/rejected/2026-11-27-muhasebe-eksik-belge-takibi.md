---
slug: muhasebe-eksik-belge-takibi
found: 2026-11-27
category: fintech
source: auto
score: 2.83
---
# Serbest muhasebeciler için müşteriden eksik fiş ve açıklama toplama

## Sorun
Küçük işletmelere ay sonu kapanışı yapan serbest muhasebeci/defter tutucular, kategorize edilemeyen banka hareketleri ve eksik fişler için müşterilere satır satır e-posta atıp yanıt kovalıyor. Bu kovalamaca ayın en büyük zaman kaybı olarak anılıyor ve kapanışı geciktiriyor.

## Kanıtlar
- https://news.ycombinator.com/item?id=46242024 (HN, 2025-12) — "At the SMB scale accountants are mostly paid to coach/pester/goade the employees to hand in the necessary paperwork in time. The accountants job is relatively quick from there on."
- https://financial-cents.com/resources/articles/the-month-end-close-problem-every-bookkeeping-firm-has/ (yazılım satıcısı makalesi, 2026-07-15, güncelleme 2026-11-02) — elle yapıldığında "the biggest time sink of the month and the hardest to get ahead of"; müşterilere tek tek satır e-postalamayı anlatıyor.
- https://www.getcanopy.com/blog/stop-the-month-end-scramble-how-to-keep-your-books-clean-and-client-ready/ (başka bir satıcı blogu) — "too many clients don't see the value in providing additional information about their transactions" (arama özetinden, doğrulanmadı).
- https://enterprisedna.co/resources/guides/accounting-stop-chasing-clients-missing-information — ay sonunun uzun bir eksik belge listesiyle başladığını anlatıyor (arama özetinden, doğrulanmadı).
Not: HN dışındaki kaynaklar satıcı içerikleri; bağımsız forum kanıtı zayıf.

## Hedef kullanıcı
10–60 küçük işletme müşterisine aylık defter tutan tek kişilik veya 2–5 kişilik muhasebe/defter tutma büroları.

## Mevcut çözümler ve eksikleri
- Muhasebe bürosu iş akışı yazılımları — https://financial-cents.com/pricing/ : tek kişilik $19/ay, ekip $49–89/kullanıcı/ay; kategorize edilmemiş hareket modülü ayrıca ~$5/müşteri/ay — tam büro yönetim paketi; yalnızca bu işe ihtiyacı olan için pahalı ve ağır.
- Fiş toplama/OCR araçları — fişi alıyor ama "bu 340$'lık harcama ne?" sorusunu müşteriye sorup yanıtı hareketle eşleştirmiyor (doğrulanmadı).
- Muhasebe programlarının kendi "müşteriye sor" özellikleri — tek programa bağlı; e-posta + tablo hâlâ yaygın.

## Kullanıcı notu

## Değerlendirme (2026-11-27)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR `fintech`: 516 toplam, 30 ≥$2K gelir, oran %5.8 (orta/zayıf, `pipeline/logs/2026-11-27-trustmrr.md`). Kanıtların çoğu satıcı blogları; bağımsız kanıt tek HN yorumu. Buna karşın bu iş için ayrı ücret ödeniyor: Financial Cents ReCats ~$4–5/müşteri/ay (https://financial-cents.com/financial-cents-recats), Uncat $9/müşteri/ay (https://www.g2.com/products/uncat/reviews). |
| büyüme | 3 | Yeni rakip modüller (ReCats, TaxDome bookkeeping hub: https://taxdome.com/bookkeeping-hub) çıkıyor, bu ilgi gösteriyor ama pazar büyüme verisi yok. |
| rekabet | 2 | Uncat (adanmış ürün), Financial Cents ReCats, TaxDome (müşteri başı ücretsiz, plana dahil), muhasebe programlarının yerel "müşteriye sor" özellikleri. Doymuş ve güçlü oyuncular. |
| farklılaşma | 2 | Planlanan tek fark "daha ucuz / programdan bağımsız"; TaxDome zaten müşteri başı ücret almıyor, rakiplerde QBO senkronu var. Somut üstünlük yok. |
| dağıtım | 3 | Defter tutucu toplulukları (Reddit r/Bookkeeping, ProAdvisor grupları) var ama rakipler bu kanallarda aktif ve büyük pazarlama bütçeli. |
| yapılabilirlik | 4 | CSV banka hareketi yükleme + müşteriye soru linki + yanıt/fiş toplama ~10 günde yapılabilir; muhasebe programı entegrasyonu olmadan değer sınırlı kalır. |

**Ortalama:** 2.83 — **Karar:** kaldı

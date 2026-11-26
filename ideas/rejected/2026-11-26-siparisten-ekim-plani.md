---
slug: siparisten-ekim-plani
found: 2026-11-26
category: productivity
source: auto
score: 3.17
---
# Mikro yeşillik üreticileri için siparişten geriye ekim planı

## Sorun
Restoranlara düzenli (haftalık sabit) sipariş veren küçük mikro yeşillik üreticileri, her ürünün farklı büyüme süresine göre hangi gün kaç tepsi ekmeleri gerektiğini tablolarla elle hesaplıyor. Sipariş değişiklikleri kaçırılınca ya da hesap yanlış yapılınca eksik/fazla tepsi ekiliyor; söz verilmiş hasat başka yere satılabiliyor ve ürün ya da gelir kaybı oluşuyor.

## Kanıtlar
- https://softwarerecs.stackexchange.com/questions/95595/offline-windows-ledger-for-a-one-person-microgreens-farm-trays-standing-order (2026-09-18) — "I sow 10×20 trays on an ~11-day cycle, harvest by ounce, and sell standing orders to kitchens plus a Saturday market. A spreadsheet lets me overwrite a harvest cell. The total still looks fine. That tray is already promised."
- https://www.hortidaily.com/article/9737096/if-you-burn-out-the-whole-system-collapses/ (2025-06-03, restoran ve marketlere satan bir mikro yeşillik çiftliği kurucusu) — "Sometimes we think we need to plant 10 trays, but we miscalculated and actually need to plant 15." / "Without a reliable system, order changes can be missed."
- https://paperpot.co/crop_planning_microgreens/ (2019, üretici röportajı; eski) — "Planning the logistics of seeding timing can become complex quickly"

## Hedef kullanıcı
1–3 kişilik, restoranlara/manavlara düzenli sipariş ve hafta sonu pazar satışı yapan mikro yeşillik (ve benzeri kısa döngülü) üreticiler.

## Mevcut çözümler ve eksikleri
- Genel çiftlik yönetim yazılımı — https://www.tend.com/pricing — Ücretsiz, Pro $30/ay, Ultimate $75/ay; fiyat sayfasında düzenli sipariş ya da tepsi bazlı ekim planlaması açıkça geçmiyor ("Orders & pack manager", "Advanced crop & production planning" var). Saha/tarla odaklı.
- Telefon için mikro yeşillik takip uygulaması — https://apps.apple.com/rs/app/microgreens-tracker/id6504773772 — fiyat ve kapsam doğrulanmadı.
- Elle hazırlanan tablolar (ürünler sütun, müşteriler satır) — siparişle eklenen tepsi arasında bağ yok; bir hücrenin üzerine yazılınca hata görünmüyor (yukarıdaki SE alıntısı).

## Kullanıcı notu

## Değerlendirme (2026-11-26)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR `productivity`: 3797 toplam, 256 ≥$2K gelir, oran %6.7 (orta sinyal; `pipeline/logs/2026-11-26-trustmrr.md`). Kanıtlar somut ama az: biri 2019 tarihli ve eski (https://paperpot.co/crop_planning_microgreens/), diğer ikisi tek kişi/tek çiftlik (https://softwarerecs.stackexchange.com/questions/95595/offline-windows-ledger-for-a-one-person-microgreens-farm-trays-standing-order, https://www.hortidaily.com/article/9737096/if-you-burn-out-the-whole-system-collapses/). |
| büyüme | 4 | Mikro yeşillik pazarı tahminleri 2025'te $1.9–3.4 milyar, çoğu %10–12 YBBO (https://www.imarcgroup.com/microgreens-market, https://www.researchandmarkets.com/reports/5744348/microgreens-market-report); raporlar arasında tutarsızlık var, düşük güvenli. |
| rekabet | 2 | Mikro yeşilliğe özel ve tam olarak "siparişe göre ekim" yapan araçlar zaten var: SeedLeaf düzenli sipariş + sow-to-order iş akışı (https://seedleaf.freshdesk.com/support/solutions/articles/72000125703-using-your-task-lists-efficiently), Tend'in mikro yeşillik çözümü (https://www.tend.com/solutions/microgreens-management), hasat tarihinden geriye ekim tarihi hesaplayan iOS uygulaması (https://apps.apple.com/us/app/-/id1390978969), Notion tabanlı yönetici (https://www.notion.com/@microgreenmanager). |
| farklılaşma | 2 | Önerilebilecek fark (siparişe bağlı tepsi, üzerine yazmayı engelleyen kayıt) mevcut sow-to-order araçlarının çekirdeğiyle örtüşüyor; somut bir eksik bulunamadı. |
| dağıtım | 3 | Üretici toplulukları ve "microgreens planting schedule" SEO sorguları var; ancak kitle küçük ve rakipler aynı kanallarda. |
| yapılabilirlik | 5 | Ürün büyüme süreleri + düzenli sipariş tablosundan geriye tarih hesabı; harici API yok, ~10 günde yapılabilir. |

**Ortalama:** 3.17 — **Karar:** kaldı

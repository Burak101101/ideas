---
slug: acik-ruhsat-denetim-takibi
found: 2026-11-28
category: productivity
source: auto
score: 3.17
---
# Küçük yükleniciler için açık yapı ruhsatı ve denetim takibi

## Sorun
ABD'de birden çok belediye/ilçede iş yapan küçük tesisatçı, elektrikçi ve tadilat yüklenicileri her işin ruhsatını, bekleyen ara/son denetimleri ve ruhsat bitiş tarihlerini tablolarda ya da notlarda tutuyor. İş bitip fatura ödenince son denetim çoğu zaman planlanmıyor; ruhsat kayıtta açık kalıyor, süresi doluyor ve yeniden başvuru ücreti, mülk satışında tapu sorunları ya da ihlal kaydı olarak geri dönüyor.

## Kanıtlar
- https://community.servicetitan.com/t5/Jobs/Managing-Permits-Inspections/td-p/1909 (bir saha hizmeti yazılımının kullanıcı topluluğu; sayfa doğrudan açılamadı, ana sayfaya yönlendiriyor; alıntı arama özetinden, **doğrulanmadı**) — "We use Trello to track permits and inspections. We have tried workaround with using tags in ST, but it isn't what we are looking for. Like Mike above, we are tracking permits separately on a spreadsheet." (birden fazla yüklenici aynı sorunu yazıyor)
- https://www.contractortalk.com/threads/permits-issued-final-inspections-never-scheduled-help-please.137131/ (yüklenici forumu, eski başlık; sayfa bot geçidine yönlendiriyor, alıntı arama özetinden, **doğrulanmadı**) — başlık: "Permits issued / final inspections never scheduled? Help please!"; aynı forumda: "a lot of people blow off final inspections but the town never closes the book on them. Should the client look to sell and get under contract the open permit will surface."
- https://www.brownstoner.com/forum/permits/contractor-let-permits-expire-without-notifying-us/ (ev sahibi forumu, ~2012) — "he sent me the permits telling me they were approved in March but that they had already expired." / "He told me it would cost $100 to reapply for the permits."
- https://payhip.com/NEXTPERMIT/blog/news/how-to-manage-ev-charger-installation-permits-across-multiple-locations (bir ruhsat danışmanı, 2026-04-19; kendi Excel şablonunu satıyor) — "Each jurisdiction has its own portal, its own forms, its own processing time."
- https://www.ipermitusa.com/ipermit-blog/how-to-track-permit-compliance-across-service-jobs (ruhsat hizmeti satıcısı blogu, 2026-08-24) — "The invoice is paid, the job feels complete, and the permit is still open. That is a tracking failure, not a technical one." / "open permits produce no alerts on their own."
- https://www.fcgov.com/building/project-closeout (Fort Collins belediyesi) — tamamlanmamış ruhsatların süresinin dolduğu ve mülkte açık ihlal hâline geldiği belirtiliyor (arama özetinden).

## Hedef kullanıcı
Aynı anda 5–50 ruhsatlı işi olan, 2+ belediyede çalışan ABD'li küçük tesisat/elektrik/HVAC/tadilat yüklenicileri ve ofis yöneticileri.

## Mevcut çözümler ve eksikleri
- Ruhsat takip SaaS'ları — ör. https://permittracker.app/ : Starter $49/ay (15 aktif ruhsat), Professional $99/ay, Business $199/ay (sayfadan) — kayıtlar elle/CSV/belge taraması ile giriliyor; belediye portallarından durum çekip çekmediği sayfada doğrulanamadı.
- Büyük saha hizmeti yazılımları — ruhsat/denetim için özel alan yok, kullanıcılar etiket veya ayrı tablo ile çözüyor (yukarıdaki topluluk başlığı).
- İnşaat proje yönetimi araçları — denetimleri takvim kilometre taşı olarak eklemeyi öneriyor (https://projul.com/blog/best-construction-permit-tracking-software/); "fatura ödendi ama son denetim yok" durumunu ayrıca yakalamıyor.
- Excel/Trello — yaygın; bitiş tarihi uyarısı ve "son denetim planlanmamış" listesi elle tutuluyor.

## Kullanıcı notu

## Değerlendirme (2026-11-28)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR `productivity`: 3835 toplam, 255 ≥$2K gelir, oran %6.6 (orta; `pipeline/logs/2026-11-28-trustmrr.md`). Kanıtların çoğu doğrulanmamış arama özetleri ya da eski forum başlıkları (contractortalk, brownstoner ~2012); en güncel kaynaklar ruhsat hizmeti satan şirket blogları (ipermitusa, payhip) — tarafsız değil. |
| büyüme | 3 | ABD ruhsat hacmi yatay: Eylül 2026 ön verisi ~1.40M yıllık (https://www.census.gov/construction/nrc/pdf/newresconst_202609.pdf); Q1 2026 tek aile ruhsatları %7.6 düştü (https://www.nahb.org/blog/2026/05/permits-Q1-2026). Satıcı kaynaklı "ruhsat takip aracı kullanımı artıyor" iddiası doğrulanamadı (https://ustechautomations.com/resources/blog/contractor-permit-tracking-automation-platform-comparison). |
| rekabet | 2 | Kalabalık: özel ruhsat takip SaaS'ı (https://permittracker.app/, $49/ay'dan), saha hizmeti/inşaat yönetimi araçlarında ruhsat modülleri (https://projul.com/blog/best-construction-permit-tracking-software/, https://vimeo.com/760064034), çok sayıda karşılaştırma listesi (https://www.capterra.com/permit-software/?page=2, https://wifitalents.com/best/building-permit-tracking-software/); belediye başvuru portalları yükleniciye ücretsiz (https://www.salesforce.com/government/state-local-government-software/permitting-software/best-permitting-software/). |
| farklılaşma | 3 | "Fatura ödendi ama son denetim planlanmadı" listesi ve bitiş tarihi uyarısı somut bir açı (https://www.ipermitusa.com/ipermit-blog/how-to-track-permit-compliance-across-service-jobs), ancak mevcut ruhsat takipçileri de bitiş tarihi uyarısı veriyor; belediye portallarından otomatik durum çekmeden fark sınırlı kalır. |
| dağıtım | 3 | Yükleniciler forumlarda ve saha yazılımı topluluklarında (contractortalk, kullanıcı toplulukları) erişilebilir ama dağınık; "permit tracking" SEO alanı rakip içerikleriyle dolu (yukarıdaki listeler). |
| yapılabilirlik | 5 | Ruhsat/denetim kayıtları + tarih hesapları + filtre listeleri; tarayıcıda CRUD, harici ücretli API yok; ~10 günde yapılabilir. |

**Ortalama:** 3.17 — **Karar:** kaldı

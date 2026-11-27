---
slug: sogutucu-kacak-kaydi
found: 2026-11-27
category: green-tech
source: auto
score: 3.00
---
# 15 lb+ soğutucu akışkanlı cihazlar için kaçak oranı ve onarım kaydı

## Sorun
ABD'de 1 Ocak 2026'dan itibaren HFC içeren ve 15 lb (eski kural: 50 lb) veya üzeri soğutucu akışkan dolumlu cihazların sahipleri ve servis teknisyenleri, her dolumda kaçak oranı hesaplamak, eşik aşılırsa 30 gün içinde onarım/doğrulama testi yapmak ve tüm kayıtları 3 yıl saklamak zorunda. Daha önce kapsam dışı olan çatı tipi klima ve küçük ticari soğutma cihazlarını işleten restoran, market ve küçük HVAC servis firmaları bunu kâğıt servis fişleri ve tablolarla takip ediyor; geçiş süresi yok.

## Kanıtlar
- https://www.epa.gov/system/files/documents/2026-01/er-r-fact-sheet-leak-repair-2026-01-13_1.pdf (EPA, Ocak 2026) — "Beginning January 1, 2026, owners or operators and certified technicians must comply with leak repair requirements for certain refrigerant-containing appliances with a charge size of 15 pounds or more"; "Owners or operators are required to conduct a leak rate calculation each time a refrigerant [is added]".
- https://www.achrnews.com/blogs/17-opinions/post/165785-new-year-new-refrigerant-rules-no-grace-period (sektör yayını, 2026-02-04) — başlık: "no grace period"; EPA yetkilisi: "there are associated recordkeeping requirements that you should be mindful of."
- https://www.bsigroup.com/en-US/insights-and-media/insights/blogs/federal-regulators-just-expanded-refrigerant-oversight-by-70 (danışmanlık blogu, 2026) — "We're talking about a threshold reduction of 70%." / "For multi-site operators, this could mean adding hundreds of units to compliance-tracking programs."
- https://www.achrnews.com/articles/135445-epa-608-recordkeeping-impacts-technicians (2017, önceki 608 kayıt kuralı) — teknisyenler kayıt zorunluluğunu "an extra step that takes too much time" olarak görüyor (eski ama aynı iş yükü türü).
- https://health.hawaii.gov/cab/?p=5315 — eyalet sağlık dairesi küçük işletmeler için ayrı bir uyum rehberi ve cihaz kaydı şablonları yayımlamış (küçük işletmelerin desteğe ihtiyaç duyduğunun işareti).

## Hedef kullanıcı
Birkaç ticari soğutma/klima cihazı işleten restoran, market, küçük otel sahipleri ve bu müşterilere bakan 1–10 teknisyenli HVAC/soğutma servis firmaları.

## Mevcut çözümler ve eksikleri
- Büyük saha hizmeti yazılımlarının soğutucu akışkan takip modülü — https://help.servicetitan.com/construction/docs/set-up-and-use-refrigerant-tracking-for-epa-recordkeeping — tam saha yönetim paketinin parçası; küçük firma ve cihaz sahibi için pahalı/ağır (fiyat sayfası herkese açık değil, veri yok).
- Kurumsal EHS/uyum platformları (ör. https://benchmarkgensuite.com) — çok lokasyonlu büyük şirketlere yönelik.
- Bakım yönetimi (CMMS) yazılımlarının şablonları — https://oxmaint.com/industries/hvac/hvac-refrigerant-log-sheet-compliance-tracking-template — genel bakım aracı; kaçak oranı eşiği/30 gün onarım saati gibi kurala özgü uyarılar sınırlı (doğrulanmadı).
- Bir indie kaçak kaydı ürünü listelenmiş (https://www.indiehackers.com/product/ref-leaklog) — sayfa 403, içerik/fiyat doğrulanmadı.
- Ücretsiz PDF/Excel şablonları (EPA, Hawaii) — hesaplama ve son tarih takibi elle.

## Kullanıcı notu

## Değerlendirme (2026-11-27)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | Zorunlu kural, güçlü itici: EPA 2026 bilgi notu (https://www.epa.gov/system/files/documents/2026-01/er-r-fact-sheet-leak-repair-2026-01-13_1.pdf). TrustMRR `green-tech`: yalnızca 32 toplam, 4 ≥$2K gelir, 0 ≥$2K MRR (oran %12.5 ama sayı çok düşük → zayıf sinyal, `pipeline/logs/2026-11-27-trustmrr.md`). Kullanıcı şikâyeti kanıtı az (2017 tarihli bir yazı). |
| büyüme | 4 | Eşik 50 lb'den 15 lb'ye indi, kapsam %70 genişledi (https://www.bsigroup.com/en-US/insights-and-media/insights/blogs/federal-regulators-just-expanded-refrigerant-oversight-by-70, https://www.achrnews.com/articles/166298-leak-rules-tighten-as-threshold-drops-to-15-pounds). |
| rekabet | 2 | Aynı soruna odaklı bağımsız bir ürün Product Hunt'ta yayında: ücretsiz kaçak oranı ve onarım son tarihi hesaplayıcısı, $29–89/ay planlar (https://www.producthunt.com/products/ref-leaklog, vendor iddiası). Ayrıca saha yönetim yazılımı modülleri, CMMS araçları (https://oxmaint.com/industries/hvac/epa-608-refrigerant-tracking-compliance-software, https://ifactoryapp.com/industries/hvac/refrigerant-leak-rate-calculation-for-hvac-epa-rules), form şablonları (https://www.mangoapps.com/templates/forms/epa-section-608-leak-rate-calculation-sheet) ve ücretsiz eyalet hesap tablosu (https://health.hawaii.gov/cab/files/2026/03/AIM-Act-Compliance-Guide-for-Small-Businesses.pdf). |
| farklılaşma | 2 | Planlanan özellikler (kaçak oranı hesabı, 30 gün takibi, kayıt saklama) adanmış rakipte zaten var; somut bir fark tanımlanmadı. |
| dağıtım | 3 | Teknisyenlere sektör yayınları ve HVAC eğitim siteleri üzerinden ulaşılabilir (https://www.hvacrschool.com/the-epas-15-pound-refrigerant-threshold-in-2026/); restoran/market sahiplerine ulaşmak zor. |
| yapılabilirlik | 4 | Cihaz kaydı + dolum girişi + iki EPA yöntemiyle hesap + son tarih uyarısı + dışa aktarım; ücretli API yok, ~10 günde yapılabilir. |

**Ortalama:** 3.00 — **Karar:** kaldı

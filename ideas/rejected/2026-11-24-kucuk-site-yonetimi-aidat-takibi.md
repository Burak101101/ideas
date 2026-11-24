---
slug: kucuk-site-yonetimi-aidat-takibi
found: 2026-11-24
category: real-estate
source: auto
score: 2.83
---
# Gönüllü yönetilen küçük site/HOA'larda aidat ve yedek fon takibi

## Sorun
10–30 haneli, profesyonel yönetim şirketi tutmayan konut birliklerinde (HOA, küçük site) saymanlığı gönüllü bir sakin üstleniyor. Genel muhasebe programları "kim aidatını ödemedi" sorusuna kolay cevap vermediği için ayrı tablolar tutuluyor; yedek fon ile işletme parası karışıyor, iş birkaç kişinin üstünde kalıp yük oluyor.

## Kanıtlar
- https://quickbooks.intuit.com/learn-support/en-us/other-questions/setting-up-a-new-company-file-for-a-small-hoa/00/842506 (2021-04-14) — 14 parsellik birliğin saymanı: "our community is made up of 14 lots"; aidatı nasıl kaydedeceğini, yedek fonu hangi hesapta tutacağını bilemiyor ve programın açtığı varsayılan hesapların çoğunun gereksiz olduğunu söylüyor.
- https://news.ycombinator.com/item?id=50274081 (2026-10-28) — 7 birimlik site: "Me and my wife ended up having to manage everything, she was accountant [...] It got to be a lot." ve "the utter lack of savings by the association and it was scary."
- https://community.quicken.com/discussion/comment/20342198 — 11 haneli bir birliğin saymanı, programın nakit akışı raporu verdiğini ama kimin aidatta geride olduğunu kolayca göstermediğini, bu yüzden ayrı tablo tuttuğunu yazıyor (sayfa giriş istedi; arama özetinden, doğrulanmadı).

## Hedef kullanıcı
ABD'de ve benzeri ülkelerde 5–50 haneli, kendi kendini yöneten konut birliklerinin gönüllü sayman ve yönetim kurulu üyeleri; küçük apartman yöneticileri.

## Mevcut çözümler ve eksikleri
- Kendi kendini yöneten birliklere özel aidat yazılımı — https://www.payhoa.com/pricing — 1–25 birim için $49/ay (yıllık) / $54/ay; 7–14 haneli bir birlik için hane başı yıllık ~$40–$85 eder, küçük bütçede ağır.
- Genel küçük işletme muhasebe programları — fiyat: veri yok — HOA için hesap planı yok, aidat borcu takibi ayrı tablo gerektiriyor (yukarıdaki kanıtlar).
- Hazır tablo şablonları — arama özetine göre ~$5 (Etsy ilanı, doğrulanmadı) — hatırlatma, makbuz, devir teslim yok; sayman değişince bilgi kayboluyor.

## Değerlendirme (2026-11-24)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR real-estate: 19/200, oran %9.5 (orta; pipeline/logs/2026-11-24-trustmrr.md). Kanıtlar gerçek ama biri 2021 tarihli, biri doğrulanmadı. |
| büyüme | 2 | Kendi kendini yöneten küçük birlik segmentinde büyüme verisi yok. |
| rekabet | 2 | Kendi kendini yöneten birliklere özel çok sayıda araç: KindHOA $0 planı (https://www.getapp.com/all-software/a/kindhoa/), HOA Ally ücretsiz (https://slashdot.org/software/p/HOA-Ally/), Bitrix24 ücretsiz HOA sayfası (https://www.bitrix24.com/uses/free-hoa-management-software-online.php?moved_from=IN), PayHOA, HOA Buddy (https://www.capterra.com/p/10044832/HOA-Buddy/), Landlord Studio (https://www.landlordstudio.com/property-type/hoa). |
| farklılaşma | 2 | "Kim borçlu + yedek fon ayrımı + devir teslim" önerisi ücretsiz planlı araçlarda büyük ölçüde mevcut (yukarıdaki kaynaklar). |
| dağıtım | 3 | SEO ve HOA toplulukları üzerinden ulaşılabilir, ancak hedef dağınık ve ücretsiz rakipler arama sonuçlarını tutuyor. |
| yapılabilirlik | 5 | Hane listesi, aidat kaydı, borç raporu ve fon ayrımı basit CRUD; harici API gerekmez. |

**Ortalama:** 2.83 — **Karar:** kaldı

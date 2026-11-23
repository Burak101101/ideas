---
slug: blog-backlink-uyarisi
found: 2026-11-22
category: analytics
source: auto
score: 2.83
---
# Blog yazısına yeni link/trafik sıçraması geldiğinde haber alma

## Sorun
Bağımsız blog yazarları, bir yazıları başka bir siteden linklenip trafik aldığında bunu ve trafiğin nereden geldiğini zamanında öğrenemiyor; arama motorlarının link sorgulama özelliği kaldırıldı, büyük SEO paketleri ise bu ihtiyaç için ağır ve pahalı.

## Kanıtlar
- https://news.ycombinator.com/item?id=50387354 — "what do you have in place that would alert you and tell you where the traffic is coming from?"
- https://news.ycombinator.com/item?id=50389930 — "they used to have a link: operator that would give you that information. Apparently they got rid of that functionality back in 2017."
- https://news.ycombinator.com/item?id=50518249 — "Curious about the backlinks monitor… does anyone have a rec that htey like?"

## Hedef kullanıcı
Kişisel/teknik blog yazarları, bülten yazarları ve küçük içerik siteleri.

## Mevcut çözümler ve eksikleri
- Backlink izleme araçları — https://webflow.com/blog/backlink-monitoring-tools — arama özetine göre yaklaşık $15–$100/ay, SEO paketleri $65–$140/ay'dan başlıyor (sayfa açılamadı, doğrulanmadı); SEO ajanslarına göre tasarlanmış, "yazım linklendi + şu kadar ziyaretçi geldi" türünden basit bir uyarı sunmuyor.
- Sunucu log analizi (barındırma paneli istatistikleri) — ücretsiz — elle bakmak gerekiyor, uyarı yok (kaynak 50387456).

## Değerlendirme (2026-11-23)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR analytics: 122/1352 ≥$2K gelir, oran %9.0 (orta; pipeline/logs/2026-11-23-trustmrr.md). Dosyada 3 HN yorumu, biri doğrudan araç önerisi arıyor (50518249). |
| büyüme | 2 | Bu niş (blogcu için link/trafik uyarısı) için büyüme verisi yok. |
| rekabet | 2 | Ahrefs backlink alert (https://ahrefs.com/academy/how-to-use-ahrefs/alerts/backlinks), Link Research Tools Link Alerts (https://www.linkresearchtools.com/seo-tools/backlink-checker/link-alerts/), Linkody, Backlink Vigil ve Search Console tabanlı trafik sıçrama uyarısı yapan yeni bir ürün (https://www.producthunt.com/p/traffic-monitor) mevcut. |
| farklılaşma | 3 | "Link + gelen ziyaretçi" tek uyarısı kısmen boş; ancak trafik sıçrama uyarısı ücretsiz katmanla zaten sunuluyor (producthunt kaynağı). |
| dağıtım | 4 | Hedef kitle HN, bülten ve blog toplulukları; kaynak başlıkların kendisi HN'de. |
| yapılabilirlik | 3 | Referrer/log tabanlı uyarı 10 günde yapılabilir; yeni linkleri web genelinde keşfetmek ise tarama altyapısı ya da ücretli link verisi API'si gerektirir. |

**Ortalama:** 2.83 — **Karar:** kaldı

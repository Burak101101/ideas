---
slug: tedarikci-sigorta-belgesi-takibi
found: 2026-11-23
category: real-estate
source: auto
score: 3.00
---
# Tedarikçi/taşeron sigorta belgelerinin süresini takip etme

## Sorun
Küçük ev sahipleri, mülk yöneticileri ve küçük müteahhitler çalıştırdıkları usta/taşeronların sigorta belgelerini (COI) e-posta ve tablolarda tutuyor. Belgenin süresi dolduğu fark edilmeden iş verilip ödeme yapılıyor; bu ancak bir hasar talebi çıktığında ortaya çıkıyor ve sorumluluk riski doğuruyor.

## Kanıtlar
- https://www.biggerpockets.com/posts/7328789 — "Then there's a claim and you find out the plumber's coverage lapsed two months ago." (soru sahibi bu alanda araç geliştirdiğini belirtiyor) / bağımsız yanıt: "a spreadsheet nobody updates is the same as no system."
- https://www.biggerpockets.com/posts/7328789 — moderatör yanıtı: küçük işletmeler için "put it on a spreadsheet and have Claude create a script for your spreadsheet to send you an email or them an email 30 days before it expires" (yani hazır, ucuz bir yol yok; kendi betiğini yazmak öneriliyor)
- https://dev.to/robertatkinson3570/existing-coi-software-costs-6k-15kyear-here-3oem — 200 birimlik bir yönetim firmasından: "the manual process was killing us"; aldığı teklifler "$12,000 a year", "$8,400" (yazar kendi ürününü tanıtıyor, taraflı kaynak)
- https://www.jlconline.com/remodeling/keep-record-of-subcontractors-insurance/ — (2007) "Every time we use a sub we must make sure that their insurance is up to date" / "The alternative — not keeping track — could mean legal trouble."

## Hedef kullanıcı
5–250 birimlik ev sahipleri ve küçük mülk yönetim firmaları; 10–100 taşeronla çalışan küçük müteahhitler ve tadilat firmaları.

## Mevcut çözümler ve eksikleri
- Kurumsal COI takip platformları — https://dev.to/robertatkinson3570/existing-coi-software-costs-6k-15kyear-here-3oem — yazarın aktardığı teklifler yıllık $6K–$15K; küçük işletme için pahalı.
- Küçük işletme odaklı COI araçları — arama özetine göre aylık $29–$149 aralığında planlar ya da tedarikçi başına ~$0.95/ay (Capterra/SaaSworthy listeleri; sayfalar açılmadı, doğrulanmadı).
- Mülk yönetim yazılımlarının yerleşik modülü — fiyat: veri yok — yalnızca o yazılımı kullananlar için; ayrı bir ihtiyaç için tüm paketi almak gerekiyor.
- Tablo + takvim hatırlatıcısı — ücretsiz — PDF'ten bitiş tarihi elle giriliyor, güncellenmeyince işe yaramıyor; ödeme anında kontrol yok.

## Değerlendirme (2026-11-23)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR real-estate: 18/200, oran %9.0 (mutlak sayı düşük; pipeline/logs/2026-11-23-trustmrr.md). Kanıtlardan biri taraflı (dev.to yazarı ürün tanıtıyor), biri 2007 tarihli. |
| büyüme | 3 | Çok sayıda yeni ve küçük COI aracı listeleniyor (CertCove, TrackSurePro; https://www.capterra.ca/software/1109350/CertCove, https://www.sourceforge.net/software/product/TrackSurePro); sayısal büyüme verisi yok. |
| rekabet | 2 | Certificial'ın ücretsiz temel katmanı ve $49 planı var (https://www.g2.com/products/certificial); RiskPartner, COI Pro, CTrax, SmartCompliance da mevcut (Capterra/Software Advice kayıtları). |
| farklılaşma | 3 | "Ödeme anında belge kontrolü" somut bir fark; ancak ücretsiz katmanlı rakip temel ihtiyacı karşılıyor. |
| dağıtım | 3 | BiggerPockets ve müteahhit toplulukları; müteahhit tarafı çevrimiçi erişimde zayıf. |
| yapılabilirlik | 4 | Belge kaydı + bitiş tarihi + hatırlatma kolay; PDF'ten otomatik tarih okuma OCR/ücretli API isteyebilir, kapsam dışı bırakılabilir. |

**Ortalama:** 3.00 — **Karar:** kaldı

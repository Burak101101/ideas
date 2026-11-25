---
slug: hibe-raporlama-takvimi
found: 2026-11-25
category: productivity
source: auto
score: 3.67
priority: 2
---
# Küçük vakıf/derneklerin hibe sonrası raporlama yükümlülüklerini takip etmesi

## Sorun
Birkaç hibe alan küçük kâr amacı gütmeyen kuruluşlar, her fonun farklı rapor tarihlerini, formatlarını ve bütçe gerçekleşmelerini dağınık tablolarda ve kişisel takvimlerde tutuyor; rapor kaçırmak bir sonraki fonu riske atıyor. Ucuz bir hibe takip aracı (GrantHub) 31 Ocak 2026'da kapandı, kalan araçlar küçük bütçeler için pahalı.

## Kanıtlar
- https://techcommunity.microsoft.com/discussions/microsoftfornonprofits/question-for-small-nonprofits/4354891/replies/4472809 (2025-11-25, küçük bir kuruluş çalışanı) — "grant deadlines, reporting requirements" tablolarda; tablolar "can lead to duplication, inconsistent data, and extra work when preparing reports"; hazır sistemler "beyond our budget or require technical capacity that our small team cannot yet support."
- https://www.instrumentl.com/newsletter/the-impact-issue-113 (2026-05-27, rakip satıcının bülteni; taraflı) — "59% of 1000+ grant professionals surveyed shared that they have missed or nearly missed a reporting deadline."
- https://www.instrumentl.com/granthub-migration (rakip satıcı) — "GrantHub is shutting down on January 31, 2026." → eski kullanıcılar yeni araç arıyor.
- https://beancount.io/blog/2026/09/18/grant-management-software-small-nonprofits-fluxx-instrumentl-smartsimple-granthub-guide (2026-09-18) — "juggling five funders' reporting calendars"; bütçe gerçekleşmeleri "live in three different spreadsheets".

## Hedef kullanıcı
Yılda 3–15 hibe yöneten, tam zamanlı hibe uzmanı olmayan 1–10 kişilik ABD kâr amacı gütmeyen kuruluşlar (yönetici, gönüllü sayman, yarı zamanlı hibe yazarı).

## Mevcut çözümler ve eksikleri
- Hibe bulma + yaşam döngüsü platformu — https://www.instrumentl.com/pricing — $299–999/ay (yıllık ödeme), hibe sonrası takip için "Pre-Award"ın üstü gerekiyor; küçük kuruluş bütçesine göre pahalı.
- Kurumsal hibe yönetim paketleri — fiyat teklif usulü (beancount.io rehberi, doğrulanmadı) — karmaşık ve pahalı.
- Ücretsiz tablo/şablonlar (Airtable, Smartsheet hibe takip şablonları) — hatırlatma, fon başına rapor şablonu ve bütçe gerçekleşme bağlantısı kullanıcının elle kurmasına kalıyor; tek kişinin kişisel takviminde kalıyor.
- Ücretsiz katmanlı yeni hibe takip araçları ve $99/ay'dan başlayan alternatifler — arama özetinden, doğrulanmadı.

## Değerlendirme (2026-11-25)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 4 | TrustMRR `productivity`: 3783 toplam, 255 ≥$2K gelir, oran %6.7 (orta sinyal, mutlak sayı yüksek; `pipeline/logs/2026-11-25-trustmrr.md`). Fikir kanıtları güçlü: 1000+ hibe profesyonelinin %59'u rapor tarihini kaçırmış/neredeyse kaçırmış (https://www.instrumentl.com/newsletter/the-impact-issue-113, satıcı kaynağı), küçük kuruluş çalışanı tablo yükünü ve bütçe engelini anlatıyor (https://techcommunity.microsoft.com/discussions/microsoftfornonprofits/question-for-small-nonprofits/4354891/replies/4472809). |
| büyüme | 4 | Hibe yönetim yazılımı pazarı 2026'da ~$2.6–3.2 milyar, YBBO %9–12 (https://www.grandviewresearch.com/industry-analysis/grant-management-software-market-report, https://www.gminsights.com/industry-analysis/grant-management-software-market, https://www.marketresearchfuture.com/reports/grant-management-software-market). Ucuz bir aracın 31 Ocak 2026'da kapanması göç eden kullanıcı yaratıyor (https://www.instrumentl.com/granthub-migration). |
| rekabet | 3 | Pahalı platformlar ($299–999/ay, https://www.instrumentl.com/pricing) ve ücretsiz şablonlar var; küçük kuruluşlar için maliyet benimsemenin ana engeli olarak raporlanıyor (https://www.gminsights.com/industry-analysis/grant-management-software-market). Ücretsiz katmanlı yeni araçlar olduğu söyleniyor (doğrulanmadı) → orta düzey boşluk. |
| farklılaşma | 3 | Yalnızca hibe *sonrası* yükümlülüklere odaklanma: fon başına rapor takvimi, bütçe-gerçekleşme ve takvime aktarım, tek kişiye bağlı kalmayan paylaşımlı görünüm. Somut ama kopyalanması kolay bir fark. |
| dağıtım | 3 | Hedef kitle erişilebilir topluluklarda (Microsoft for Nonprofits forumu, yukarıdaki link) ve "grant tracking spreadsheet" türü SEO sorgularında; ancak satın alma kararı yavaş, bütçe sınırlı. |
| yapılabilirlik | 5 | Çekirdek CRUD + takvim + bütçe tablosu + .ics dışa aktarma; harici ücretli API gerekmez, tek kişi + ajanla ~10 günde yapılabilir. |

**Ortalama:** 3.67 — **Karar:** geçti

## MVP Kapsamı
### Çekirdek özellikler (3–5)
1. Kullanıcı bir hibe (fon veren, tutar, başlangıç/bitiş tarihi) ekleyip düzenleyebilir ve silebilir.
2. Kullanıcı her hibeye birden çok rapor yükümlülüğü (tür: anlatı/mali, son tarih, durum: bekliyor/gönderildi) ekleyebilir; tüm hibelerin raporları tek bir tarih sıralı "yaklaşan raporlar" listesinde görünür, son tarihi 14 gün içinde olanlar ve gecikenler ayrı renkle işaretlenir.
3. Kullanıcı her hibe için bütçe kalemleri (planlanan tutar) ve harcamalar (tarih, kalem, tutar) girebilir; kalem bazında planlanan / harcanan / kalan ve yüzde görünür.
4. Kullanıcı tüm rapor son tarihlerini tek bir .ics dosyası olarak indirip takvim uygulamasına aktarabilir.
5. Veriler tarayıcıda kalıcıdır (sayfa yenilenince kaybolmaz) ve tüm veri JSON olarak dışa/içe aktarılabilir.
### Kapsam dışı
- Hibe bulma/arama veritabanı
- E-posta/SMS hatırlatma, çok kullanıcılı hesaplar, sunucu tarafı kimlik doğrulama
- Muhasebe yazılımı entegrasyonları, ödeme alma
### Kabul kriterleri
- "Hibe ekle" ile fon veren, tutar ve tarihleri girip kaydedince hibe listede görünür; düzenleme ve silme listeyi günceller.
- Bir hibeye son tarihi bugünden 7 gün sonra olan bir rapor eklenince "yaklaşan raporlar" listesinde "yakında" işaretiyle görünür; son tarihi geçmiş ve durumu "bekliyor" olan rapor "gecikti" işaretiyle görünür; durum "gönderildi" yapılınca işaret kalkar.
- İki farklı hibeye rapor eklenince yaklaşan raporlar listesi iki hibenin raporlarını tarih sırasıyla birlikte gösterir.
- Planlanan 1000 olan bir bütçe kalemine 250 + 150 harcama girilince kalem satırında harcanan 400, kalan 600, %40 görünür.
- ".ics indir" düğmesi, her rapor için bir `VEVENT` içeren geçerli bir .ics dosyası indirir.
- Veri girildikten sonra sayfa yenilenince veriler yerinde durur; JSON dışa aktarıp verileri temizledikten sonra içe aktarınca aynı veriler geri gelir.

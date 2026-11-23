---
slug: danismanlik-zaman-fatura-uyumu
found: 2026-11-22
category: productivity
source: auto
score: 2.50
---
# Danışmanlık şirketlerinde zaman kaydı → fatura uyumsuzlukları

## Sorun
Küçük danışmanlık şirketleri ve serbest çalışanlar; ön ödemeli saatler, yuvarlama, satın alma siparişi (PO) numarası değişiklikleri ve ana yüklenici üzerinden faturalama gibi durumları hazır zaman takibi/fatura araçlarında modelleyemiyor. Geçici çözümlerle ayda günlerce operasyon emeği harcıyor ya da kendi araçlarını yazıyorlar.

## Kanıtlar
- https://news.ycombinator.com/item?id=50425109 — "Time tracking and invoicing are unavoidable complexity in a consulting business, particularly at scale when you’re spending lots of time dealing with edge cases"
- https://news.ycombinator.com/item?id=50425109 — "we finally have a tool that perfectly models our business, and saves days of person-effort every month."
- https://news.ycombinator.com/item?id=50274363 — "My product is a time tracker with many options I use to bill my clients like timer, manual entries, rounding, prepaid hours. I created my own tool to meet my requirements"

## Hedef kullanıcı
5–50 kişilik danışmanlık/ajans şirketlerinin operasyon ve finans sorumluları; ön ödemeli (retainer) çalışan serbest danışmanlar.

## Mevcut çözümler ve eksikleri
- Genel zaman takibi + planlama araçları — fiyat: veri yok — kaynak 50425109'a göre ana yüklenici/son müşteri ayrımı ve PO arası zaman taşıma için geçici çözüm gerekiyor.
- Muhasebe yazılımları — fiyat: veri yok — zaman kaydı hatalarından doğan fatura düzeltmelerini elle yapmayı gerektiriyor.
- Kendi yazdıkları iç araçlar — bakım yükü (kaynak 50425109: bazı haftalar "2-8 hours").

## Değerlendirme (2026-11-23)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR productivity: 252/3756, oran %6.7 (orta-zayıf; pipeline/logs/2026-11-23-trustmrr.md). 2 HN başlığı; ikisi de kendi aracını yazmış (50425109, 50274363). |
| büyüme | 2 | Bu alt alan için büyüme verisi yok. |
| rekabet | 2 | Zaman takibi/faturalama yerleşik ve kalabalık bir kategori (TrustMRR productivity 3756 kayıt; pipeline/logs/2026-11-23-trustmrr.md); dosyadaki kaynağa göre genel araçlar çoğu senaryoyu karşılıyor, sorun kenar durumlarda. |
| farklılaşma | 3 | Ön ödemeli saat, PO taşıma, ana yüklenici modellemesi somut boşluk (50425109) ama her şirkette farklı; tek bir cevap tasarlamak zor. |
| dağıtım | 2 | 5–50 kişilik danışmanlık şirketlerinin finans/operasyon sorumlularına ulaşacak belirgin topluluk ya da pazaryeri kanıtı yok. |
| yapılabilirlik | 3 | Çekirdek CRUD yapılabilir; değeri kenar durum kurallarında olduğu için 10 günde inandırıcı bir çekirdek riskli. |

**Ortalama:** 2.50 — **Karar:** kaldı

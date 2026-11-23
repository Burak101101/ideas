---
slug: guvenlik-anketi-yanitlayici
found: 2026-11-22
category: security
source: auto
score: 3.17
---
# Küçük B2B satıcılar için güvenlik anketi yanıtlama

## Sorun
Güvenlik ekibi olmayan küçük yazılım şirketleri büyük bir müşteriye satış yaparken anlaşmanın sonunda 100–300 soruluk (çoğu zaman Excel) güvenlik anketleriyle karşılaşıyor. Yanıtları kurucu/CTO her seferinde sıfırdan ya da son anketten kopyalayarak dolduruyor; anlaşmalar haftalarca gecikebiliyor.

## Kanıtlar
- https://news.ycombinator.com/item?id=50439770 — "a security questionnaire usually shows up late in the deal: 100 to 300 questions, often an Excel file, sometimes a portal."
- https://news.ycombinator.com/item?id=50439861 — "If you struggle on this and there is money on the line, and its a common theme, maybe get someone in to answer them."
- https://news.ycombinator.com/item?id=50520324 — "Imagine you're a 3 person SaaS startup. You get your first potential enterprise customer. But then their security team wants to see SOC 2."
- https://news.ycombinator.com/item?id=50308150 — "I had to fill a security questionnaire today."

## Hedef kullanıcı
Güvenlik/uyum personeli olmayan, kurumsal müşteriye satış yapmaya başlayan 2–30 kişilik B2B SaaS ve ajanslar (kurucu, CTO, satış mühendisi).

## Mevcut çözümler ve eksikleri
- Güvenlik anketi otomasyon araçları — https://sourceforge.net/software/security-questionnaire-automation/ — arama özetine göre giriş planları yaklaşık $69–$499/ay (sayfa bu ortamdan açılamadı, doğrulanmadı); çoğu uyum platformuna bağlı ya da soru/anket kotalı, tek kişilik ekip için pahalı.
- Danışman tutmak — fiyat: veri yok — her anket için tekrar eden maliyet.
- Elle tutulan yanıt bankası (tablo/doküman) — ücretsiz — soru eşleştirme ve güncellik takibi yok.

## Değerlendirme (2026-11-23)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 4 | TrustMRR security: 23/202, oran %11.4 (oran güçlü, mutlak sayı küçük; pipeline/logs/2026-11-23-trustmrr.md). Dosyada 4 bağımsız HN kanıtı. |
| büyüme | 4 | Mordor Intelligence: pazar 2026'da ~$0.42 milyar → 2031'de ~$1.20 milyar, ~%23 yıllık bileşik büyüme (https://www.mordorintelligence.com/industry-reports/security-questionnaire-automation-market; tek kaynak tahmini). |
| rekabet | 2 | Kalabalık: Vanta, SecurityPal, Skypher ve G2'de ayrı bir kategori (https://vanta.com/resources/best-security-questionnaire-automation-software, https://www.g2.com/categories/vendor-security-and-privacy-assessment); G2 verisine göre alıcıların ~%39'u küçük işletme, yani küçük segment de hedefleniyor. |
| farklılaşma | 3 | Uyum platformundan bağımsız, kotasız, ucuz yanıt bankası somut bir cevap; ancak rakiplerin değer önerisi yapay zekâ ile otomatik doldurma ve biz bunu ücretli API olmadan sunamayız. |
| dağıtım | 3 | Kurucu/CTO kitlesine HN, Indie Hackers üzerinden ulaşılabilir; ihtiyaç anlaşma anında ve seyrek ortaya çıkıyor. |
| yapılabilirlik | 3 | Yanıt bankası + Excel içe/dışa aktarma + yerel metin benzerliği yapılabilir; rakiplerle kıyaslanır kalitede eşleştirme ücretli LLM API'si olmadan zor. |

**Ortalama:** 3.17 — **Karar:** kaldı

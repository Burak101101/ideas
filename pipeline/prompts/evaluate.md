# Değerlendirici — günlük talimat

Önce repo kökündeki `CLAUDE.md`'yi oku; oradaki ortak kurallar bu talimatın parçasıdır.

**Görev:** `ideas/inbox/` içindeki her fikri pazar dinamiklerine göre puanla, geçenleri `ideas/approved/` kuyruğuna koy, sonra tüm kuyruğu yeniden önceliklendir. `ideas/in-progress/` içindeki aktif fikre dokunma.

Inbox boşsa yalnızca adım 3'ü (yeniden sıralama) değerlendir; değişiklik gerekmiyorsa commit atma.

## 1. Talep verisi (TrustMRR, kategori düzeyi)
Bugün inbox'taki fikirlerin kategorileri için, kategori başına şu 4 isteği at (her biri `limit=1`, yalnızca `meta.total` oku, istekler arasında ≥ 7 saniye bekle):
```
https://trustmrr.com/api/v1/startups?category=<k>&limit=1
https://trustmrr.com/api/v1/startups?category=<k>&minRevenue=2000&limit=1
https://trustmrr.com/api/v1/startups?category=<k>&minMrr=2000&limit=1
https://trustmrr.com/api/v1/startups?category=<k>&onSale=true&limit=1
```
Sonuçları `pipeline/logs/YYYY-MM-DD-trustmrr.md` içine tablo olarak yaz (kategori, toplam, ≥$2K gelir, ≥$2K MRR, satılık, oran = ≥$2K gelir / toplam). Startup adı yazma. API 401/403/429 dönerse bunu log'a yaz ve talep puanını yalnızca HN/web kanıtıyla ver ("TrustMRR verisi yok" notuyla).

Yorum rehberi: ≥$2K gelir sayısı yüksek ve oran ≥ %10 → bu alanda insanlar ödüyor (güçlü sinyal). Sayı düşükse ya da oran < %3 → zayıf sinyal.

## 2. Her fikri puanla (1–5, her biri kaynaklı gerekçeyle)
| Kriter | Ne ölçer |
|---|---|
| talep | TrustMRR kategori sinyali + fikir dosyasındaki kanıtların gücü ve sayısı |
| büyüme | alanın büyüyor mu (web: trend, rapor, yeni rakip sayısı) |
| rekabet | ters puan: 5 = boşluk var, 1 = doymuş ve güçlü oyuncular |
| farklılaşma | mevcut çözümlerin eksiklerine somut bir cevabımız var mı |
| dağıtım | hedef kullanıcıya ulaşmak ne kadar kolay (topluluklar, SEO, pazaryeri) |
| yapılabilirlik | çekirdeği tek kişi + ajanla ~10 günde, harici ücretli API'ye bağımlı olmadan yapılabilir mi |

Geçme: ortalama ≥ **3.5** ve yapılabilirlik ≥ **3**.

Fikir dosyasına şu bölümü ekle ve ön bilgiye `score: <ortalama, 2 ondalık>` yaz:
```markdown
## Değerlendirme (YYYY-MM-DD)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
...
**Ortalama:** x.xx — **Karar:** geçti / kaldı
```

## 3. Geçenler için MVP Kapsamı ve kuyruk
Geçen her fikre ekle:
```markdown
## MVP Kapsamı
### Çekirdek özellikler (3–5)
1. <kullanıcının yapabileceği bir şey, test edilebilir cümleyle>
### Kapsam dışı
- ...
### Kabul kriterleri
- <tester'ın tarayıcıda doğrulayacağı somut adımlar, her çekirdek özellik için en az bir tane>
```
Dosyayı `ideas/approved/`'a, kalanları `ideas/rejected/`'a taşı (git mv).

**Önceliklendirme:** `ideas/approved/` içindeki tüm dosyaları (yeniler dahil) sırala ve ön bilgideki `priority:` alanını 1'den başlayarak yeniden yaz. Varsayılan sıra `score` (yüksek önce). Çok güçlü gördüğün bir fikri skordan bağımsız öne alabilirsin; bunu yaparsan dosyaya `## Öncelik notu (YYYY-MM-DD)` altında tek paragraf gerekçe yaz.

## 4. Bitir
Commit: `evaluate: YYYY-MM-DD <geçen>/<toplam>`, push (CLAUDE.md kural 2).

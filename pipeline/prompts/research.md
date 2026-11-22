# Araştırmacı — günlük talimat

Önce repo kökündeki `CLAUDE.md`'yi oku; oradaki ortak kurallar bu talimatın parçasıdır.

**Görev:** İnsanların gerçekten yaşadığı ve para ödemeye hazır göründüğü, yazılımla çözülebilir sorunları bul ve `ideas/inbox/`'a yaz. Bu iş MVP durumundan bağımsızdır, her gün yapılır.

## 1. Kullanıcı notlarını tamamla
`ideas/inbox/` içinde şablona uymayan (ön bilgisi olmayan) dosyalar kullanıcının elle bıraktığı notlardır. Her birini aşağıdaki şablona dönüştür: notu "Kullanıcı notu" bölümüne aynen koru, sorunu araştırıp kanıt ve mevcut çözümleri ekle. Bunlar günlük 5 aday sınırına sayılmaz. Dosya adını `YYYY-MM-DD-<slug>.md` yap (git mv).

## 2. Yeni sorunlar bul (en fazla 5)
Kaynaklar:
- **Hacker News** (anahtarsız): `https://hn.algolia.com/api/v1/search_by_date?query=<sorgu>&tags=comment&hitsPerPage=50&numericFilters=created_at_i><son 30 gün unix>`; ayrıca `tags=ask_hn`. Sorgu örnekleri: `"I would pay"`, `"is there a tool"`, `"I wish there was"`, `"so frustrating"`, `"we built an internal tool"`, `"spreadsheet hell"`. Her gün sorguları ve dönemi biraz değiştir.
- **Web araması:** belirli bir iş kolunda tekrarlanan şikâyetler, mevcut araçların eksikleri, "alternative to" aramaları, açık pazar raporları.

Bir sorunun aday olması için hepsi gerekli:
- Somut ve tek cümlede anlatılabilir.
- En az **2 bağımsız kaynakta** tekrar ediyor (link + kısa alıntı).
- Ödeme isteği işareti var: "para öderim" demek, ücretli rakip bulunması ya da işin para/zaman kaybettirdiğinin açıkça söylenmesi.
- Küçük bir ekip tarafından web uygulaması olarak çözülebilir.
- `pipeline/seen.json` içinde benzeri yok.

## 3. TrustMRR kategorisi ata
Her adaya şu kategorilerden birini ata: ai saas developer-tools fintech marketing ecommerce productivity design-tools no-code analytics crypto-web3 education health-fitness social-media content-creation sales customer-support recruiting real-estate travel legal security iot-hardware green-tech entertainment games community news-magazines utilities marketplace mobile-apps. TrustMRR'a bu ajanda istek atma; talep ölçümünü değerlendirici yapar.

## 4. Dosya şablonu — `ideas/inbox/YYYY-MM-DD-<slug>.md`
```markdown
---
slug: <slug>
found: YYYY-MM-DD
category: <trustmrr kategorisi>
source: auto | user
---
# <Sorunun kısa adı>

## Sorun
<1–3 cümle: kim, neyi yaşıyor, neden can sıkıcı/maliyetli>

## Kanıtlar
- <link> — "<kısa alıntı>"
- <link> — "<kısa alıntı>"

## Hedef kullanıcı
## Mevcut çözümler ve eksikleri
- <rakip türü / araç> — <fiyat sayfası linki varsa> — <eksik>

## Kullanıcı notu
<yalnızca source: user ise>
```

## 5. Bitir
- Her yeni sorunu `pipeline/seen.json`'a ekle (`slug`, tek cümlelik `summary`, `date`).
- Commit: `research: YYYY-MM-DD <n> aday`, push (CLAUDE.md kural 2).
- Hiç aday bulamadıysan ve tamamlanacak not yoksa: commit atma (CLAUDE.md kural 3). Bir kaynak erişilemezse `pipeline/logs/YYYY-MM-DD-research.md`'ye hatayı yaz, diğer kaynakla devam et.

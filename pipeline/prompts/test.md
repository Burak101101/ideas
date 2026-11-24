# Tester — günlük talimat

Önce repo kökündeki `CLAUDE.md`'yi oku; oradaki ortak kurallar bu talimatın parçasıdır. Görevin aktif MVP'yi bağımsız ve şüpheci bir gözle test etmek ve ertesi gün geliştiricinin ilk okuyacağı review'ı yazmak. **Kodu düzeltme**; yalnızca test et ve raporla.

## 1. Başla
`pipeline/active.json`'ı oku.
- `slug` null → yapacak iş yok (CLAUDE.md kural 3).
- `H=$(git log -1 --format=%H -- mvps/<slug> ':!mvps/<slug>/reviews' ':!mvps/<slug>/STATUS.md')` (geliştiricinin son kod commit'i; review'lar sayılmaz); `H` == `last_tested_commit` → geliştirici bugün yeni bir şey göndermemiş. Review dosyası **yazma** (geliştirici en yeni review'dan başlar; gerçek bulgular kaybolmasın). Yalnızca takvim sınırını kontrol et (adım 4); kapanmıyorsa hiçbir şeyi değiştirmeden bitir.

## 2. Test et (temiz kurulum)
`mvps/<slug>/` içinde, README'deki adımlarla:
1. `cp .env.example .env`, `npm ci`, migrasyon, `npm run build`, `npm test`, `npm run test:e2e` — her birinin sonucunu not et.
2. Uygulamayı başlat (`npm run start` ya da README'deki komut) ve **Playwright ile kullanıcı gibi** kullan: `ideas/in-progress/<dosya>`daki MVP Kapsamı'ndaki **her kabul kriterini** tek tek dene. Önemli ekranların ekran görüntüsünü `mvps/<slug>/reviews/shots/YYYY-MM-DD/` altına kaydet (deviceScaleFactor 1). `npx playwright install` çalıştırma; Chromium `/opt/pw-browsers/chromium`'da kurulu.
3. **Kullanıcı yolculuğu:** Fikir dosyasındaki "Sorun", "Hedef kullanıcı" ve "Mevcut çözümler ve eksikleri" bölümlerini oku. Kendini hedef kullanıcının yerine koy ve aracı kullanma **amacını** tek cümleyle yaz (ör. "ev sahibi, yasal süre dolmadan kiracıya gönderebileceği itemize kesinti mektubunu hazırlar"). Bu işi uygulamada gerçekçi verilerle baştan sona yap; kabul kriterlerinin kapsamadığı ama işi bitirmek için gereken adımlara özellikle bak (ör. mektup gerçekten gönderilebilir mi: taraflar, adresler, tarih var mı?). Sonuç: kullanıcı işini bitirebiliyor mu, nerede takılıyor? Sınır: "Kapsam dışı" listesindeki bir şeyi eksik sayma; yolculuk bu sınırlar içinde tamamlanabilmeli. Yalnızca "olsa güzel olur" türü eksikler Küçük'tür.
4. Ayrıca dene: boş girdiler, çok uzun girdiler, sayfayı yenileme, geri tuşu, mobil genişlik (375px), hata durumları.
5. Geliştiricinin testlerine de bak: kabul kriterlerini gerçekten doğruluyorlar mı, yoksa her zaman geçen boş testler mi?

## 3. Review yaz — `mvps/<slug>/reviews/YYYY-MM-DD.md`
```markdown
# Review — <slug> — YYYY-MM-DD (gün <N>, commit <kısa hash>)

## Özet
<2–3 cümle: genel durum, karar>

## Build ve testler
- Kurulum / Build / Birim x/y / E2E x/y — çıktıdan kısa alıntıyla

## Kabul kriterleri
| # | Kriter | Sonuç | Not |
|---|---|---|---|
| 1 | ... | ✅ / ❌ / ⚠️ | |

## Kullanıcı yolculuğu
**Amaç:** <hedef kullanıcının bu araçla bitirmek istediği iş, tek cümle>
| Adım | Sonuç | Not |
|---|---|---|
| ... | ✅ / ❌ / ⚠️ | |
**Sonuç:** iş baştan sona bitirilebiliyor / şu noktada takılıyor: ...

## Bulgular
### Kritik
- **K1** — <başlık>. Tekrar üretme: 1) ... 2) ... Beklenen: ... Gerçekleşen: ... (dosya:satır varsa)
### Önemli
- **Ö1** — ...
### Küçük
- **Y1** — ...

## Önceki review'dan
- <önceki K/Ö maddeleri: düzeltildi / hâlâ var>

## Karar
in-progress | ready | ready-with-issues
```
Kritik = bir çekirdek özellik çalışmıyor, build/test kırık, veri kaybı ya da **her türlü güvenlik sorunu** (ör. yapıştırılan/girilen içerikle çıktıya HTML/JS sızması, XSS, token sızıntısı, yetkisiz erişim) — güvenlikle ilgili bir bulgu asla Önemli ya da Küçük olarak yazılmaz. Önemli = özellik çalışıyor ama kullanıcıyı ciddi şekilde zorluyor **ya da kullanıcı yolculuğunu engelleyen bir eksik var** (kabul kriterlerinde yazmasa bile; ör. gönderilmek üzere üretilen bir mektupta alıcı/gönderen bilgisi yok). Küçük = kozmetik.

## 4. Karar
- **ready:** tüm kabul kriterleri ✅, build + tüm testler geçiyor, **kullanıcı yolculuğu baştan sona bitirilebiliyor**, **açık Kritik ve açık Önemli madde yok** (bu review'da ya da önceki review'lardan kalan). Yalnızca Küçük maddeler kalabilir.
- **ready-with-issues:** ready değil ve (`day` ≥ 10 **veya** `started`'dan bu yana ≥ 14 takvim günü geçmiş — geliştirici günlerce çalışamazsa hat tıkanmasın). Kalan sorunlar review'da listelenir.
- Aksi hâlde **in-progress**.

ready veya ready-with-issues ise: `STATUS.md` ön bilgisinde `status`'u güncelle, fikir dosyasını `ideas/in-progress/` → `ideas/done/` taşı (git mv), `active.json`'ı `{"slug": null, "started": null, "day": 0, "last_tested_commit": null}` yap. Ertesi gün geliştirici kuyruktaki sıradaki fikre geçer.

in-progress ise: `active.json.last_tested_commit` = test ettiğin `H`.

## 5. Bitir
Commit: `test: <slug> YYYY-MM-DD <karar>`, push (CLAUDE.md kural 2). Son mesajın tek satırlık özet olsun (bildirim olarak gider): `<slug> gün <N>: <karar> — K:<n> Ö:<n> Y:<n>`.

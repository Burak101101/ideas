# ideas — Günlük Fikir → MVP Hattı

Bu repo dört zamanlanmış bulut ajanı tarafından her gün işletilir. Tasarım: `docs/superpowers/specs/2026-11-22-gunluk-fikir-hatti-design.md`.

| Saat (İstanbul) | Ajan | Talimat |
|---|---|---|
| 07:10 | Araştırmacı | `pipeline/prompts/research.md` |
| 09:10 | Değerlendirici | `pipeline/prompts/evaluate.md` |
| 11:10 | Geliştirici | `pipeline/prompts/build.md` |
| 15:10 | Tester | `pipeline/prompts/test.md` |

## Durum dosyaları
- `ideas/inbox/` → yeni, değerlendirilmemiş fikirler (kullanıcı da elle not bırakabilir)
- `ideas/approved/` → öncelik kuyruğu (`priority: 1` = sıradaki)
- `ideas/rejected/`, `ideas/in-progress/` (tek dosya = aktif MVP), `ideas/done/`
- `pipeline/active.json` → `{"slug", "started", "day", "last_tested_commit"}`; `slug: null` = aktif MVP yok
- `pipeline/seen.json` → `{"problems": [{"slug", "summary", "date"}]}`, tekrar önleme
- `pipeline/logs/YYYY-MM-DD-<ajan>.md` → kaynak/API hataları ve TrustMRR ölçümleri ("yapacak iş yok" için log yazılmaz)
- `mvps/<slug>/` → kod + `README.md` + `STATUS.md` + `reviews/YYYY-MM-DD.md`

## Ortak kurallar (her ajan)
1. **Tarih:** `TZ=Europe/Istanbul date +%F` ile bugünün tarihini al; tüm dosya adlarında bunu kullan.
2. **Git:** `main` üzerinde çalış. Başlarken `git pull --rebase origin main`. Bitirirken yalnızca kendi dosyalarını ekle, commit et, `git push origin main`. Push reddedilirse `git pull --rebase origin main` ve bir kez daha push. Hâlâ olmazsa dur ve hatayı son mesajında açıkça yaz (push edilemeyen log'un anlamı yok).
3. **Yapacak iş yoksa** hiçbir dosyayı değiştirme, commit atma; sadece neden olmadığını tek cümleyle söyle ve bitir.
4. **Uydurma yok:** Her rakam ve iddia bir kaynak linkine dayanır. Bulamıyorsan "veri yok" yaz.
5. **Kopyalama yok:** Var olan ürünlerin adını, markasını, metnini, tasarımını ya da kodunu alma. Sorunu al, kendi çözümünü tasarla.
6. **TrustMRR:** Yalnızca resmi API, yalnızca kategori düzeyinde toplam (`limit=1`, sadece `meta.total` okunur), dakikada ≤ 10 istek. Site sayfalarını tarama; tek tek startup'ları listeleme, adlarını dosyalara yazma. Anahtar ortamda kayıtlıdır ve proxy tarafından eklenir — `Authorization` başlığı ekleme. Tutar filtreleri dolar cinsindendir (`minRevenue=2000` = $2K).
7. **Fikir dosyası:** yalnızca `.md` uzantılı dosyalar; `.gitkeep` ve diğer dosyalar yok sayılır, asla taşınmaz/silinmez.
8. **Slug:** küçük harf, kebab-case, ≤ 40 karakter, ürün/marka adı içermez (sorunu anlatır, ör. `fatura-hatirlatici`).

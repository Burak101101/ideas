# Günlük Fikir Hattı — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TrustMRR'dan günlük fikir bulan, değerlendirip önceliklendiren, tek seferde tek MVP geliştiren ve her gün test edip review yazan dört zamanlanmış bulut ajanını kurmak.
**Architecture:** Ajan talimatları `pipeline/prompts/*.md`; her zamanlanmış görev yeni oturum açıp ilgili dosyayı okur. Durum `pipeline/active.json`, `ideas/*/` klasörleri ve `mvps/<slug>/{STATUS.md,reviews/}` üzerinden; her ajan doğrudan `main`'e push eder.
**Tech Stack:** Markdown prompt'lar, Claude Code zamanlanmış görevleri, MVP'ler için Next.js + TypeScript + Tailwind + SQLite (Prisma), test için Playwright.
**Spec:** `docs/superpowers/specs/2026-11-22-gunluk-fikir-hatti-design.md`

## Değişiklik notu (2026-11-22)
TrustMRR şartları site taramasını ve "başarılı startup'ı taklit etmek için belirleyen" otomasyonu yasakladığı için araştırmacı artık HN (hn.algolia.com) + web araması + kullanıcı notlarıyla sorun bulur; TrustMRR yalnızca değerlendiricide, resmi API ile ve yalnızca kategori düzeyinde toplam (`limit=1`, `meta.total`) olarak kullanılır. Ayrıntı: spec'teki "TrustMRR kullanım kuralı".

## Global Constraints
- Saatler Europe/Istanbul: 07:10 araştırma, 09:10 değerlendirme, 11:10 geliştirme, 15:10 test.
- Seçim: (exit/acquired) veya (doğrulanmış MRR ≥ $2K) ve somut bir sorun. Günde en fazla 5 yeni aday.
- Geçme: 6 kriter ortalaması ≥ 3.5 ve yapılabilirlik ≥ 3. Kuyrukta `priority:` 1 = en önce.
- Aynı anda tek aktif MVP. Bitti: tüm kapsam çalışıyor + build/test yeşil + 0 Kritik. Süre sınırı 10 geliştirme günü → `ready-with-issues`.
- Review şiddetleri: Kritik / Önemli / Küçük. Kaynaksız rakam yazılmaz. Marka/kod kopyalanmaz.
- Dosya adları: fikir `YYYY-MM-DD-<slug>.md`, review `mvps/<slug>/reviews/YYYY-MM-DD.md`.

## Review Focus
- Kuyruk ve aktif MVP boş → geliştirici/tester hiçbir şey değiştirmeden, boş commit atmadan çıkmalı.
- TrustMRR erişilemez / yapı değişmiş → araştırmacı uydurmamalı; `pipeline/logs/YYYY-MM-DD-research.md` yazıp çıkmalı.
- Geliştirici o gün push edemedi / hiç çalışmadı → tester yine çalışır ama aynı commit'i ikinci kez review'lamaz; review'a "yeni commit yok" yazar ve gün sayacını artırmaz.
- Aynı ürün tekrar bulunur → `seen.json` ile atlanmalı.
- Değerlendirici yeniden sıralarken `in-progress/`'teki aktif fikre dokunmamalı.

---

### Task 1: Repo iskeleti
**Files:** Create `pipeline/seen.json` (`{"products": []}`), `pipeline/active.json` (`{"slug": null}`), `.gitkeep`: `ideas/{inbox,approved,rejected,in-progress,done}/`, `mvps/`, `pipeline/logs/`; `CLAUDE.md` (hattın özeti + klasör/durum kuralları); `README.md` güncelle.
- [ ] Oluştur. Doğrula: `find ideas mvps pipeline -type f`.

### Task 2: `pipeline/prompts/research.md`
TrustMRR'ın gerçek sayfa yapısına bakılarak yazılır. Seçim şartı, `seen.json` güncelleme, fikir şablonu (Ürün, Kanıt, Sorun, Hedef kullanıcı, Fiyatlandırma, Notlar), hata davranışı, commit `research: YYYY-MM-DD <n> aday`.
- [ ] Yaz.

### Task 3: `pipeline/prompts/evaluate.md`
6 kriter + kaynak; eşik; "MVP Kapsamı"; ön bilgi `score:` ve `priority:`; tüm `approved/` kuyruğunu yeniden sıralama + gerekçe; aktif fikre dokunmama; commit `evaluate: YYYY-MM-DD <geçen>/<toplam>`.
- [ ] Yaz.

### Task 4: `pipeline/prompts/build.md`
Akış: `active.json` dolu → en son review'ı oku, Kritik → Önemli → eksik kapsam; boş → `priority: 1` fikri `in-progress/`'e taşı, `active.json`'ı doldur, iskelet kur. Stack, TDD, `STATUS.md` (durum, build/test sonucu, yapılanlar, sıradaki işler), `active.json.day` artırma, commit `build: <slug> gün <N>`.
- [ ] Yaz.

### Task 5: `pipeline/prompts/test.md`
Temiz kurulum, build, testler, Playwright ile kapsamdaki her özelliği deneme; review şablonu (özellik tablosu, Kritik/Önemli/Küçük + tekrar üretme adımları); bitti kararı ve 10 gün sınırı; kapatınca fikri `done/`'a taşı, `active.json`'ı boşalt; "yeni commit yok" durumu; commit `test: <slug> YYYY-MM-DD <karar>`.
- [ ] Yaz.
- [ ] Task 1–5'i commit'le, `main`'e merge et, push'la.

### Task 6: Zamanlanmış görevler
`create_trigger`, her biri `create_new_session_on_fire: true`, ortam `Agent_Dev`:
- "Fikir Araştırma" — `CRON_TZ=Europe/Istanbul 10 7 * * *`
- "Fikir Değerlendirme" — `CRON_TZ=Europe/Istanbul 10 9 * * *`
- "MVP Geliştirme" — `CRON_TZ=Europe/Istanbul 10 11 * * *`
- "MVP Test" — `CRON_TZ=Europe/Istanbul 10 15 * * *`, `notifications: {push: true}`
Prompt: "`Burak101101/ideas` reposunda `main` üzerindesin. `pipeline/prompts/<x>.md` dosyasını oku ve harfiyen uygula."
- [ ] Oluştur. Doğrula: `list_triggers` dördünü `next_run_at` ile gösterir.

### Task 7: Duman testi
- [ ] Araştırma görevini `fire_trigger` ile şimdi çalıştır; bitince `git pull` ile `ideas/inbox/` içinde ≥1 dosya ve güncel `seen.json` olduğunu doğrula.

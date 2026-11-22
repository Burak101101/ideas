# Günlük Fikir Hattı — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TrustMRR'dan günlük fikir bulan, değerlendiren ve MVP kodlayan üç zamanlanmış bulut ajanını kurmak.
**Architecture:** Ajan talimatları `pipeline/prompts/*.md` dosyalarında; her zamanlanmış görev yeni oturum açıp ilgili dosyayı okur. Ajanlar arası devir `ideas/{inbox,approved,rejected,built}/` klasörleri üzerinden, doğrudan `main`'e push ile.
**Tech Stack:** Markdown prompt'lar, Claude Code zamanlanmış görevleri (create_trigger), MVP'ler için Next.js + TypeScript + Tailwind + SQLite (Prisma).
**Spec:** `docs/superpowers/specs/2026-11-22-gunluk-fikir-hatti-design.md`

## Global Constraints
- Saatler Europe/Istanbul: 07:10 araştırma, 09:10 değerlendirme, 11:10 kodlama.
- Seçim: (exit/acquired) veya (doğrulanmış MRR ≥ $2K) ve somut bir sorun. Günde en fazla 5 yeni aday.
- Geçme: 6 kriter ortalaması ≥ 3.5 ve yapılabilirlik ≥ 3.
- Günde en fazla 1 MVP. Kaynaksız rakam yazılmaz. Marka/kod kopyalanmaz.
- Fikir dosya adı: `YYYY-MM-DD-<slug>.md`. MVP: `mvps/<slug>/`.

## Review Focus
- Kuyruk boş (inbox/approved boş) → ajan hiçbir şey değiştirmeden, "yapacak iş yok" commit'i atmadan çıkmalı.
- TrustMRR sayfa yapısı değişir / erişilemez → araştırmacı uydurmamalı; `pipeline/logs/YYYY-MM-DD-research.md` içine hatayı yazıp çıkmalı.
- Aynı ürün ikinci gün yine bulunur → `seen.json` kontrolü ile atlanmalı.
- Push çakışması (iki görev çakışırsa) → `git pull --rebase` + bir kez tekrar.
- MVP build/test geçmiyor → README'de "tamamlanmadı" ve hata özetiyle yine commit; fikir `approved/`'da kalmamalı (sonsuz tekrar), `built/`'e "status: failed" ile taşınmalı.

---

### Task 1: Repo iskeleti
**Files:** Create `pipeline/seen.json` (`{"products": []}`), `ideas/{inbox,approved,rejected,built}/.gitkeep`, `mvps/.gitkeep`, `pipeline/logs/.gitkeep`, `CLAUDE.md` (hattın kısa açıklaması + klasör kuralları), `README.md` güncelle.
- [ ] Dosyaları oluştur.
- [ ] Doğrula: `find ideas mvps pipeline -type f` tüm dosyaları listeler.

### Task 2: Araştırmacı prompt'u — `pipeline/prompts/research.md`
TrustMRR'ın gerçek sayfa yapısına (liste/startup sayfaları, MRR ve "sold/for sale" alanları) bakılarak yazılır. İçerir: seçim şartı, `seen.json` güncelleme, fikir dosyası şablonu (başlıklar: Ürün, Kanıt (MRR/exit + link), Sorun, Hedef kullanıcı, Fiyatlandırma, Notlar), Review Focus'taki boş/erişilemez davranışı, commit mesajı `research: YYYY-MM-DD <n> aday`.
- [ ] Yaz. Doğrula: Task 6'daki duman testi.

### Task 3: Değerlendirici prompt'u — `pipeline/prompts/evaluate.md`
İçerir: 6 kriter (pazar büyüklüğü, büyüme, rekabet (ters), farklılaşma, dağıtım, yapılabilirlik), her biri 1–5 + kaynak linki; geçme eşiği; geçenlere "MVP Kapsamı" (3–5 çekirdek özellik, kapsam dışı); dosyaya `score:` ön bilgisi; taşıma; commit `evaluate: YYYY-MM-DD <geçen>/<toplam>`.
- [ ] Yaz.

### Task 4: Geliştirici prompt'u — `pipeline/prompts/build.md`
İçerir: `approved/` içinden en yüksek `score`; varsayılan stack; TDD; `npm run build` + `npm test` geçmeli; `mvps/<slug>/README.md`; başarısızlıkta `status: failed`; fikri `built/`'e taşıma; commit `build: <slug>`.
- [ ] Yaz.
- [ ] Task 1–4'ü commit'le, `main`'e merge et ve push'la.

### Task 5: Zamanlanmış görevler
`create_trigger`, her biri `create_new_session_on_fire: true`, ortam `Agent_Dev`:
- "Fikir Araştırma" — `CRON_TZ=Europe/Istanbul 10 7 * * *`
- "Fikir Değerlendirme" — `CRON_TZ=Europe/Istanbul 10 9 * * *`
- "MVP Geliştirme" — `CRON_TZ=Europe/Istanbul 10 11 * * *`, `notifications: {push: true}`
Prompt: "`Burak101101/ideas` reposunda `main` üzerindesin. `pipeline/prompts/<x>.md` dosyasını oku ve harfiyen uygula."
- [ ] Oluştur. Doğrula: `list_triggers` üçünü de `next_run_at` ile gösterir.

### Task 6: Duman testi
- [ ] Araştırma görevini `fire_trigger` ile şimdi çalıştır; bitince `ideas/inbox/` içinde ≥1 dosya ve güncel `seen.json` olduğunu `git pull` ile doğrula.

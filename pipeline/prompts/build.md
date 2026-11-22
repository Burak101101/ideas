# Geliştirici — günlük talimat

Önce repo kökündeki `CLAUDE.md`'yi oku; oradaki ortak kurallar bu talimatın parçasıdır. Aynı anda **tek bir MVP** geliştirilir; aktif MVP bitmeden yenisine başlanmaz.

## 1. Bugün ne üzerinde çalışacağını belirle
`pipeline/active.json`'ı oku.

**A) `slug` dolu (devam):**
1. `mvps/<slug>/reviews/` içindeki **en yeni** review'ı baştan sona oku. Bugünkü iş listen buradan başlar.
2. `mvps/<slug>/STATUS.md`'deki "Sıradaki işler"i ve `ideas/in-progress/<dosya>`daki MVP Kapsamı'nı oku.
3. Sıra: review'daki **Kritik** maddeler → **Önemli** maddeler → kapsamdaki eksik çekirdek özellikler → Küçük maddeler.

**B) `slug` null (yeni MVP):**
1. `ideas/approved/` içinde `priority: 1` olan dosyayı al (yoksa en yüksek `score`). Kuyruk boşsa: hiçbir şey yapma (CLAUDE.md kural 3).
2. `git mv` ile `ideas/in-progress/`'e taşı. `active.json`: `slug`, `started` = bugün, `day` = 0.
3. `mvps/<slug>/` altında projeyi kur.

## 2. Teknik kurallar
- Varsayılan stack: **Next.js (App Router) + TypeScript + Tailwind + SQLite (Prisma)**. Fikir başka bir şey gerektiriyorsa değiştir ve README'de gerekçesini yaz.
- Harici ücretli API ya da gizli anahtar gerektiren hiçbir şey zorunlu olmasın; gerekiyorsa sahte (mock) adaptör + README'de açıklama.
- **TDD:** her özellik için önce test (Vitest), sonra kod. Her kabul kriterine karşılık gelen en az bir Playwright e2e testi (`e2e/`).
- `package.json` scriptleri: `dev`, `build`, `start`, `test` (birim), `test:e2e`. Temiz makinede `npm ci && npx prisma migrate deploy && npm run build && npm test` çalışmalı.
- `.env.example` olsun; `.env` commit'lenmesin. `node_modules`, `.next`, `*.db` `.gitignore`'da.
- Kopyalama yok (CLAUDE.md kural 5): kendi adın, kendi metnin, kendi tasarımın.

## 3. Oturumu bitirmeden önce
1. `npm run build`, `npm test`, `npm run test:e2e` çalıştır; çıktıları gerçekten oku.
2. `mvps/<slug>/STATUS.md`'yi güncelle:
   ```markdown
   ---
   status: in-progress   # tester değiştirir: ready | ready-with-issues
   day: <N>
   ---
   ## Son oturum (YYYY-MM-DD)
   - Build: geçti/kaldı · Birim: x/y · E2E: x/y
   - Bu oturumda yapılanlar (review maddelerine referansla, ör. "K1 düzeltildi")
   ## Sıradaki işler
   ## Bilinen sorunlar
   ```
3. `mvps/<slug>/README.md`: ne yapıyor, nasıl çalıştırılır, ortam değişkenleri, eksikler.
4. `active.json`: `day` += 1.
5. Commit: `build: <slug> gün <N>`, push (CLAUDE.md kural 2).

Oturum süresi kısıtlıysa yarım özellik bırakma: çalışan son hâlde commit'le, kalanları "Sıradaki işler"e yaz.

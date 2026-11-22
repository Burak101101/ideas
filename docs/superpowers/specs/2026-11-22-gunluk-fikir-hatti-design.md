# Günlük Fikir → Değerlendirme → MVP Hattı

## Amaç
Her gün, gerçekten para kazandığı kanıtlanmış (exit yapmış ya da ≥ $2K MRR) ve somut bir sorunu çözen SaaS fikirlerini bulmak, pazarına göre elemek ve geçen fikirden çalışan bir MVP çıkarmak. Nihai hedef: kullanıcının yayınlayıp deneyebileceği MVP'ler.

## Hedefler / Hedef olmayanlar
- **Hedef:** Günde 1 tarama, 1 değerlendirme turu, en fazla 1 MVP. Her şey `Burak101101/ideas` reposunda kalıcı.
- **Hedef değil:** Product Hunt (bot koruması 403 veriyor; ileride erişilirse eklenir). Deploy / canlıya alma. Günde birden fazla MVP.
- **Anti-hedef:** Ürünlerin adını, markasını, tasarımını ya da kodunu kopyalamak — *sorunu* alıp kendi çözümümüzü yazarız. Uydurma MRR / pazar verisi — kaynak gösterilemeyen rakam yazılmaz.

## Yaklaşımlar
- **A) Üç ayrı zamanlanmış görev + repo dosyaları üzerinden kuyruk** — ✅ seçildi. Her ajan temiz oturum, birinin hatası diğerini durdurmaz, geç kalma kuyrukla tolere edilir.
- B) Tek görev içinde sırayla üç alt ajan — reddedildi: kodlamaya gelindiğinde bağlam dolu, tek hata tüm günü yakar.

## Tasarım

### Zamanlama (Europe/Istanbul, her gün)
| Saat | Ajan | Girdi → Çıktı |
|---|---|---|
| 07:10 | Araştırmacı | TrustMRR → `ideas/inbox/` |
| 09:10 | Değerlendirici | `ideas/inbox/` → `ideas/approved/` veya `ideas/rejected/` |
| 11:10 | Geliştirici | `ideas/approved/` (en yüksek puanlı) → `mvps/<slug>/`, fikir dosyası `ideas/built/`'e |

Her görev yeni bir oturum açar ve yalnızca şunu der: *"`pipeline/prompts/<ajan>.md` dosyasını oku ve uygula."* Böylece ajan talimatları repoda durur; görevleri değiştirmeden prompt'ları düzenleyebilirsin.

### Repo yapısı
```
pipeline/prompts/research.md   evaluate.md   build.md
pipeline/seen.json             # taranmış ürünlerin listesi (tekrar önleme)
ideas/inbox/ approved/ rejected/ built/   # her fikir: YYYY-MM-DD-<slug>.md
mvps/<slug>/                   # her MVP kendi klasöründe, kendi README'si ile
```

### 1. Araştırmacı
- TrustMRR'da satılık/satılmış listeleri ve startup sayfalarını tarar.
- Seçim şartı: (exit/acquired) **veya** (doğrulanmış MRR ≥ $2K) **ve** tek cümlede söylenebilen somut bir sorun çözüyor.
- `seen.json`'daki ürünleri atlar. Günde en fazla 5 yeni aday.
- Fikir dosyası: ürün adı + link, MRR/exit kanıtı, çözdüğü sorun, hedef kullanıcı, fiyatlandırma, gözlemler.

### 2. Değerlendirici
Her aday için web araştırması yapıp 1–5 puanlar: pazar büyüklüğü, büyüme/trend, rekabet yoğunluğu (ters), farklılaşma fırsatı, dağıtım kolaylığı, **tek oturumda MVP yapılabilirlik**. Kaynak linkleriyle gerekçe yazar.
**Geçme şartı:** ortalama ≥ 3.5 ve yapılabilirlik ≥ 3. Geçenlere "MVP kapsamı" bölümü ekler (çekirdek 3–5 özellik, kapsam dışı olanlar).

### 3. Geliştirici
- `approved/` içinden en yüksek puanlıyı alır (boşsa hiçbir şey yapmaz).
- Varsayılan stack: **Next.js + TypeScript + Tailwind + SQLite (Prisma)**; fikir gerektiriyorsa ajan değiştirebilir ve README'de gerekçesini yazar.
- Testleri yazar, build + test geçmeden "bitti" demez. `mvps/<slug>/README.md`: ne yapıyor, nasıl çalıştırılır, eksikler.
- Bitince fikir dosyasını `built/`'e taşır.

### Git
Ajanlar arası devir repodan olduğu için **her ajan doğrudan `main`'e commit + push** yapar (PR yok). Push çakışırsa `pull --rebase` ile bir kez tekrar dener.

### Bildirim
Geliştirici görevinin bitişinde telefona push bildirimi.

## Builder'a bırakılanlar
Prompt'ların tam metni, TrustMRR sayfa yapısına göre tarama yöntemi, MVP içindeki teknik kararlar.

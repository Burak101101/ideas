# Günlük Fikir → Değerlendirme → MVP → Test Hattı

## Amaç
Her gün, gerçekten para kazandığı kanıtlanmış (exit yapmış ya da ≥ $2K MRR) ve somut bir sorunu çözen SaaS fikirlerini bulmak, pazarına göre elemek ve en iyisinden **bitmiş, test edilmiş** bir MVP çıkarmak. Nihai hedef: kullanıcının yayınlayıp deneyebileceği MVP'ler.

## Hedefler / Hedef olmayanlar
- **Hedef:** Günde 1 tarama, 1 değerlendirme, 1 geliştirme oturumu, 1 test oturumu. Aynı anda **tek bir MVP** geliştirilir; bitmeden yenisine başlanmaz. Her şey `Burak101101/ideas` reposunda kalıcı.
- **Hedef değil:** Product Hunt (bot koruması 403 veriyor; ileride erişilirse eklenir). Deploy / canlıya alma.
- **Anti-hedef:** Ürünlerin adını, markasını, tasarımını ya da kodunu kopyalamak — *sorunu* alıp kendi çözümümüzü yazarız. Uydurma MRR / pazar verisi. Bir MVP'nin sonsuza kadar "devam ediyor"da kalması.

## Yaklaşımlar
- **A) Ayrı zamanlanmış görevler + repo dosyaları üzerinden kuyruk** — ✅ seçildi. Her ajan temiz oturum, birinin hatası diğerini durdurmaz.
- B) Tek görev içinde sırayla alt ajanlar — reddedildi: kodlamaya gelindiğinde bağlam dolu, tek hata tüm günü yakar.

## Tasarım

### Zamanlama (Europe/Istanbul, her gün)
| Saat | Ajan | İş |
|---|---|---|
| 07:10 | Araştırmacı | TrustMRR → `ideas/inbox/` (her gün, MVP durumundan bağımsız) |
| 09:10 | Değerlendirici | `inbox/` → `approved/` (öncelikli kuyruk) veya `rejected/` |
| 11:10 | Geliştirici | Aktif MVP varsa son review'dan başlar ve devam eder; yoksa kuyruğun başındaki fikre başlar |
| 15:10 | Tester | Aktif MVP'yi test eder, review yazar, bitti/bitmedi kararı verir |

Her görev yeni bir oturum açar ve yalnızca *"`pipeline/prompts/<ajan>.md` dosyasını oku ve uygula"* der; talimatlar repoda düzenlenebilir.

### Repo yapısı
```
pipeline/prompts/research.md evaluate.md build.md test.md
pipeline/seen.json      # taranmış ürünler (tekrar önleme)
pipeline/active.json    # {"slug": "...", "started": "YYYY-MM-DD", "day": N} ya da {"slug": null}
pipeline/logs/          # hata / "yapacak iş yok" kayıtları
ideas/inbox/ approved/ rejected/ in-progress/ done/
mvps/<slug>/            # kod + README.md + STATUS.md + reviews/YYYY-MM-DD.md
```

### 1. Araştırmacı (her gün çalışır)
- TrustMRR'da satılık/satılmış listeleri ve startup sayfalarını tarar.
- Şart: (exit/acquired) **veya** (doğrulanmış MRR ≥ $2K) **ve** somut bir sorun çözüyor. `seen.json`'dakileri atlar. Günde en fazla 5 yeni aday.
- Fikir dosyası: ürün + link, MRR/exit kanıtı, sorun, hedef kullanıcı, fiyatlandırma, notlar.

### 2. Değerlendirici
- 6 kriterde 1–5 puan + kaynak linkleri: pazar büyüklüğü, büyüme, rekabet (ters), farklılaşma, dağıtım kolaylığı, MVP yapılabilirliği. Geçme: ortalama ≥ 3.5 ve yapılabilirlik ≥ 3. Geçenlere "MVP Kapsamı" (3–5 çekirdek özellik + kapsam dışı) ekler.
- **Önceliklendirme:** `approved/` bir kuyruktur. Her dosyada `priority:` (1 = en önce) vardır; değerlendirici her gün yeni gelenlerle birlikte tüm kuyruğu yeniden sıralar ve çok güçlü gördüğü bir fikri öne alabilir (gerekçesini yazar). Aktif MVP'ye dokunmaz.

### 3. Geliştirici
- `active.json` doluysa: o MVP'nin **en son review'ını okuyarak başlar**, önce oradaki "Kritik" maddeleri, sonra "Önemli"leri düzeltir, kalan zamanda kapsamdaki eksik özellikleri yapar.
- `active.json` boşsa: `approved/` içinden `priority: 1` olanı alır, `ideas/in-progress/`'e taşır, `active.json`'ı doldurur, `mvps/<slug>/` iskeletini kurar.
- Varsayılan stack: **Next.js + TypeScript + Tailwind + SQLite (Prisma)**; fikir gerektiriyorsa değiştirir, README'de gerekçesini yazar. TDD; oturum sonunda build + test durumu `STATUS.md`'ye yazılır.
- Kuyruk ve aktif MVP ikisi de boşsa hiçbir şey yapmaz.

### 4. Tester
- Aktif MVP'yi temiz kurulumla çalıştırır: install, build, testler, uygulamayı ayağa kaldırıp (Playwright ile) MVP Kapsamı'ndaki her özelliği kullanıcı gibi dener.
- `mvps/<slug>/reviews/YYYY-MM-DD.md` yazar: özellik bazında çalışıyor/çalışmıyor, bulunan hatalar **Kritik / Önemli / Küçük** olarak, her birine tekrar üretme adımları.
- **Bitti kararı:** Kapsamdaki tüm özellikler çalışıyor, build + testler yeşil ve hiç Kritik madde yoksa → `STATUS.md: ready`, fikir `ideas/done/`'a, `active.json` boşaltılır. Ertesi gün geliştirici kuyruktaki sıradaki fikre geçer.
- **Süre sınırı:** Bir MVP **10 geliştirme gününü** doldurursa tester onu `ready-with-issues` olarak kapatır (kalan sorunlar review'da listelenir); böylece hat tıkanmaz.

### Git
Ajanlar arası devir repodan olduğu için her ajan doğrudan `main`'e commit + push yapar. Çakışmada `git pull --rebase` ve bir kez tekrar.

### Bildirim
Tester görevinin bitişinde telefona push bildirimi (günün MVP durumu).

## Builder'a bırakılanlar
Prompt'ların tam metni, TrustMRR sayfa yapısına göre tarama yöntemi, MVP içindeki teknik kararlar.

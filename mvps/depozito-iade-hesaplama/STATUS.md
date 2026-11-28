---
status: in-progress
day: 2
---
## Son oturum (2026-11-28)
- Build: geçti · Birim: 28/28 · E2E: 18/18
- Yeniden açılan MVP; `reviews/2026-11-23.md` maddeleri:
  - **Ö1 düzeltildi:** tutar alanları `parseAmount` ile doğrulanıyor; negatif, sayı olmayan ve çok büyük değerler alan altında hata gösteriyor, Save/Create statement kapalı; Totals ve mektup ham değeri değil doğrulanmış değeri gösteriyor. Alanlar `type="text" inputMode="decimal"` (Chrome `1e400`'ü number alanında sessizce boşaltıyordu); `$1,500` biçimi kabul.
  - **Ö2 düzeltildi:** form kayıtlı hâlinden farklıysa (yarım kalan kesinti girdisi dahil) başlıkta "Unsaved changes" rozeti; başka kaydın Edit'i ya da "Start a new one" onay soruyor, iptal edilirse düzenlemeler kalıyor; sayfadan çıkarken `beforeunload` uyarısı.
  - **Y7 (Önemli sayıldı) düzeltildi:** "Your details" kartı (ev sahibi adı + posta adresi, kayıtlardan bağımsız localStorage'da hatırlanır) ve kayıt başına "Tenant forwarding address". Mektupta gönderen bloğu, kiracı adresi, imza altında ad; eksikse önizlemede (baskıya çıkmayan) uyarı.
  - **Y1:** localStorage yüklenirken tarih formatı, tutarlar ve kesinti şekli doğrulanıyor; bozuk kayıt atlanıyor, uygulama çökmüyor. Eski kayıtlara `forwardingAddress: ""` ekleniyor.
  - **Y2:** uzun boşluksuz adlar listede/mektupta satır kırıyor (375px'te yatay kaydırma yok).
  - **Y3:** mektup `role="dialog"`; Escape kapatır, açılınca odak Print'e gider, Tab modal içinde döner, kapanınca odak "Create statement"a döner.
  - **Y4:** depozito zorunlu.
  - **Y5:** mobilde altta sabit özet çubuğu (son tarih + kalan gün + iade/alacak).
  - **Y6:** taşan girdi "Amount is too large." hatası veriyor.
- Yeni e2e: `validation.spec.ts`, `unsaved.spec.ts`, `letter-details.spec.ts`; yeni birim: `amount.test.ts`, `storage-validation.test.ts`.

## Sıradaki işler
- Tester review'ındaki yeni maddeler.
- Daha fazla eyalet (yalnızca resmi kaynağı doğrulanabilenler; Texas sayfası daha önce açılmadı).

## Bilinen sorunlar
- Arayüz etiketleri İngilizce: "Overdue" = süre geçti, "Due soon" = yaklaşıyor.
- Kaydedilmemiş düzenlemeler artık uyarıyla korunuyor ama taslak olarak saklanmıyor; kullanıcı uyarıyı onaylayıp yenilerse kaybolur.

## Yeniden açılış (2026-11-24)
`ready` kuralı sıkılaştırıldığı için yeniden açıldı ve kuyruğa (priority 1) geri kondu. Sıra gelince proje yeniden kurulmaz; `reviews/2026-11-23.md`'deki **Ö1** (negatif tutarlar) ve **Ö2** (kaydedilmemiş değişiklik kaybı) önce düzeltilir. Yeni kullanıcı yolculuğu kuralına göre **Y7** (mektupta ev sahibi adı/adresi ve kiracının yönlendirme adresi yok, mektup gönderilemez) de Önemli sayılır.

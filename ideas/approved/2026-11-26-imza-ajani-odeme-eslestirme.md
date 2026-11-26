---
slug: imza-ajani-odeme-eslestirme
found: 2026-11-26
category: fintech
source: auto
score: 3.67
priority: 3
---
# Serbest kredi imza noterleri için gelen ödeme ↔ iş eşleştirme

## Sorun
ABD'de kredi kapanış imzalarını serbest çalışan "signing agent" noterler onlarca farklı aracı şirketten iş alıyor; ödemeler farklı kanallardan (çek, toplu banka havalesi, ödeme platformları) ve çoğu zaman fatura numarası olmadan geliyor. Hangi ödemenin hangi işe ait olduğunu eşleştiremedikleri için bazı ödenmemiş işler gözden kaçıyor ve geç ödeyen şirketleri takip edemiyorlar.

## Kanıtlar
- https://forum.notarycafe.com/t/56833 (2026-06-14, "Fee Reconciliations") — "I have done almost 1000 loan signings now and have worked with 90-100 SS … I log everything on [bir noter iş takip uygulaması] and seem to have reached a point of being overwhelmed by tracking incoming payments and feel that some are slipping through the cracks." / aynı başlıkta (2026-06-17): "my bank account has no record of numbers that jive with my records so it was impossible to know who paid and for what order."
- https://forum.notarycafe.com/t/56833 — başka bir kullanıcı: "The only trouble I had with [aynı uygulama] was when a client paid a more current order first and [uygulama] applied the payment to the oldest order instead."
- https://forum.notarycafe.com/t/58616 (2026-10-29, "Logging jobs") — "I used to use a spreadsheet but that was too burdensome."
- https://www.nationalnotary.org/knowledge-center/signing-agent-resources/non-payment-issues (meslek birliği, tarih yok) — konuyu ayrı bir başlık olarak ele alıyor: "ensuring payment is made in a timely manner". Not: ilk üç kanıt aynı forumdan (farklı kullanıcılar ve başlıklar); bağımsız ikinci kaynak bu sayfa.

## Hedef kullanıcı
Ayda onlarca imza işi yapan, 20+ aracı şirketle çalışan ABD'li serbest noter/signing agent'lar.

## Mevcut çözümler ve eksikleri
- Noterlere özel iş/fatura takip uygulamaları — ~$9–40/ay (fiyatlar ikincil kaynaktan, doğrulanmadı: https://www.closewise.com/notarygadget-vs-notaryassist-vs-closewise-2026/ ; bir ürünün kendi fiyat sayfası: https://www.closewise.com/pricing) — iş kaydı ve vade takibi var; banka hesap hareketlerini (toplu/numarasız havaleler) işlere eşleştirme forumda sorun olarak anılıyor.
- Genel muhasebe yazılımları — faturalar gönderilmediği (aracı şirketler fatura istemiyor) için alacak takibi yapay kalıyor (https://forum.notarycafe.com/t/do-you-send-invoices/9976 , 2020: "most companies ask that you not send invoices").
- Kişisel Excel tabloları — forumda yaygın; elle giriş ve unutulan ödeme kaydı sorunu sürüyor.

## Kullanıcı notu

## Değerlendirme (2026-11-26)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR `fintech`: 512 toplam, 29 ≥$2K gelir, oran %5.7 (orta-zayıf sinyal; `pipeline/logs/2026-11-26-trustmrr.md`). Kanıtlar somut (~1000 imza, 90–100 şirket, "slipping through the cracks": https://forum.notarycafe.com/t/56833) ama çoğu tek forumdan; meslek birliği ödeme almama sorununu ayrı başlıkta ele alıyor (https://www.nationalnotary.org/knowledge-center/signing-agent-resources/non-payment-issues). |
| büyüme | 3 | İş hacmi faiz oranlarına bağlı; faiz düşüşü imza işini artırıyor (https://www.nationalnotary.org/notary-bulletin/blog/2025/10/why-lower-interest-rates-mean-more-work-for-notary-signing-agents-and-how-to-find-it). Mobil noter pazar raporları %6.7–18 YBBO arasında çelişkili (https://www.htfmarketintelligence.com/report/north-america-mobile-notary-public-market, https://www.marketresearch.com/LP-Information-Inc-v4134/Global-Mobile-Notary-Service-Growth-44928815/) → düşük güvenli, orta. |
| rekabet | 3 | Çok sayıda noter iş/gelir takip aracı var (ör. https://apps.apple.com/us/app/notaryassist/id1552293025, https://apps.apple.com/us/app/notarygadget/id1633651969, https://support.snapdocs.com/tracking-your-payments); ödendi/ödenmedi işareti ve hatırlatma yaygın, ancak aramada banka hareketi içe aktarıp işlere eşleştiren bir araç bulunamadı (veri yok). Kalabalık ama belirli boşluk var. |
| farklılaşma | 4 | Somut cevap: banka CSV'sini içe aktar, tutar + şirket + tarih yakınlığıyla aday işleri öner, toplu havaleyi birden çok işe böl, bilinçli olarak "en eskiye uygula" yapma (forumda şikâyet edilen davranış: https://forum.notarycafe.com/t/56833). Şirket bazında ortalama ödeme süresi raporu. |
| dağıtım | 4 | Hedef kitle yoğun ve erişilebilir topluluklarda toplanıyor (https://forum.notarycafe.com, NNA kaynakları); "signing agent payment tracking" türü SEO sorguları. |
| yapılabilirlik | 5 | Tarayıcıda CSV ayrıştırma + eşleştirme kuralları + CRUD; banka API'si gerekmez (CSV yükleme), harici ücretli API yok; ~10 günde yapılabilir. |

**Ortalama:** 3.67 — **Karar:** geçti

## MVP Kapsamı
### Çekirdek özellikler (3–5)
1. Kullanıcı imza işi (tarih, aracı şirket, sipariş no, ücret) ekleyip düzenleyebilir ve silebilir; her işin durumu ödenmedi / kısmen ödendi / ödendi olarak görünür.
2. Kullanıcı banka hesap hareketlerini CSV olarak yükleyebilir (tarih, açıklama, tutar sütunlarını kendisi eşler); yalnızca gelen (pozitif) hareketler eşleştirme listesine gelir.
3. Her gelen ödeme için uygulama, tutarı eşit olan ve tarihi ödemeden önceki ödenmemiş işleri aday olarak önerir; kullanıcı bir ödemeyi tek işe ya da (toplu havalede) birden çok işe tutar bölerek atayabilir.
4. Kullanıcı vadesi geçmiş (iş tarihinden X gün sonra hâlâ ödenmemiş, X ayarlanabilir) işleri aracı şirkete göre gruplanmış listede görür; şirket bazında ortalama ödeme süresi (gün) gösterilir.
5. Veriler tarayıcıda kalıcıdır ve JSON olarak dışa/içe aktarılabilir.
### Kapsam dışı
- Banka hesabına doğrudan bağlantı (Plaid vb.), OFX/QFX formatı
- Fatura oluşturma/gönderme, e-posta hatırlatma, çok kullanıcılı hesaplar
- Vergi/gider raporu, takvim/randevu yönetimi
### Kabul kriterleri
- "İş ekle" ile tarih, şirket, sipariş no ve 150 ücret girilince iş listede "ödenmedi" olarak görünür; düzenleme ve silme listeyi günceller.
- Üç satırlık (iki pozitif, bir negatif tutarlı) bir CSV yüklenip sütunlar eşlenince eşleştirme listesinde yalnızca iki gelen ödeme görünür.
- 150 tutarlı bir ödeme için, 150 ücretli ve ödemeden önce tarihli ödenmemiş iş aday olarak listelenir, 200 ücretli iş listelenmez; atama sonrası iş "ödendi" olur.
- 250 tutarlı bir ödeme 150 ve 100 ücretli iki işe bölünerek atanınca ikisi de "ödendi" olur; 250'nin yalnızca 150'si atanırsa ödemede "100 atanmamış" görünür. 200 ücretli işe 120 atanınca iş "kısmen ödendi" olur.
- Vade 30 gün ayarlıyken 45 gün önceki ödenmemiş iş "vadesi geçmiş" listesinde kendi şirketinin altında görünür; 10 gün önceki iş görünmez. İş tarihinden 20 gün sonra ödenen iki iş olan şirketin ortalama ödeme süresi 20 gün görünür.
- Veri girildikten sonra sayfa yenilenince veriler yerinde durur; JSON dışa aktarıp verileri temizledikten sonra içe aktarınca aynı veriler geri gelir.

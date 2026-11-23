---
slug: depozito-iade-hesaplama
found: 2026-11-23
category: real-estate
source: auto
score: 3.67
priority: 1
---
# Kiracı çıkışında depozito kesinti/iade hesabı ve yasal süre takibi

## Sorun
Az sayıda dairesi olan ev sahipleri kiracı çıkışında hasar, fatura ve faiz kesintilerini tablolarla hesaplıyor; hesap yavaş ve hataya açık. ABD eyaletlerinin çoğunda iade ve itemize kesinti listesi için kısa bir yasal süre var (genellikle 2–3 hafta, Kaliforniya’da 21 gün); süre bir gün bile kaçırılınca kiracı dava açabiliyor.

## Kanıtlar
- https://www.biggerpockets.com/forums/899/topics/1205182-advice-how-to-make-handling-security-deposits-easy — "We have just 5 properties, but with turnover each year, it is very time-consuming to figure out security deposit refunds" / "This just isn't quick and it is error prone." / "had to issue several adjustments after the fact"
- https://biggerpockets.com/forums/52/topics/688430-being-sued-by-tenant-for-security-deposit — (2019) "We did, however, fail to provide a full cost breakdown within the 21 day requirement (missed by one day)"
- https://www.biggerpockets.com/forums/52/topics/526766-tracking-tenant-deposits-and-refunds — (2018) "Do people just use a pencil and paper or is there specialized software for this?"
- https://www.nolo.com/legal-encyclopedia/chart-deadline-returning-security-deposits-29018.html — eyalet bazında iade süreleri tablosu (arama özetinden: çoğu eyalette "usually two to three weeks"; sayfa açılmadı, doğrulanmadı)

## Hedef kullanıcı
1–20 birimlik, profesyonel yönetici kullanmayan bireysel ev sahipleri (ABD).

## Mevcut çözümler ve eksikleri
- Tam kapsamlı mülk yönetim yazılımları — fiyat: veri yok (bu oturumda fiyat sayfası doğrulanmadı) — aynı başlıkta: "Capable PM software is complex, some of them you literally have to take classes."; birim başı fiyatlama şikâyeti: "doesn't charge by the unit which irks me" (526766).
- Muhasebe yazılımında yükümlülük hesabı olarak takip — muhasebe bilgisi gerektiriyor, kesinti mektubu ve süre hatırlatması yok.
- Satın alınan tablo şablonları (Etsy vb.) — tek seferlik düşük ücret — eyalet süresi, belge/fotoğraf eki ve itemize mektup üretimi yok.

## Değerlendirme (2026-11-23)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR real-estate: 18/200, oran %9.0 (oran orta, mutlak sayı düşük; pipeline/logs/2026-11-23-trustmrr.md). Dosyada 3 BiggerPockets başlığı, biri gün kaçırma yüzünden dava (688430); ikisi 2018–2019'dan, eski. |
| büyüme | 2 | Büyüme verisi yok; ihtiyaç kalıcı ama durağan (her kiracı çıkışında tekrar ediyor). |
| rekabet | 4 | Arama sonuçlarında yalnızca mektup şablonları ve rehberler çıkıyor (https://www.legalzoom.com/templates/t/landlord-security-deposit-return-letter, https://theclose.com/security-deposit-return-letter/, https://ipropertymanagement.com/templates/security-deposit-return-letter); süre takibi + hesap + mektubu birleştiren hafif bir araç bulunamadı. Tam mülk yönetim yazılımları bunu paketin içinde sunuyor olabilir (veri yok). |
| farklılaşma | 4 | Eyalet süresi geri sayımı + kalem kalem kesinti hesabı + itemize mektup tek ekranda; kaynaklar sürenin eyalete göre 14–60 gün arasında değiştiğini (https://findlaw.com/realestate/landlord-tenant-law/security-deposit-return-timelines.html) ve itemize listenin eksikliğinin tam iade zorunluluğu doğurabildiğini (https://www.nolo.com/legal-encyclopedia/security-deposits) gösteriyor. |
| dağıtım | 4 | BiggerPockets toplulukları ve "security deposit return letter" gibi yüksek niyetli SEO aramaları (yukarıdaki şablon sayfaları bu aramaya hizmet ediyor). |
| yapılabilirlik | 5 | Tarayıcıda çalışan hesap + kaynaklı eyalet süre tablosu + yazdırılabilir mektup; sunucu ve ücretli API gerekmez. |

**Ortalama:** 3.67 — **Karar:** geçti

## MVP Kapsamı
### Çekirdek özellikler (3–5)
1. Kullanıcı kiracı adını, depozito tutarını, çıkış tarihini ve eyaleti girer; uygulama o eyaletin yasal iade/itemize liste son tarihini ve kalan gün sayısını gösterir (her eyalet satırı resmi kaynağa linkli bir tablodan gelir; MVP'de en az 10 eyalet).
2. Kullanıcı kesinti kalemleri (açıklama + tutar; hasar, temizlik, ödenmemiş kira/fatura) ekleyip çıkarabilir; iade tutarı anında yeniden hesaplanır. Kesintiler depozitoyu aşarsa iade 0 ve kiracıdan alacak tutarı gösterilir. İsteğe bağlı elle girilen faiz tutarı iadeye eklenir.
3. Kullanıcı tek tıkla yazdırılabilir itemize kesinti mektubu üretir (depozito, çıkış tarihi, her kalem, toplam kesinti, faiz, iade/alacak tutarı).
4. Kullanıcı birden çok çıkış kaydını son tarihe göre sıralı bir listede görür; süresi 3 gün veya daha az kalanlar "yaklaşıyor", geçmiş olanlar "süre geçti" olarak işaretlenir. Veriler tarayıcıda saklanır, sayfa yenilenince kaybolmaz.
### Kapsam dışı
- Hukuki tavsiye (sayfada "hukuki tavsiye değildir, eyalet yasasını doğrulayın" uyarısı olur)
- Ödeme gönderme, e-posta/SMS gönderimi, kullanıcı hesabı ve sunucu
- Eyalete özgü otomatik faiz hesabı, şehir düzeyi kurallar, 50 eyaletin tamamı
- Fotoğraf yükleme ve mülk yönetimi özellikleri
### Kabul kriterleri
- Eyalet California, çıkış tarihi 2026-11-01 girildiğinde son tarih 2026-11-22 (21 gün) olarak gösterilir ve tablodaki kaynak linki görünür.
- Depozito $1500, kesintiler $200 (temizlik) + $150 (hasar) → iade $1150 gösterilir; $150'lik kalem silinince iade $1300 olur.
- Depozito $1500, kesinti toplamı $1800 → iade $0 ve "kiracıdan alacak: $300" gösterilir.
- Faiz alanına $12 girildiğinde iade $1162 olur (ilk örnekte).
- "Mektup oluştur" düğmesi tüm kalemleri, toplamları ve tarihleri içeren yazdırılabilir bir görünüm açar.
- Son tarihi farklı üç kayıt eklendiğinde liste son tarihe göre sıralanır; son tarihi geçmiş kayıt "süre geçti", 3 gün içindeki kayıt "yaklaşıyor" etiketi taşır; sayfa yenilendikten sonra kayıtlar duruyor.

---
slug: statik-site-icerik-duzenleme
found: 2026-11-24
category: no-code
source: auto
score: 3.50
priority: 1
---
# Statik küçük işletme sitelerinde metin/görsel düzenleme

## Sorun
Geliştiriciler (ve giderek yapay zekâyla site üreten yarı teknik kişiler) küçük işletmelere düz HTML/CSS statik siteler kurup ücretsiz barındırıyor. Ama site sahibi yılda birkaç kez bir başlığı değiştirmek ya da fotoğraf değiştirmek istediğinde Git/GitHub bilmediği için her seferinde geliştiriciye dönüyor; tam site kurucuya geçmek ise birkaç düzenleme için pahalı ve gereksiz.

## Kanıtlar
- https://news.ycombinator.com/item?id=50514154 (2026-11-16, Ask HN) — "my friends want to update the text and swap pictures. They don't know GitHub [...] Wix and Squarespace feel like overkill, and overpriced, for a few small edits a year." (yazar kendi bekleme listeli aracını yapıyor; taraflı)
- https://news.ycombinator.com/item?id=47652172 (2026-04-05) — "id be quite interested if someone would build a native editor that can be just hooked with git, so it would make it possible to run the site serverless."
- https://news.ycombinator.com/item?id=47389589 (2026-03-15, WordPress tarafı) — "you just want to change a headline, swap an image [...] or pay a developer $150 to move a button 20 pixels to the left?" (ürün tanıtımı; taraflı, ancak küçük düzenlemeler için ödenen bedeli gösteriyor)
- https://news.ycombinator.com/item?id=45119388 (2025-09-03) — ajanslar müşteri siteleri için Git tabanlı CMS kurulumunu elle yapılandırıyor: "Currently having 20+ sites running this setup for clients"

## Hedef kullanıcı
Küçük işletmelere statik site kuran serbest geliştiriciler ve küçük ajanslar (birden çok müşteri sitesi); dolaylı olarak teknik olmayan site sahipleri (kafe, usta, danışman, dernek).

## Mevcut çözümler ve eksikleri
- Git tabanlı ticari CMS'ler — https://cloudcannon.com/pricing/ — Standart $55/ay (yıllık $49/ay), Team $350/ay; birkaç yıllık düzenleme için küçük müşteriye pahalı ve site şablonunun CMS'e göre yapılandırılmasını istiyor.
- Açık kaynak Git tabanlı CMS'ler (Decap/Sveltia türü) — ücretsiz — yapılandırma dosyası, kimlik doğrulama ara katmanı ve içerik modelleme gerektiriyor; düz HTML sayfayı olduğu gibi düzenlemiyor.
- Barındırılan site kurucular — fiyat: veri yok (bu çalışmada fiyat sayfası açılmadı) — siteyi baştan o platformda yeniden kurmayı gerektiriyor; mevcut statik siteyi düzenlemiyor.
- WordPress için yapay zekâ düzenleme araçları — https://news.ycombinator.com/item?id=47389589 — $29–$199/ay (yazarın beyanı) — yalnızca WordPress siteleri.

## Değerlendirme (2026-11-24)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR no-code: 27/279, oran %9.7 (orta, %10'a yakın; pipeline/logs/2026-11-24-trustmrr.md). Dosyada 2025-09 ile 2026-11 arasında 4 ayrı HN kanıtı; biri ajansın 20+ müşteri sitesinde bu kurulumu elle yaptığını gösteriyor (https://news.ycombinator.com/item?id=45119388). |
| büyüme | 3 | Yapay zekâyla düz HTML site üretenlerin arttığı iddiası yalnızca HN anlatımına dayanıyor (https://news.ycombinator.com/item?id=50514154); ölçülmüş büyüme verisi yok. |
| rekabet | 3 | CloudCannon $49–$350/ay (dosyadaki fiyat sayfası), Pinegrow CMS son kullanıcı başına lisans istiyor (https://docs.pinegrow.com/docs/pinegrow-pro/cms/), wedit öğelerin önceden işaretlenmesini istiyor (https://github.com/sofmon/wedit); küçük kişisel projeler var (https://swill.github.io/gitqi/, https://github.com/krispo/git-edit) ama olgun, ucuz, yapılandırmasız bir seçenek görünmüyor. |
| farklılaşma | 4 | Somut cevap: mevcut düz HTML'i yapılandırma dosyası ya da etiketleme olmadan açıp yalnızca metin/görseli düzenlemek ve değişikliği doğrudan repoya commit'lemek; Decap/CloudCannon yapılandırma, Pinegrow kişi başı lisans istiyor (yukarıdaki kaynaklar). |
| dağıtım | 4 | Alıcı geliştirici/ajans: HN, Indie Hackers (aynı ihtiyacı soran başlık: https://www.indiehackers.com/post/is-there-already-a-way-to-upload-your-html-website-and-visually-edit-it-solved-ac770323a7) ve geliştirici toplulukları üzerinden doğrudan ulaşılabilir; bir geliştirici birden çok müşteri sitesi getirir. |
| yapılabilirlik | 4 | Tarayıcıda HTML ayrıştırma + yerinde düzenleme + dosya indirme ve GitHub'ın ücretsiz REST API'siyle commit tek kişiyle ~10 günde yapılabilir; HTML'i biçimini bozmadan geri yazma dikkat istiyor. |

**Ortalama:** 3.50 — **Karar:** geçti

## MVP Kapsamı
### Çekirdek özellikler (3–5)
1. Kullanıcı bir `.html` dosyası yükleyebilir (ya da hazır örnek siteyi açabilir); araç hiçbir yapılandırma istemeden başlıkları, paragrafları, bağlantı metinlerini ve görselleri düzenlenebilir olarak işaretler.
2. Kullanıcı önizlemede bir metne tıklayıp yerinde değiştirebilir; bir görsele tıklayıp bilgisayarından yeni bir görsel seçerek değiştirebilir.
3. Kullanıcı yaptığı değişikliklerin listesini (eski → yeni) görebilir ve tek tek geri alabilir.
4. Kullanıcı düzenlenmiş sayfayı indirebilir; indirilen dosyada yalnızca düzenlenen metin/görsel değişmiş, geri kalan HTML/CSS aynı kalmıştır.
5. Kullanıcı kendi GitHub token'ı, repo ve dosya yolunu girerek değişikliği doğrudan repoya commit'leyebilir (token yalnızca tarayıcı belleğinde tutulur, sunucuya gönderilmez).
### Kapsam dışı
- Düzen/CSS düzenleme, yeni bölüm ya da sayfa ekleme
- Kendi barındırma hizmeti, kullanıcı hesapları, ödeme
- GitHub dışındaki Git sağlayıcıları, çok sayfalı site gezinme
- Markdown/şablon motorlu statik site üreticileri (Hugo, Jekyll kaynak dosyaları)
### Kabul kriterleri
- "Örnek siteyi aç"a tıklayınca önizleme yüklenir; başlık, paragraf ve görsellerin üzerine gelince düzenlenebilir olduklarını gösteren bir vurgu çıkar.
- Bir başlığa tıklayıp metni "Yeni Başlık" yapınca önizleme anında güncellenir; bir görsele tıklayıp yerel bir PNG seçince önizlemedeki görsel değişir.
- İki değişiklik yapıldıktan sonra değişiklik listesinde 2 kayıt görünür; birinde "Geri al"a basınca önizleme o öğe için eski haline döner ve liste 1 kayda iner.
- "İndir"e basınca bir `.html` dosyası iner; dosyada "Yeni Başlık" metni bulunur, `<style>`/`<link>` etiketleri ve düzenlenmeyen öğeler orijinal dosyayla aynıdır.
- GitHub alanları boşken "Commit et"e basınca eksik alanları belirten bir hata mesajı görünür; geçersiz bir token girilince GitHub'ın reddettiğini (401) söyleyen anlaşılır bir mesaj görünür ve sayfa çökmez.

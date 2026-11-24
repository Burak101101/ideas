---
slug: statik-site-icerik-duzenleme
found: 2026-11-24
category: no-code
source: auto
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


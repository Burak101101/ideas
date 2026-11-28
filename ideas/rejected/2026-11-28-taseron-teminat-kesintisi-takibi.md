---
slug: taseron-teminat-kesintisi-takibi
found: 2026-11-28
category: fintech
source: auto
score: 3.00
---
# Küçük taşeronlar için teminat kesintisi (retainage) alacak takibi

## Sorun
ABD'de ana yüklenicilere çalışan küçük taşeronlardan her hakediş faturasında genellikle %5–10 teminat kesintisi (retainage) yapılıyor ve bu para iş bitene kadar tutuluyor. Genel muhasebe yazılımları bunu doğal olarak modellemediği için taşeronlar kesintileri günlük kayıt hileleri ve ayrı tablolarla izliyor; hangi işte ne kadar teminat beklediğini, ne zaman iade talep etmesi gerektiğini kaybediyor, nakit esaslı gelir raporları da yanlış çıkıyor.

## Kanıtlar
- https://quickbooks.intuit.com/community/reports-and-accounting-5/p-l-showing-contractor-retention-is-paid-when-it-has-not-yet-been-paid-54131 (muhasebe yazılımı topluluğu, 2024-01-18) — "always holds back 10% retention on every invoice until the entire job is completed." / "we have been over reporting our income on our tax returns." / "I think QB should fix in cash basis to show the real figure that was actually received in income."
- https://quickbooks.intuit.com/community/reports-and-accounting-5/contractor-retention-43747 (aynı topluluk, farklı kullanıcı, 2022-04-05) — "The problem with this is that the invoices show an open balance even after the retention is paid." / "an easier way to do this that will zero out the invoice balance?"
- https://community.getjobber.com/discussions/invoicing-getting-paid/how-to-do-holdbacks-in-jobber/15204 (başka bir saha hizmeti yazılımının topluluğu; HTTP 403, arama özetinden, **doğrulanmadı**) — kullanıcı ödeme planını bölüp son faturayı %10 teminat tutarına eşitleyerek ve serbest bırakılana kadar ödenmemiş bırakarak çözdüğünü anlatıyor.
- https://www.contractormag.com/management/news/55403190/subcontractors-are-still-financing-their-own-jobs-2026-survey-finds (sektör dergisi, 2026-09-04; anketi bir hakediş yazılımı şirketi yaptı, 492 katılımcı, Mayıs 2026) — "43% of subcontractors reported waiting more than 90 days to collect final payment and retainage." / "Nearly one in five subcontractors waits six months or more."
- https://www.siteline.com/blog/quickbooks-and-aia-billing-software (rakip satıcı blogu, 2026-07-23) — "Neither QuickBooks Online nor QuickBooks Enterprise Contractor includes a built-in AIA® G702®/G703® format" ve "retention calculations, waiver tracking" de yok; taşeronların teminatı "a separate line item that can be forgotten until closeout" ile izlediğini yazıyor.

## Hedef kullanıcı
Yılda birkaç milyon dolar altı ciroyla ana yüklenicilere çalışan ABD'li küçük taşeronlar (elektrik, mekanik, alçıpan, boya vb.) ve onların serbest muhasebecileri.

## Mevcut çözümler ve eksikleri
- İnşaat hakediş (AIA pay app) yazılımları — ör. https://www.siteline.com (fiyat sayfası açıkça rakam vermiyor: veri yok), https://knowify.com/resources/quickbooks-retainage/ — tam hakediş formu ve onay akışı odaklı; birkaç işi olan küçük taşeron için ağır ve pahalı olabilir (fiyat doğrulanmadı).
- Genel muhasebe yazılımları — retainage için yerleşik modül yok, hesap planı/günlük kaydı geçici çözümleri gerekiyor (yukarıdaki topluluk başlıkları; https://liveflow.com/blog/retainage-accounting-in-quickbooks-online-the-complete-workaround-guide-for-contractors).
- Saha hizmeti yazılımları — "holdback" alanı yok, ödeme planı bölme hilesi (Jobber topluluğu).
- Excel — iş başına kesinti, iade koşulu (iş bitimi/kabul), iade talep tarihi ve haciz (lien) süresi elle izleniyor.

## Kullanıcı notu

## Değerlendirme (2026-11-28)
| Kriter | Puan | Gerekçe + kaynak |
|---|---|---|
| talep | 3 | TrustMRR `fintech`: 517 toplam, 29 ≥$2K gelir, oran %5.6 (orta-zayıf; `pipeline/logs/2026-11-28-trustmrr.md`). Kanıt güçlü ve güncel: iki ayrı muhasebe topluluğu başlığı (2022, 2024) ve 492 katılımcılı anket — "43% … waiting more than 90 days to collect final payment and retainage" (https://www.contractormag.com/management/news/55403190/subcontractors-are-still-financing-their-own-jobs-2026-survey-finds; anketi bir hakediş yazılımı şirketi yaptı). |
| büyüme | 3 | Alana özel büyüme verisi yok; inşaat ruhsat hacmi yatay (https://www.census.gov/construction/nrc/pdf/newresconst_202609.pdf). Yeni girişler var (yakın zamanda açılmış düz ücretli taşeron muhasebe aracı: https://marginlock.pages.dev/resources/best/best-construction-accounting-software-small-business) → ilgi var, ölçülebilir trend yok. |
| rekabet | 2 | Retainage'ı açıkça hedefleyen çok sayıda araç ve 2026 karşılaştırma listesi: hakediş yazılımları (https://www.siteline.com/blog/best-construction-billing-software-for-subcontractors), inşaat faturalama araçları (https://agiled.app/blog/best-invoicing-software-for-construction), taşeron muhasebe araçları (https://constructioncoverage.com/software/accounting/best-for-subcontractors), Knowify ~$99 (https://www.cloudwards.net/subcontractor-management-software/). Küçük taşeron için düz ücretli retainage aracı da artık var (MarginLock, yukarıda). |
| farklılaşma | 3 | Yalnızca teminat defteri (iş başına tutulan/iade edilen, iade talep tarihi, nakit esaslı gerçek gelir) basit ve ucuz bir açı; ama yukarıdaki araçlar retainage + WIP'i zaten kapsıyor, muhasebe yazılımıyla entegrasyon olmadan ikinci bir kayıt yeri gerektiriyor. |
| dağıtım | 3 | Hedef kitle muhasebe yazılımı topluluklarında ve serbest muhasebeciler üzerinden erişilebilir (https://quickbooks.intuit.com/community/reports-and-accounting-5/contractor-retention-43747), ancak SEO alanı rakip satıcı bloglarıyla dolu (https://www.siteline.com/blog/quickbooks-and-aia-billing-software, https://liveflow.com/blog/retainage-accounting-in-quickbooks-online-the-complete-workaround-guide-for-contractors). |
| yapılabilirlik | 4 | İş/fatura/kesinti CRUD + hesaplar tarayıcıda ~10 günde yapılabilir; eyalete göre değişen iade/haciz süreleri doğru modellenmezse yanlış yönlendirir, bu yüzden kullanıcı girişine bırakılmalı. |

**Ortalama:** 3.00 — **Karar:** kaldı

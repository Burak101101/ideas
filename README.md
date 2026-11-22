# ideas

Her gün kendiliğinden çalışan bir fikir → MVP hattı. Dört bulut ajanı (İstanbul saati):

1. **07:10 Araştırmacı:** Hacker News ve web aramasından, insanların para ödemeye hazır olduğu sorunları bulur → `ideas/inbox/`
2. **09:10 Değerlendirici:** TrustMRR kategori verisi (API, toplu) + web kanıtıyla puanlar, öncelik kuyruğu kurar → `ideas/approved/`
3. **11:10 Geliştirici:** Tek aktif MVP'yi geliştirir; her gün tester'ın son review'ıyla başlar → `mvps/<slug>/`
4. **15:10 Tester:** MVP'yi kurar, tarayıcıda dener, review yazar ve bitti kararını verir → `mvps/<slug>/reviews/`

## Elle fikir eklemek
`ideas/inbox/` içine herhangi bir adla kısa bir not bırak (ör. `ideas/inbox/not.md`: "Küçük klinikler randevu hatırlatmasını hâlâ elle yapıyor"). Ertesi sabah araştırmacı tamamlar, değerlendirici puanlar.

## Ajan talimatlarını değiştirmek
`pipeline/prompts/*.md` dosyalarını düzenle; zamanlanmış görevler her çalışmada bu dosyaları okur. Ortak kurallar `CLAUDE.md`'de.

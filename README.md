# 🎵 SpotAI - AI Songwriting Companion

<div align="center">

![SpotAI Banner](https://img.shields.io/badge/SpotAI-Songwriting%20Assistant-1ed760?style=for-the-badge&logo=spotify&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Results](https://img.shields.io/badge/Optimization-Suno%20AI-FF6F61?style=for-the-badge)

**Gemini AI ile hayalindeki şarkıyı saniyeler içinde tasarla.**
*Design your dream song in seconds with Gemini AI.*

[Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [Teknolojiler](#-teknolojiler) • [Katkıda Bulunma](#-katkıda-bulunma)

</div>

---

## 📖 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Arayüz & Tasarım](#-arayüz--tasarım)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Teknik Detaylar](#-teknik-detaylar)
- [Sorun Giderme](#-sorun-giderme)
- [Yol Haritası](#-yol-haritası)
- [Lisans](#-lisans)

---

## 🎯 Hakkında

**SpotAI**, müzik üretimi için **Suno AI** gibi platformları kullanan yaratıcılar için geliştirilmiş, **Spotify** arayüzünden ilham alan modern bir yapay zeka asistanıdır.

Google'ın en yeni **Gemini 2.0 Flash** modelini kullanarak, sadece birkaç kelimelik fikrinizden:
*   ✨ Suno için optimize edilmiş **Müzik Tarzı (Style Tags)**
*   📝 Şarkı yapısına uygun **Tam Şarkı Sözleri (Lyrics)**
*   🏷️ Akılda kalıcı **Şarkı Başlıkları (Titles)**

üretir. Karmaşık prompt mühendisliği ile uğraşmanıza gerek kalmadan, profesyonel sonuçlar almanızı sağlar.

---

## ✨ Özellikler

### 🤖 Güçlü AI Motoru
- **Çoklu Model Desteği:** Gemini 2.0 Flash, Pro ve Lite modelleri arasında otomatik geçiş.
- **Suno Optimizasyonu:** Suno'nun en iyi anladığı formatta çıktı üretimi (`[Verse]`, `[Chorus]`, vs.).
- **Yaratıcı Başlıklar:** Şarkının moduna uygun otomatik isim önerisi.

### 🎨 Premium Arayüz
- **Dark Mode:** Göz yormayan, şık ve profesyonel siyah/gri tonlar.
- **Responsive Tasarım:** Mobil, tablet ve masaüstünde kusursuz deneyim.
- **İnteraktif Elementler:** Hover efektleri, animasyonlu geçişler ve "Player" kontrolleri.

### 🚀 Kullanım Kolaylığı
- **Tek Tıkla Kopyalama:** Başlık, Stil ve Sözleri ayrı ayrı kopyalama imkanı.
- **Suno Entegrasyonu:** "Create in Suno" butonu ile direkt üretim sayfasına geçiş.
- **Akıllı Hata Yönetimi:** API kotalarını ve hataları otomatik yöneten sağlam altyapı.

---

## 🎨 Arayüz & Tasarım

SpotAI, kullanıcı deneyimini (UX) ön planda tutar:

| Bileşen | Açıklama |
|---------|----------|
| **Sol Sidebar** | Navigasyon ve playlist simülasyonu (Kapalıyız modalı ile eğlenceli etkileşim). |
| **Ana Alan** | Şarkı oluşturma inputs, örnek kartlar (Neon City, Midnight Rain vb.) ve sonuç ekranı. |
| **Player Bar** | Alt kısımda tamamen CSS/SVG ile çizilmiş, interaktif görünümlü oynatıcı kontrolleri. |
| **Settings** | API anahtarınızı güvenle girebileceğiniz, localStorage kullanan ayarlar menüsü. |

---

## 📦 Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
- Git
- Python 3.8+ (Basit sunucu için) veya herhangi bir web sunucusu
- Modern bir web tarayıcısı

### Adım 1: Projeyi Klonlayın
```bash
git clone https://github.com/the91455/spotai-web.git
cd spotai-web
```

### Adım 2: Sunucuyu Başlatın
Python ile basit bir sunucu başlatarak projeyi ayağa kaldırabilirsiniz:

```bash
python3 server.py
# Veya standart modül ile:
python3 -m http.server 8080
```

### Adım 3: Tarayıcıda Açın
```
http://localhost:8080
```
adresine gidin.

### Adım 4: API Anahtarını Girin
1. Sağ üstteki **API** butonuna tıklayın.
2. [Google AI Studio](https://aistudio.google.com/app/apikey)'dan aldığınız ücretsiz API anahtarını girin.
3. "Save Key" diyerek kaydedin.

---

## 🚀 Kullanım

1. **Fikrini Yaz:** "Create Your Hit" alanına şarkı fikrini gir (Örn: *"Cyberpunk şehrinde geçen hüzünlü bir aşk hikayesi, synthwave türünde"*).
2. **Generate'e Bas:** Yapay zekanın sihrini konuşturmasını bekle.
3. **Sonuçları İncele:**
   - **Title:** Şarkı ismini kopyala.
   - **Style:** Suno'nun "Style of Music" kutusuna yapıştır.
   - **Lyrics:** "Lyrics" kutusuna yapıştır.
4. **Suno'da Üret:** "Create in Suno" butonuna bas ve hit şarkını oluştur!

*İpucu: Ne yazacağını bilmiyorsan, giriş alanının yanındaki "Surprise Me" butonunu (veya komutunu) kullanarak rastgele bir fikir alabilirsin!*

---

## 🛠 Teknolojiler

Bu proje, modern web teknolojileri kullanılarak "hafif ve hızlı" olacak şekilde tasarlanmıştır:

- **HTML5 & CSS3:** Grid ve Flexbox yapıları, CSS değişkenleri, özel animasyonlar.
- **Vanilla JavaScript (ES6+):** Framework bağımlılığı olmadan saf performans. `fetch` API, `Async/Await`, `LocalStorage`.
- **Google Gemini API:** Metin üretimi ve yaratıcı içerik oluşturma.
- **SVG:** Tüm ikonlar (Play, Pause, Shuffle vb.) vektörel olarak kod içinde tanımlıdır, ekstra kütüphane gerektirmez.

---

## 🐛 Sorun Giderme

### API Hatası Alıyorum
- API anahtarınızın doğru olduğundan ve [Google AI Studio](https://aistudio.google.com/)'da aktif olduğundan emin olun.
- Kota sınırına (Rate Limit) takılmış olabilirsiniz, biraz bekleyip tekrar deneyin.

### "Kapalıyız" Uyarısı Çıkıyor
- Yan menüdeki bazı özellikler (Kitaplık, Playlist oluşturma vb.) şu an sadece görsel amaçlıdır (UI Demo). Bu özelliklere tıkladığınızda çıkan uyarı kasıtlıdır.

### Arayüz Düzgün Görünmüyor
- Tarayıcınızın güncel olduğundan emin olun. Proje modern CSS özelliklerini kullanır.

---

## 🗺️ Yol Haritası

- [x] Temel Arayüz ve Tasarım
- [x] Gemini API Entegrasyonu
- [x] Suno Formatında Çıktı Üretimi
- [x] Responsive Uyumluluk
- [ ] Geçmiş (History) Özelliği
- [ ] Favori Şarkı Fikirlerini Kaydetme
- [ ] Çoklu Dil Desteği (TR/EN)

---

## 📄 Lisans

Bu proje **GNU General Public License v3.0 (GPL-3.0)** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

GPL-3.0, açık kaynak yazılımlar için en güçlü "copyleft" lisansıdır ve şunları garanti eder:
- ✅ Kaynak kodunu özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz
- ✅ Türev çalışmaların da GPL-3.0 ile lisanslanması zorunludur
- ✅ Patent hakları kullanıcılara açıkça verilir

---

## 👨‍💻 Yapımcı Bilgileri

**A VİBE CODER**
**İsim**: [Glass]  
**GitHub**: [@the91455](https://github.com/the91455)  
**Email**: the91455@tutamail.com

---

## 🙏 Teşekkürler

- [Google Gemini](https://ai.google.dev/) - Güçlü AI modeli için
- [Spotify](https://spotify.com/) - İlham veren arayüz tasarımı için
- [Suno AI](https://suno.com/) - Müzik üretim devrimi için

---

<div align="center">

### ⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

**Made with ❤️ and 🤖 AI**

[⬆ Başa Dön](#-spotai---ai-songwriting-companion)

</div>

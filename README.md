# Oxford 3000™ Kelime Öğrenme Platformu

Modern ve etkileşimli bir İngilizce kelime öğrenme platformu. Oxford 3000™ kelime listesini kullanarak İngilizce kelime dağarcığınızı geliştirmenize yardımcı olur.

## 🌟 Özellikler

### 1. Kelime Öğrenme
- **Oxford 3000™ Kelime Listesi**: En sık kullanılan ve önemli 3000 İngilizce kelime
- **CEFR Seviyeleri**: A1'den C1'e kadar seviyelendirilmiş kelimeler
- **Detaylı Kelime Kartları**: 
  - Telaffuz
  - Türkçe anlamlar
  - Örnek cümleler
  - Kelime türü bilgisi
  - Öğrenme durumu takibi

### 2. Sınav Sistemi
- **Özelleştirilebilir Sınavlar**:
  - Soru sayısı seçimi (10-100 arası)
  - Zorluk seviyesi seçimi (A1-C1)
  - Kelime havuzu seçimi (Öğrenilen/Tüm kelimeler)
  - Farklı soru tipleri:
    - Çoktan seçmeli
    - Cümle tamamlama
    - Telaffuz
    - Örnek eşleştirme

- **Detaylı Analiz**:
  - Seviye bazlı performans analizi
  - Kelime türü bazlı analiz
  - Doğru/yanlış istatistikleri
  - Süre takibi
  - Kişiselleştirilmiş öneriler

### 3. İlerleme Takibi
- Öğrenilen kelime sayısı
- Seviye bazlı ilerleme
- Başarı oranları
- Öğrenme istatistikleri

## 🛠 Teknik Detaylar

### Kullanılan Teknolojiler

#### Frontend
- **React 18.3.1**: Modern UI geliştirme
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Vite**: Hızlı geliştirme ve build süreci
- **TailwindCSS**: Özelleştirilebilir UI tasarımı
- **Lucide Icons**: Modern ikonlar

#### State Yönetimi
- Context API
- Custom Hooks
- Reducer Pattern

### Proje Yapısı

```
src/
├── components/         # Genel UI bileşenleri
├── exam/              # Sınav sistemi
│   ├── components/    # Sınav bileşenleri
│   ├── context/      # Sınav state yönetimi
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Sınav sayfaları
│   ├── types/        # TypeScript tipleri
│   └── utils/        # Yardımcı fonksiyonlar
├── data/             # Oxford 3000 kelime verileri
├── styles/           # CSS stilleri
└── utils/            # Genel yardımcı fonksiyonlar
```

### Önemli Bileşenler

#### 1. QuizPage
- Sınav başlatma
- Soru gösterimi
- Sonuç analizi
- İlerleme takibi

#### 2. WordCard
- Kelime detayları
- Telaffuz desteği
- Öğrenme durumu
- Örnek cümleler

#### 3. ContentSection
- Kelime listesi görünümü
- Seviye filtreleme
- Arama fonksiyonu
- Sayfalama

### Stil Sistemi

#### CSS Organizasyonu
```
styles/
├── base.css          # Temel stiller
├── components/       # Bileşen stilleri
├── layout.css        # Layout stilleri
├── pages/           # Sayfa özel stilleri
└── utils/           # Yardımcı stiller
```

#### Tema Renkleri
- Primary: #081C9E
- Navy: #00124F
- Gradient: Navy -> Primary
- Nötr: #8D93A5

### Performans Optimizasyonları

1. **Kod Bölme**
   - Lazy loading
   - Dinamik imports
   - Route-based code splitting

2. **Veri Yönetimi**
   - Memoization
   - Debouncing
   - Önbellek stratejileri

3. **Asset Optimizasyonu**
   - Lazy image loading
   - SVG ikonlar
   - Minifikasyon

## 🚀 Kurulum

```bash
# Depoyu klonla
git clone [repo-url]

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## 🔧 Yapılandırma

### Vite Yapılandırması
```javascript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### Tailwind Yapılandırması
```javascript
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'bs-primary': '#081C9E',
        'bs-navy': '#00124F',
        // ...diğer renkler
      }
    }
  }
}
```

## 📱 Responsive Tasarım

- Mobile-first yaklaşım
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 🎯 Özellik Detayları

### Sınav Sistemi

#### Soru Tipleri
1. **Çoktan Seçmeli**
   - 4 seçenek
   - Anlam eşleştirme
   - Anında geri bildirim

2. **Cümle Tamamlama**
   - Bağlam içinde kelime kullanımı
   - Örnek cümle bazlı
   - Boşluk doldurma

3. **Telaffuz**
   - Ses dosyası dinleme
   - Kelime seçimi
   - IPA gösterimi

4. **Örnek Eşleştirme**
   - Cümle içinde kelime bulma
   - Bağlam anlama
   - Kullanım örnekleri

#### Analiz Sistemi
- Seviye bazlı performans
- Kelime türü analizi
- Zaman analizi
- Öneriler sistemi

### Kelime Kartı Sistemi

#### Özellikler
- Telaffuz desteği
- Örnek cümleler
- Türkçe anlamlar
- Öğrenme durumu
- Seviye gösterimi

#### İnteraktif Öğeler
- Ses çalma
- Öğrenildi işaretleme
- Animasyonlar
- Hover efektleri

## 🔒 Güvenlik

- Input sanitization
- XSS koruması
- Rate limiting
- Error handling

## 🤝 Katkıda Bulunma

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- Oxford University Press
- React Topluluğu
- Vite Ekibi
- TailwindCSS Ekibi
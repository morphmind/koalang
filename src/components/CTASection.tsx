import React from 'react';
import { useAuth } from '../modules/auth/context/AuthContext';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { 
  Brain, 
  Target, 
  Zap,
  ChevronRight,
  BookOpen,
  BarChart3,
  Sparkles,
  Trophy,
  Lightbulb,
  Globe2,
  Layers,
  Rocket,
  GraduationCap,
  Headphones,
  Gauge,
  Puzzle,
  LineChart,
  Laptop
} from 'lucide-react';

export const CTASection: React.FC = () => {
  const { user } = useAuth();
  const { openAuthPopup } = useAuthPopup();

  const handleGetStarted = () => {
    if (!user) {
      openAuthPopup();
    }
  };

  // Oxford Araştırma İstatistikleri
  const researchStats = [
    {
      icon: BookOpen,
      title: '2 Milyar+',
      description: 'Analiz Edilen Kelime',
      detail: 'Oxford English Corpus veritabanında analiz edilen toplam kelime sayısı'
    },
    {
      icon: Target,
      title: '%85',
      description: 'Kapsama Oranı',
      detail: 'İngilizce metinlerin %85\'ini anlayabilmek için gereken kelime oranı'
    },
    {
      icon: GraduationCap,
      title: '30+',
      description: 'Yıllık Araştırma',
      detail: 'Oxford Üniversitesi\'nin kelime seçimi üzerine yaptığı araştırma süresi'
    },
    {
      icon: Globe2,
      title: '190+',
      description: 'Ülke',
      detail: 'Oxford 3000 ve 5000 kelime listelerinin kullanıldığı ülke sayısı'
    }
  ];

  // Uygulama Özellikleri
  const appFeatures = [
    {
      icon: Brain,
      title: 'Yapay Zeka Destekli Öğrenme',
      description: 'Kişiselleştirilmiş öğrenme deneyimi ve akıllı kelime önerileri'
    },
    {
      icon: Headphones,
      title: 'Telaffuz Desteği',
      description: 'Her kelime için profesyonel telaffuz ve örnek cümleler'
    },
    {
      icon: Gauge,
      title: 'Seviye Takibi',
      description: 'CEFR (A1-C1) seviyelerine göre ilerleme takibi'
    },
    {
      icon: Puzzle,
      title: 'İnteraktif Sınavlar',
      description: 'Farklı soru tipleriyle öğrenme durumunuzu test edin'
    },
    {
      icon: LineChart,
      title: 'Detaylı Analizler',
      description: 'Öğrenme performansınızı görsel grafiklerle takip edin'
    },
    {
      icon: Laptop,
      title: 'Çoklu Platform',
      description: 'Tüm cihazlarınızdan kesintisiz erişim imkanı'
    }
  ];

  return (
    <>
      {/* Oxford Araştırma Bölümü */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bs-navy via-bs-primary to-bs-800 py-24 rounded-3xl">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        
        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full 
                         bg-white/10 text-white/90 text-sm font-medium backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
              <span>Oxford Üniversitesi Araştırması</span>
            </div>
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
              30 Yıllık Bilimsel{' '}
              <span className="relative">
                <span className="relative z-10">Araştırma</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-bs-primary/30 
                              -skew-x-12 -z-10" />
              </span>
            </h2>
            <p className="text-lg text-white/80">
              Oxford English Corpus'tan elde edilen 2 milyar kelimelik veri analizi sonucunda, 
              günlük hayatta en sık kullanılan ve en önemli kelimeler belirlendi.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {researchStats.map((stat) => (
              <div key={stat.title} 
                   className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-8
                            hover:-translate-y-1 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center
                               group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{stat.title}</div>
                    <div className="text-sm text-white/80">{stat.description}</div>
                  </div>
                </div>
                <p className="text-sm text-white/60">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uygulama Özellikleri Bölümü */}
      <section className="relative overflow-hidden bg-white py-24 rounded-3xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-bs-50 via-white to-bs-50/30" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full 
                     bg-gradient-to-br from-bs-primary/5 to-bs-800/5 blur-3xl
                     animate-float-slow opacity-60 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full 
                     bg-gradient-to-br from-bs-800/5 to-bs-primary/5 blur-3xl
                     animate-float-slow-reverse opacity-40 translate-y-1/2 -translate-x-1/2" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full 
                         bg-bs-primary/10 text-bs-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Akıllı Öğrenme Platformu</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-bs-navy sm:text-5xl mb-6">
              Modern Teknoloji ile{' '}
              <span className="bg-gradient-to-r from-bs-primary to-bs-800 bg-clip-text text-transparent">
                Kolay Öğrenme
              </span>
            </h2>
            <p className="text-lg leading-8 text-bs-navygri">
              Yapay zeka destekli öğrenme sistemi, interaktif sınavlar ve detaylı analizlerle 
              İngilizce kelime haznenizi geliştirin.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {appFeatures.map((feature) => (
                <div key={feature.title} 
                     className="relative overflow-hidden rounded-2xl border border-bs-100 p-8
                              hover:border-bs-primary hover:shadow-xl transition-all 
                              hover:-translate-y-1 group flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-bs-50 flex items-center justify-center
                                 group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <feature.icon className="w-6 h-6 text-bs-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-bs-navy mb-2">{feature.title}</h3>
                    <p className="text-bs-navygri">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 flex items-center justify-center gap-x-6">
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r 
                     from-bs-primary to-bs-800 px-8 py-4 text-white shadow-lg shadow-bs-primary/20
                     hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Hemen Başla
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold leading-6 text-bs-primary hover:text-bs-800"
            >
              Oxford Araştırması Hakkında <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
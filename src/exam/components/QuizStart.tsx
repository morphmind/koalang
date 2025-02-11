import React, { useState } from 'react';
import { QuizSettings } from '../types';
import {
  BookOpen,
  GraduationCap,
  Clock,
  CheckCircle2,
  BookMarked,
  Library,
  ArrowRight,
  ChevronLeft,
  Layout,
  FileText,
  GitCompare,
  Volume2
} from 'lucide-react';

interface QuizStartProps {
  learnedWordsCount: number;
  onStart: (settings: QuizSettings) => void;
}

const QuizStart: React.FC<QuizStartProps> = ({ learnedWordsCount, onStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState<QuizSettings>({
    questionCount: 10,
    difficulty: 'mixed',
    questionTypes: ['multiple-choice', 'sentence-completion', 'pronunciation', 'example-matching'],
    wordPool: 'learned'
  });

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleStart = () => {
    onStart(settings);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className={`flex items-center ${step !== 4 ? 'w-20 sm:w-24' : ''}`}>
          <div
            className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center font-medium text-xs sm:text-sm ${
              currentStep >= step ? 'bg-bs-primary text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step}
          </div>
          {step !== 4 && (
            <div className={`flex-1 h-0.5 mx-1 ${currentStep > step ? 'bg-bs-primary' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto overflow-y-auto max-h-[calc(100vh-200px)] px-4 sm:px-6 md:px-0">
      {/* Başlık */}
      <div className="text-center mb-12 px-2 sm:px-0">
        <div>
          {/* Mobilde başlık boyutunu küçülttük: text-2xl sm:text-4xl */}
          <h2 className="text-2xl sm:text-4xl font-bold text-bs-navy mb-4 bg-clip-text text-transparent bg-gradient-to-r from-bs-navy via-bs-primary to-bs-800 leading-relaxed">
            Kelime Bilgini Test Et
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg text-bs-navygri">
            {settings.wordPool === 'learned' ? (
              <>
                <span>Öğrendiğin</span>
                <div className="px-2 sm:px-3 py-1 bg-bs-50 text-bs-primary rounded-full font-semibold">
                  {learnedWordsCount} kelime
                </div>
                <span>üzerinden kendini test et</span>
              </>
            ) : (
              <>
                <span>Tüm</span>
                <div className="px-2 sm:px-3 py-1 bg-bs-50 text-bs-primary rounded-full font-semibold">
                  3000 kelime
                </div>
                <span>üzerinden kendini test et</span>
              </>
            )}
          </div>
        </div>
      </div>

      {renderStepIndicator()}

      {/* STEP 1: Kelime Havuzu */}
      <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-lg">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 flex items-center justify-center shadow-lg shadow-bs-primary/20">
              <Library className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            {/* Mobilde ortalama için text-center, sm: ile sola hizalama */}
            <div className="flex-1 pt-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-bs-navy mb-1">Kelime Havuzu</h3>
              <p className="text-xs sm:text-sm text-bs-navygri leading-relaxed">
                Hangi kelimelerden sınav olmak istersin?
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <button
              className={`relative p-4 sm:p-6 rounded-2xl border transition-all group overflow-hidden ${
                settings.wordPool === 'learned'
                  ? 'border-bs-primary bg-gradient-to-br from-bs-50 to-white shadow-lg'
                  : 'border-gray-200 hover:border-bs-primary hover:shadow-lg'
              }`}
              onClick={() => setSettings({ ...settings, wordPool: 'learned' })}
            >
              <div className="relative z-10 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:items-start gap-2 sm:gap-4 mb-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <BookMarked className="w-5 sm:w-6 h-5 sm:h-6 text-bs-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-bs-navy mb-1">Öğrendiğim Kelimeler</h4>
                    <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      <span className="text-lg sm:text-2xl font-bold text-bs-primary">{learnedWordsCount}</span>
                      <span className="text-xs sm:text-sm text-bs-navygri">kelime</span>
                    </div>
                  </div>
                </div>
                {/* Mobilde pl-0, sm:pl-8 */}
                <div className="text-xs sm:text-sm text-bs-navygri pl-0 sm:pl-8">
                  Sadece öğrendiğin kelimelerden sınav ol ve bilgini test et.
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-bs-primary/5 to-transparent rounded-full blur-3xl -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 group-hover:translate-x-16 transition-transform duration-500" />
            </button>

            <button
              className={`relative p-4 sm:p-6 rounded-2xl border transition-all group overflow-hidden ${
                settings.wordPool === 'all'
                  ? 'border-bs-primary bg-gradient-to-br from-bs-50 to-white shadow-lg'
                  : 'border-gray-200 hover:border-bs-primary hover:shadow-lg'
              }`}
              onClick={() => setSettings({ ...settings, wordPool: 'all' })}
            >
              <div className="relative z-10 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:items-start gap-2 sm:gap-4 mb-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Library className="w-5 sm:w-6 h-5 sm:h-6 text-bs-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base sm:text-lg text-bs-navy mb-1">Tüm Kelimeler</h4>
                    <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                      <span className="text-lg sm:text-2xl font-bold text-bs-primary">3000</span>
                      <span className="text-xs sm:text-sm text-bs-navygri">kelime</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-bs-navygri pl-0 sm:pl-8">
                  Oxford 3000™ listesindeki tüm kelimelerden sınav ol.
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-bs-primary/5 to-transparent rounded-full blur-3xl -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 group-hover:translate-x-16 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: Soru Sayısı */}
      <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
        <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center gap-4 sm:gap-6 mb-6">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 flex items-center justify-center shadow-lg shadow-bs-primary/20">
              <BookOpen className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-bs-navy mb-1">Soru Sayısı</h3>
              <p className="text-xs sm:text-base text-bs-navygri leading-relaxed">
                Kaç soru çözmek istersin?
              </p>
            </div>
          </div>
          {/* Question Count Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {[10, 20, 30, 40, 50, 100].map(count => (
              <button
                key={count}
                className={`relative p-4 sm:p-6 rounded-xl border transition-all group overflow-hidden ${
                  settings.questionCount === count
                    ? 'border-bs-primary bg-gradient-to-br from-bs-50 to-white shadow-lg'
                    : 'border-gray-200 hover:border-bs-primary hover:shadow-lg'
                }`}
                onClick={() => setSettings({ ...settings, questionCount: count })}
              >
                <div className="relative z-10 text-center">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <div className={`text-lg sm:text-3xl font-bold ${settings.questionCount === count ? 'text-bs-primary' : 'text-bs-navy'}`}>
                      {count}
                    </div>
                    <div className="text-xs sm:text-sm text-bs-navygri">
                      {count === 10 && 'Hızlı Test'}
                      {count === 20 && 'Kısa Test'}
                      {count === 30 && 'Normal Test'}
                      {count === 40 && 'Uzun Test'}
                      {count === 50 && 'Detaylı Test'}
                      {count === 100 && 'Tam Test'}
                    </div>
                    <div className="text-[10px] sm:text-xs text-bs-navygri opacity-75">
                      ~{Math.round(count * 0.5)} dakika
                    </div>
                  </div>
                  {settings.questionCount === count && (
                    <div className="absolute -bottom-1 -left-1 -right-1 h-1 bg-gradient-to-r from-bs-primary to-bs-800" />
                  )}
                </div>
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-bs-primary/5 to-transparent rounded-full blur-3xl -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 group-hover:translate-x-16 transition-transform duration-500" />
              </button>
            ))}
          </div>
          {/* Info Text */}
          <div className="mt-6 p-4 bg-bs-50 rounded-xl text-xs sm:text-sm text-bs-navygri">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-bs-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-bs-primary" />
              </div>
              <p className="leading-relaxed">
                Her soru için ortalama 30 saniye süre önerilir. Seçtiğin soru sayısına göre tahmini süre yukarıda belirtilmiştir.
                Süre sınırı yoktur, kendi hızınla ilerleyebilirsin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: Zorluk Seviyesi */}
      <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
        <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center gap-4 sm:gap-6 mb-6">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 flex items-center justify-center shadow-lg shadow-bs-primary/20">
              <GraduationCap className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-bs-navy mb-1">Zorluk Seviyesi</h3>
              <p className="text-xs sm:text-base text-bs-navygri leading-relaxed">
                Hangi seviyede test olmak istersin?
              </p>
            </div>
          </div>
          {/* Difficulty Level Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                value: 'mixed',
                label: 'Karışık',
                desc: 'Tüm seviyelerden',
                color: 'from-gray-500 to-gray-600',
                lightColor: 'bg-gray-50',
                textColor: 'text-gray-600'
              },
              {
                value: 'A1',
                label: 'A1 - Başlangıç',
                desc: 'Temel kelimeler',
                color: 'from-green-500 to-emerald-600',
                lightColor: 'bg-green-50',
                textColor: 'text-green-600'
              },
              {
                value: 'A2',
                label: 'A2 - Temel',
                desc: 'Günlük konuşma',
                color: 'from-blue-500 to-cyan-600',
                lightColor: 'bg-blue-50',
                textColor: 'text-blue-600'
              },
              {
                value: 'B1',
                label: 'B1 - Orta',
                desc: 'Genel konular',
                color: 'from-indigo-500 to-violet-600',
                lightColor: 'bg-indigo-50',
                textColor: 'text-indigo-600'
              },
              {
                value: 'B2',
                label: 'B2 - İyi',
                desc: 'Detaylı konular',
                color: 'from-purple-500 to-fuchsia-600',
                lightColor: 'bg-purple-50',
                textColor: 'text-purple-600'
              },
              {
                value: 'C1',
                label: 'C1 - İleri',
                desc: 'Akademik seviye',
                color: 'from-pink-500 to-rose-600',
                lightColor: 'bg-pink-50',
                textColor: 'text-pink-600'
              }
            ].map(level => (
              <button
                key={level.value}
                className={`relative p-4 sm:p-6 rounded-xl border transition-all group overflow-hidden ${
                  settings.difficulty === level.value
                    ? `border-${level.textColor.split('-')[1]}-500 ${level.lightColor} shadow-lg`
                    : 'border-gray-200 hover:shadow-lg hover:-translate-y-1'
                }`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    difficulty: level.value as QuizSettings['difficulty']
                  })
                }
              >
                <div className="relative z-10 text-center sm:text-left">
                  {/* Level Badge */}
                  <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full ${level.lightColor} ${level.textColor} text-xs sm:text-sm font-medium mb-3`}>
                    {level.value}
                  </div>
                  {/* Level Info */}
                  <div className="space-y-1">
                    <div className="font-semibold text-base sm:text-lg text-bs-navy">{level.label}</div>
                    <div className="text-xs sm:text-sm text-bs-navygri">{level.desc}</div>
                  </div>
                  {/* Selected Indicator */}
                  {settings.difficulty === level.value && (
                    <div className="absolute -bottom-1 -left-1 -right-1 h-1 bg-gradient-to-r from-bs-primary to-bs-800" />
                  )}
                </div>
                {/* Decorative Background */}
                <div className={`absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br ${level.color} opacity-5 rounded-full blur-3xl -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 group-hover:translate-x-16 transition-transform duration-500`} />
              </button>
            ))}
          </div>
          {/* Info Text */}
          <div className="mt-6 p-4 bg-bs-50 rounded-xl text-xs sm:text-sm text-bs-navygri">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-bs-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-bs-primary" />
              </div>
              <p className="leading-relaxed">
                CEFR (Common European Framework of Reference for Languages) seviyelerine göre kelimeler gruplandırılmıştır. Karışık seçeneği tüm seviyelerdeki kelimeleri içerir.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: Soru Tipleri */}
      <div className={`transition-all duration-300 ${currentStep === 4 ? 'block' : 'hidden'}`}>
        <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center gap-4 sm:gap-6 mb-6">
            <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 flex items-center justify-center shadow-lg shadow-bs-primary/20">
              <Layout className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-bs-navy mb-1">Soru Tipleri</h3>
              <p className="text-xs sm:text-base text-bs-navygri leading-relaxed">
                Hangi tip sorular görmek istersin? En az bir soru tipi seçmelisin.
              </p>
            </div>
          </div>
          {/* Question Types Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                id: 'multiple-choice',
                label: 'Çoktan Seçmeli',
                desc: 'Kelime anlamını seç',
                icon: BookOpen,
                color: 'from-blue-500 to-cyan-600',
                lightColor: 'bg-blue-50',
                textColor: 'text-blue-600'
              },
              {
                id: 'sentence-completion',
                label: 'Cümle Tamamlama',
                desc: 'Boşluğa uygun kelimeyi seç',
                icon: FileText,
                color: 'from-purple-500 to-fuchsia-600',
                lightColor: 'bg-purple-50',
                textColor: 'text-purple-600'
              },
              {
                id: 'pronunciation',
                label: 'Telaffuz',
                desc: 'Dinlediğin kelimeyi bul',
                icon: Volume2,
                color: 'from-green-500 to-emerald-600',
                lightColor: 'bg-green-50',
                textColor: 'text-green-600'
              },
              {
                id: 'example-matching',
                label: 'Örnek Eşleştirme',
                desc: 'Cümledeki kelimeyi bul',
                icon: GitCompare,
                color: 'from-orange-500 to-amber-600',
                lightColor: 'bg-orange-50',
                textColor: 'text-orange-600'
              }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => {
                  const types = settings.questionTypes.includes(type.id as QuizSettings['questionTypes'][0])
                    ? settings.questionTypes.filter(t => t !== type.id)
                    : [...settings.questionTypes, type.id as QuizSettings['questionTypes'][0]];
                  setSettings({ ...settings, questionTypes: types });
                }}
                className={`relative p-4 sm:p-6 rounded-xl border transition-all group overflow-hidden ${
                  settings.questionTypes.includes(type.id as QuizSettings['questionTypes'][0])
                    ? `border-${type.textColor.split('-')[1]}-500 ${type.lightColor} shadow-lg`
                    : 'border-gray-200 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className="relative z-10 text-center sm:text-left">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-2 sm:gap-4 mb-4">
                    <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl ${type.lightColor} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <type.icon className={`w-5 sm:w-6 h-5 sm:h-6 ${type.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base sm:text-lg text-bs-navy mb-1">{type.label}</h4>
                      <p className="text-xs sm:text-sm text-bs-navygri">{type.desc}</p>
                    </div>
                  </div>
                  {/* Selected Indicator */}
                  {settings.questionTypes.includes(type.id as QuizSettings['questionTypes'][0]) && (
                    <div className="absolute -bottom-1 -left-1 -right-1 h-1 bg-gradient-to-r from-bs-primary to-bs-800" />
                  )}
                </div>
                {/* Decorative Background */}
                <div className={`absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br ${type.color} opacity-5 rounded-full blur-3xl -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32 group-hover:translate-x-16 transition-transform duration-500`} />
              </button>
            ))}
          </div>
          {/* Info Text */}
          <div className="mt-6 p-4 bg-bs-50 rounded-xl text-xs sm:text-sm text-bs-navygri">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-bs-primary/10 flex items-center justify-center flex-shrink-0">
                <Layout className="w-3 h-3 sm:w-4 sm:h-4 text-bs-primary" />
              </div>
              <p className="leading-relaxed">
                Farklı soru tipleriyle öğrenme deneyimini zenginleştirebilirsin. Her soru tipi farklı bir öğrenme yöntemi destekler ve kelime bilgini farklı açılardan test eder.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Sticky Footer */}
      <div className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-md py-4 sm:py-6 border-t border-gray-100 mt-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="px-4 sm:px-6 py-3 border border-bs-primary text-bs-primary rounded-xl font-medium hover:bg-bs-50 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bs-primary/10 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Geri
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-bs-primary to-bs-800 text-white rounded-xl font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bs-primary/20 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span>Devam Et</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={settings.questionTypes.length === 0}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-bs-primary to-bs-800 text-white rounded-xl font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bs-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <CheckCircle2 className="w-5 h-5" />
                <span>Sınava Başla</span>
              </button>
            )}
          </div>
          <div className="mt-4">
            {currentStep === 4 ? (
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 px-2 py-1 bg-bs-50 text-bs-primary rounded-full">
                  <BookOpen className="w-4 h-4" />
                  <span>{settings.questionCount} Soru</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-bs-50 text-bs-primary rounded-full">
                  <GraduationCap className="w-4 h-4" />
                  <span>{settings.difficulty === 'mixed' ? 'Karışık Seviye' : settings.difficulty}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-bs-50 text-bs-primary rounded-full">
                  <Layout className="w-4 h-4" />
                  <span>{settings.questionTypes.length} Soru Tipi</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-bs-navygri">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-bs-primary' : 'bg-gray-300'}`} />
                  <span className={currentStep === 1 ? 'text-bs-primary font-medium' : ''}>Kelime Havuzu</span>
                </div>
                <div className="w-6 h-px bg-gray-200" />
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-bs-primary' : 'bg-gray-300'}`} />
                  <span className={currentStep === 2 ? 'text-bs-primary font-medium' : ''}>Soru Sayısı</span>
                </div>
                <div className="w-6 h-px bg-gray-200" />
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-bs-primary' : 'bg-gray-300'}`} />
                  <span className={currentStep === 3 ? 'text-bs-primary font-medium' : ''}>Zorluk Seviyesi</span>
                </div>
                <div className="w-6 h-px bg-gray-200" />
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${currentStep >= 4 ? 'bg-bs-primary' : 'bg-gray-300'}`} />
                  <span className={currentStep === 4 ? 'text-bs-primary font-medium' : ''}>Soru Tipleri</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { QuizStart };

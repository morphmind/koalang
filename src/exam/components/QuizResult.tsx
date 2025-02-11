import React from 'react';
import { QuizResult as QuizResultType } from '../types';
import {
  Trophy,
  Target,
  XCircle,
  Clock,
  BarChart as ChartBar,
  PieChart,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Home,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

interface QuizResultProps {
  result: QuizResultType;
  onRetry: () => void;
  onClose: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ result, onRetry, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto overflow-y-auto max-h-[calc(100vh-200px)] px-4 md:px-0">
      {/* Başlık */}
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
          <CheckCircle2 className="w-4 h-4" />
          {result.wrongAnswers.length === 0 && result.skippedQuestions === 0
            ? 'Mükemmel!'
            : 'Sınav Tamamlandı'}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-bs-navy">
          {result.wrongAnswers.length === 0 && result.skippedQuestions === 0 ? (
            'Tebrikler! Tüm soruları doğru yanıtladın!'
          ) : (
            <>
              {result.totalQuestions} sorudan {result.correctAnswers} doğru,{' '}
              {result.wrongAnswers.length} yanlış
              {result.skippedQuestions > 0 &&
                `, ${result.skippedQuestions} geçilen`}
            </>
          )}
        </h2>
        <p className="text-bs-navygri mt-2">
          {result.successRate >= 80
            ? 'Harika bir performans!'
            : result.successRate >= 60
            ? 'İyi bir performans, biraz daha çalışarak daha da iyileştirebilirsin.'
            : 'Daha fazla pratik yaparak performansını artırabilirsin.'}
        </p>
      </div>

      {/* Ana Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Başarı Puanı Kartı */}
        <div className="relative overflow-hidden bg-gradient-to-br from-bs-primary to-bs-800 p-8 rounded-2xl text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Başarı Puanı</h4>
                <p className="text-white/80 text-sm">
                  {result.totalQuestions} soru üzerinden
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-bold">{result.totalScore}</div>
              <div className="text-xl text-white/80">/100</div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <div>
                  <div className="text-white/80">Başarı Oranı</div>
                  <div className="font-semibold mt-1">{result.successRate}%</div>
                </div>
                <div>
                  <div className="text-white/80">Doğru Sayısı</div>
                  <div className="font-semibold mt-1">{result.correctAnswers}/{result.totalQuestions}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        </div>

        {/* Süre Kartı */}
        <div className="relative overflow-hidden bg-gradient-to-br from-bs-50 to-white p-8 rounded-2xl border border-bs-100">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-bs-navy">Toplam Süre</h4>
                <p className="text-bs-navygri text-sm">
                  Sınav boyunca harcanan süre
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-bold text-bs-navy">
                {Math.floor(result.timeSpent / 60)}
                <span className="text-2xl ml-1">dk</span>
              </div>
              <div className="text-xl text-bs-navygri">
                {result.timeSpent % 60}
                <span className="text-lg ml-1">sn</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-bs-100">
              <div className="flex justify-between text-sm">
                <div>
                  <div className="text-bs-navygri">Soru Başına</div>
                  <div className="font-semibold text-bs-navy mt-1">
                    {Math.round(result.timeSpent / result.totalQuestions)} saniye
                  </div>
                </div>
                <div>
                  <div className="text-bs-navygri">Toplam Soru</div>
                  <div className="font-semibold text-bs-navy mt-1">
                    {result.totalQuestions} soru
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50/50 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-50/50 rounded-full translate-y-24 -translate-x-24" />
        </div>
      </div>

      {/* Detaylı İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Toplam Soru */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-bs-primary transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-bs-50 flex items-center justify-center group-hover:bg-bs-primary/10 transition-colors">
              <BookOpen className="w-5 h-5 text-bs-primary" />
            </div>
            <span className="text-sm font-medium text-bs-navygri">Toplam</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-bs-navy">{result.totalQuestions}</div>
            <div className="text-sm text-bs-navygri mt-1">soru</div>
          </div>
        </div>

        {/* Doğru Cevaplar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-green-500 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-bs-navygri">Doğru</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-green-600">{result.correctAnswers}</div>
            <div className="text-sm text-bs-navygri mt-1">
              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}% başarı
            </div>
          </div>
        </div>

        {/* Yanlış Cevaplar */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-red-500 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-bs-navygri">Yanlış</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-red-600">{result.wrongAnswers.length}</div>
            <div className="text-sm text-bs-navygri mt-1">
              {Math.round((result.wrongAnswers.length / result.totalQuestions) * 100)}% hata
            </div>
          </div>
        </div>

        {/* Geçilen Sorular */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-yellow-500 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-bs-navygri">Geçilen</span>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-yellow-600">{result.skippedQuestions || 0}</div>
            <div className="text-sm text-bs-navygri mt-1">
              {Math.round(((result.skippedQuestions || 0) / result.totalQuestions) * 100)}% geçildi
            </div>
          </div>
        </div>
      </div>

      {/* Seviye Analizi */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 
                          flex items-center justify-center shadow-lg shadow-bs-primary/20">
              <ChartBar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-bs-navy">Seviye Analizi</h3>
              <p className="text-sm text-bs-navygri">CEFR seviyelerine göre performansın</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {Object.entries(result.levelAnalysis).map(([level, analysis]) => {
            // Seviyeye göre renk belirleme
            const colors = {
              'A1': { 
                gradient: 'from-green-500 to-emerald-600',
                lightBg: 'bg-green-50',
                text: 'text-green-600',
                border: 'border-green-200',
                shadow: 'shadow-green-500/20'
              },
              'A2': { 
                gradient: 'from-blue-500 to-cyan-600',
                lightBg: 'bg-blue-50',
                text: 'text-blue-600',
                border: 'border-blue-200',
                shadow: 'shadow-blue-500/20'
              },
              'B1': { 
                gradient: 'from-indigo-500 to-violet-600',
                lightBg: 'bg-indigo-50',
                text: 'text-indigo-600',
                border: 'border-indigo-200',
                shadow: 'shadow-indigo-500/20'
              },
              'B2': { 
                gradient: 'from-purple-500 to-fuchsia-600',
                lightBg: 'bg-purple-50',
                text: 'text-purple-600',
                border: 'border-purple-200',
                shadow: 'shadow-purple-500/20'
              },
              'C1': { 
                gradient: 'from-pink-500 to-rose-600',
                lightBg: 'bg-pink-50',
                text: 'text-pink-600',
                border: 'border-pink-200',
                shadow: 'shadow-pink-500/20'
              }
            };
            
            const color = colors[level as keyof typeof colors];
            
            // Performans değerlendirmesi
            const getPerformanceLabel = (percentage: number) => {
              if (percentage >= 80) return 'Mükemmel';
              if (percentage >= 60) return 'İyi';
              if (percentage >= 40) return 'Orta';
              return 'Geliştirilebilir';
            };

            return (
              <div 
                key={level} 
                className={`relative p-6 rounded-2xl border ${color.border} transition-all duration-300 flex flex-col items-center
                           hover:shadow-xl hover:-translate-y-2 group`}
              >
                {/* Level Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full 
                                ${color.lightBg} ${color.text} text-sm font-medium mb-4`}>
                  {level}
                </div>

                {/* Progress Circle */}
                <div className="relative w-24 h-24 mx-auto mb-4 transition-transform duration-300 
                               group-hover:scale-110 group-hover:rotate-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    {/* Glow Effect */}
                    <defs>
                      <filter id={`glow-${level}`}>
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      className={`stroke-current ${color.text}`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${analysis.percentage}, 100`}
                      filter={`url(#glow-${level})`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-3xl font-bold ${color.text} text-center`}>
                      {analysis.percentage}
                      <span className="text-lg ml-0.5">%</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className={`text-base font-semibold ${color.text} mb-2`}>
                    {getPerformanceLabel(analysis.percentage)}
                  </div>
                  <div className="text-sm text-bs-navygri">
                    {analysis.correct} / {analysis.total} doğru
                  </div>
                </div>

                {/* Hover Info */}
                <div className="absolute inset-0 rounded-xl bg-white/90 backdrop-blur-sm 
                              opacity-0 group-hover:opacity-100 transition-all duration-300 
                              flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${color.text} mb-2`}>
                      {level} Seviyesi
                    </div>
                    <div className="text-sm text-bs-navygri">
                      {analysis.correct} doğru, {analysis.total - analysis.correct} yanlış
                      <br />
                      Başarı oranı: {analysis.percentage}%
                    </div>
                  </div>
                </div>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 
                                group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Kelime Türü Analizi */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bs-primary to-bs-800 
                          flex items-center justify-center shadow-lg shadow-bs-primary/20">
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-bs-navy">Kelime Türü Analizi</h3>
              <p className="text-sm text-bs-navygri">Kelime türlerine göre performansın</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(result.wordTypeAnalysis).map(([type, analysis]) => {
            const getTypeColor = (percentage: number) => {
              if (percentage >= 80) return {
                bg: 'bg-green-50',
                text: 'text-green-600',
                border: 'border-green-200',
                progress: 'from-green-500 to-emerald-600'
              };
              if (percentage >= 60) return {
                bg: 'bg-blue-50',
                text: 'text-blue-600',
                border: 'border-blue-200',
                progress: 'from-blue-500 to-cyan-600'
              };
              if (percentage >= 40) return {
                bg: 'bg-yellow-50',
                text: 'text-yellow-600',
                border: 'border-yellow-200',
                progress: 'from-yellow-500 to-amber-600'
              };
              return {
                bg: 'bg-red-50',
                text: 'text-red-600',
                border: 'border-red-200',
                progress: 'from-red-500 to-rose-600'
              };
            };

            const color = getTypeColor(analysis.percentage);

            return (
              <div 
                key={type} 
                className={`relative p-6 rounded-xl border ${color.border} transition-all duration-300
                           hover:shadow-lg hover:-translate-y-1 group`}
                style={{ minHeight: '160px' }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`max-w-[70%] px-3 py-1.5 rounded-lg ${color.bg} ${color.text} 
                                   text-sm font-medium leading-tight`}>
                      {type.split('(')[0].trim()}
                      <span className="block text-xs opacity-75 mt-1">
                        ({type.split('(')[1]?.replace(')', '') || ''})
                      </span>
                    </div>
                    <div className="text-sm text-bs-navygri whitespace-nowrap">
                      {analysis.correct} / {analysis.total}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full bg-gradient-to-r ${color.progress} transition-all relative`}
                      style={{ width: `${analysis.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 
                                    animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>
                  </div>

                  {/* Performance Label */}
                  <div className={`text-sm ${color.text} font-medium mt-auto`}>
                    {analysis.percentage >= 80 ? 'Mükemmel' :
                     analysis.percentage >= 60 ? 'İyi' :
                     analysis.percentage >= 40 ? 'Orta' : 'Geliştirilebilir'}
                  </div>
                </div>

                {/* Hover Info */}
                <div className="absolute inset-0 rounded-xl bg-white/90 backdrop-blur-sm 
                              opacity-0 group-hover:opacity-100 transition-all duration-300
                              flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${color.text} mb-2`}>
                      {type.split('(')[0].trim()}
                      <div className="text-sm opacity-75 mt-1">
                        ({type.split('(')[1]?.replace(')', '') || ''})
                      </div>
                    </div>
                    <div className="text-sm text-bs-navygri">
                      {analysis.correct} doğru, {analysis.total - analysis.correct} yanlış
                      <br />
                      Başarı oranı: {analysis.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yanlış Cevaplar */}
      {result.wrongAnswers && result.wrongAnswers.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-bs-navy mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-bs-primary" />
            Yanlış Cevapladığın Sorular ({result.wrongAnswers.length})
          </h3>
          <div className="space-y-4">
            {result.wrongAnswers.map((question, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="font-medium text-bs-navy mb-2">
                  {question.type === 'multiple-choice'
                    ? 'Çoktan Seçmeli'
                    : question.type === 'sentence-completion'
                    ? 'Cümle Tamamlama'
                    : question.type === 'pronunciation'
                    ? 'Telaffuz'
                    : 'Örnek Eşleştirme'}{' '}
                  Soru
                </div>
                <div className="text-bs-navy mb-4">{question.question}</div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Cevabınız: {question.userAnswer || 'Cevap verilmedi'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Doğru cevap: {question.correctAnswer}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-bs-navygri bg-white p-4 rounded-lg border border-gray-100">
                  <div className="font-medium text-bs-navy mb-2">
                    Açıklama:
                  </div>
                  {question.explanation || 'Bu soru için açıklama bulunmuyor.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!result.wrongAnswers || result.wrongAnswers.length === 0) &&
        result.skippedQuestions === 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Harika İş!
            </div>
            <p className="text-bs-navygri">
              Tebrikler! Hiç yanlış cevabınız yok.
            </p>
          </div>
        )}

      {/* Öneriler */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-bs-navy mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-bs-primary" />
          Öneriler
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg bg-bs-50 flex items-center justify-center shrink-0">
                <span className="text-bs-primary font-semibold">
                  {index + 1}
                </span>
              </div>
              <p
                className="text-sm text-bs-navygri"
                dangerouslySetInnerHTML={{ __html: recommendation }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-center gap-4 sticky bottom-0 bg-white p-4 md:p-6 border-t border-gray-100">
        <button
          onClick={onRetry}
          className="w-full md:w-auto px-6 md:px-8 py-4 bg-bs-primary text-white rounded-xl font-medium hover:bg-bs-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Yeni Sınav
        </button>
        <button
          onClick={onClose}
          className="w-full md:w-auto px-6 md:px-8 py-4 border border-bs-primary text-bs-primary rounded-xl font-medium hover:bg-bs-50 transition-colors flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};

export { QuizResult };
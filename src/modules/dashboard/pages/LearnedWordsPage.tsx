import React from 'react';
import { useWords } from '../../words/context/WordContext';
import { LoadingSpinner } from '../../auth/components/LoadingSpinner';
import { ErrorMessage } from '../../auth/components/ErrorMessage';
import { BookOpen, Search, Volume2, BookmarkCheck, Filter } from 'lucide-react';
import { Word } from '../../../data/oxford3000.types';
import words from '../../../data/oxford3000';

export const LearnedWordsPage: React.FC = () => {
  const { learnedWords, toggleWordLearned, isLoading, error } = useWords();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLevel, setSelectedLevel] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'word'>('date');

  // Öğrenilen kelimeleri filtrele
  const filteredWords = React.useMemo(() => {
    return words
      .filter(word => learnedWords[word.word])
      .filter(word => {
        const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel;
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'word') {
          return a.word.localeCompare(b.word);
        }
        // Tarih sıralaması için şimdilik alfabetik sıralama kullanıyoruz
        // TODO: Gerçek öğrenme tarihine göre sıralama eklenecek
        return b.word.localeCompare(a.word);
      });
  }, [learnedWords, searchQuery, selectedLevel, sortBy]);

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden relative max-w-[1200px] mx-auto">
        {/* Gradient Background */}
        <div className="relative bg-gradient-to-br from-bs-primary to-bs-800 p-8">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 max-w-[1200px] mx-auto">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Öğrendiğim Kelimeler
                </h1>
                <p className="text-white/80">
                  {filteredWords.length} kelime öğrendiniz
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bs-600/20 rounded-full blur-3xl 
                       -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-bs-navy/20 rounded-full blur-2xl 
                       translate-y-1/2 -translate-x-1/2 animate-pulse" />
        </div>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 p-6 sm:p-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          {/* Arama */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-bs-navygri group-focus-within:text-bs-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kelime veya anlam ara..."
              className="block w-full pl-12 pr-4 py-3.5 border border-bs-100 rounded-xl text-bs-navy
                       shadow-sm transition-all duration-200 placeholder:text-bs-navygri/50
                       focus:ring-2 focus:ring-bs-primary/10 focus:border-bs-primary focus:shadow-lg
                       hover:border-bs-primary/50"
            />
          </div>

          {/* Seviye Filtresi */}
          <div className="w-full sm:w-56">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="block w-full px-4 py-3.5 border border-bs-100 rounded-xl text-bs-navy
                       shadow-sm transition-all duration-200 cursor-pointer
                       focus:ring-2 focus:ring-bs-primary/10 focus:border-bs-primary focus:shadow-lg
                       hover:border-bs-primary/50"
            >
              <option value="all">Tüm Seviyeler</option>
              <option value="A1">A1 - Başlangıç</option>
              <option value="A2">A2 - Temel</option>
              <option value="B1">B1 - Orta</option>
              <option value="B2">B2 - İyi</option>
              <option value="C1">C1 - İleri</option>
            </select>
          </div>

          {/* Sıralama */}
          <div className="w-full sm:w-56">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'word')}
              className="block w-full px-4 py-3.5 border border-bs-100 rounded-xl text-bs-navy
                       shadow-sm transition-all duration-200 cursor-pointer
                       focus:ring-2 focus:ring-bs-primary/10 focus:border-bs-primary focus:shadow-lg
                       hover:border-bs-primary/50"
            >
              <option value="date">Öğrenme Tarihi</option>
              <option value="word">Alfabetik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kelime Listesi */}
      <div className="bg-white rounded-2xl shadow-lg border border-bs-100 overflow-hidden relative max-w-[1200px] mx-auto">
        {filteredWords.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 rounded-2xl bg-bs-50 flex items-center justify-center mx-auto mb-6
                          ring-8 ring-bs-50/50">
              <BookOpen className="w-12 h-12 text-bs-primary" />
            </div>
            <h3 className="text-xl font-semibold text-bs-navy mb-3">
              Henüz kelime bulunamadı
            </h3>
            <p className="text-bs-navygri max-w-md mx-auto text-lg">
              {searchQuery 
                ? 'Arama kriterlerinize uygun kelime bulunamadı.' 
                : 'Henüz hiç kelime öğrenmediniz.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-bs-100 relative">
            {filteredWords.map((word) => (
              <div 
                key={word.word}
                className="p-6 sm:p-8 hover:bg-gradient-to-br from-bs-50/50 to-white transition-all 
                         hover:shadow-lg flex flex-col sm:flex-row sm:items-center gap-6 group 
                         relative overflow-hidden border-l-4 border-l-transparent
                         hover:border-l-bs-primary"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-bs-primary/5 to-transparent 
                             opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Kelime ve Seviye */}
                <div className="flex-1 relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-bs-navy group-hover:text-bs-primary 
                                transition-colors">
                      {word.word}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm
                                 ${word.level === 'A1' ? 'bg-green-50 text-green-600' :
                                   word.level === 'A2' ? 'bg-blue-50 text-blue-600' :
                                   word.level === 'B1' ? 'bg-indigo-50 text-indigo-600' :
                                   word.level === 'B2' ? 'bg-purple-50 text-purple-600' :
                                   'bg-pink-50 text-pink-600'}`}>
                      {word.level}
                    </span>
                  </div>
                  <p className="text-lg text-bs-navygri group-hover:text-bs-navy transition-colors">
                    {word.meaning}
                  </p>
                  {word.examples[0] && (
                    <p className="text-sm text-bs-navygri/75 mt-3 italic leading-relaxed">
                      "{word.examples[0].en}"
                    </p>
                  )}
                </div>

                {/* Telaffuz */}
                <div className="flex items-center gap-3 relative z-10">
                  <span className="text-sm text-bs-navygri font-mono bg-bs-50 px-3 py-1.5 rounded-lg">
                    {word.pronunciation}
                  </span>
                  <button
                    onClick={() => handleSpeak(word.word)}
                    className="w-10 h-10 flex items-center justify-center text-bs-primary 
                             hover:bg-white hover:shadow-lg rounded-lg transition-all 
                             hover:-translate-y-0.5 border border-transparent
                             hover:border-bs-primary"
                    title="Telaffuzu dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Öğrenildi İşareti */}
                <button
                  onClick={() => toggleWordLearned(word.word)}
                  className="w-10 h-10 flex items-center justify-center text-bs-primary 
                           bg-bs-primary text-white hover:bg-bs-800 hover:shadow-lg rounded-lg transition-all 
                           hover:-translate-y-0.5 border border-transparent
                           hover:border-bs-primary relative z-10"
                  title="Öğrenildi işaretini kaldır"
                >
                  <BookmarkCheck className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
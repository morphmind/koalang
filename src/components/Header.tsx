import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { UserMenu } from '../modules/auth/components/UserMenu';
import { NotificationBell } from '../modules/notifications/components/NotificationBell';
import { BookOpen, Search, BookmarkPlus, BookmarkCheck, PenTool, ChevronDown, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showLearned: boolean;
  setShowLearned: (value: boolean) => void;
  setShowQuiz: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  showLearned,
  setShowLearned,
  setShowQuiz
}) => {
  const { user } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-section');
      const searchSection = document.querySelector('.search-section');

      if (heroSection && searchSection) {
        const searchRect = searchSection.getBoundingClientRect();
        const searchTop = searchRect.top;
        const searchHeight = searchRect.height;
        const triggerPoint = window.innerHeight / 2;

        setIsSticky(searchTop <= triggerPoint);
        setIsSearchVisible(searchTop <= triggerPoint - searchHeight);
        setIsTransitioning(searchTop <= triggerPoint && searchTop > triggerPoint - searchHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { openAuthPopup } = useAuthPopup();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${isSticky ? 'shadow-lg' : 'rounded-b-3xl shadow-lg'}
                  ${isSticky ? 'h-16' : 'h-20'}`}
    >
      {/* Gradient Background */}
      <div className="relative bg-gradient-to-r from-bs-navy via-bs-primary to-bs-800 rounded-b-3xl">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        {/* Glass Effect Container */}
        <div className="relative backdrop-blur-sm border-b border-white/10 rounded-b-3xl shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-4 transition-all duration-300
                          ${isSticky ? 'h-16' : 'h-20'}`}>
              {/* Logo */}
              <div className={`flex-shrink-0 transition-all duration-300 pl-0 lg:pl-2
                            ${isSticky ? 'w-auto' : 'w-[180px] md:w-auto'}`}>
                <Link to="/" className="flex items-center gap-3">
                  <div className={`rounded-xl bg-white/10 backdrop-blur flex items-center justify-center
                                transition-all duration-300
                                ${isSticky ? 'w-8 h-8' : 'w-10 h-10'}`}>
                    <BookOpen className={`transition-all duration-300
                                      ${isSticky ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                  </div>
                  <span className={`font-bold text-white tracking-tight transition-all duration-300
                                 ${isSticky ? 'text-xl md:block hidden' : 'text-2xl'}`}>
                    koa<span className="text-bs-400">:lang</span>
                  </span>
                </Link>
              </div>
              {/* Arama ve Butonlar - Sticky durumunda göster */}
              {isSticky && isSearchVisible && (
                <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 max-w-4xl mx-auto animate-fade-in-up">
                  {/* Arama Kutusu */}
                  <div className="relative flex-1 max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Kelime veya anlam ara..."
                      className="w-full pl-12 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg
                                 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30
                                 focus:border-white/30 transition-all text-sm"
                    />
                  </div>
                  {/* Butonlar */}
                  <button
                    onClick={() => {
                      if (!user) {
                        openAuthPopup();
                        return;
                      }
                      setShowLearned(!showLearned);
                    }}
                    className={`flex items-center justify-center w-10 sm:w-auto px-2 sm:px-4 py-2
                               rounded-lg text-sm font-medium transition-all ${
                                 showLearned
                                   ? 'bg-white text-bs-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                   : 'bg-white/10 text-white hover:bg-white/20 hover:-translate-y-0.5 border border-white/20'
                               }`}
                  >
                    {showLearned ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline ml-2">{showLearned ? 'Gizle' : 'Öğrendiklerim'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        openAuthPopup();
                        return;
                      }
                      setShowQuiz(true);
                    }}
                    className="flex items-center justify-center w-10 sm:w-auto px-2 sm:px-4 py-2
                               bg-white text-bs-primary rounded-lg text-sm font-medium hover:bg-bs-50
                               transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <PenTool className="w-5 h-5" />
                    <span className="hidden sm:inline ml-2">Sınav Ol</span>
                  </button>
                </div>
              )}
              {/* Main Navigation */}
              <nav
                className={`items-center space-x-1 transition-all duration-300 flex-1 justify-center
                         ${isSticky ? 'hidden' : 'hidden md:flex opacity-100 visible h-auto'}`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Link
                    to="/oxford-3000"
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Oxford 3000
                  </Link>
                  <Link
                    to="/oxford-5000"
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Oxford 5000
                  </Link>
                  <Link
                    to="/practice"
                    className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Pratik Yap
                  </Link>
                </div>
              </nav>
              {/* Auth Buttons / User Menu */}
              <div className="flex items-center gap-3 pr-0 lg:pr-2 ml-auto">
                {user ? (
                  <>
                    <NotificationBell />
                    <UserMenu />
                  </>
                ) : (
                  <div className={`flex items-center gap-2 transition-all duration-300
                              ${isSticky ? 'opacity-0 invisible w-0 h-0' : 'opacity-100 visible w-auto h-auto'}`}>
                    <button
                      onClick={openAuthPopup}
                      className="h-8 px-4 text-xs font-medium text-white hover:bg-white/10 
                             rounded-lg transition-all border border-white/20 min-w-[80px] whitespace-nowrap"
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={openAuthPopup}
                      className="h-8 px-4 text-xs font-medium bg-white text-bs-primary 
                             rounded-lg transition-all hover:bg-bs-50 shadow-sm hover:shadow-md min-w-[80px] whitespace-nowrap"
                    >
                      Kayıt Ol
                    </button>
                  </div>
                )}
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg 
                         hover:bg-white/10 transition-colors ml-2"
                  aria-label="Ana menüyü aç/kapat"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[100] md:hidden">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-br from-bs-navy via-bs-primary to-bs-800 shadow-2xl
                           animate-slide-in-right">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none z-0" />
                
                {/* Content Container */}
                <div className="h-screen flex flex-col relative z-10">
                  {/* Header */}
                  <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-br from-bs-navy via-bs-primary to-bs-800">
                    <Link 
                      to="/"
                      className="flex items-center gap-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-white">
                        koa<span className="text-bs-300">:lang</span>
                      </span>
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white 
                               hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto bg-gradient-to-br from-bs-navy via-bs-primary to-bs-800">
                    <div className="p-6">
                      <nav className="space-y-6">
                        {/* Ana Menü */}
                        <div>
                          <h3 className="px-4 text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                            Ana Menü
                          </h3>
                          <div className="space-y-2">
                            <Link
                              to="/oxford-3000"
                              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl 
                                       transition-all group relative overflow-hidden"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">Oxford 3000™</div>
                                <div className="text-sm text-white/60">En sık kullanılan kelimeler</div>
                              </div>
                            </Link>
                            <Link
                              to="/oxford-5000"
                              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all group"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">Oxford 5000™</div>
                                <div className="text-sm text-white/60">İleri seviye kelimeler</div>
                              </div>
                            </Link>
                            <Link
                              to="/practice"
                              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all group"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <PenTool className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">Pratik Yap</div>
                                <div className="text-sm text-white/60">Öğrendiklerini test et</div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* Kullanıcı Menüsü */}
                        {user && (
                          <div>
                            <h3 className="px-4 text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                              Hesabım
                            </h3>
                            <div className="space-y-2">
                              <Link
                                to="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all group"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-medium">Dashboard</div>
                                  <div className="text-sm text-white/60">İlerlemeni takip et</div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </nav>
                    </div>
                  </div>

                  {/* Footer */}
                  {!user && (
                    <div className="flex-shrink-0 p-6 mt-auto bg-gradient-to-br from-bs-navy via-bs-primary to-bs-800 
                                shadow-[0_-8px_16px_rgba(0,0,0,0.1)] relative overflow-hidden">
                      {/* Pattern Overlay */}
                      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none" />
                      
                      {/* Content */}
                      <div className="relative z-10 space-y-4">
                        <p className="text-white/80 text-sm text-center mb-6">
                          Kelime öğrenme yolculuğuna başlamak için giriş yapın
                        </p>
                        
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthPopup();
                          }}
                          className="w-full px-4 py-3.5 bg-white text-bs-primary rounded-xl font-medium shadow-lg
                                   hover:bg-bs-50 transition-all hover:-translate-y-0.5 hover:shadow-xl
                                   relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <span className="relative z-10">Kayıt Ol</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthPopup();
                          }}
                          className="w-full px-4 py-3.5 bg-white/10 text-white rounded-xl font-medium 
                                   hover:bg-white/20 transition-all hover:-translate-y-0.5 border border-white/20
                                   relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                                       translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <span className="relative z-10">Zaten hesabım var</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
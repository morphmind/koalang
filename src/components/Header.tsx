import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../modules/auth';
import { useAuthPopup } from '../modules/auth/hooks/useAuthPopup';
import { UserMenu } from '../modules/auth/components/UserMenu';
import { NotificationBell } from '../modules/notifications/components/NotificationBell';
import { BookOpen, Search, BookmarkPlus, BookmarkCheck, PenTool, ChevronDown } from 'lucide-react';

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
                  <>
                    <button
                      onClick={openAuthPopup}
                      className={`flex items-center justify-center w-10 sm:w-auto px-2 sm:px-4 py-2
                                 bg-white/10 text-white hover:bg-white/20 hover:-translate-y-0.5
                                 border border-white/20 rounded-lg text-sm font-medium transition-all`}
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={openAuthPopup}
                      className="flex items-center justify-center w-10 sm:w-auto px-2 sm:px-4 py-2
                                 bg-white text-bs-primary rounded-lg text-sm font-medium hover:bg-bs-50
                                 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Kayıt Ol
                    </button>
                  </>
                )}
                {/* Mobile Menu Button */}
                <button
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Ana menüyü aç"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

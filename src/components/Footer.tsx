import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Twitter, 
  Instagram,
  BookText as TikTok,
  Mail,
  Heart,
  ArrowUpRight,
  BookMarked,
  Target,
  Brain,
  GraduationCap,
  Rocket,
  Award,
  FileText,
  MessageCircle,
  Layers,
  Globe2,
  Sparkles,
  Zap
} from 'lucide-react';
import { useLegalPopup } from '../context/LegalPopupContext';

export const Footer: React.FC = () => {
  const { openPopup } = useLegalPopup();
  const menuItems = [
    {
      title: 'Ürünler',
      items: [
        { icon: BookOpen, label: 'Oxford 3000™', href: '/oxford-3000' },
        { icon: BookMarked, label: 'Oxford 5000™', href: '/oxford-5000' },
        { icon: Target, label: 'Pratik Yap', href: '/practice' },
        { icon: Brain, label: 'Yapay Zeka Asistan', href: '/ai-tutor', soon: true },
        { icon: GraduationCap, label: 'Özel Ders', href: '/tutoring', soon: true }
      ]
    },
    {
      title: 'Şirket',
      items: [
        { icon: Award, label: 'Hakkımızda', href: '/about' },
        { icon: FileText, label: 'Blog', href: '/blog' },
        { icon: MessageCircle, label: 'İletişim', href: '/contact' }
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/koalang',
      color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/koalang',
      color: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] hover:border-[#FD1D1D]'
    },
    {
      name: 'TikTok',
      icon: TikTok,
      href: 'https://tiktok.com/@koalang',
      color: 'hover:bg-black hover:border-black'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:hello@koalang.com',
      color: 'hover:bg-bs-primary hover:border-bs-primary'
    }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-bs-navy via-bs-primary to-bs-800 rounded-t-[48px] shadow-lg">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Logo ve Sosyal Medya */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="group inline-flex items-center gap-3 hover:-translate-y-1 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center
                         group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              koa<span className="text-bs-300">:lang</span>
            </span>
          </Link>
          {/* App Store Links - Yeni Tasarım */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <span className="text-white/80 text-sm font-medium">Mobil Uygulamamızı İndirin</span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#" 
                className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm p-1.5
                         transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10
                         z-20"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                             translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store" 
                  className="h-10 relative z-10"
                />
              </a>
              <a 
                href="#" 
                className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm p-1.5
                         transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10
                         z-20"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                             translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play" 
                  className="h-10 relative z-10"
                />
              </a>
            </div>
          </div>

          {/* Sosyal Medya */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {socialLinks.map((social) => (
              <Link 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur 
                         flex items-center justify-center text-white/70 hover:text-white
                         transition-all duration-500 hover:-translate-y-2 hover:shadow-xl
                         group relative overflow-hidden ${social.color} z-20`}
                title={social.name}
              >
                <social.icon className="w-5 h-5 relative z-10 transition-transform duration-500 
                                   group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          {menuItems.map((section, idx) => (
            <div key={section.title} className="relative">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                  {idx === 0 ? <Layers className="w-6 h-6 text-white" /> : <Rocket className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-xl font-bold text-white">{section.title}</h3>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur
                             hover:bg-white/10 transition-all duration-500 relative overflow-hidden
                             z-10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center
                                group-hover:bg-white group-hover:text-bs-primary 
                                group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <item.icon className="w-5 h-5 text-white group-hover:text-bs-primary" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                    {item.soon ? (
                      <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 
                                   rounded-full bg-white/10 text-white/90">
                        Yakında
                      </span>
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-white/40 absolute top-4 right-4 
                                           opacity-0 -translate-x-4 group-hover:opacity-100 
                                           group-hover:translate-x-0 transition-all duration-500" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>Powered by</span>
                <div className="relative group">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm relative z-10
                               hover:bg-white/20 transition-all duration-500">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-white font-medium tracking-wide">AI</span>
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 z-0
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
                <span>&&</span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 relative z-10
                               backdrop-blur-sm group hover:bg-white/20 transition-all duration-500">
                    <span className="text-white/80">🤖</span>
                    <span className="text-white font-medium tracking-wide">cyborg</span>
                    <span className="text-white/80">⚡️</span>
                    <span className="text-white font-medium tracking-wide">devs</span>
                    <span className="text-white/80">🔋</span>
                  </div>
                </div>
              </div>
              <span className="text-sm text-white/50">
                © {new Date().getFullYear()} koa:lang
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                { id: 'privacy' as const, label: 'Gizlilik' },
                { id: 'terms' as const, label: 'Kullanım Koşulları' },
                { id: 'cookies' as const, label: 'Çerez Politikası' },
                { id: 'kvkk' as const, label: 'KVKK' },
                { id: 'security' as const, label: 'Güvenlik' }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => openPopup(link.id)}
                  className="text-sm text-white/50 hover:text-white transition-colors relative z-10 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full 
                   bg-gradient-to-br from-bs-primary/30 to-bs-800/30 blur-[128px]
                   -translate-y-1/2 translate-x-1/2 animate-float-slow" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full 
                   bg-gradient-to-br from-bs-800/30 to-bs-primary/30 blur-[128px]
                   translate-y-1/2 -translate-x-1/2 animate-float-slow-reverse" />
    </footer>
  );
};
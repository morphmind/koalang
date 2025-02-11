import React, { useState, useRef } from 'react';
import { X, BookOpen } from 'lucide-react'; 
import { useOnClickOutside } from '../modules/auth/hooks/useOnClickOutside';

interface LegalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'cookies' | 'kvkk' | 'security';
}

export const LegalPopup: React.FC<LegalPopupProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const popupRef = useRef<HTMLDivElement>(null);

  // Popup dışına tıklamayı dinle
  useOnClickOutside(popupRef, onClose);

  if (!isOpen) return null;

  const tabs = [
    { id: 'privacy', label: 'Gizlilik' },
    { id: 'terms', label: 'Kullanım Koşulları' },
    { id: 'cookies', label: 'Çerez Politikası' },
    { id: 'kvkk', label: 'KVKK' },
    { id: 'security', label: 'Güvenlik' }
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white 
                     text-left align-middle shadow-xl transition-all border border-bs-100">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 
                     transition-colors z-[60] group cursor-pointer"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-bs-primary to-bs-800 p-8 rounded-t-2xl relative overflow-hidden z-[50]">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
            
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8 relative z-[51]">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                koa<span className="text-bs-300">:lang</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-4 relative z-[51]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden
                           group isolate cursor-pointer select-none
                           ${activeTab === tab.id 
                             ? 'bg-white text-bs-primary shadow-lg hover:-translate-y-0.5' 
                             : 'text-white/80 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'}`}
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000
                               z-[1]" />
                  <span className="relative z-[2]">{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl 
                         -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl 
                         translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Content */}
          <div className="p-8 max-h-[70vh] overflow-y-auto relative z-[1]">
            {/* Content Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-bs-50/50 to-white pointer-events-none" />
            
            {/* Actual Content */}
            <div className="relative z-[2]">
            {activeTab === 'privacy' && <PrivacyContent />}
            {activeTab === 'terms' && <TermsContent />}
            {activeTab === 'cookies' && <CookiesContent />}
            {activeTab === 'kvkk' && <KVKKContent />}
            {activeTab === 'security' && <SecurityContent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyContent: React.FC = () => (
  <div className="prose max-w-none">
    <h2 className="text-2xl font-bold text-bs-navy mb-6">Gizlilik Politikası</h2>
    
    <p className="text-bs-navygri mb-6">
      koa:lang olarak, gizliliğinize önem veriyoruz. Bu gizlilik politikası, hizmetlerimizi 
      kullanırken toplanan, kullanılan ve korunan bilgileriniz hakkında sizi bilgilendirmek 
      için hazırlanmıştır.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Toplanan Bilgiler</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Hesap bilgileri (e-posta, kullanıcı adı)</li>
      <li>Öğrenme istatistikleri ve ilerleme</li>
      <li>Uygulama kullanım verileri</li>
      <li>Cihaz ve tarayıcı bilgileri</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Bilgilerin Kullanımı</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Kişiselleştirilmiş öğrenme deneyimi sunmak</li>
      <li>Hizmet kalitesini artırmak</li>
      <li>Güvenliği sağlamak</li>
      <li>Yasal yükümlülükleri yerine getirmek</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Bilgi Güvenliği</h3>
    <p className="text-bs-navygri mb-6">
      Verileriniz, endüstri standardı güvenlik önlemleriyle korunmaktadır. SSL şifreleme, 
      güvenli veri depolama ve düzenli güvenlik denetimleri uyguluyoruz.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Veri Paylaşımı</h3>
    <p className="text-bs-navygri mb-6">
      Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz. 
      Hizmet sağlayıcılarımızla yapılan paylaşımlar, gizlilik sözleşmeleri kapsamında 
      gerçekleştirilir.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Haklarınız</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Verilerinize erişim</li>
      <li>Düzeltme talep etme</li>
      <li>Silme talep etme</li>
      <li>İşlemeye itiraz etme</li>
    </ul>

    <p className="text-bs-navygri">
      Bu politika hakkında sorularınız için <a href="mailto:privacy@koalang.com" 
      className="text-bs-primary hover:text-bs-800">privacy@koalang.com</a> adresinden 
      bizimle iletişime geçebilirsiniz.
    </p>
  </div>
);

const TermsContent: React.FC = () => (
  <div className="prose max-w-none">
    <h2 className="text-2xl font-bold text-bs-navy mb-6">Kullanım Koşulları</h2>
    
    <p className="text-bs-navygri mb-6">
      koa:lang platformunu kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Lütfen 
      bu koşulları dikkatlice okuyunuz.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Hesap Oluşturma</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Doğru ve güncel bilgiler sağlamakla yükümlüsünüz</li>
      <li>Hesap güvenliğinizden siz sorumlusunuz</li>
      <li>13 yaşından küçükseniz veli izni gereklidir</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Kullanım Kuralları</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>İçerikleri kopyalamak ve dağıtmak yasaktır</li>
      <li>Platformu kötüye kullanmak yasaktır</li>
      <li>Diğer kullanıcılara saygılı olunmalıdır</li>
      <li>Telif haklarına uyulmalıdır</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Ödeme ve İadeler</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Ödemeler güvenli ödeme sistemleri üzerinden yapılır</li>
      <li>İptal ve iade koşulları abonelik tipine göre değişir</li>
      <li>14 gün içinde cayma hakkı mevcuttur</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Sorumluluk Reddi</h3>
    <p className="text-bs-navygri mb-6">
      Platform "olduğu gibi" sunulmaktadır. Kesintisiz veya hatasız hizmet garantisi 
      verilmemektedir. Yaşanabilecek veri kayıplarından sorumlu değiliz.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Değişiklikler</h3>
    <p className="text-bs-navygri mb-6">
      Bu koşullar önceden haber verilmeksizin değiştirilebilir. Önemli değişiklikler 
      e-posta ile bildirilir.
    </p>

    <p className="text-bs-navygri">
      Sorularınız için <a href="mailto:legal@koalang.com" 
      className="text-bs-primary hover:text-bs-800">legal@koalang.com</a> adresinden 
      bizimle iletişime geçebilirsiniz.
    </p>
  </div>
);

const CookiesContent: React.FC = () => (
  <div className="prose max-w-none">
    <h2 className="text-2xl font-bold text-bs-navy mb-6">Çerez Politikası</h2>
    
    <p className="text-bs-navygri mb-6">
      koa:lang olarak, hizmetlerimizi geliştirmek ve kullanıcı deneyimini iyileştirmek 
      için çerezler kullanıyoruz.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Çerez Nedir?</h3>
    <p className="text-bs-navygri mb-6">
      Çerezler, web siteleri tarafından cihazınıza yerleştirilen küçük metin dosyalarıdır. 
      Bu dosyalar, site kullanımınızı kolaylaştırır ve daha iyi bir deneyim sunmamıza 
      yardımcı olur.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Kullandığımız Çerez Türleri</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>
        <span className="font-medium">Zorunlu Çerezler:</span> Sitenin çalışması için 
        gerekli temel çerezler
      </li>
      <li>
        <span className="font-medium">Performans Çerezleri:</span> Site kullanımını 
        analiz etmek için kullanılan çerezler
      </li>
      <li>
        <span className="font-medium">İşlevsellik Çerezleri:</span> Tercihlerinizi 
        hatırlamak için kullanılan çerezler
      </li>
      <li>
        <span className="font-medium">Hedefleme Çerezleri:</span> Size özel içerik 
        sunmak için kullanılan çerezler
      </li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Çerez Yönetimi</h3>
    <p className="text-bs-navygri mb-6">
      Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Ancak bazı 
      çerezleri devre dışı bırakmak, site fonksiyonlarını etkileyebilir.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Üçüncü Taraf Çerezleri</h3>
    <p className="text-bs-navygri mb-6">
      Analitik ve reklam amaçlı üçüncü taraf çerezler kullanıyoruz. Bu çerezler, 
      ilgili hizmet sağlayıcıların gizlilik politikalarına tabidir.
    </p>

    <p className="text-bs-navygri">
      Çerez politikamız hakkında sorularınız için <a href="mailto:privacy@koalang.com" 
      className="text-bs-primary hover:text-bs-800">privacy@koalang.com</a> adresinden 
      bizimle iletişime geçebilirsiniz.
    </p>
  </div>
);

const KVKKContent: React.FC = () => (
  <div className="prose max-w-none">
    <h2 className="text-2xl font-bold text-bs-navy mb-6">KVKK Aydınlatma Metni</h2>
    
    <p className="text-bs-navygri mb-6">
      6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, koa:lang olarak 
      kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek isteriz.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Veri Sorumlusu</h3>
    <p className="text-bs-navygri mb-6">
      koa:lang (bundan sonra "Şirket" olarak anılacaktır) veri sorumlusu olarak hareket 
      etmektedir.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">İşlenen Kişisel Veriler</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Kimlik bilgileri</li>
      <li>İletişim bilgileri</li>
      <li>Öğrenme verileri</li>
      <li>Kullanım istatistikleri</li>
      <li>Ödeme bilgileri</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">İşleme Amaçları</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Hizmet sunumu ve geliştirilmesi</li>
      <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      <li>Müşteri ilişkileri yönetimi</li>
      <li>Güvenliğin sağlanması</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Veri Aktarımı</h3>
    <p className="text-bs-navygri mb-6">
      Kişisel verileriniz, yasal zorunluluklar ve hizmet gereklilikleri doğrultusunda:
    </p>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Yetkili kamu kurum ve kuruluşları</li>
      <li>Hizmet sağlayıcılar</li>
      <li>İş ortakları</li>
      <li>Ödeme kuruluşları ile paylaşılabilir</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Haklarınız</h3>
    <p className="text-bs-navygri mb-6">
      KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
    </p>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
      <li>İşlenen veriler hakkında bilgi talep etme</li>
      <li>İşlenme amacını öğrenme</li>
      <li>Aktarıldığı üçüncü kişileri öğrenme</li>
      <li>Düzeltme talep etme</li>
      <li>Silinmesini veya yok edilmesini isteme</li>
      <li>İşlemeye itiraz etme</li>
    </ul>

    <p className="text-bs-navygri">
      Haklarınızı kullanmak için <a href="mailto:kvkk@koalang.com" 
      className="text-bs-primary hover:text-bs-800">kvkk@koalang.com</a> adresinden 
      bizimle iletişime geçebilirsiniz.
    </p>
  </div>
);

const SecurityContent: React.FC = () => (
  <div className="prose max-w-none">
    <h2 className="text-2xl font-bold text-bs-navy mb-6">Güvenlik Politikası</h2>
    
    <p className="text-bs-navygri mb-6">
      koa:lang olarak, kullanıcılarımızın güvenliğini en üst düzeyde tutmak için 
      kapsamlı güvenlik önlemleri uyguluyoruz.
    </p>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Veri Güvenliği</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>SSL/TLS şifreleme</li>
      <li>Güvenli veri depolama</li>
      <li>Düzenli güvenlik denetimleri</li>
      <li>Erişim kontrolü ve izleme</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Hesap Güvenliği</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>İki faktörlü kimlik doğrulama</li>
      <li>Güçlü şifre politikası</li>
      <li>Oturum yönetimi</li>
      <li>Şüpheli aktivite izleme</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Güvenlik Önlemleri</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>DDoS koruması</li>
      <li>Güvenlik duvarı</li>
      <li>Düzenli yedekleme</li>
      <li>Güvenlik güncellemeleri</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Güvenlik İhlali Prosedürü</h3>
    <p className="text-bs-navygri mb-6">
      Olası bir güvenlik ihlali durumunda:
    </p>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Hızlı müdahale ve değerlendirme</li>
      <li>Kullanıcıları bilgilendirme</li>
      <li>Gerekli önlemleri alma</li>
      <li>İlgili kurumlarla iletişim</li>
    </ul>

    <h3 className="text-xl font-semibold text-bs-navy mb-4">Kullanıcı Sorumlulukları</h3>
    <ul className="list-disc pl-6 mb-6 text-bs-navygri space-y-2">
      <li>Güçlü şifre kullanımı</li>
      <li>Hesap bilgilerinin korunması</li>
      <li>Şüpheli aktivitelerin bildirimi</li>
      <li>Güncel yazılım kullanımı</li>
    </ul>

    <p className="text-bs-navygri">
      Güvenlik ile ilgili sorularınız için <a href="mailto:security@koalang.com" 
      className="text-bs-primary hover:text-bs-800">security@koalang.com</a> adresinden 
      bizimle iletişime geçebilirsiniz.
    </p>
  </div>
);
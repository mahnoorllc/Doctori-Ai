import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'bn' | 'es' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'chat.title': 'Chat with Doctori AI',
    'chat.subtitle': 'Your personal AI health assistant - Always here to help',
    'chat.placeholder': 'Describe your symptoms in detail...',
    'chat.send': 'Send',
    'chat.emergency': 'Emergency? Need immediate help?',
    'chat.call911': 'Call 911',
    'chat.disclaimer': '⚠️ This AI assistant provides general information only and is not a substitute for professional medical advice.',
    'chat.welcome': "Hello! I'm Doctori AI, your personal health assistant. I'm here to help you understand your symptoms and connect you with the right healthcare providers. Please describe your symptoms or health concerns in detail.\n\n⚠️ Remember: This is not medical advice and should not replace professional medical care. In case of emergency, please call 911 immediately.",
    'auth.loginRequired': 'Login Required for PDF Download',
    'auth.loginMessage': 'You can chat with our AI freely, but to download PDF reports, please log in or create an account.',
    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.guestContinue': 'Continue as Guest',
    'language.select': 'Select Language'
  },
  bn: {
    'chat.title': 'ডক্টরি এআই এর সাথে চ্যাট করুন',
    'chat.subtitle': 'আপনার ব্যক্তিগত এআই স্বাস্থ্য সহায়ক - সর্বদা সাহায্য করতে এখানে',
    'chat.placeholder': 'আপনার উপসর্গগুলি বিস্তারিত বর্ণনা করুন...',
    'chat.send': 'পাঠান',
    'chat.emergency': 'জরুরি? তাৎক্ষণিক সাহায্য প্রয়োজন?',
    'chat.call911': '৯৯৯ এ কল করুন',
    'chat.disclaimer': '⚠️ এই এআই সহায়ক শুধুমাত্র সাধারণ তথ্য প্রদান করে এবং পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।',
    'chat.welcome': "হ্যালো! আমি ডক্টরি এআই, আপনার ব্যক্তিগত স্বাস্থ্য সহায়ক। আমি আপনাকে আপনার উপসর্গগুলি বুঝতে এবং সঠিক স্বাস্থ্যসেবা প্রদানকারীদের সাথে যুক্ত করতে সাহায্য করতে এখানে আছি। অনুগ্রহ করে আপনার উপসর্গ বা স্বাস্থ্য উদ্বেগ বিস্তারিতভাবে বর্ণনা করুন।\n\n⚠️ মনে রাখবেন: এটি চিকিৎসা পরামর্শ নয় এবং পেশাদার চিকিৎসা যত্নের বিকল্প হওয়া উচিত নয়। জরুরি অবস্থায়, অনুগ্রহ করে অবিলম্বে ৯৯৯ এ কল করুন।",
    'auth.loginRequired': 'পিডিএফ ডাউনলোডের জন্য লগইন প্রয়োজন',
    'auth.loginMessage': 'আপনি আমাদের এআই এর সাথে অবাধে চ্যাট করতে পারেন, কিন্তু পিডিএফ রিপোর্ট ডাউনলোড করতে, অনুগ্রহ করে লগইন করুন বা অ্যাকাউন্ট তৈরি করুন।',
    'auth.login': 'লগইন',
    'auth.signup': 'সাইন আপ',
    'auth.guestContinue': 'গেস্ট হিসেবে চালিয়ে যান',
    'language.select': 'ভাষা নির্বাচন করুন'
  },
  es: {
    'chat.title': 'Chatea con Doctori AI',
    'chat.subtitle': 'Tu asistente personal de salud con IA - Siempre aquí para ayudar',
    'chat.placeholder': 'Describe tus síntomas en detalle...',
    'chat.send': 'Enviar',
    'chat.emergency': '¿Emergencia? ¿Necesitas ayuda inmediata?',
    'chat.call911': 'Llamar 911',
    'chat.disclaimer': '⚠️ Este asistente de IA proporciona solo información general y no es un sustituto del consejo médico profesional.',
    'chat.welcome': "¡Hola! Soy Doctori AI, tu asistente personal de salud. Estoy aquí para ayudarte a entender tus síntomas y conectarte con los proveedores de atención médica adecuados. Por favor describe tus síntomas o preocupaciones de salud en detalle.\n\n⚠️ Recuerda: Esto no es consejo médico y no debe reemplazar la atención médica profesional. En caso de emergencia, por favor llama al 911 inmediatamente.",
    'auth.loginRequired': 'Inicio de sesión requerido para descargar PDF',
    'auth.loginMessage': 'Puedes chatear libremente con nuestra IA, pero para descargar informes PDF, por favor inicia sesión o crea una cuenta.',
    'auth.login': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.guestContinue': 'Continuar como Invitado',
    'language.select': 'Seleccionar Idioma'
  },
  fr: {
    'chat.title': 'Chattez avec Doctori AI',
    'chat.subtitle': 'Votre assistant santé IA personnel - Toujours là pour vous aider',
    'chat.placeholder': 'Décrivez vos symptômes en détail...',
    'chat.send': 'Envoyer',
    'chat.emergency': 'Urgence ? Besoin d\'aide immédiate ?',
    'chat.call911': 'Appeler le 15',
    'chat.disclaimer': '⚠️ Cet assistant IA fournit uniquement des informations générales et ne remplace pas les conseils médicaux professionnels.',
    'chat.welcome': "Bonjour ! Je suis Doctori AI, votre assistant santé personnel. Je suis là pour vous aider à comprendre vos symptômes et vous connecter avec les bons prestataires de soins. Veuillez décrire vos symptômes ou préoccupations de santé en détail.\n\n⚠️ Rappel : Ceci n'est pas un conseil médical et ne doit pas remplacer les soins médicaux professionnels. En cas d'urgence, veuillez appeler le 15 immédiatement.",
    'auth.loginRequired': 'Connexion requise pour télécharger le PDF',
    'auth.loginMessage': 'Vous pouvez chatter librement avec notre IA, mais pour télécharger des rapports PDF, veuillez vous connecter ou créer un compte.',
    'auth.login': 'Se Connecter',
    'auth.signup': 'S\'inscrire',
    'auth.guestContinue': 'Continuer en tant qu\'invité',
    'language.select': 'Sélectionner la langue'
  },
  ar: {
    'chat.title': 'تحدث مع دكتوري الذكي',
    'chat.subtitle': 'مساعدك الصحي الشخصي بالذكاء الاصطناعي - موجود دائماً للمساعدة',
    'chat.placeholder': 'صف أعراضك بالتفصيل...',
    'chat.send': 'إرسال',
    'chat.emergency': 'حالة طوارئ؟ تحتاج مساعدة فورية؟',
    'chat.call911': 'اتصل بالطوارئ',
    'chat.disclaimer': '⚠️ يوفر هذا المساعد الذكي معلومات عامة فقط وليس بديلاً عن المشورة الطبية المهنية.',
    'chat.welcome': "مرحباً! أنا دكتوري الذكي، مساعدك الصحي الشخصي. أنا هنا لمساعدتك في فهم أعراضك وربطك بمقدمي الرعاية الصحية المناسبين. يرجى وصف أعراضك أو مخاوفك الصحية بالتفصيل.\n\n⚠️ تذكر: هذه ليست نصيحة طبية ولا يجب أن تحل محل الرعاية الطبية المهنية. في حالة الطوارئ، يرجى الاتصال بالطوارئ فوراً.",
    'auth.loginRequired': 'تسجيل الدخول مطلوب لتحميل PDF',
    'auth.loginMessage': 'يمكنك التحدث مع الذكاء الاصطناعي بحرية، ولكن لتحميل تقارير PDF، يرجى تسجيل الدخول أو إنشاء حساب.',
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.guestContinue': 'المتابعة كضيف',
    'language.select': 'اختر اللغة'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
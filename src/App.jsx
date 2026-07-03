import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Shield,
  Waves,
  Timer as TimerIcon,
  Activity,
  History,
  Settings,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Info,
  Save,
  Trash2,
  Play,
  Square,
  RefreshCw,
  Eye,
  EyeOff,
  MapPin,
  Stethoscope,
  Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * TRANSLATIONS
 */
const translations = {
  en: {
    appTitle: 'DEEPTRAIN',
    tagline: 'Zero-Knowledge Apnea Management',
    enterPasscode: 'Enter Passcode',
    deriveKeys: 'Derive Local Keys',
    secureSession: 'Secure Session',
    aesActive: 'AES-256-GCM Active',
    passcodeInfo: 'Your passcode is never stored. Keys are derived in memory using PBKDF2 and discarded when the session ends.',
    location: 'Bou Zadjar Training Station, Algeria',
    trainer: 'Trainer',
    logger: 'Logger',
    safety: 'Safety',
    logs: 'Logs',
    apneaTrainer: 'Apnea Trainer',
    co2Table: 'CO2 Table',
    o2Table: 'O2 Table',
    rounds: 'Rounds',
    baseHold: 'Base Hold (s)',
    startSession: 'Start {type} Session',
    tablePreview: 'Table Preview',
    round: 'Round',
    breathe: 'breathe',
    hold: 'hold',
    abort: 'Abort',
    sessionFlow: 'Session Flow',
    sessionComplete: 'Session Complete!',
    disciplineMsg: 'Excellent discipline. Your lung capacity and CO2 tolerance are improving.',
    saveToVault: 'Save to Encrypted Vault',
    done: 'Done',
    secureLogger: 'Secure Logger',
    distance: 'Distance (m)',
    duration: 'Duration (min)',
    trainingNotes: 'Training Notes',
    notesPlaceholder: 'Water temperature, visibility, feeling...',
    crampsLabel: 'Experienced Cramps',
    crampsSub: 'Toggle if you felt muscle tightness',
    encryptStore: 'Encrypt & Store Data',
    privacyProof: 'Privacy Proof (Client-Side)',
    jsonPayload: 'JSON PAYLOAD',
    ciphertext: 'AES-256-GCM CIPHERTEXT',
    waitingEncryption: 'Waiting for encryption...',
    trainingHistory: 'Training History',
    encryptedEntries: '{count} ENCRYPTED ENTRIES',
    noLogs: 'No training sessions found',
    decrypting: 'Decrypting vault with your key...',
    swimSession: 'Swim Session',
    unknown: 'Unknown',
    crampsReported: 'Cramps reported',
    safetyRecovery: 'Safety & Recovery',
    emergencyProtocols: 'Emergency Protocols',
    protocol1: 'NEVER DIVE ALONE. Always have a qualified safety buddy watching your surface transition.',
    protocol2: 'One up, one down rule is mandatory at Bou Zadjar deep zones.',
    crampTroubleshooting: 'Cramp Troubleshooting',
    resolutionSteps: 'Resolution Steps',
    bouZadjarRules: 'Bou Zadjar Rules',
    rule1: 'Strong currents near the rocky outcrops. Avoid diving during high swell.',
    rule2: 'Local fishing boats pass frequently. Use a high-visibility surface buoy.',
    rule3: "The 'Blue Hole' equivalent near the cliff is for advanced divers only (25m+).",
    customizeWeather: 'Customize Weather Metrics Manually',
    windSpeed: 'Wind Speed',
    weatherCondition: 'Weather Condition',
    airTemp: 'Air Temperature',
    humidity: 'Humidity',
    seaState: 'Sea State',
    seaTemp: 'Sea Temperature',
    visibility: 'Visibility',
    fishActivity: 'Fish Activity',
    fishHigh: 'High Activity 🐟',
    fishModerate: 'Moderate Activity 🎣',
    fishLow: 'Quiet 🌊',
    fbSearch: 'Facebook Search',
    ttSearch: 'TikTok Search',
    kmh: 'km/h',
    meters: 'm',
    edit: 'Edit',
    saveChanges: 'Save Changes',
    calfCramp: 'Calf Cramp',
    footCramp: 'Foot Arch Cramp',
    calfSteps: [
      'Stop swimming immediately and float on your back.',
      'Pull your toes toward your shin to stretch the muscle.',
      'Massage the area firmly while keeping the leg straight.',
      'Once relaxed, swim back using only your arms.'
    ],
    footSteps: [
      'Tuck your knee to your chest while floating.',
      'Forcefully pull your toes upward with your hand.',
      'Apply pressure to the center of your arch.',
      'Check fin tightness - often caused by restrictive foot pockets.'
    ]
  },
  fr: {
    appTitle: 'DEEPTRAIN',
    tagline: 'Gestion d\'apnée à connaissance nulle',
    enterPasscode: 'Entrez le code',
    deriveKeys: 'Dériver les clés locales',
    secureSession: 'Session sécurisée',
    aesActive: 'AES-256-GCM Actif',
    passcodeInfo: 'Votre code n\'est jamais stocké. Les clés sont dérivées en mémoire via PBKDF2 et jetées à la fin de la session.',
    location: 'Station d\'entraînement Bou Zadjar, Algérie',
    trainer: 'Entraîneur',
    logger: 'Journal',
    safety: 'Sécurité',
    logs: 'Logs',
    apneaTrainer: 'Entraîneur d\'apnée',
    co2Table: 'Table CO2',
    o2Table: 'Table O2',
    rounds: 'Cycles',
    baseHold: 'Maintien de base (s)',
    startSession: 'Démarrer session {type}',
    tablePreview: 'Aperçu de la table',
    round: 'Cycle',
    breathe: 'respirer',
    hold: 'bloquer',
    abort: 'Abandonner',
    sessionFlow: 'Flux de la session',
    sessionComplete: 'Session terminée !',
    disciplineMsg: 'Excellente discipline. Votre capacité pulmonaire et votre tolérance au CO2 s\'améliorent.',
    saveToVault: 'Enregistrer dans le coffre chiffré',
    done: 'Terminé',
    secureLogger: 'Journal sécurisé',
    distance: 'Distance (m)',
    duration: 'Durée (min)',
    trainingNotes: 'Notes d\'entraînement',
    notesPlaceholder: 'Température de l\'eau, visibilité, ressentis...',
    crampsLabel: 'Crampes ressenties',
    crampsSub: 'Cochez si vous avez senti des raideurs',
    encryptStore: 'Chiffrer et stocker les données',
    privacyProof: 'Preuve de confidentialité (Client)',
    jsonPayload: 'CHARGE UTILE JSON',
    ciphertext: 'TEXTE CHIFFRÉ AES-256-GCM',
    waitingEncryption: 'En attente du chiffrement...',
    trainingHistory: 'Historique d\'entraînement',
    encryptedEntries: '{count} ENTRÉES CHIFFRÉES',
    noLogs: 'Aucune session trouvée',
    decrypting: 'Déchiffrement du coffre avec votre clé...',
    swimSession: 'Session de natation',
    unknown: 'Inconnu',
    crampsReported: 'Crampes signalées',
    safetyRecovery: 'Sécurité et Récupération',
    emergencyProtocols: 'Protocoles d\'urgence',
    protocol1: 'NE JAMAIS PLONGER SEUL. Ayez toujours un binôme qualifié surveillant votre surface.',
    protocol2: 'La règle "un en bas, un en haut" est obligatoire dans les zones profondes de Bou Zadjar.',
    crampTroubleshooting: 'Dépannage des crampes',
    resolutionSteps: 'Étapes de résolution',
    bouZadjarRules: 'Règles de Bou Zadjar',
    rule1: 'Courants forts près des rochers. Évitez de plonger en cas de forte houle.',
    rule2: 'Les bateaux de pêche passent souvent. Utilisez une bouée de surface visible.',
    rule3: "L'équivalent du 'Blue Hole' près de la falaise est réservé aux plongeurs confirmés (25m+).",
    customizeWeather: 'Personnaliser les métriques météo manuellement',
    windSpeed: 'Vitesse du vent',
    weatherCondition: 'Condition météo',
    airTemp: 'Température de l\'air',
    humidity: 'Humidité',
    seaState: 'État de la mer',
    seaTemp: 'Température de la mer',
    visibility: 'Visibilité',
    fishActivity: 'Activité des poissons',
    fishHigh: 'Activité élevée 🐟',
    fishModerate: 'Activité modérée 🎣',
    fishLow: 'Calme 🌊',
    fbSearch: 'Recherche Facebook',
    ttSearch: 'Recherche TikTok',
    kmh: 'km/h',
    meters: 'm',
    edit: 'Modifier',
    saveChanges: 'Enregistrer les modifications',
    calfCramp: 'Crampe du mollet',
    footCramp: 'Crampe de la voûte plantaire',
    calfSteps: [
      'Arrêtez de nager immédiatement et flottez sur le dos.',
      'Tirez vos orteils vers votre tibia pour étirer le muscle.',
      'Massez fermement la zone tout en gardant la jambe tendue.',
      'Une fois relaxé, revenez à la nage en utilisant uniquement vos bras.'
    ],
    footSteps: [
      'Ramenez votre genou contre votre poitrine en flottant.',
      'Tirez vigoureusement vos orteils vers le haut avec votre main.',
      'Appliquez une pression au centre de votre voûte plantaire.',
      'Vérifiez le serrage des palmes - souvent causé par des chaussons trop serrés.'
    ]
  },
  ar: {
    appTitle: 'DEEPTRAIN',
    tagline: 'إدارة انقطاع النفس بخصوصية تامة',
    enterPasscode: 'أدخل رمز المرور',
    deriveKeys: 'اشتقاق المفاتيح المحلية',
    secureSession: 'جلسة آمنة',
    aesActive: 'نظام AES-256-GCM نشط',
    passcodeInfo: 'لا يتم تخزين رمز المرور الخاص بك أبدًا. يتم اشتقاق المفاتيح في الذاكرة باستخدام PBKDF2 ويتم التخلص منها عند انتهاء الجلسة.',
    location: 'محطة تدريب بوزجار، الجزائر',
    trainer: 'المدرب',
    logger: 'المسجل',
    safety: 'السلامة',
    logs: 'السجلات',
    apneaTrainer: 'مدرب انقطاع النفس',
    co2Table: 'جدول CO2',
    o2Table: 'جدول O2',
    rounds: 'الجولات',
    baseHold: 'وقت الحبس الأساسي (ث)',
    startSession: 'بدء جلسة {type}',
    tablePreview: 'معاينة الجدول',
    round: 'جولة',
    breathe: 'تنفس',
    hold: 'احبس',
    abort: 'إلغاء',
    sessionFlow: 'تدفق الجلسة',
    sessionComplete: 'اكتملت الجلسة!',
    disciplineMsg: 'انضباط ممتاز. قدرة رئتيك وتحملك لثاني أكسيد الكربون في تحسن.',
    saveToVault: 'حفظ في الخزنة المشفرة',
    done: 'تم',
    secureLogger: 'المسجل الآمن',
    distance: 'المسافة (متر)',
    duration: 'المدة (دقيقة)',
    trainingNotes: 'ملاحظات التدريب',
    notesPlaceholder: 'حرارة الماء، الرؤية، الشعور...',
    crampsLabel: 'عانيت من تشنجات',
    crampsSub: 'قم بالتبديل إذا شعرت بضيق في العضلات',
    encryptStore: 'تشفير وتخزين البيانات',
    privacyProof: 'إثبات الخصوصية (جهة العميل)',
    jsonPayload: 'حمولة JSON',
    ciphertext: 'نص مشفر AES-256-GCM',
    waitingEncryption: 'بانتظار التشفير...',
    trainingHistory: 'سجل التدريب',
    encryptedEntries: '{count} سجلات مشفرة',
    noLogs: 'لم يتم العثور على جلسات تدريب',
    decrypting: 'فك تشفير الخزنة باستخدام مفتاحك...',
    swimSession: 'جلسة سباحة',
    unknown: 'غير معروف',
    crampsReported: 'تم الإبلاغ عن تشنجات',
    safetyRecovery: 'السلامة والاستشفاء',
    emergencyProtocols: 'بروتوكولات الطوارئ',
    protocol1: 'لا تغص بمفردك أبدًا. يجب أن يراقبك زميل سلامة مؤهل دائمًا.',
    protocol2: 'قاعدة "واحد تحت، واحد فوق" إلزامية في مناطق بوزجار العميقة.',
    crampTroubleshooting: 'استكشاف أخطاء التشنجات',
    resolutionSteps: 'خطوات الحل',
    bouZadjarRules: 'قواعد بوزجار',
    rule1: 'تيارات قوية بالقرب من النتوءات الصخرية. تجنب الغوص أثناء الأمواج العالية.',
    rule2: 'تمر قوارب الصيد المحلية بشكل متكرر. استخدم عوامة سطحية عالية الوضوح.',
    rule3: "ما يعادل 'الثقب الأزرق' بالقرب من الجرف هو للغواصين المتقدمين فقط (25م+).",
    customizeWeather: 'تخصيص مقاييس الطقس يدويًا',
    windSpeed: 'سرعة الرياح',
    weatherCondition: 'حالة الطقس',
    airTemp: 'درجة الحرارة',
    humidity: 'الرطوبة',
    seaState: 'حالة البحر',
    seaTemp: 'حرارة الماء',
    visibility: 'الرؤية',
    fishActivity: 'حالة الأسماك',
    fishHigh: 'نشاط عالٍ 🐟',
    fishModerate: 'نشاط متوسط 🎣',
    fishLow: 'هدوء 🌊',
    fbSearch: 'بحث فيسبوك',
    ttSearch: 'بحث تيكتوك',
    kmh: 'كم/ساعة',
    meters: 'متر',
    edit: 'تعديل',
    saveChanges: 'حفظ التعديلات',
    calfCramp: 'تشنج ربلة الساق',
    footCramp: 'تشنج قوس القدم',
    calfSteps: [
      'توقف عن السباحة فورًا واطفُ على ظهرك.',
      'اسحب أصابع قدمك نحو ساقك لتمديد العضلة.',
      'دلك المنطقة بقوة مع إبقاء الساق مستقيمة.',
      'بمجرد الاسترخاء، اسبح عائدًا باستخدام ذراعيك فقط.'
    ],
    footSteps: [
      'قرب ركبتك من صدرك أثناء الطفو.',
      'اسحب أصابع قدمك بقوة للأعلى بيدك.',
      'اضغط على منتصف قوس قدمك.',
      'تحقق من ضيق الزعانف - غالبًا ما يكون بسبب جيوب القدم الضيقة.'
    ]
  }
};

/**
 * ORAN BEACH LOCATIONS
 */
const BEACHES = [
  { name: 'Bou Zadjar', lat: 35.575, lng: -1.135 },
  { name: 'Madagh', lat: 35.600, lng: -1.100 },
  { name: 'Les Andalouses', lat: 35.706, lng: -0.893 },
  { name: 'Bousfer', lat: 35.711, lng: -0.811 },
  { name: 'Ain El Turk', lat: 35.741, lng: -0.749 },
  { name: 'Cap Falcon', lat: 35.771, lng: -0.801 },
  { name: 'Kristel', lat: 35.826, lng: -0.483 }
];

/**
 * REAL-TIME WEATHER & MARINE DATA (Open-Meteo)
 */
async function fetchRealTimeData(lat, lng) {
  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility&timezone=auto`;
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,sea_surface_temperature`;

    const [fRes, mRes] = await Promise.all([fetch(forecastUrl), fetch(marineUrl)]);
    const fData = await fRes.json();
    const mData = await mRes.json();

    const curr = fData.current;
    const mar = mData.current;

    // Mapping weather codes to icons/text
    const weatherMap = {
      0: 'Sunny ☀️', 1: 'Mainly Clear 🌤️', 2: 'Partly Cloudy ⛅', 3: 'Overcast ☁️',
      45: 'Foggy 🌫️', 48: 'Rime Fog 🌫️', 51: 'Drizzle 🌧️', 61: 'Rain 🌧️',
      71: 'Snow ❄️', 95: 'Thunderstorm ⛈️'
    };

    const airTemp = Math.round(curr.temperature_2m);
    const seaTemp = Math.round(mar.sea_surface_temperature);
    const waveHeight = mar.wave_height;

    // Fish Status Logic
    let fishStatus = 'fishModerate';
    if (seaTemp >= 18 && seaTemp <= 24 && waveHeight < 0.8) fishStatus = 'fishHigh';
    else if (waveHeight > 1.5) fishStatus = 'fishLow';

    return {
      airTemp,
      humidity: curr.relative_humidity_2m,
      windSpeed: Math.round(curr.wind_speed_10m),
      weatherCond: weatherMap[curr.weather_code] || 'Clear ✨',
      visibility: Math.round(curr.visibility / 1000), // convert to km
      seaTemp,
      waveHeight,
      seaState: waveHeight < 0.5 ? 'Calm 🌊' : waveHeight < 1.2 ? 'Moderate 🌊' : 'Rough 🚫',
      fishStatus
    };
  } catch (e) {
    console.error("API Fetch Error", e);
    return null;
  }
}

/**
 * METEOROLOGICAL SIMULATOR (v3.1)
 * Deterministic weather based on date and spot.
 */
function getWeatherAndSeaState(dateStr, spotId) {
  const date = new Date(dateStr);
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Hash function for pseudo-randomness based on date/spot
  const seed = (month * 31 + day + spotId.length) % 100;

  // Seasonal Air Temp Base
  const airTempBase = [15, 16, 18, 22, 25, 28, 32, 33, 29, 24, 19, 16];
  const airTemp = airTempBase[month] + (seed % 5) - 2;

  // Seasonal Sea Temp Base
  const seaTempBase = [15, 14, 15, 17, 19, 22, 24, 25, 23, 21, 18, 16];
  const seaTemp = seaTempBase[month] + (seed % 2);

  // Wind Speed (Deterministic)
  const windSpeed = 5 + (seed % 25); // 5 to 30 km/h

  // Weather Condition
  let weatherCond = 'Sunny ☀️';
  if (windSpeed > 22) weatherCond = 'Windy 💨';
  else if (windSpeed > 15) weatherCond = 'Breezy 🍃';
  else if (seed % 10 > 7) weatherCond = 'Cloudy ⛅';

  // Sea State
  let seaState = 'Calm 🌊';
  if (windSpeed > 25) seaState = 'Rough 🚫';
  else if (windSpeed > 15) seaState = 'Moderate Swell 🌊';

  // Visibility (Base 20m, decays with rough sea)
  let visibility = 20 - (windSpeed / 3);
  if (seaState === 'Rough 🚫') visibility = Math.max(2, visibility - 5);
  visibility = Math.round(visibility);

  return {
    windSpeed,
    weatherCond,
    airTemp,
    seaState,
    seaTemp,
    visibility
  };
}

/**
 * CRYPTOGRAPHY UTILITIES
 */
const SALT = new TextEncoder().encode('bou-zadjar-salt-v1');
const ITERATIONS = 100000;

async function hashPasscode(passcode) {
  const msgUint8 = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 12);
}

async function deriveKey(passcode) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passcode),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(key, plaintext) {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function decryptData(key, ciphertext) {
  try {
    const combined = new Uint8Array(
      atob(ciphertext).split('').map((c) => c.charCodeAt(0))
    );
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    throw new Error('Decryption failed.');
  }
}

/**
 * UI COMPONENTS
 */

const Button = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-ocean-marine text-white hover:bg-ocean-marine/80 shadow-lg shadow-ocean-marine/20',
    ghost: 'bg-transparent text-ocean-cyan border border-ocean-cyan/30 hover:bg-ocean-cyan/10',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20',
    outline: 'border border-white/20 text-white hover:bg-white/5',
    cyan: 'bg-ocean-cyan text-ocean-deep font-bold hover:brightness-110'
  };
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

const Card = ({ children, className }) => (
  <div className={cn('bg-ocean-slate/50 backdrop-blur-md border border-white/10 rounded-2xl p-4', className)}>
    {children}
  </div>
);

/**
 * MAIN APPLICATION
 */

export default function App() {
  const [locale, setLocale] = useState('en');
  const t = translations[locale];
  const isRTL = locale === 'ar';

  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterKey, setMasterKey] = useState(null);
  const [activeTab, setActiveTab] = useState('trainer');
  const [preloadData, setPreloadData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [userHash, setUserHash] = useState('');

  // Persistence
  useEffect(() => {
    if (isUnlocked && userHash) {
      const saved = localStorage.getItem(`deeptrain_logs_${userHash}`);
      if (saved) {
        try {
          setLogs(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load logs from storage");
          setLogs([]);
        }
      } else {
        setLogs([]);
      }
    }
  }, [isUnlocked, userHash]);

  useEffect(() => {
    if (isUnlocked && userHash) {
      localStorage.setItem(`deeptrain_logs_${userHash}`, JSON.stringify(logs));
    }
  }, [logs, isUnlocked, userHash]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (passcode.length < 4) {
      setError(locale === 'ar' ? 'رمز المرور قصير جدًا' : 'Passcode too short');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const key = await deriveKey(passcode);
      const hash = await hashPasscode(passcode);
      setMasterKey(key);
      setUserHash(hash);
      setIsUnlocked(true);
    } catch (err) {
      setError(locale === 'ar' ? 'فشل الغاء القفل' : 'Unlock failed');
    } finally {
      setIsLoading(false);
    }
  };

  const LanguageSelector = () => (
    <div className="flex gap-2">
      {['en', 'fr', 'ar'].map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={cn(
            "w-8 h-8 rounded-full border text-[10px] font-bold transition-all",
            locale === lang ? "bg-ocean-cyan border-ocean-cyan text-ocean-deep" : "border-white/10 text-white/40 hover:text-white"
          )}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-ocean-deep flex flex-col items-center justify-center p-6 text-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        {/* Abstract background elements */}
        <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] bg-ocean-marine/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] end-[-10%] w-[40%] h-[40%] bg-ocean-cyan/10 blur-[100px] rounded-full" />

        <Card className="w-full max-w-md p-8 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-ocean-marine/20 p-4 rounded-full mb-4">
              <Waves className="w-12 h-12 text-ocean-cyan animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-center">
              {t.appTitle.split('TRAIN')[0]}<span className="text-ocean-cyan">TRAIN</span>
            </h1>
            <p className="text-white/60 text-center mt-2">{t.tagline}</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/40 uppercase tracking-widest block text-start ps-1">{t.enterPasscode}</label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={cn(
                    "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl focus:ring-2 focus:ring-ocean-cyan outline-none transition-all placeholder:tracking-normal placeholder:text-sm",
                    isRTL ? "tracking-[0.5em]" : "tracking-[1em]"
                  )}
                  placeholder="••••••"
                  autoFocus
                />
                <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/20", isRTL ? "left-4" : "right-4")} />
              </div>
            </div>

            {error && <p className="text-rose-400 text-sm text-center font-medium">{error}</p>}

            <Button type="submit" variant="cyan" className="w-full py-4 text-lg" disabled={isLoading}>
              {isLoading ? (
                <SVGLoader />
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  {t.deriveKeys}
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3 text-xs text-white/40 leading-relaxed">
            <Shield className="w-6 h-6 flex-shrink-0 text-ocean-marine" />
            <p>{t.passcodeInfo}</p>
          </div>
        </Card>

        <div className="mt-8 flex items-center gap-2 text-white/20">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{t.location}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-deep text-white flex flex-col max-w-2xl mx-auto border-x border-white/5" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* App Header */}
      <header className="sticky top-0 z-30 p-4 border-b border-white/10 bg-ocean-deep/80 backdrop-blur-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-ocean-marine p-1.5 rounded-lg">
            <Waves className="w-5 h-5 text-ocean-deep" />
          </div>
          <span className="font-bold tracking-tight">DEEPTRAIN</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="flex items-center gap-1.5 text-[10px] text-ocean-cyan font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-ocean-cyan animate-pulse" />
              {t.secureSession}
            </div>
            <span className="text-[10px] text-white/40">{t.aesActive}</span>
          </div>
          <button
            onClick={() => { setIsUnlocked(false); setMasterKey(null); setPasscode(''); }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Lock className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 p-4 overflow-y-auto">
        {activeTab === 'trainer' && (
          <ApneaTrainer t={t} onLogSession={(data) => {
            setActiveTab('logger');
            setPreloadData(data);
          }} />
        )}
        {activeTab === 'logger' && (
          <SecureLogger
            t={t}
            masterKey={masterKey}
            preloadData={preloadData}
            isEditing={!!preloadData?.isEditing}
            onSave={(newLog) => {
              if (preloadData?.isEditing) {
                const newLogs = [...logs];
                newLogs[preloadData.index] = newLog;
                setLogs(newLogs);
              } else {
                setLogs(prev => [newLog, ...prev]);
              }
              setActiveTab('history');
              setPreloadData(null);
            }}
          />
        )}
        {activeTab === 'safety' && (
          <SafetyHub t={t} />
        )}
        {activeTab === 'history' && (
          <TrainingHistory
            t={t}
            logs={logs}
            masterKey={masterKey}
            onEdit={(index, data) => {
               setPreloadData({ ...data, index, isEditing: true });
               setActiveTab('logger');
            }}
            onDelete={(index) => {
              const newLogs = [...logs];
              newLogs.splice(index, 1);
              setLogs(newLogs);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-ocean-slate/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex justify-between items-center z-40">
        <NavButton active={activeTab === 'trainer'} onClick={() => setActiveTab('trainer')} icon={<TimerIcon />} label={t.trainer} />
        <NavButton active={activeTab === 'logger'} onClick={() => setActiveTab('logger')} icon={<Activity />} label={t.logger} />
        <NavButton active={activeTab === 'safety'} onClick={() => setActiveTab('safety')} icon={<Stethoscope />} label={t.safety} />
        <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History />} label={t.logs} />
      </nav>
    </div>
  );
}

/**
 * APNEA TRAINER COMPONENT
 */
function ApneaTrainer({ t, onLogSession }) {
  const [tableType, setTableType] = useState('CO2'); // CO2 or O2
  const [rounds, setRounds] = useState(8);
  const [baseHold, setBaseHold] = useState(120); // seconds
  const [baseBreathe, setBaseBreathe] = useState(120); // seconds

  const [isActive, setIsActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState('breathe'); // 'breathe' or 'hold'
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const timerRef = useRef(null);

  const tableData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= rounds; i++) {
      let hold = baseHold;
      let breathe = baseBreathe;

      if (tableType === 'CO2') {
        breathe = Math.max(15, baseBreathe - (i - 1) * 15);
      } else {
        hold = baseHold + (i - 1) * 15;
      }

      data.push({ round: i, hold, breathe });
    }
    return data;
  }, [tableType, rounds, baseHold, baseBreathe]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (window.navigator.vibrate) window.navigator.vibrate(500);
      if (phase === 'breathe') {
        setPhase('hold');
        setTimeLeft(tableData[currentRound - 1].hold);
      } else {
        if (currentRound < rounds) {
          setCurrentRound((prev) => prev + 1);
          setPhase('breathe');
          setTimeLeft(tableData[currentRound].breathe);
        } else {
          setIsActive(false);
          setSessionCompleted(true);
          clearInterval(timerRef.current);
        }
      }
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, phase, currentRound, rounds, tableData]);

  const startSession = () => {
    setCurrentRound(1);
    setPhase('breathe');
    setTimeLeft(tableData[0].breathe);
    setIsActive(true);
    setSessionCompleted(false);
  };

  const stopSession = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = isActive ?
    (1 - (timeLeft / (phase === 'hold' ? tableData[currentRound-1].hold : tableData[currentRound-1].breathe))) * 100
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t.apneaTrainer}</h2>
        <div className="flex bg-white/5 rounded-lg p-1">
          <button
            onClick={() => !isActive && setTableType('CO2')}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", tableType === 'CO2' ? "bg-ocean-cyan text-ocean-deep" : "text-white/40")}
          >{t.co2Table}</button>
          <button
            onClick={() => !isActive && setTableType('O2')}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", tableType === 'O2' ? "bg-ocean-cyan text-ocean-deep" : "text-white/40")}
          >{t.o2Table}</button>
        </div>
      </header>

      {!isActive && !sessionCompleted ? (
        <Card className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase block text-start">{t.rounds}</label>
              <input
                type="number"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase block text-start">{t.baseHold}</label>
              <input
                type="number"
                value={baseHold}
                onChange={(e) => setBaseHold(parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xl font-bold"
              />
            </div>
          </div>
          <Button variant="cyan" className="w-full py-4" onClick={startSession}>
            <Play className={cn("w-5 h-5 fill-current", t.locale === 'ar' && "rotate-180")} />
            {t.startSession.replace('{type}', t[tableType.toLowerCase() + 'Table'])}
          </Button>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white/60 block text-start">{t.tablePreview}</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {tableData.map((r) => (
                <div key={r.round} className="flex justify-between items-center text-sm p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-white/40">{t.round} {r.round}</span>
                  <span className="font-mono text-xs">{t.breathe}: {formatTime(r.breathe)} / {t.hold}: {formatTime(r.hold)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : isActive ? (
        <div className="flex flex-col items-center gap-8 py-8">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Lung Simulator */}
            <LungSimulator phase={phase} isActive={isActive} progress={progress} className="absolute w-40 h-40 opacity-20" />

            {/* Animated Progress Ring */}
            <svg className="w-full h-full -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <circle
                cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={753.9}
                strokeDashoffset={753.9 - (753.9 * progress) / 100}
                className={cn("transition-all duration-1000", phase === 'hold' ? "text-rose-500" : "text-ocean-cyan")}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-xs font-bold uppercase tracking-widest", phase === 'hold' ? "text-rose-400" : "text-ocean-cyan")}>
                {t[phase]}
              </span>
              <span className="text-7xl font-mono font-bold leading-none my-2">{formatTime(timeLeft)}</span>
              <span className="text-white/40 text-sm">{t.round} {currentRound} / {rounds}</span>
            </div>
          </div>

          <div className="w-full flex gap-4">
            <Button variant="outline" className="flex-1 py-4" onClick={stopSession}>
              <Square className="w-5 h-5 fill-current" />
              {t.abort}
            </Button>
          </div>

          <div className="w-full space-y-4">
             <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold text-white/60">{t.sessionFlow}</h3>
                <Zap className="w-4 h-4 text-ocean-cyan animate-pulse" />
             </div>
             <div className="flex gap-1">
                {tableData.map((r) => (
                  <div key={r.round} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        r.round < currentRound ? "bg-ocean-marine" : r.round === currentRound ? "bg-ocean-cyan" : "bg-transparent"
                      )}
                    />
                  </div>
                ))}
             </div>
          </div>
        </div>
      ) : (
        <Card className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-ocean-cyan/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-ocean-cyan" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{t.sessionComplete}</h3>
            <p className="text-white/60 mt-2">{t.disciplineMsg}</p>
          </div>
          <div className="flex flex-col gap-3">
             <Button variant="cyan" className="py-4" onClick={() => onLogSession({
               type: 'apnea',
               tableType,
               rounds,
               timestamp: new Date().toISOString()
             })}>
               <Save className="w-5 h-5" />
               {t.saveToVault}
             </Button>
             <Button variant="ghost" onClick={() => setSessionCompleted(false)}>
               {t.done}
             </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * SECURE LOGGER COMPONENT
 */
function SecureLogger({ t, masterKey, preloadData, onSave, isEditing = false }) {
  const [formData, setFormData] = useState({
    distance: '',
    duration: '',
    location: 'Bou Zadjar',
    lat: 35.575,
    lng: -1.135,
    notes: '',
    cramps: false,
    manualWeather: false,
    windSpeed: '',
    weatherCond: '',
    airTemp: '',
    humidity: '',
    seaState: '',
    seaTemp: '',
    visibility: '',
    fishStatus: '',
    ...preloadData
  });

  // Auto-populate weather if not manual and not already set
  useEffect(() => {
    async function updateWeather() {
      if (!formData.manualWeather && !isEditing) {
        const data = await fetchRealTimeData(formData.lat, formData.lng);
        if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      }
    }
    updateWeather();
  }, [formData.manualWeather, formData.lat, formData.lng, isEditing]);

  const [encryptionStatus, setEncryptionStatus] = useState('idle'); // idle, encrypting, done
  const [ciphertextPreview, setCiphertextPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setEncryptionStatus('encrypting');

    const plaintext = JSON.stringify({
      ...formData,
      timestamp: new Date().toISOString()
    });

    await new Promise(r => setTimeout(r, 800));

    try {
      const encrypted = await encryptData(masterKey, plaintext);

      // Decompose for visualization
      const binary = atob(encrypted);
      const iv = btoa(binary.slice(0, 12));
      const tag = btoa(binary.slice(-16));
      const body = btoa(binary.slice(12, -16));

      setCiphertextPreview({ iv, tag, body, full: encrypted });
      setEncryptionStatus('done');

      await new Promise(r => setTimeout(r, 1200));
      onSave(encrypted);
    } catch (e) {
      console.error(e);
      setEncryptionStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">{t.secureLogger}</h2>

      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-white/40 uppercase font-bold block text-start">{t.distance}</label>
            <input
              type="number"
              value={formData.distance}
              onChange={e => setFormData({...formData, distance: e.target.value})}
              placeholder="e.g. 500"
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/40 uppercase font-bold block text-start">{t.duration}</label>
            <input
              type="number"
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g. 30"
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase font-bold block text-start ps-1">{t.location.split(',')[0]}</label>
          <div className="relative">
            <MapPin className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-cyan", t.locale === 'ar' ? 'right-3' : 'left-3')} />
            <select
              value={formData.location}
              onChange={e => {
                const b = BEACHES.find(beach => beach.name === e.target.value);
                setFormData({...formData, location: b.name, lat: b.lat, lng: b.lng});
              }}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 ps-10 appearance-none focus:ring-1 focus:ring-ocean-cyan outline-none"
            >
              {BEACHES.map(b => (
                <option key={b.name} value={b.name} className="bg-ocean-deep text-white text-start">{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden h-40 border border-white/10">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${formData.lat},${formData.lng}&z=14&output=embed`}
            allowFullScreen
          />
        </div>

        <div className="flex gap-2">
           <a
             href={`https://www.facebook.com/search/top?q=${encodeURIComponent('حالة البحر ' + formData.location)}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex-1 bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-lg py-2 text-[10px] font-bold text-[#1877F2] flex items-center justify-center gap-2"
           >
              {t.fbSearch}
           </a>
           <a
             href={`https://www.tiktok.com/search?q=${encodeURIComponent('حالة البحر ' + formData.location)}`}
             target="_blank"
             rel="noopener noreferrer"
             className="flex-1 bg-black/20 border border-white/10 rounded-lg py-2 text-[10px] font-bold text-white flex items-center justify-center gap-2"
           >
              {t.ttSearch}
           </a>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase font-bold block text-start">{t.trainingNotes}</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            placeholder={t.notesPlaceholder}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 min-h-[80px]"
          />
        </div>

        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={formData.cramps}
            onChange={e => setFormData({...formData, cramps: e.target.checked})}
            className="w-5 h-5 rounded border-white/10 bg-black/20 text-ocean-cyan focus:ring-ocean-cyan"
          />
          <div className="flex-1 text-start">
            <div className="text-sm font-bold">{t.crampsLabel}</div>
            <div className="text-[10px] text-white/40">{t.crampsSub}</div>
          </div>
          <AlertTriangle className={cn("w-5 h-5", formData.cramps ? "text-rose-500" : "text-white/10")} />
        </label>

        <div className="pt-4 space-y-4 border-t border-white/5">
          <label className="flex items-center justify-between p-3 bg-ocean-cyan/5 border border-ocean-cyan/10 rounded-xl cursor-pointer">
             <div className="text-start">
                <div className="text-xs font-bold text-ocean-cyan">{t.customizeWeather}</div>
             </div>
             <input
                type="checkbox"
                checked={formData.manualWeather || isEditing}
                disabled={isEditing}
                onChange={e => setFormData({...formData, manualWeather: e.target.checked})}
                className="w-5 h-5 rounded border-white/10 bg-black/20 text-ocean-cyan focus:ring-ocean-cyan"
             />
          </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" dir="ltr">
             <WeatherMetricField
                label={t.windSpeed}
                value={formData.windSpeed}
                unit={t.kmh}
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, windSpeed: v})}
             />
             <WeatherMetricField
                label={t.weatherCondition}
                value={formData.weatherCond}
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, weatherCond: v})}
             />
             <WeatherMetricField
                label={t.airTemp}
                value={formData.airTemp}
                unit="°C"
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, airTemp: v})}
             />
             <WeatherMetricField
                label={t.humidity}
                value={formData.humidity}
                unit="%"
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, humidity: v})}
             />
             <WeatherMetricField
                label={t.seaState}
                value={formData.seaState}
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, seaState: v})}
             />
             <WeatherMetricField
                label={t.seaTemp}
                value={formData.seaTemp}
                unit="°C"
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, seaTemp: v})}
             />
             <WeatherMetricField
                label={t.visibility}
                value={formData.visibility}
                unit="km"
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, visibility: v})}
             />
             <WeatherMetricField
                label={t.fishActivity}
                value={t[formData.fishStatus] || formData.fishStatus}
                disabled={!formData.manualWeather && !isEditing}
                onChange={v => setFormData({...formData, fishStatus: v})}
             />
          </div>
        </div>

        <Button
          variant="cyan"
          className="w-full py-4 mt-4"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <SVGLoader /> : <Shield className="w-5 h-5" />}
          {isEditing ? t.saveChanges : t.encryptStore}
        </Button>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-ocean-cyan" />
            {t.privacyProof}
          </h3>
          <div className="px-2 py-0.5 rounded-full bg-ocean-cyan/10 border border-ocean-cyan/20 text-[8px] text-ocean-cyan font-bold uppercase">
            {encryptionStatus}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-32">
           <div className="bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden text-start">
              <div className="text-[9px] text-white/20 mb-2 font-mono">{t.jsonPayload}</div>
              <pre className="text-[10px] text-ocean-marine font-mono leading-tight whitespace-pre-wrap">
                {JSON.stringify(formData, null, 2)}
              </pre>
           </div>
           <div className="bg-ocean-deep rounded-xl p-3 border border-ocean-cyan/20 overflow-hidden relative text-start">
              <div className="text-[9px] text-ocean-cyan/40 mb-2 font-mono uppercase">{t.ciphertext}</div>
              {encryptionStatus === 'encrypting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-ocean-deep/80 backdrop-blur-sm z-10">
                   <RefreshCw className="w-6 h-6 text-ocean-cyan animate-spin" />
                </div>
              )}
              <div className="text-[10px] text-ocean-cyan font-mono break-all leading-tight opacity-60 space-y-2">
                {!ciphertextPreview ? t.waitingEncryption : (
                  <>
                    <div><span className="opacity-40">[IV]</span> {ciphertextPreview.iv}</div>
                    <div><span className="opacity-40">[TAG]</span> {ciphertextPreview.tag}</div>
                    <div><span className="opacity-40">[BODY]</span> {ciphertextPreview.body}</div>
                  </>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TRAINING HISTORY COMPONENT
 */
function TrainingHistory({ t, logs, masterKey, onEdit, onDelete }) {
  const [decryptedLogs, setDecryptedLogs] = useState([]);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const decryptAll = async () => {
    setIsDecrypting(true);
    try {
      const results = await Promise.all(
        logs.map(async (l) => {
          const raw = await decryptData(masterKey, l);
          return JSON.parse(raw);
        })
      );
      setDecryptedLogs(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDecrypting(false);
    }
  };

  useEffect(() => {
    if (logs.length > 0) decryptAll();
  }, [logs]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-start">{t.trainingHistory}</h2>
        <div className="text-[10px] bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-white/40 font-mono">
          {t.encryptedEntries.replace('{count}', logs.length)}
        </div>
      </div>

      {logs.length > 0 && !isDecrypting && (
        <div className="animate-in fade-in duration-700">
           <TrainingChart data={decryptedLogs} t={t} />
        </div>
      )}

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <History className="w-16 h-16 mb-4 opacity-10" />
          <p>{t.noLogs}</p>
        </div>
      ) : isDecrypting ? (
        <div className="flex flex-col items-center justify-center py-20">
           <RefreshCw className="w-8 h-8 text-ocean-cyan animate-spin mb-4" />
           <p className="text-sm text-white/40">{t.decrypting}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {decryptedLogs.map((log, i) => (
            <Card key={i} className="group relative overflow-hidden text-start">
               <div className="absolute top-0 bottom-0 w-1 bg-ocean-cyan opacity-0 group-hover:opacity-100 transition-opacity start-0" />
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-ocean-marine/10 p-2 rounded-lg">
                      {log.type === 'apnea' ? <TimerIcon className="w-4 h-4 text-ocean-cyan" /> : <Waves className="w-4 h-4 text-ocean-marine" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{log.type === 'apnea' ? t[log.tableType.toLowerCase() + 'Table'] : t.swimSession}</h4>
                      <p className="text-[10px] text-white/40">{new Date(log.timestamp).toLocaleDateString()} @ {log.location || t.unknown}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(i, decryptedLogs[i])}
                      className="p-2 text-white/10 hover:text-ocean-cyan transition-colors"
                      title={t.edit}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(i)}
                      className="p-2 text-white/10 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-4">
                  {log.distance && (
                    <div className="bg-black/20 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-white/40 uppercase">{t.distance.split(' ')[0]}</div>
                      <div className="text-xs font-bold text-ocean-cyan">{log.distance}m</div>
                    </div>
                  )}
                  {log.duration && (
                    <div className="bg-black/20 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-white/40 uppercase">{t.duration.split(' ')[0]}</div>
                      <div className="text-xs font-bold text-ocean-cyan">{log.duration} min</div>
                    </div>
                  )}
                  {log.rounds && (
                    <div className="bg-black/20 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-white/40 uppercase">{t.rounds}</div>
                      <div className="text-xs font-bold text-ocean-cyan">{log.rounds}</div>
                    </div>
                  )}
               </div>

               {log.notes && (
                 <p className="mt-3 text-[10px] text-white/60 leading-relaxed italic border-s-2 border-white/5 ps-2">{log.notes}</p>
               )}

               {log.cramps && (
                 <div className="mt-2 flex items-center gap-1.5 text-rose-400 text-[10px] font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    {t.crampsReported}
                 </div>
               )}

               <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-2" dir="ltr">
                  <div className="text-[8px] text-white/30">
                    <div className="uppercase">{t.windSpeed}</div>
                    <div className="text-white/60 font-mono">{log.windSpeed} {t.kmh}</div>
                  </div>
                  <div className="text-[8px] text-white/30">
                    <div className="uppercase">{t.seaState}</div>
                    <div className="text-white/60 font-mono">{log.seaState}</div>
                  </div>
                  <div className="text-[8px] text-white/30">
                    <div className="uppercase">{t.visibility}</div>
                    <div className="text-white/60 font-mono">{log.visibility} km</div>
                  </div>
                  <div className="text-[8px] text-white/30 col-span-2">
                    <div className="uppercase">{t.fishActivity}</div>
                    <div className="text-white/60 font-mono">{t[log.fishStatus] || log.fishStatus}</div>
                  </div>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * SAFETY HUB COMPONENT
 */
function SafetyHub({ t }) {
  const [activeFlow, setActiveFlow] = useState(null);

  const CRAMP_FLOWS = {
    calf: {
      title: t.calfCramp,
      steps: t.calfSteps
    },
    foot: {
      title: t.footCramp,
      steps: t.footSteps
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-start">
      <h2 className="text-2xl font-bold">{t.safetyRecovery}</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-rose-500">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">{t.emergencyProtocols}</h3>
        </div>

        <Card className="border-rose-500/20 bg-rose-500/5">
           <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <div className="bg-rose-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">1</div>
                 <p className="text-sm font-medium">{t.protocol1}</p>
              </div>
              <div className="flex items-start gap-3">
                 <div className="bg-rose-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">2</div>
                 <p className="text-sm font-medium">{t.protocol2}</p>
              </div>
           </div>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-ocean-cyan">
          <Activity className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">{t.crampTroubleshooting}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
           {Object.entries(CRAMP_FLOWS).map(([key, flow]) => (
             <button
               key={key}
               onClick={() => setActiveFlow(key)}
               className={cn(
                 "p-4 rounded-2xl border text-start transition-all",
                 activeFlow === key ? "bg-ocean-cyan border-ocean-cyan text-ocean-deep shadow-lg shadow-ocean-cyan/20" : "bg-white/5 border-white/10 text-white"
               )}
             >
               <Zap className={cn("w-5 h-5 mb-2", activeFlow === key ? "text-ocean-deep" : "text-ocean-cyan")} />
               <div className="font-bold text-sm">{flow.title}</div>
             </button>
           ))}
        </div>

        {activeFlow && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <Card className="bg-ocean-cyan/10 border-ocean-cyan/20">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-ocean-cyan font-bold text-xs uppercase">{t.resolutionSteps}</span>
                  <button onClick={() => setActiveFlow(null)} className="text-ocean-cyan/60 hover:text-ocean-cyan">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
               <div className="space-y-3">
                  {CRAMP_FLOWS[activeFlow].steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                       <CheckCircle2 className="w-4 h-4 text-ocean-cyan mt-0.5 flex-shrink-0" />
                       <p className="text-xs text-white/80 leading-relaxed">{step}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-ocean-marine">
          <MapPin className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">{t.bouZadjarRules}</h3>
        </div>

        <Card className="space-y-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ocean-marine flex-shrink-0" />
              <p className="text-xs text-white/70">{t.rule1}</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ocean-marine flex-shrink-0" />
              <p className="text-xs text-white/70">{t.rule2}</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ocean-marine flex-shrink-0" />
              <p className="text-xs text-white/70">{t.rule3}</p>
           </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * LUNG SIMULATOR COMPONENT (SVG Animation)
 */
function LungSimulator({ phase, isActive, progress, className }) {
  // Animation scale based on phase and progress
  // Breathe phase: lungs expand (1.0 -> 1.3)
  // Hold phase: lungs slowly contract or stay still (1.3 -> 1.1)
  const scale = useMemo(() => {
    if (!isActive) return 1;
    if (phase === 'breathe') {
      return 1 + (progress / 100) * 0.3;
    } else {
      return 1.3 - (progress / 100) * 0.2;
    }
  }, [phase, isActive, progress]);

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("transition-transform duration-1000 ease-in-out", className)}
      style={{ transform: `scale(${scale})` }}
    >
      <defs>
        <radialGradient id="lungGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00B4D8" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {/* Left Lung */}
      <path
        d="M95,40 C70,40 50,60 50,100 C50,140 70,170 95,170 C100,170 100,160 100,140 L100,60 C100,40 100,40 95,40 Z"
        fill="url(#lungGradient)"
        className={cn("transition-all duration-1000", phase === 'hold' ? "brightness-75" : "brightness-125")}
      />
      {/* Right Lung */}
      <path
        d="M105,40 C130,40 150,60 150,100 C150,140 130,170 105,170 C100,170 100,160 100,140 L100,60 C100,40 100,40 105,40 Z"
        fill="url(#lungGradient)"
        className={cn("transition-all duration-1000", phase === 'hold' ? "brightness-75" : "brightness-125")}
      />
      {/* Trachea */}
      <rect x="98" y="20" width="4" height="30" rx="2" fill="#00F5D4" opacity="0.4" />
    </svg>
  );
}

/**
 * CUSTOM SVG BAR CHART COMPONENT
 */
function TrainingChart({ data, t }) {
  if (!data || data.length === 0) return null;

  const maxDistance = Math.max(...data.map(d => parseInt(d.distance) || 0), 100);
  const chartHeight = 120;
  const barWidth = 40;
  const gap = 12;

  return (
    <Card className="bg-ocean-deep/40 border-ocean-cyan/10">
      <div className="text-[10px] text-white/20 uppercase font-bold mb-4 tracking-widest">{t.distance} (m)</div>
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <svg
          width={data.length * (barWidth + gap)}
          height={chartHeight}
          className="overflow-visible"
        >
          {data.map((d, i) => {
            const dist = parseInt(d.distance) || 0;
            const h = (dist / maxDistance) * chartHeight;
            const x = i * (barWidth + gap);
            return (
              <g key={i} className="group">
                <rect
                  x={x}
                  y={chartHeight - h}
                  width={barWidth}
                  height={h}
                  rx="6"
                  fill={d.type === 'apnea' ? '#00F5D4' : '#00B4D8'}
                  className="opacity-60 group-hover:opacity-100 transition-all duration-500"
                >
                  <animate attributeName="height" from="0" to={h} dur="1s" fill="freeze" />
                  <animate attributeName="y" from={chartHeight} to={chartHeight - h} dur="1s" fill="freeze" />
                </rect>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - h - 6}
                  textAnchor="middle"
                  fill="#00F5D4"
                  className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {dist}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

/**
 * CUSTOM SVG LOADER
 */
function SVGLoader({ className }) {
  return (
    <svg viewBox="0 0 50 50" className={cn("w-6 h-6", className)}>
      <circle
        cx="25" cy="25" r="20"
        fill="none" stroke="currentColor" strokeWidth="4"
        strokeDasharray="31.4 31.4" strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25" to="360 25 25"
          dur="1s" repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/**
 * WEATHER METRIC FIELD COMPONENT
 */
function WeatherMetricField({ label, value, unit, disabled, onChange }) {
  return (
    <div className="space-y-1">
       <label className="text-[9px] text-white/40 uppercase font-bold block text-start truncate">{label}</label>
       <div className="relative">
          <input
            type="text"
            value={value}
            disabled={disabled}
            onChange={e => onChange(e.target.value)}
            className={cn(
              "w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono transition-colors",
              disabled ? "opacity-50" : "focus:border-ocean-cyan/50"
            )}
          />
          {unit && <span className="absolute end-2 top-1/2 -translate-y-1/2 text-[8px] text-white/20">{unit}</span>}
       </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all",
        active ? "text-ocean-cyan" : "text-white/40 hover:text-white/60"
      )}
    >
      {React.cloneElement(icon, { className: "w-6 h-6" })}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

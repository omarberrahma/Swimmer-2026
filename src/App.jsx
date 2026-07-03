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
  Stethoscope
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * CRYPTOGRAPHY UTILITIES
 */
const SALT = new TextEncoder().encode('bou-zadjar-salt-v1');
const ITERATIONS = 100000;

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
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterKey, setMasterKey] = useState(null);
  const [activeTab, setActiveTab] = useState('trainer');
  const [preloadData, setPreloadData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('deeptrain_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load logs from storage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('deeptrain_logs', JSON.stringify(logs));
  }, [logs]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (passcode.length < 4) {
      setError('Passcode too short');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const key = await deriveKey(passcode);
      // In a real app, we might try to decrypt a "stored proof" string to verify the passcode
      // For this simulation, we'll just accept it and derive the key
      setMasterKey(key);
      setIsUnlocked(true);
    } catch (err) {
      setError('Unlock failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-ocean-deep flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ocean-marine/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ocean-cyan/10 blur-[100px] rounded-full" />

        <Card className="w-full max-w-md p-8 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-ocean-marine/20 p-4 rounded-full mb-4">
              <Waves className="w-12 h-12 text-ocean-cyan animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-center">DEEP<span className="text-ocean-cyan">TRAIN</span></h1>
            <p className="text-white/60 text-center mt-2">Zero-Knowledge Apnea Management</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/40 uppercase tracking-widest ml-1">Enter Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-ocean-cyan outline-none transition-all placeholder:tracking-normal placeholder:text-sm"
                  placeholder="••••••"
                  autoFocus
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              </div>
            </div>

            {error && <p className="text-rose-400 text-sm text-center font-medium">{error}</p>}

            <Button type="submit" variant="cyan" className="w-full py-4 text-lg" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Derive Local Keys
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3 text-xs text-white/40 leading-relaxed">
            <Shield className="w-6 h-6 flex-shrink-0 text-ocean-marine" />
            <p>
              Your passcode is never stored. Keys are derived in memory using PBKDF2 and discarded when the session ends.
            </p>
          </div>
        </Card>

        <div className="mt-8 flex items-center gap-2 text-white/20">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Bou Zadjar Training Station, Algeria</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-deep text-white flex flex-col max-w-2xl mx-auto border-x border-white/5">
      {/* App Header */}
      <header className="sticky top-0 z-30 p-4 border-b border-white/10 bg-ocean-deep/80 backdrop-blur-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-ocean-marine p-1.5 rounded-lg">
            <Waves className="w-5 h-5 text-ocean-deep" />
          </div>
          <span className="font-bold tracking-tight">DEEPTRAIN</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-[10px] text-ocean-cyan font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-ocean-cyan animate-pulse" />
              Secure Session
            </div>
            <span className="text-[10px] text-white/40">AES-256-GCM Active</span>
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
          <ApneaTrainer onLogSession={(data) => {
            // This will be handled by the logger logic in next steps
            setActiveTab('logger');
            setPreloadData(data);
          }} />
        )}
        {activeTab === 'logger' && (
          <SecureLogger
            masterKey={masterKey}
            preloadData={preloadData}
            onSave={(newLog) => {
              setLogs(prev => [newLog, ...prev]);
              setActiveTab('history');
              setPreloadData(null);
            }}
          />
        )}
        {activeTab === 'safety' && (
          <SafetyHub />
        )}
        {activeTab === 'history' && (
          <TrainingHistory
            logs={logs}
            masterKey={masterKey}
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
        <NavButton active={activeTab === 'trainer'} onClick={() => setActiveTab('trainer')} icon={<TimerIcon />} label="Trainer" />
        <NavButton active={activeTab === 'logger'} onClick={() => setActiveTab('logger')} icon={<Activity />} label="Logger" />
        <NavButton active={activeTab === 'safety'} onClick={() => setActiveTab('safety')} icon={<Stethoscope />} label="Safety" />
        <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History />} label="Logs" />
      </nav>
    </div>
  );
}

/**
 * APNEA TRAINER COMPONENT
 */
function ApneaTrainer({ onLogSession }) {
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
        // CO2 Table: Fixed hold, decreasing recovery
        breathe = Math.max(15, baseBreathe - (i - 1) * 15);
      } else {
        // O2 Table: Increasing hold, fixed recovery
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
        <h2 className="text-2xl font-bold">Apnea Trainer</h2>
        <div className="flex bg-white/5 rounded-lg p-1">
          <button
            onClick={() => !isActive && setTableType('CO2')}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", tableType === 'CO2' ? "bg-ocean-cyan text-ocean-deep" : "text-white/40")}
          >CO2</button>
          <button
            onClick={() => !isActive && setTableType('O2')}
            className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", tableType === 'O2' ? "bg-ocean-cyan text-ocean-deep" : "text-white/40")}
          >O2</button>
        </div>
      </header>

      {!isActive && !sessionCompleted ? (
        <Card className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase">Rounds</label>
              <input
                type="number"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xl font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase">Base Hold (s)</label>
              <input
                type="number"
                value={baseHold}
                onChange={(e) => setBaseHold(parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xl font-bold"
              />
            </div>
          </div>
          <Button variant="cyan" className="w-full py-4" onClick={startSession}>
            <Play className="w-5 h-5 fill-current" />
            Start {tableType} Session
          </Button>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white/60">Table Preview</h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {tableData.map((r) => (
                <div key={r.round} className="flex justify-between items-center text-sm p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-white/40">Round {r.round}</span>
                  <span className="font-mono">Breathe: {formatTime(r.breathe)} / Hold: {formatTime(r.hold)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : isActive ? (
        <div className="flex flex-col items-center gap-8 py-8">
          <div className="relative w-64 h-64 flex items-center justify-center">
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
                {phase}
              </span>
              <span className="text-7xl font-mono font-bold leading-none my-2">{formatTime(timeLeft)}</span>
              <span className="text-white/40 text-sm">Round {currentRound} of {rounds}</span>
            </div>
          </div>

          <div className="w-full flex gap-4">
            <Button variant="outline" className="flex-1 py-4" onClick={stopSession}>
              <Square className="w-5 h-5 fill-current" />
              Abort
            </Button>
          </div>

          <div className="w-full space-y-4">
             <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold text-white/60">Session Flow</h3>
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
            <h3 className="text-2xl font-bold">Session Complete!</h3>
            <p className="text-white/60 mt-2">Excellent discipline. Your lung capacity and CO2 tolerance are improving.</p>
          </div>
          <div className="flex flex-col gap-3">
             <Button variant="cyan" className="py-4" onClick={() => onLogSession({
               type: 'apnea',
               tableType,
               rounds,
               timestamp: new Date().toISOString()
             })}>
               <Save className="w-5 h-5" />
               Save to Encrypted Vault
             </Button>
             <Button variant="ghost" onClick={() => setSessionCompleted(false)}>
               Done
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
function SecureLogger({ masterKey, preloadData, onSave }) {
  const [formData, setFormData] = useState({
    distance: '',
    duration: '',
    location: 'Bou Zadjar Beach',
    notes: '',
    cramps: false,
    ...preloadData
  });

  const [encryptionStatus, setEncryptionStatus] = useState('idle'); // idle, encrypting, done
  const [ciphertextPreview, setCiphertextPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setEncryptionStatus('encrypting');

    const plaintext = JSON.stringify({
      ...formData,
      timestamp: new Date().toISOString()
    });

    // Visual delay to show the encryption process
    await new Promise(r => setTimeout(r, 800));

    try {
      const encrypted = await encryptData(masterKey, plaintext);
      setCiphertextPreview(encrypted);
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
      <h2 className="text-2xl font-bold">Secure Logger</h2>

      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-white/40 uppercase font-bold">Distance (m)</label>
            <input
              type="number"
              value={formData.distance}
              onChange={e => setFormData({...formData, distance: e.target.value})}
              placeholder="e.g. 500"
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-white/40 uppercase font-bold">Duration (min)</label>
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
          <label className="text-[10px] text-white/40 uppercase font-bold">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean-cyan" />
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 pl-10"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase font-bold">Training Notes</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            placeholder="Water temperature, visibility, feeling..."
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
          <div className="flex-1">
            <div className="text-sm font-bold">Experienced Cramps</div>
            <div className="text-[10px] text-white/40">Toggle if you felt muscle tightness</div>
          </div>
          <AlertTriangle className={cn("w-5 h-5", formData.cramps ? "text-rose-500" : "text-white/10")} />
        </label>

        <Button
          variant="cyan"
          className="w-full py-4 mt-4"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
          Encrypt & Store Data
        </Button>
      </Card>

      {/* PRIVACY PROOF VISUALIZER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-ocean-cyan" />
            Privacy Proof (Client-Side)
          </h3>
          <div className="px-2 py-0.5 rounded-full bg-ocean-cyan/10 border border-ocean-cyan/20 text-[8px] text-ocean-cyan font-bold uppercase">
            {encryptionStatus}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-32">
           <div className="bg-black/40 rounded-xl p-3 border border-white/5 overflow-hidden">
              <div className="text-[9px] text-white/20 mb-2 font-mono">JSON PAYLOAD</div>
              <pre className="text-[10px] text-ocean-marine font-mono leading-tight whitespace-pre-wrap">
                {JSON.stringify(formData, null, 2)}
              </pre>
           </div>
           <div className="bg-ocean-deep rounded-xl p-3 border border-ocean-cyan/20 overflow-hidden relative">
              <div className="text-[9px] text-ocean-cyan/40 mb-2 font-mono uppercase">AES-256-GCM CIPHERTEXT</div>
              {encryptionStatus === 'encrypting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-ocean-deep/80 backdrop-blur-sm z-10">
                   <RefreshCw className="w-6 h-6 text-ocean-cyan animate-spin" />
                </div>
              )}
              <div className="text-[10px] text-ocean-cyan font-mono break-all leading-tight opacity-60">
                {ciphertextPreview || 'Waiting for encryption...'}
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
function TrainingHistory({ logs, masterKey, onDelete }) {
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
        <h2 className="text-2xl font-bold">Training History</h2>
        <div className="text-[10px] bg-white/5 px-2 py-1 rounded-lg border border-white/10 text-white/40 font-mono">
          {logs.length} ENCRYPTED ENTRIES
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <History className="w-16 h-16 mb-4 opacity-10" />
          <p>No training sessions found</p>
        </div>
      ) : isDecrypting ? (
        <div className="flex flex-col items-center justify-center py-20">
           <RefreshCw className="w-8 h-8 text-ocean-cyan animate-spin mb-4" />
           <p className="text-sm text-white/40">Decrypting vault with your key...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {decryptedLogs.map((log, i) => (
            <Card key={i} className="group relative overflow-hidden">
               <div className="absolute right-0 top-0 bottom-0 w-1 bg-ocean-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-ocean-marine/10 p-2 rounded-lg">
                      {log.type === 'apnea' ? <TimerIcon className="w-4 h-4 text-ocean-cyan" /> : <Waves className="w-4 h-4 text-ocean-marine" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{log.type === 'apnea' ? `${log.tableType} Table` : 'Swim Session'}</h4>
                      <p className="text-[10px] text-white/40">{new Date(log.timestamp).toLocaleDateString()} @ {log.location || 'Unknown'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(i)}
                    className="p-2 text-white/10 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-4">
                  {log.distance && (
                    <div className="bg-black/20 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-white/40 uppercase">Distance</div>
                      <div className="text-xs font-bold text-ocean-cyan">{log.distance}m</div>
                    </div>
                  )}
                  {log.duration && (
                    <div className="bg-black/20 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-white/40 uppercase">Time</div>
                      <div className="text-xs font-bold text-ocean-cyan">{log.duration}m</div>
                    </div>
                  )}
                  {log.rounds && (
                    <div className="bg-black/20 p-2 rounded-lg text-center">
                      <div className="text-[8px] text-white/40 uppercase">Rounds</div>
                      <div className="text-xs font-bold text-ocean-cyan">{log.rounds}</div>
                    </div>
                  )}
               </div>

               {log.notes && (
                 <p className="mt-3 text-[10px] text-white/60 leading-relaxed italic border-l-2 border-white/5 pl-2">{log.notes}</p>
               )}

               {log.cramps && (
                 <div className="mt-2 flex items-center gap-1.5 text-rose-400 text-[10px] font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    Cramps reported
                 </div>
               )}
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
function SafetyHub() {
  const [activeFlow, setActiveFlow] = useState(null);

  const CRAMP_FLOWS = {
    calf: {
      title: 'Calf Cramp',
      steps: [
        'Stop swimming immediately and float on your back.',
        'Pull your toes toward your shin to stretch the muscle.',
        'Massage the area firmly while keeping the leg straight.',
        'Once relaxed, swim back using only your arms.'
      ]
    },
    foot: {
      title: 'Foot Arch Cramp',
      steps: [
        'Tuck your knee to your chest while floating.',
        'Forcefully pull your toes upward with your hand.',
        'Apply pressure to the center of your arch.',
        'Check fin tightness - often caused by restrictive foot pockets.'
      ]
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold">Safety & Recovery</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-rose-500">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">Emergency Protocols</h3>
        </div>

        <Card className="border-rose-500/20 bg-rose-500/5">
           <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <div className="bg-rose-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">1</div>
                 <p className="text-sm font-medium">NEVER DIVE ALONE. Always have a qualified safety buddy watching your surface transition.</p>
              </div>
              <div className="flex items-start gap-3">
                 <div className="bg-rose-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs">2</div>
                 <p className="text-sm font-medium">One up, one down rule is mandatory at Bou Zadjar deep zones.</p>
              </div>
           </div>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-ocean-cyan">
          <Activity className="w-5 h-5" />
          <h3 className="font-bold uppercase tracking-wider text-sm">Cramp Troubleshooting</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
           {Object.entries(CRAMP_FLOWS).map(([key, flow]) => (
             <button
               key={key}
               onClick={() => setActiveFlow(key)}
               className={cn(
                 "p-4 rounded-2xl border text-left transition-all",
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
                  <span className="text-ocean-cyan font-bold text-xs uppercase">Resolution Steps</span>
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
          <h3 className="font-bold uppercase tracking-wider text-sm">Bou Zadjar Rules</h3>
        </div>

        <Card className="space-y-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ocean-marine" />
              <p className="text-xs text-white/70">Strong currents near the rocky outcrops. Avoid diving during high swell.</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ocean-marine" />
              <p className="text-xs text-white/70">Local fishing boats pass frequently. Use a high-visibility surface buoy.</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-ocean-marine" />
              <p className="text-xs text-white/70">The 'Blue Hole' equivalent near the cliff is for advanced divers only (25m+).</p>
           </div>
        </Card>
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

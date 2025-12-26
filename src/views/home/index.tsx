// Next, React
import { FC, useState } from 'react';
import pkg from '../../../package.json';

// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE

export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>

      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center px-4 py-3">
        <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Scrolly Game
            </span>
            <span className="text-[9px] opacity-70">#NoCodeJam</span>
          </div>

          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>

      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};

// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM
// Replace this entire GameSandbox component with the one AI generates.
// Keep the name `GameSandbox` and the `FC` type.








import {useEffect, useRef, useCallback } from 'react';

// --- CONFIGURATION ---
const CONFIG = {
    stack: [ {val: 8, cost: 0}, {val: 10, cost: 100}, {val: 12, cost: 200}, {val: 14, cost: 350}, {val: 16, cost: 500} ],
    speed: [ {val: 1.8, cost: 0}, {val: 2.2, cost: 150}, {val: 2.6, cost: 300}, {val: 3.0, cost: 600} ],
    
    // Machines
    machineBakery: [ {val: 120, cost: 0}, {val: 90, cost: 500}, {val: 60, cost: 1000} ], 
    machineSauce: [ {val: 180, cost: 0}, {val: 150, cost: 1000}, {val: 120, cost: 2000} ], 
    
    // Zone 1 Costs
    farmStaff: [ {val: 1, cost: 100}, {val: 2, cost: 200}, {val: 3, cost: 300}, {val: 4, cost: 400}, {val: 5, cost: 500} ],
    salesStaffBread: { cost: 300 },
    
    // Zone 2 Costs (More Expensive)
    tomatoStaff: [ {val: 1, cost: 500}, {val: 2, cost: 1000}, {val: 3, cost: 1500}, {val: 4, cost: 2000}, {val: 5, cost: 2500} ],
    salesStaffKetchup: { cost: 1000 },

    maxMachineOutput: 12,
    prices: { bread: 15, ketchup: 40 },
    unlocks: { ketchupZone: 5000 },
    salesDelay: 180 // 3 Seconds @ 60fps
};

// --- AUDIO SYSTEM ---
let audioCtx: AudioContext | null = null;

const initAudio = () => {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const stopAudio = () => {
    if (audioCtx && audioCtx.state === 'running') {
        audioCtx.suspend();
    }
};

const playSfx = (type: 'pop' | 'coin' | 'upgrade' | 'unlock') => {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'pop') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'coin') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.setValueAtTime(1600, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'upgrade') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.2);
            osc.frequency.linearRampToValueAtTime(1000, now + 0.4);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (type === 'unlock') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(800, now + 1.0);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);
        }
    } catch (e) { console.error(e); }
};

// --- HELPER: STAFF CAP COLOR ---
const getStaffCapColor = (level: number) => {
    const colors = ['#fff', '#4caf50', '#2196f3', '#9c27b0', '#ffeb3b'];
    return colors[level] || '#fff';
};

// --- ASSETS: SVGS ---

const SvgFloor = ({ width }: { width: number }) => (
  <svg width="100%" height="100%" preserveAspectRatio="none">
    <defs>
      <pattern id="wood-floor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#e1c699" />
        <path d="M0 38 L40 38" stroke="#c5a575" strokeWidth="2" />
      </pattern>
      <pattern id="asphalt" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="#37474f" />
        <path d="M50 0 L50 100" stroke="#ffeb3b" strokeWidth="4" strokeDasharray="20 10" />
      </pattern>
      <pattern id="grass" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
         <rect width="50" height="50" fill="#8bc34a" />
         <circle cx="10" cy="10" r="2" fill="#689f38" opacity="0.5" />
      </pattern>
      <pattern id="brick" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
         <rect width="20" height="10" fill="#a1887f" />
         <path d="M0 10 L20 10 M10 0 L10 10" stroke="#5d4037" strokeWidth="1" />
      </pattern>
    </defs>
    <rect x="0" y="0" width="100%" height="45%" fill="url(#grass)" />
    <rect x="0" y="45%" width="100%" height="35%" fill="url(#wood-floor)" />
    <rect x="0" y="80%" width="100%" height="20%" fill="url(#asphalt)" />
    <rect x="0" y="78%" width="100%" height="20" fill="url(#brick)" stroke="#5d4037" strokeWidth="2" />
    <rect x="0" y="43%" width="100%" height="10" fill="#5d4037" />
  </svg>
);

const SvgPlant = ({ type, state }: { type: 'CORN'|'TOMATO', state: 'RIPE' | 'GROWING' }) => {
  if (state === 'GROWING') return <div className="w-2 h-2 bg-green-800/30 rounded-full mx-auto mt-8" />;
  if (type === 'CORN') {
      return (
        <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-md">
           <path d="M20 60 L20 20" stroke="#558b2f" strokeWidth="3" />
           <path d="M20 50 Q5 40 5 25" stroke="#7cb342" strokeWidth="2" fill="none" />
           <path d="M20 50 Q35 40 35 25" stroke="#7cb342" strokeWidth="2" fill="none" />
           <rect x="15" y="10" width="10" height="25" rx="3" fill="#fdd835" stroke="#fbc02d" strokeWidth="1" />
           <path d="M15 15 H25 M15 20 H25 M15 25 H25 M15 30 H25" stroke="#f9a825" strokeWidth="0.5" />
        </svg>
      );
  }
  return (
    <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-md">
       <path d="M20 60 L20 20" stroke="#558b2f" strokeWidth="3" />
       <path d="M20 40 Q5 30 5 15" stroke="#7cb342" strokeWidth="2" fill="none" />
       <path d="M20 40 Q35 30 35 15" stroke="#7cb342" strokeWidth="2" fill="none" />
       <circle cx="20" cy="20" r="12" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1"/>
       <path d="M20 8 L24 12 M20 8 L16 12" stroke="#33691e" strokeWidth="2"/>
    </svg>
  );
};

const SvgItem = ({ type }: { type: 'CORN' | 'BREAD' | 'TOMATO' | 'KETCHUP' }) => {
    if (type === 'CORN') return (
        <svg viewBox="0 0 20 30" className="w-full h-full drop-shadow-sm">
            <rect x="5" y="2" width="10" height="26" rx="3" fill="#fdd835" stroke="#fbc02d" strokeWidth="1" />
            <path d="M5 8 H15 M5 14 H15 M5 20 H15 M5 26 H15" stroke="#f9a825" strokeWidth="0.5" />
        </svg>
    );
    if (type === 'BREAD') return (
        <svg viewBox="0 0 40 30" className="w-full h-full drop-shadow-md">
            <path d="M2 18 Q2 28 20 28 Q38 28 38 18 L38 25 Q38 28 30 28 L10 28 Q2 28 2 25 Z" fill="#5d4037" />
            <path d="M2 15 Q2 5 20 5 Q38 5 38 15 L38 22 Q38 25 20 25 Q2 25 2 22 Z" fill="#8d6e63" />
            <path d="M4 12 Q20 2 36 12 Q20 16 4 12 Z" fill="#d7ccc8" opacity="0.8" />
            <path d="M15 10 Q20 14 25 10" stroke="#5d4037" strokeWidth="1.5" fill="none" />
        </svg>
    );
    if (type === 'TOMATO') return (
        <svg viewBox="0 0 30 30" className="w-full h-full drop-shadow-sm">
            <circle cx="15" cy="15" r="10" fill="#d32f2f" stroke="#b71c1c" />
            <path d="M15 5 L18 8 M15 5 L12 8" stroke="#33691e" strokeWidth="2"/>
        </svg>
    );
    return ( // Ketchup
        <svg viewBox="0 0 20 40" className="w-full h-full drop-shadow-md">
            <rect x="5" y="10" width="10" height="25" rx="2" fill="#d32f2f" />
            <rect x="7" y="2" width="6" height="8" fill="#e0e0e0" />
            <rect x="5" y="18" width="10" height="10" fill="white" opacity="0.8" />
            <path d="M8 20 L12 28" stroke="red" strokeWidth="2" />
        </svg>
    );
};

const SvgMachine = ({ type, working }: { type: 'BAKERY'|'SAUCE', working: boolean }) => {
    const mainColor = type === 'BAKERY' ? '#039be5' : '#e53935';
    const accentColor = type === 'BAKERY' ? '#0277bd' : '#c62828';
    
    return (
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl">
            <rect x="5" y="40" width="90" height="30" fill="#455a64" rx="4" />
            <rect x="10" y="35" width="80" height="10" fill="#263238" />
            <rect x="25" y="5" width="50" height="40" fill={mainColor} rx="4" stroke={accentColor} strokeWidth="2" />
            <circle cx="50" cy="25" r="8" fill={working ? "#ff1744" : "#00e676"} className={working ? "animate-pulse" : ""} />
            <path d="M30 5 L20 0 L80 0 L70 5 Z" fill="#cfd8dc" />
            {type === 'SAUCE' && <path d="M35 15 L65 15 L50 35 Z" fill="#b71c1c" opacity="0.3" />}
        </svg>
    );
};

const SvgDesk = () => (
  <svg viewBox="0 0 80 60" className="w-full h-full drop-shadow-lg">
    <rect x="10" y="20" width="8" height="40" fill="#3e2723" />
    <rect x="62" y="20" width="8" height="40" fill="#3e2723" />
    <rect x="5" y="10" width="70" height="15" fill="#795548" stroke="#3e2723" strokeWidth="2" rx="2" />
    <path d="M5 25 L75 25" stroke="#3e2723" strokeWidth="2" />
  </svg>
);

const SvgTruck = ({ color }: { color: string }) => (
  <svg viewBox="0 0 140 70" className="w-full h-full drop-shadow-lg">
     <circle cx="35" cy="60" r="8" fill="#212121" />
     <circle cx="85" cy="60" r="8" fill="#212121" />
     <circle cx="115" cy="60" r="8" fill="#212121" />
     <path d="M95 30 L135 30 L135 55 L95 55 Z" fill={color} stroke="black" strokeWidth="1" />
     <path d="M110 30 L135 30 L135 45 L110 45 Z" fill="#b3e5fc" />
     <rect x="5" y="5" width="90" height="50" fill={color} stroke="black" strokeWidth="1" rx="2" />
     <rect x="8" y="8" width="84" height="44" fill="black" opacity="0.1" />
     <rect x="90" y="45" width="10" height="5" fill="#555" />
  </svg>
);

const SvgCharacter = ({ type, capColor, isSelling }: { type: 'PLAYER' | 'STAFF' | 'SALES', capColor?: string, isSelling?: boolean }) => {
  const bodyColor = type === 'PLAYER' ? "#f44336" : type === 'STAFF' ? "#2196f3" : "#9c27b0";
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full" style={{ overflow: 'visible' }}>
        <style>{`
          @keyframes sellLeft { 0%, 100% { transform: translateY(0) rotate(45deg); } 50% { transform: translateY(-3px) rotate(55deg); } }
          @keyframes sellRight { 0%, 100% { transform: translateY(0) rotate(-45deg); } 50% { transform: translateY(-3px) rotate(-55deg); } }
          .selling-arm-left { animation: sellLeft 0.5s ease-in-out infinite; transform-origin: 20px 25px; }
          .selling-arm-right { animation: sellRight 0.5s ease-in-out infinite; transform-origin: 40px 25px; }
        `}</style>
        <ellipse cx="30" cy="55" rx="12" ry="4" fill="black" opacity="0.3" />
        <rect x="23" y="40" width="6" height="15" fill="#3e2723" />
        <rect x="31" y="40" width="6" height="15" fill="#3e2723" />
        <rect x="20" y="20" width="20" height="25" rx="4" fill={bodyColor} />
        <g className={isSelling ? "selling-arm-left" : "transition-transform duration-300 origin-[20px_25px]"}>
            <path d="M20 25 L5 35" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <circle cx="5" cy="35" r="3" fill="black" />
        </g>
        <g className={isSelling ? "selling-arm-right" : "transition-transform duration-300 origin-[40px_25px]"}>
            <path d="M40 25 L55 35" stroke="black" strokeWidth="3" strokeLinecap="round" />
            <circle cx="55" cy="35" r="3" fill="black" />
        </g>
        <circle cx="30" cy="15" r="10" fill="#ffcc80" />
        {type === 'STAFF' && (
            <g transform="translate(15, -10)">
               <path d="M5 10 Q5 0 15 0 Q25 0 25 10 L25 15 L5 15 Z" fill={capColor || 'white'} stroke="black" strokeWidth="0.5" />
               <rect x="5" y="15" width="20" height="5" fill={capColor || 'white'} stroke="black" strokeWidth="0.5" />
            </g>
        )} 
        {type === 'SALES' && (
            <g transform="translate(0, -2)">
                <path d="M20 15 Q30 5 40 15 L40 18 Q30 12 20 18 Z" fill="#333" />
                <path d="M20 18 Q30 22 40 18 L42 20 Q30 25 18 20 Z" fill="#222" />
            </g>
        )}
    </svg>
  );
};

// --- TYPES & HELPERS ---
type ItemType = 'CORN' | 'BREAD' | 'TOMATO' | 'KETCHUP';
type FloatingText = { id: number; x: number; y: number; text: string; life: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; color: string; life: number; size: number; };
type Patch = { id: number; type: 'CORN'|'TOMATO'; x: number; y: number; timer: number; state: 'RIPE'|'GROWING' };
type MachineState = { x: number; y: number; processing: boolean; timer: number; queue: number; output: Array<{id: number, x: number, y: number}> };
type SalesStaffState = { active: boolean; x: number; y: number; timer: number; state: 'IDLE' | 'SELLING' };

// --- MAIN COMPONENT ---

const GameSandbox: FC = () => {
  const ROAD_BOUNDARY_Y = 445; 
  const WORLD_WIDTH = 720; 
  const SCREEN_WIDTH = 360;
  const AUTOSAVE_KEY = 'township_autosave_v2';
  
  // --- UI STATES ---
  const [gameState, setGameState] = useState<'START' | 'PLAYING'>('START');
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [uiTick, setUiTick] = useState(0);
  const [hasSave, setHasSave] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [saveSlots, setSaveSlots] = useState<{id: string, label: string, date: string}[]>([]);
  const [isSellingManually, setIsSellingManually] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();

  // --- GAME REFS ---
  const gs = useRef({
    inventory: [] as ItemType[],
    money: 0,
    lvlStack: 0,
    lvlSpeed: 0,
    lvlMachineBread: 0,
    lvlMachineSauce: 0,
    unlockedKetchup: false,
    
    camera: { x: 0 },
    player: { x: 160, y: 300 },
    
    // STAFF
    staffCorn: { active: false, level: 0, x: 50, y: 50, state: 'IDLE', holding: [] as ItemType[], maxHold: 1 },
    staffTomato: { active: false, level: 0, x: 400, y: 50, state: 'IDLE', holding: [] as ItemType[], maxHold: 1 },
    
    // SALES STAFF
    salesStaffBread: { active: false, x: 100, y: 460, timer: 0, state: 'IDLE' } as SalesStaffState,
    salesStaffKetchup: { active: false, x: 460, y: 460, timer: 0, state: 'IDLE' } as SalesStaffState,
    
    truck: { 
        x: -200, y: 530, 
        state: 'IDLE' as 'IDLE' | 'DRIVING' | 'WAITING' | 'LEAVING', 
        targetX: 0,
        orders: { bread: 0, ketchup: 0 },
        color: '#fbc02d', 
        phrase: '' 
    },
    
    machineBakery: { x: 250, y: 280, processing: false, timer: 0, queue: 0, output: [] } as MachineState,
    machineSauce: { x: 610, y: 280, processing: false, timer: 0, queue: 0, output: [] } as MachineState,
    
    deskBread: { x: 100, y: 460, stock: 0 },
    deskKetchup: { x: 460, y: 460, stock: 0 },
    
    // HIRE ZONES
    hireZoneFarm: { x: 280, y: 100 }, 
    hireZoneSales: { x: 200, y: 460 },
    hireZoneTomato: { x: 550, y: 100 },
    hireZoneSalesKetchup: { x: 560, y: 460 },
    
    patches: [] as Patch[],
    
    floatingTexts: [] as FloatingText[],
    particles: [] as Particle[],
    
    joystick: { active: false, originX: 0, originY: 0, dx: 0, dy: 0 },
    
    // Logic flags
    alertCooldown: 0,
    saveTimer: 0,
    purchaseCooldown: 0,
    lastAffordableCount: 0
  });

  // Init Patches
  const initPatches = () => {
    const p: Patch[] = [];
    // Corn (Room 1)
    for(let i=0; i<9; i++) p.push({ id: i, type: 'CORN', x: 40 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' });
    // Tomato (Room 2)
    for(let i=0; i<9; i++) p.push({ id: 100+i, type: 'TOMATO', x: 400 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' });
    return p;
  };

  useEffect(() => {
      // Check autosave
      if (localStorage.getItem(AUTOSAVE_KEY)) setHasSave(true);
      
      // Load Slots Metadata
      const slots = [1, 2, 3].map(i => {
          const data = localStorage.getItem(`slot_${i}`);
          if (data) {
              const p = JSON.parse(data);
              return { id: `slot_${i}`, label: `SLOT ${i}`, date: p.date || 'Unknown' };
          }
          return { id: `slot_${i}`, label: `SLOT ${i}`, date: 'Empty' };
      });
      setSaveSlots(slots);
  }, [gameState]); 

  const spawnText = (x: number, y: number, text: string) => {
      gs.current.floatingTexts.push({ id: Date.now() + Math.random(), x, y, text, life: 60 });
  };

  const spawnConfetti = (x: number, y: number) => {
      if (soundOn) playSfx('upgrade');
      for(let i=0; i<40; i++) { 
          gs.current.particles.push({
              id: Math.random(), x, y,
              vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
              color: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'][Math.floor(Math.random()*5)],
              life: 60, size: Math.random() * 6 + 4 
          });
      }
  };

  const loadGame = (key: string) => {
      initAudio();
      const data = localStorage.getItem(key);
      if (data) {
          try {
              const p = JSON.parse(data);
              const s = gs.current;
              s.money = p.money || 0;
              s.lvlStack = p.lvlStack || 0;
              s.lvlSpeed = p.lvlSpeed || 0;
              s.lvlMachineBread = p.lvlMachine || 0; 
              if (p.lvlMachineBread !== undefined) s.lvlMachineBread = p.lvlMachineBread;
              s.lvlMachineSauce = p.lvlMachineSauce || 0;
              s.unlockedKetchup = p.unlockedKetchup || false;
              s.patches = initPatches();
              s.inventory = p.playerInventory || [];
              
              // Load Desks
              s.deskBread.stock = p.deskBreadStock || 0;
              s.deskKetchup.stock = p.deskKetchupStock || 0;

              // Load Machines
              if(p.machineBakery) s.machineBakery = p.machineBakery;
              if(p.machineSauce) s.machineSauce = p.machineSauce;

              // Load Staff 1
              if (p.staffCornLevel > 0) {
                  s.staffCorn.active = true;
                  s.staffCorn.level = p.staffCornLevel - 1;
                  s.staffCorn.maxHold = p.staffCornLevel;
              }
              // Load Staff 2
              if (p.staffTomatoLevel > 0) {
                  s.staffTomato.active = true;
                  s.staffTomato.level = p.staffTomatoLevel - 1;
                  s.staffTomato.maxHold = p.staffTomatoLevel;
              }

              // Load Sales Staff State Correctly
              s.salesStaffBread.active = !!p.salesBreadActive;
              s.salesStaffKetchup.active = !!p.salesKetchupActive;
              
              setGameState('PLAYING');
          } catch(e) { console.error(e); }
      }
  };

  const startGame = () => {
      initAudio();
      const s = gs.current;
      // HARD RESET ALL STATE
      s.money = 0; s.lvlStack = 0; s.lvlSpeed = 0; s.lvlMachineBread = 0; s.lvlMachineSauce = 0;
      s.inventory = [];
      s.unlockedKetchup = false;
      
      // Reset Staff
      s.staffCorn = { active: false, level: 0, x: 50, y: 50, state: 'IDLE', holding: [], maxHold: 1 };
      s.staffTomato = { active: false, level: 0, x: 400, y: 50, state: 'IDLE', holding: [], maxHold: 1 };
      s.salesStaffBread = { active: false, x: 100, y: 460, timer: 0, state: 'IDLE' };
      s.salesStaffKetchup = { active: false, x: 460, y: 460, timer: 0, state: 'IDLE' };
      
      // Reset Machines & Desks
      s.machineBakery = { x: 250, y: 280, processing: false, timer: 0, queue: 0, output: [] };
      s.machineSauce = { x: 610, y: 280, processing: false, timer: 0, queue: 0, output: [] };
      s.deskBread.stock = 0;
      s.deskKetchup.stock = 0;
      
      // Reset Truck
      s.truck = { x: -200, y: 530, state: 'IDLE', targetX: 0, orders: { bread: 0, ketchup: 0 }, color: '#fbc02d', phrase: '' };
      
      s.patches = initPatches();
      setGameState('PLAYING');
  };

  const saveGame = (key: string) => {
      const s = gs.current;
      const data = {
          money: s.money,
          lvlStack: s.lvlStack,
          lvlSpeed: s.lvlSpeed,
          lvlMachineBread: s.lvlMachineBread,
          lvlMachineSauce: s.lvlMachineSauce,
          staffCornLevel: s.staffCorn.active ? s.staffCorn.level + 1 : 0,
          staffTomatoLevel: s.staffTomato.active ? s.staffTomato.level + 1 : 0,
          salesBreadActive: s.salesStaffBread.active,
          salesKetchupActive: s.salesStaffKetchup.active,
          unlockedKetchup: s.unlockedKetchup,
          deskBreadStock: s.deskBread.stock,
          deskKetchupStock: s.deskKetchup.stock,
          playerInventory: s.inventory,
          machineBakery: s.machineBakery,
          machineSauce: s.machineSauce,
          date: new Date().toLocaleString()
      };
      localStorage.setItem(key, JSON.stringify(data));
      if (key !== AUTOSAVE_KEY) {
          spawnConfetti(180 + s.camera.x, 320);
          setAlertMsg("Game Saved Successfully!");
          // Update slots display
          setSaveSlots(prev => prev.map(slot => slot.id === key ? { ...slot, date: data.date } : slot));
      }
  };

  const cleanupGame = () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      stopAudio();
  };

  const exitToMenu = () => {
      cleanupGame();
      setGameState('START');
      setShowSettings(false);
      setAlertMsg(null);
  };

  const getTruckPhrase = (bread: number, ketchup: number) => {
      if (bread > 0 && ketchup > 0) return `I need ${bread}🍞 & ${ketchup}🍅`;
      if (bread > 0) return `I need ${bread}🍞`;
      if (ketchup > 0) return `I need ${ketchup}🍅`;
      return "Thanks!";
  };

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const s = gs.current;
    
    // PAUSE LOGIC
    if (showUpgradeMenu || showSettings || alertMsg) { // Pause on alert too
        animRef.current = requestAnimationFrame(update);
        return;
    }

    const playerSpeed = CONFIG.speed[s.lvlSpeed].val;
    const maxStack = CONFIG.stack[s.lvlStack].val;
    const breadSpeed = CONFIG.machineBakery[s.lvlMachineBread].val;
    const sauceSpeed = CONFIG.machineSauce[s.lvlMachineSauce].val;

    // --- PLAYER MOVEMENT ---
    if (s.joystick.active) {
      const len = Math.sqrt(s.joystick.dx ** 2 + s.joystick.dy ** 2);
      if (len > 0) {
        const moveX = (s.joystick.dx / len) * playerSpeed;
        const moveY = (s.joystick.dy / len) * playerSpeed;
        let nextX = s.player.x + moveX;
        let nextY = s.player.y + moveY;
        
        // World Bounds
        const MAX_X = s.unlockedKetchup ? WORLD_WIDTH - 20 : SCREEN_WIDTH - 20;
        nextX = Math.max(20, Math.min(MAX_X, nextX));
        nextY = Math.max(20, Math.min(ROAD_BOUNDARY_Y, nextY));

        // Unlock Room Collision
        if (!s.unlockedKetchup && nextX > SCREEN_WIDTH - 30) {
            if (s.money >= CONFIG.unlocks.ketchupZone) {
                s.money -= CONFIG.unlocks.ketchupZone;
                s.unlockedKetchup = true;
                spawnConfetti(350, 200);
                playSfx('unlock');
                setAlertMsg("NEW ROOM UNLOCKED!");
            } else {
               nextX = SCREEN_WIDTH - 30; // Wall
               if (s.alertCooldown <= 0) { setAlertMsg(`Need $${CONFIG.unlocks.ketchupZone} to Unlock!`); s.alertCooldown = 180; }
            }
        }
        s.player.x = nextX;
        s.player.y = nextY;
      }
    }

    // --- CAMERA ---
    let targetCam = s.player.x - SCREEN_WIDTH / 2;
    targetCam = Math.max(0, Math.min(targetCam, WORLD_WIDTH - SCREEN_WIDTH));
    s.camera.x += (targetCam - s.camera.x) * 0.1;

    // --- HIRING ---
    const checkHire = (zone: {x:number, y:number}, cost: number, action: () => void) => {
        if (Math.abs(s.player.x - (zone.x + 30)) < 60 && Math.abs(s.player.y - (zone.y + 30)) < 60 && s.purchaseCooldown <= 0) {
            if (s.money >= cost) {
                s.money -= cost;
                action();
                s.purchaseCooldown = 60;
                spawnConfetti(zone.x + 30, zone.y + 30);
            }
        }
    };

    // Farm Staff 1 (Corn)
    if (s.staffCorn.level < 4) {
        const cost = CONFIG.farmStaff[s.staffCorn.active ? s.staffCorn.level + 1 : 0].cost;
        checkHire(s.hireZoneFarm, cost, () => {
             if (!s.staffCorn.active) { s.staffCorn.active = true; s.staffCorn.level = 0; }
             else { s.staffCorn.level++; }
             s.staffCorn.maxHold = s.staffCorn.level + 1;
        });
    }
    // Sales Staff 1 (Bread)
    if (!s.salesStaffBread.active) {
        checkHire(s.hireZoneSales, CONFIG.salesStaffBread.cost, () => { s.salesStaffBread.active = true; setAlertMsg("Sales Staff Hired!"); });
    }
    
    // Zone 2 Hiring
    if (s.unlockedKetchup) {
        // Farm Staff 2 (Tomato)
        if (s.staffTomato.level < 4) {
            const cost = CONFIG.tomatoStaff[s.staffTomato.active ? s.staffTomato.level + 1 : 0].cost;
            checkHire(s.hireZoneTomato, cost, () => {
                 if (!s.staffTomato.active) { s.staffTomato.active = true; s.staffTomato.level = 0; }
                 else { s.staffTomato.level++; }
                 s.staffTomato.maxHold = s.staffTomato.level + 1;
            });
        }
        // Sales Staff 2 (Ketchup)
        if (!s.salesStaffKetchup.active) {
            checkHire(s.hireZoneSalesKetchup, CONFIG.salesStaffKetchup.cost, () => { s.salesStaffKetchup.active = true; setAlertMsg("Sauce Sales Staff Hired!"); });
        }
    }

    if (s.purchaseCooldown > 0) s.purchaseCooldown--;

    // --- FARMING ---
    s.patches.forEach(p => { if (p.state === 'GROWING') { p.timer--; if (p.timer <= 0) p.state = 'RIPE'; } });
    
    if (s.inventory.length < maxStack) {
        s.patches.forEach(p => {
            if (p.state === 'RIPE' && (p.type === 'CORN' || s.unlockedKetchup)) {
                if (Math.hypot(s.player.x - p.x, s.player.y - p.y) < 30) {
                    p.state = 'GROWING';
                    p.timer = 300;
                    s.inventory.push(p.type);
                    if (soundOn) playSfx('pop');
                }
            }
        });
    }

    // --- MACHINES ---
    const handleMachine = (m: MachineState, inputType: ItemType, productType: ItemType, speed: number, xPos: number, yPos: number) => {
        // Feed Machine
        if (Math.hypot(s.player.x - m.x, s.player.y - m.y) < 40) {
            const items = s.inventory.filter(i => i === inputType).length;
            if (items > 0) { 
                s.inventory = s.inventory.filter(i => i !== inputType); 
                m.queue += items; 
            }
        }
        // Process
        if (!m.processing && m.queue > 0 && m.output.length < CONFIG.maxMachineOutput) {
            m.processing = true; m.queue--; m.timer = speed;
        }
        if (m.processing) {
            m.timer--;
            if (m.timer <= 0) {
                m.processing = false;
                if (m.output.length < CONFIG.maxMachineOutput) m.output.push({ id: Date.now(), x: m.x - 30, y: m.y + 20 });
            }
        }
        // Collect
        if (s.inventory.length < maxStack) {
            m.output = m.output.filter(item => {
                if (s.inventory.length >= maxStack) return true;
                if (Math.hypot(s.player.x - item.x, s.player.y - item.y) < 30) {
                    s.inventory.push(productType);
                    return false;
                }
                return true;
            });
        }
    };

    handleMachine(s.machineBakery, 'CORN', 'BREAD', breadSpeed, 250, 280);
    if (s.unlockedKetchup) handleMachine(s.machineSauce, 'TOMATO', 'KETCHUP', sauceSpeed, 610, 280);

    // --- STAFF AI ---
    const updateStaff = (bot: any, targetType: 'CORN' | 'TOMATO', machine: MachineState, queueProp: 'queue') => {
        if (!bot.active) return;
        const holdingCount = bot.holding.length;
        
        if (holdingCount < bot.maxHold) {
            // Find nearest ripe patch
            let targetPatch: Patch | null = null;
            let minDist = 9999;
            s.patches.forEach(p => {
                 if (p.state === 'RIPE' && p.type === targetType) {
                     const d = Math.hypot(p.x - bot.x, p.y - bot.y);
                     if (d < minDist) { minDist = d; targetPatch = p; }
                 }
            });

            if (targetPatch) {
                const tp = targetPatch as Patch;
                const dist = Math.hypot(tp.x - bot.x, tp.y - bot.y);
                if (dist < 5) { tp.state = 'GROWING'; tp.timer = 300; bot.holding.push(tp.type); }
                else { bot.x += ((tp.x - bot.x)/dist)*1.5; bot.y += ((tp.y - bot.y)/dist)*1.5; }
            }
        } else {
            // Go to machine
            const dist = Math.hypot(machine.x - bot.x, machine.y - bot.y);
            if (dist < 10) {
                machine[queueProp] += bot.holding.length;
                bot.holding = [];
            } else {
                bot.x += ((machine.x - bot.x)/dist)*1.5; 
                bot.y += ((machine.y - bot.y)/dist)*1.5;
            }
        }
    };
    
    updateStaff(s.staffCorn, 'CORN', s.machineBakery, 'queue');
    if (s.unlockedKetchup) updateStaff(s.staffTomato, 'TOMATO', s.machineSauce, 'queue');

    // --- DESK STOCKING ---
    const stockDesk = (desk: any, itemType: ItemType, x: number, y: number) => {
        // SAME RADIUS AS SELLING (60px)
        if (Math.hypot(s.player.x - x, s.player.y - y) < 60) {
            const idx = s.inventory.indexOf(itemType);
            if (idx > -1) { s.inventory.splice(idx, 1); desk.stock++; }
        }
    };
    stockDesk(s.deskBread, 'BREAD', s.deskBread.x, s.deskBread.y);
    stockDesk(s.deskKetchup, 'KETCHUP', s.deskKetchup.x, s.deskKetchup.y);

    // --- TRUCK LOGIC (ADVANCED) ---
    const BREAD_STOP_X = 100;
    const KETCHUP_STOP_X = 460;
    const EXIT_X = WORLD_WIDTH + 100;

    let manualSellAction = false;

    if (s.truck.state === 'IDLE') {
        if (Math.random() < 0.01) {
            s.truck.state = 'DRIVING'; 
            s.truck.x = -180;
            
            // Generate Order (RANDOMIZED)
            let wantsBread = Math.random() > 0.5;
            let wantsKetchup = s.unlockedKetchup && Math.random() > 0.5;
            if (!wantsBread && !wantsKetchup) { if (s.unlockedKetchup) wantsKetchup = true; else wantsBread = true; }

            s.truck.orders = {
                bread: wantsBread ? Math.floor(Math.random() * 4) + 1 : 0,
                ketchup: wantsKetchup ? Math.floor(Math.random() * 3) + 1 : 0
            };
            
            // Route Planning
            if (s.truck.orders.bread > 0) s.truck.targetX = BREAD_STOP_X;
            else if (s.truck.orders.ketchup > 0) s.truck.targetX = KETCHUP_STOP_X;
            else s.truck.targetX = EXIT_X;
            
            s.truck.color = ['#d32f2f', '#388e3c', '#1976d2', '#f57c00'][Math.floor(Math.random()*4)];
            s.truck.phrase = getTruckPhrase(s.truck.orders.bread, s.truck.orders.ketchup);
        }
    } 
    else if (s.truck.state === 'DRIVING') {
        const dist = s.truck.targetX - s.truck.x;
        if (Math.abs(dist) < 5) {
             s.truck.x = s.truck.targetX; 
             if (s.truck.targetX === EXIT_X) {
                 s.truck.state = 'IDLE';
             } else {
                 s.truck.state = 'WAITING';
             }
        } else {
            s.truck.x += dist > 0 ? 2.5 : -2.5;
        }
    } 
    else if (s.truck.state === 'WAITING') {
        // Determine which desk we are at
        const atBread = Math.abs(s.truck.x - BREAD_STOP_X) < 10;
        const atKetchup = Math.abs(s.truck.x - KETCHUP_STOP_X) < 10;
        
        let sold = false;
        
        // Sell Logic (BULK SELL + DELAYED STAFF)
        const checkSale = (desk: any, type: 'bread'|'ketchup', price: number, salesStaff: SalesStaffState) => {
            const requiredAmount = s.truck.orders[type];
            if (requiredAmount > 0) {
                const playerClose = Math.hypot(s.player.x - desk.x, s.player.y - desk.y) < 60;
                
                // Manual Selling is Instant
                if (playerClose && desk.stock >= requiredAmount) {
                    manualSellAction = true;
                    // Instant Sell for Player
                    desk.stock -= requiredAmount;
                    s.truck.orders[type] = 0; 
                    const totalGain = requiredAmount * price;
                    s.money += totalGain;
                    if (soundOn) playSfx('coin');
                    spawnText(s.truck.x + 50, s.truck.y, `+$${totalGain}`);
                    s.truck.phrase = getTruckPhrase(s.truck.orders.bread, s.truck.orders.ketchup);
                    return true;
                }

                // Staff Selling (Delayed)
                if (salesStaff.active && desk.stock >= requiredAmount) {
                    if (salesStaff.state === 'IDLE') {
                        salesStaff.state = 'SELLING';
                        salesStaff.timer = CONFIG.salesDelay;
                    } else if (salesStaff.state === 'SELLING') {
                        salesStaff.timer--;
                        if (salesStaff.timer <= 0) {
                            salesStaff.state = 'IDLE';
                            // Sell Execution
                            desk.stock -= requiredAmount;
                            s.truck.orders[type] = 0;
                            const totalGain = requiredAmount * price;
                            s.money += totalGain;
                            if (soundOn) playSfx('coin');
                            spawnText(s.truck.x + 50, s.truck.y, `+$${totalGain}`);
                            s.truck.phrase = getTruckPhrase(s.truck.orders.bread, s.truck.orders.ketchup);
                            return true;
                        }
                    }
                } else {
                    // Reset if conditions fail (e.g. ran out of stock mid-wait)
                    if (salesStaff.state === 'SELLING') salesStaff.state = 'IDLE';
                }
            }
            return false;
        };

        if (atBread) sold = checkSale(s.deskBread, 'bread', CONFIG.prices.bread, s.salesStaffBread);
        if (atKetchup) sold = checkSale(s.deskKetchup, 'ketchup', CONFIG.prices.ketchup, s.salesStaffKetchup);

        // Check if done with current station or all orders
        if (s.truck.orders.bread === 0 && s.truck.orders.ketchup === 0) {
            s.truck.targetX = EXIT_X;
            s.truck.state = 'DRIVING';
        } else if (atBread && s.truck.orders.bread === 0) {
             if (s.truck.orders.ketchup > 0) {
                 s.truck.targetX = KETCHUP_STOP_X;
                 s.truck.state = 'DRIVING';
             } else {
                 s.truck.targetX = EXIT_X;
                 s.truck.state = 'DRIVING';
             }
        }
    }
    
    setIsSellingManually(manualSellAction && !s.salesStaffBread.active && !s.salesStaffKetchup.active); 

    // --- PARTICLES & UTILS ---
    s.floatingTexts.forEach(t => { t.y -= 1; t.life -= 1; });
    s.floatingTexts = s.floatingTexts.filter(t => t.life > 0);
    s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
    s.particles = s.particles.filter(p => p.life > 0);

    s.saveTimer++;
    if (s.saveTimer > 300) { s.saveTimer = 0; saveGame(AUTOSAVE_KEY); }
    if (s.alertCooldown > 0) s.alertCooldown--;

    setUiTick(t => t + 1);
    animRef.current = requestAnimationFrame(update);
  }, [gameState, showUpgradeMenu, showSettings, alertMsg]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
        if (soundOn) initAudio(); // RESUME AUDIO if sound is on
        animRef.current = requestAnimationFrame(update); 
        return () => cleanupGame(); 
    }
  }, [gameState, update, soundOn]); // Re-run if sound settings change

  const buyUpgrade = (type: 'stack'|'speed'|'machineBread'|'machineSauce') => {
      const s = gs.current;
      let cost = 0; let success = false;
      if (type === 'stack' && s.lvlStack < 4) { cost = CONFIG.stack[s.lvlStack + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlStack++; success = true; } }
      else if (type === 'speed' && s.lvlSpeed < 3) { cost = CONFIG.speed[s.lvlSpeed + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlSpeed++; success = true; } }
      else if (type === 'machineBread' && s.lvlMachineBread < 2) { cost = CONFIG.machineBakery[s.lvlMachineBread + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineBread++; success = true; } }
      else if (type === 'machineSauce' && s.lvlMachineSauce < 2) { cost = CONFIG.machineSauce[s.lvlMachineSauce + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineSauce++; success = true; } }
      
      if (success) { spawnConfetti(180, 320); setAlertMsg("Upgrade Successful!"); s.purchaseCooldown = 60; }
  };

  const farmCost1 = CONFIG.farmStaff[gs.current.staffCorn.active ? gs.current.staffCorn.level + 1 : 0]?.cost || 0;
  const farmCost2 = CONFIG.tomatoStaff[gs.current.staffTomato.active ? gs.current.staffTomato.level + 1 : 0]?.cost || 0;

  // --- MENU BACKGROUND PARTICLES ---
  const MenuBackground = () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({length: 20}).map((_, i) => (
             <div key={i} 
                  className="absolute animate-[fall_3s_infinite_linear]" 
                  style={{
                      left: `${Math.random()*100}%`,
                      top: '-20px',
                      animationDuration: `${Math.random()*3 + 2}s`,
                      animationDelay: `${Math.random()*2}s`,
                      opacity: 0.5
                  }}>
                 <div className="text-green-500 font-bold text-xl">$</div>
             </div> 
          ))}
          <style>{`@keyframes fall { from { transform: translateY(-20px) rotate(0deg); } to { transform: translateY(110vh) rotate(360deg); } }`}</style>
      </div>
  );

  if (gameState === 'START') {
      return (
          <div className="w-full h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-700 via-purple-900 to-black flex flex-col items-center justify-center text-white gap-6 relative overflow-hidden">
              <MenuBackground />
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <button onClick={() => setShowSettings(true)} className="absolute top-6 right-6 w-10 h-10 bg-slate-700/50 rounded-full border border-slate-400 flex items-center justify-center hover:bg-slate-600 transition-colors z-50">⚙️</button>
              
              {/* PULSING GLOW TITLE */}
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg tracking-widest text-center z-10 animate-[pulse-glow_2s_infinite]">TOWNSHIP<br/>TYCOON</h1>
              <style>{`@keyframes pulse-glow { 0%, 100% { text-shadow: 0 0 20px #fbbf24; } 50% { text-shadow: 0 0 40px #d97706; } }`}</style>
              
              <div className="flex flex-col gap-4 z-10 w-72">
                  <button onClick={() => startGame()} className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl font-black text-xl shadow-2xl border-b-4 border-green-800 hover:scale-105 active:scale-95 transition-all">NEW GAME</button>
                  {hasSave && <button onClick={() => loadGame(AUTOSAVE_KEY)} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl font-black text-xl shadow-2xl border-b-4 border-blue-800 hover:scale-105 active:scale-95 transition-all">CONTINUE</button>}
                  
                  <div className="flex flex-col gap-2 mt-4">
                      {saveSlots.map(slot => (
                          <button key={slot.id} onClick={() => loadGame(slot.id)} className="w-full py-3 px-4 bg-slate-800/80 rounded-lg border-l-4 border-yellow-500 text-left hover:bg-slate-700 transition-colors">
                              <div className="text-xs font-black text-yellow-500">{slot.label}</div>
                              <div className="text-[10px] text-gray-300">{slot.date}</div>
                          </button>
                      ))}
                  </div>
              </div>

              {showSettings && (
                <div className="absolute inset-0 bg-black/90 z-[3000] flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 text-center">
                        <h2 className="font-black text-2xl text-slate-800 mb-4">SETTINGS</h2>
                        <button onClick={() => setSoundOn(!soundOn)} className={`w-full py-3 mb-4 rounded-xl font-bold border-2 ${soundOn ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>SOUND: {soundOn ? "ON 🔊" : "OFF 🔇"}</button>
                        <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">CLOSE</button>
                    </div>
                </div>
              )}
          </div>
      );
  }

  const s = gs.current;
  const canAffordAny = ((s.lvlStack < 4 && s.money >= CONFIG.stack[s.lvlStack+1].cost) || (s.lvlSpeed < 3 && s.money >= CONFIG.speed[s.lvlSpeed+1].cost) || (s.lvlMachineBread < 2 && s.money >= CONFIG.machineBakery[s.lvlMachineBread+1].cost));

  return (
    <div className="flex items-center justify-center w-full h-screen bg-slate-900 overflow-hidden relative">
      <div ref={containerRef} className="relative w-[360px] h-[640px] overflow-hidden bg-black rounded-3xl shadow-2xl border-8 border-slate-800 select-none cursor-pointer"
        onMouseDown={(e) => { if(!showUpgradeMenu && !showSettings && !alertMsg) gs.current.joystick = { active: true, originX: e.clientX, originY: e.clientY, dx: 0, dy: 0 }; }}
        onMouseMove={(e) => { if(gs.current.joystick.active) { gs.current.joystick.dx = e.clientX - gs.current.joystick.originX; gs.current.joystick.dy = e.clientY - gs.current.joystick.originY; } }}
        onMouseUp={() => { gs.current.joystick.active = false; }}
        onTouchStart={(e) => { if(!showUpgradeMenu && !showSettings && !alertMsg) gs.current.joystick = { active: true, originX: e.touches[0].clientX, originY: e.touches[0].clientY, dx: 0, dy: 0 }; }}
        onTouchMove={(e) => { if(gs.current.joystick.active) { gs.current.joystick.dx = e.touches[0].clientX - gs.current.joystick.originX; gs.current.joystick.dy = e.touches[0].clientY - gs.current.joystick.originY; } }}
        onTouchEnd={() => { gs.current.joystick.active = false; }}
      >
        {/* WORLD CONTAINER - MOVES FOR CAMERA */}
        <div style={{ transform: `translateX(${-s.camera.x}px)`, width: `${WORLD_WIDTH}px`, height: '100%', position: 'absolute', transition: 'transform 0.1s linear' }}>
            <div className="absolute inset-0 z-0"><SvgFloor width={WORLD_WIDTH} /></div>
            
            {/* LOCKED AREA FOG (Cleaned Up) */}
            {!s.unlockedKetchup && (
                <div className="absolute top-0 right-0 w-[360px] h-full bg-black/60 z-40 flex flex-col items-center justify-center border-l-4 border-slate-600">
                    <div className="text-6xl mb-2">🔒</div>
                </div>
            )}

            {/* --- ENTITIES --- */}
            
            {/* PATCHES (LAYER 1 - BOTTOM) */}
            {s.patches.map(p => (p.type === 'CORN' || s.unlockedKetchup) && <div key={p.id} className="absolute w-[40px] h-[60px]" style={{ left: p.x, top: p.y, zIndex: 1 }}><SvgPlant type={p.type} state={p.state} /></div>)}

            {/* TRUCK (Sorted by Y) */}
            <div className="absolute w-[160px] h-[70px] transition-transform duration-300" style={{ left: s.truck.x, top: s.truck.y, zIndex: Math.floor(s.truck.y), transform: s.truck.state === 'DRIVING' && s.truck.targetX < s.truck.x ? 'scaleX(-1)' : 'scaleX(1)' }}>
                <SvgTruck color={s.truck.color} />
                {s.truck.state !== 'IDLE' && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl border-2 border-slate-300 shadow-xl z-50 animate-bounce" style={{ transform: s.truck.state === 'DRIVING' && s.truck.targetX < s.truck.x ? 'scaleX(-1)' : 'scaleX(1)' }}><p className="font-bold text-sm whitespace-nowrap text-slate-800">{s.truck.phrase}</p><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-300 transform rotate-45"></div></div>}
            </div>

            {/* BAKERY (Sorted by Y) */}
            <div className="absolute w-[100px] h-[80px]" style={{ left: s.machineBakery.x, top: s.machineBakery.y, zIndex: Math.floor(s.machineBakery.y) }}>
                <SvgMachine type="BAKERY" working={s.machineBakery.processing} />
                {s.machineBakery.queue > 0 && <div className="absolute -top-4 right-0 bg-blue-500 text-white text-[10px] px-1 rounded">Q: {s.machineBakery.queue}</div>}
            </div>
            {s.machineBakery.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-8 h-6 animate-bounce relative"><SvgItem type="BREAD" /></div></div>)}

            {/* SAUCE MACHINE (Sorted by Y) */}
            {s.unlockedKetchup && (
                <>
                <div className="absolute w-[100px] h-[80px]" style={{ left: s.machineSauce.x, top: s.machineSauce.y, zIndex: Math.floor(s.machineSauce.y) }}>
                    <SvgMachine type="SAUCE" working={s.machineSauce.processing} />
                    {s.machineSauce.queue > 0 && <div className="absolute -top-4 right-0 bg-red-500 text-white text-[10px] px-1 rounded">Q: {s.machineSauce.queue}</div>}
                </div>
                {s.machineSauce.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-4 h-8 animate-bounce relative"><SvgItem type="KETCHUP" /></div></div>)}
                </>
            )}

            {/* BREAD DESK (Sorted by Y) */}
            <div className="absolute w-[80px] h-[60px]" style={{ left: s.deskBread.x - 40, top: s.deskBread.y, zIndex: Math.floor(s.deskBread.y) }}>
                 <SvgDesk />
                 <div className="absolute -top-4 w-full text-center text-xs font-black text-black drop-shadow bg-white/70 rounded">BREAD: {s.deskBread.stock}</div>
            </div>

            {/* KETCHUP DESK (Sorted by Y) */}
            {s.unlockedKetchup && (
                <div className="absolute w-[80px] h-[60px]" style={{ left: s.deskKetchup.x - 40, top: s.deskKetchup.y, zIndex: Math.floor(s.deskKetchup.y) }}>
                     <SvgDesk />
                     <div className="absolute -top-4 w-full text-center text-xs font-black text-black drop-shadow bg-white/70 rounded">KETCH: {s.deskKetchup.stock}</div>
                </div>
            )}
            
            {/* SELL ZONE INDICATOR */}
            {!s.salesStaffBread.active && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 60, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}

            {/* HIRE ZONES ROOM 1 */}
            <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffCorn.level>=4 ? 'bg-green-600/50 border-green-400' : s.money>=farmCost1 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneFarm.x, top: s.hireZoneFarm.y, zIndex: 10 }}>
                 {s.staffCorn.level>=4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffCorn.active ? `LVL ${s.staffCorn.level+2}` : "HIRE"}</div><div className="text-xs font-black text-white">${farmCost1}</div></>}
            </div>
            {!s.salesStaffBread.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money>=300 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSales.x, top: s.hireZoneSales.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">$300</div></div>}

            {/* HIRE ZONES ROOM 2 */}
            {s.unlockedKetchup && (
                <>
                <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffTomato.level>=4 ? 'bg-green-600/50 border-green-400' : s.money>=farmCost2 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneTomato.x, top: s.hireZoneTomato.y, zIndex: 10 }}>
                    {s.staffTomato.level>=4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffTomato.active ? `LVL ${s.staffTomato.level+2}` : "HIRE"}</div><div className="text-xs font-black text-white">${farmCost2}</div></>}
                </div>
                {!s.salesStaffKetchup.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money>=1000 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSalesKetchup.x, top: s.hireZoneSalesKetchup.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">$1000</div></div>}
                </>
            )}

            
            {/* CHARACTERS (Sorted by Y) */}
            {s.staffCorn.active && <div className="absolute w-[60px] h-[60px] transition-transform duration-75" style={{ left: s.staffCorn.x - 10, top: s.staffCorn.y, zIndex: Math.floor(s.staffCorn.y) }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffCorn.level)} /><div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffCorn.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}
            
            {s.staffTomato.active && s.unlockedKetchup && <div className="absolute w-[60px] h-[60px] transition-transform duration-75" style={{ left: s.staffTomato.x - 10, top: s.staffTomato.y, zIndex: Math.floor(s.staffTomato.y) }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffTomato.level)} /><div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffTomato.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}
            
            {s.salesStaffBread.active && <div className="absolute w-[60px] h-[60px]" style={{ left: 70, top: 400, zIndex: 400 }}><SvgCharacter type="SALES" isSelling={s.salesStaffBread.state === 'SELLING'} /></div>}
            {s.salesStaffKetchup.active && s.unlockedKetchup && <div className="absolute w-[60px] h-[60px]" style={{ left: 430, top: 400, zIndex: 400 }}><SvgCharacter type="SALES" isSelling={s.salesStaffKetchup.state === 'SELLING'} /></div>}

            <div className="absolute w-[60px] h-[60px]" style={{ left: s.player.x - 10, top: s.player.y, zIndex: Math.floor(s.player.y) }}>
                <SvgCharacter type="PLAYER" />
                {isSellingManually && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded animate-pulse whitespace-nowrap">SELLING...</div>}
                <div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">
                    {s.inventory.map((item, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md transform transition-transform" style={{ transform: `rotate(${Math.sin(i * 132) * 5}deg)` }}><SvgItem type={item} /></div>)}
                </div>
            </div>

            {/* PARTICLES */}
            {s.floatingTexts.map(t => <div key={t.id} className="absolute font-black text-green-400 text-xl drop-shadow-md z-[500] pointer-events-none" style={{ left: t.x, top: t.y, opacity: t.life/60 }}>{t.text}</div>)}
            {s.particles.map(p => <div key={p.id} className="absolute w-4 h-4 rounded-full z-[500] pointer-events-none" style={{ left: p.x, top: p.y, backgroundColor: p.color, opacity: p.life/60 }} />)}
        </div>

        {/* --- UI OVERLAY (Fixed to Screen) --- */}
        <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-full border-2 border-slate-200 shadow-xl flex items-center gap-2 z-[900] pointer-events-auto">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600" />
            <span className="font-black text-lg text-slate-800">${s.money}</span>
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-[900] backdrop-blur-sm">
            {s.inventory.length} / {CONFIG.stack[s.lvlStack].val}
        </div>

        {/* ALERT POPUP (FIXED POSITION & CENTERED) */}
        {alertMsg && (
            <div className="absolute inset-0 z-[3100] bg-black/50 flex items-center justify-center pointer-events-auto">
                <div className="bg-yellow-400 text-black px-8 py-6 rounded-2xl border-4 border-white shadow-2xl flex flex-col items-center gap-4 animate-bounce">
                    <span className="font-black text-xl text-center">{alertMsg}</span>
                    <button onClick={(e) => { e.stopPropagation(); setAlertMsg(null); }} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-800 font-bold text-lg shadow-lg transform active:scale-95 transition-transform">OK</button>
                </div>
            </div>
        )}

        {/* CONTROLS */}
        <div className="absolute bottom-4 left-4 flex gap-4 z-[900] pointer-events-auto">
            <div onClick={(e) => { e.stopPropagation(); setShowUpgradeMenu(true); }} className={`w-14 h-14 bg-purple-600 rounded-xl border-4 border-purple-400 flex items-center justify-center shadow-xl transition-transform active:scale-95 ${canAffordAny ? 'animate-bounce' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
            </div>
            <div onClick={(e) => { e.stopPropagation(); setShowSettings(true); }} className="w-14 h-14 bg-gray-600 rounded-xl border-4 border-gray-400 flex items-center justify-center shadow-xl transition-transform active:scale-95">
                <span className="text-2xl">⚙️</span>
            </div>
        </div>

        {/* MODALS */}
        {(showUpgradeMenu || showSettings) && (
            <div className="absolute inset-0 bg-slate-900/95 z-[3000] flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                {showUpgradeMenu && (
                    <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 shrink-0">
                            <h2 className="font-black text-2xl text-slate-800">UPGRADES</h2>
                            <button onClick={() => setShowUpgradeMenu(false)} className="text-red-500 font-bold text-xl">X</button>
                        </div>
                        {/* SCROLLABLE UPGRADE LIST */}
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                            {/* STACK */}
                            <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Player Stack: {CONFIG.stack[s.lvlStack].val} ➔ {s.lvlStack<4 ? CONFIG.stack[s.lvlStack+1].val : 'MAX'}</span></div><button disabled={s.lvlStack>=4} onClick={() => buyUpgrade('stack')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlStack>=4 ? 'bg-gray-400' : s.money >= CONFIG.stack[s.lvlStack+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlStack>=4 ? "MAX" : `$${CONFIG.stack[s.lvlStack+1].cost}`}</button></div>
                            
                            {/* SPEED */}
                            <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Player Speed: Lvl {s.lvlSpeed+1} ➔ {s.lvlSpeed<3 ? s.lvlSpeed+2 : 'MAX'}</span></div><button disabled={s.lvlSpeed>=3} onClick={() => buyUpgrade('speed')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlSpeed>=3 ? 'bg-gray-400' : s.money >= CONFIG.speed[s.lvlSpeed+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlSpeed>=3 ? "MAX" : `$${CONFIG.speed[s.lvlSpeed+1].cost}`}</button></div>
                            
                            {/* BAKERY SPEED */}
                            <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Bakery Speed: {(CONFIG.machineBakery[s.lvlMachineBread].val/60).toFixed(1)}s ➔ {s.lvlMachineBread<2 ? (CONFIG.machineBakery[s.lvlMachineBread+1].val/60).toFixed(1)+'s' : 'MAX'}</span></div><button disabled={s.lvlMachineBread>=2} onClick={() => buyUpgrade('machineBread')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineBread>=2 ? 'bg-gray-400' : s.money >= CONFIG.machineBakery[s.lvlMachineBread+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineBread>=2 ? "MAX" : `$${CONFIG.machineBakery[s.lvlMachineBread+1].cost}`}</button></div>

                            {/* SAUCE SPEED */}
                            {s.unlockedKetchup ? (
                                <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Sauce Speed: {(CONFIG.machineSauce[s.lvlMachineSauce].val/60).toFixed(1)}s ➔ {s.lvlMachineSauce<2 ? (CONFIG.machineSauce[s.lvlMachineSauce+1].val/60).toFixed(1)+'s' : 'MAX'}</span></div><button disabled={s.lvlMachineSauce>=2} onClick={() => buyUpgrade('machineSauce')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineSauce>=2 ? 'bg-gray-400' : s.money >= CONFIG.machineSauce[s.lvlMachineSauce+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineSauce>=2 ? "MAX" : `$${CONFIG.machineSauce[s.lvlMachineSauce+1].cost}`}</button></div>
                            ) : (
                                <div className="bg-slate-200 p-2 rounded-lg shrink-0 opacity-50"><div className="text-center text-xs font-bold text-slate-500">Unlock Zone 2 for more upgrades</div></div>
                            )}
                        </div>
                    </div>
                )}
                {showSettings && (
                    <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 text-center">
                        <h2 className="font-black text-2xl text-slate-800 mb-4">SETTINGS</h2>
                        <button onClick={() => setSoundOn(!soundOn)} className={`w-full py-3 mb-4 rounded-xl font-bold border-2 ${soundOn ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>SOUND: {soundOn ? "ON 🔊" : "OFF 🔇"}</button>
                        <p className="text-xs font-bold text-slate-400 mb-2">MANUAL SAVE SLOTS</p>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[1, 2, 3].map(i => <button key={i} onClick={() => saveGame(`slot_${i}`)} className="py-2 bg-blue-500 text-white rounded font-bold text-xs hover:bg-blue-600">SLOT {i}</button>)}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={exitToMenu} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold border-b-4 border-red-800 active:scale-95">EXIT TO MENU</button>
                            <button onClick={() => setShowSettings(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold border-b-4 border-slate-950 active:scale-95">CLOSE</button>
                        </div>
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default GameSandbox;
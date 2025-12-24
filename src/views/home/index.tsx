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
    machine: [ {val: 120, cost: 0}, {val: 90, cost: 500}, {val: 60, cost: 1000} ], // 120 frames = 2s
    farmStaff: [ {val: 1, cost: 100}, {val: 2, cost: 200}, {val: 3, cost: 300}, {val: 4, cost: 400}, {val: 5, cost: 500} ],
    salesStaff: { cost: 300 },
    maxMachineOutput: 12
};

// --- AUDIO SYSTEM ---
// Singleton Audio Context to respect browser autoplay policies
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

const playSfx = (type: 'pop' | 'coin' | 'upgrade') => {
    if (!audioCtx) return;
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
        }
    } catch (e) { console.error(e); }
};

// --- HELPER: STAFF CAP COLOR ---
const getStaffCapColor = (level: number) => {
    const colors = ['#fff', '#4caf50', '#2196f3', '#9c27b0', '#ffeb3b'];
    return colors[level] || '#fff';
};

// --- ASSETS: SVGS ---

const SvgFloor = () => (
  <svg width="100%" height="100%" preserveAspectRatio="none">
    <defs>
      <pattern id="wood-floor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#e1c699" />
        <path d="M0 38 L40 38" stroke="#c5a575" strokeWidth="2" />
        <path d="M0 0 L0 40" stroke="#c5a575" strokeWidth="1" opacity="0.5" />
      </pattern>
      <pattern id="asphalt" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="#37474f" />
        <path d="M50 0 L50 100" stroke="#ffeb3b" strokeWidth="4" strokeDasharray="20 10" />
      </pattern>
      <pattern id="grass" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
         <rect width="50" height="50" fill="#8bc34a" />
         <circle cx="10" cy="10" r="2" fill="#689f38" opacity="0.5" />
         <circle cx="35" cy="35" r="3" fill="#689f38" opacity="0.5" />
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

const SvgCornPlant = ({ state }: { state: 'RIPE' | 'GROWING' }) => {
  if (state === 'GROWING') return <div className="w-2 h-2 bg-green-800/30 rounded-full mx-auto mt-8" />;
  return (
    <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-md">
       <path d="M20 60 L20 20" stroke="#558b2f" strokeWidth="3" />
       <path d="M20 50 Q5 40 5 25" stroke="#7cb342" strokeWidth="2" fill="none" />
       <path d="M20 50 Q35 40 35 25" stroke="#7cb342" strokeWidth="2" fill="none" />
       <rect x="15" y="10" width="10" height="25" rx="3" fill="#fdd835" stroke="#fbc02d" strokeWidth="1" />
       <path d="M15 15 H25 M15 20 H25 M15 25 H25 M15 30 H25" stroke="#f9a825" strokeWidth="0.5" />
    </svg>
  );
};

const SvgCornCob = () => (
  <svg viewBox="0 0 20 30" className="w-full h-full drop-shadow-sm">
    <rect x="5" y="2" width="10" height="26" rx="3" fill="#fdd835" stroke="#fbc02d" strokeWidth="1" />
    <path d="M5 8 H15 M5 14 H15 M5 20 H15 M5 26 H15" stroke="#f9a825" strokeWidth="0.5" />
  </svg>
);

const SvgBread = () => (
  <svg viewBox="0 0 40 30" className="w-full h-full drop-shadow-md">
      <path d="M2 18 Q2 28 20 28 Q38 28 38 18 L38 25 Q38 28 30 28 L10 28 Q2 28 2 25 Z" fill="#5d4037" />
      <path d="M2 15 Q2 5 20 5 Q38 5 38 15 L38 22 Q38 25 20 25 Q2 25 2 22 Z" fill="#8d6e63" />
      <path d="M4 12 Q20 2 36 12 Q20 16 4 12 Z" fill="#d7ccc8" opacity="0.8" />
      <path d="M15 10 Q20 14 25 10" stroke="#5d4037" strokeWidth="1.5" fill="none" />
  </svg>
);

const SvgMachine = ({ working }: { working: boolean }) => (
  <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl">
    <rect x="5" y="40" width="90" height="30" fill="#455a64" rx="4" />
    <rect x="10" y="35" width="80" height="10" fill="#263238" />
    <rect x="25" y="5" width="50" height="40" fill="#039be5" rx="4" stroke="#0277bd" strokeWidth="2" />
    <circle cx="50" cy="25" r="8" fill={working ? "#ff1744" : "#00e676"} className={working ? "animate-pulse" : ""} />
    <path d="M30 5 L20 0 L80 0 L70 5 Z" fill="#81d4fa" />
  </svg>
);

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
type FloatingText = { id: number; x: number; y: number; text: string; life: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; color: string; life: number; size: number; };

// --- MAIN COMPONENT ---

const GameSandbox: FC = () => {
  const ROAD_BOUNDARY_Y = 445;
  const AUTOSAVE_KEY = 'township_autosave';
  
  // --- UI STATES ---
  const [gameState, setGameState] = useState<'START' | 'PLAYING'>('START');
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [uiTick, setUiTick] = useState(0);
  const [hasSave, setHasSave] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // --- GAME REFS ---
  const gs = useRef({
    inventory: [] as Array<'CORN' | 'BREAD'>,
    money: 0,
    lvlStack: 0,
    lvlSpeed: 0,
    lvlMachine: 0,
    
    player: { x: 160, y: 300 },
    staff: { active: false, level: 0, x: 50, y: 50, state: 'IDLE', holding: 0, maxHold: 1, cooldown: 0 },
    salesStaff: { active: false, x: 100, y: 460, salesTimer: 0 },
    truck: { x: -200, y: 530, state: 'IDLE', order: 0, color: '#fbc02d', phrase: 'I need bread 🍞' },
    machine: { x: 250, y: 280, processing: false, timer: 0, queue: 0, output: [] as Array<{id: number, x: number, y: number}> },
    desk: { x: 100, y: 460, stock: 0 },
    
    hireZoneFarm: { x: 280, y: 100 }, 
    hireZoneSales: { x: 200, y: 460 },
    
    patches: Array.from({ length: 9 }, (_, i) => ({ id: i, x: 40 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' as 'RIPE' | 'GROWING' })),
    
    floatingTexts: [] as FloatingText[],
    particles: [] as Particle[],
    
    joystick: { active: false, originX: 0, originY: 0, dx: 0, dy: 0 },
    
    // Logic flags
    alertCooldown: 0,
    saveTimer: 0,
    purchaseCooldown: 0,
    lastAffordableCount: 0
  });

  useEffect(() => {
      if (localStorage.getItem(AUTOSAVE_KEY)) setHasSave(true);
  }, []);

  const spawnText = (x: number, y: number, text: string) => {
      gs.current.floatingTexts.push({ id: Date.now() + Math.random(), x, y, text, life: 60 });
  };

  const spawnConfetti = (x: number, y: number) => {
      if (soundOn) playSfx('upgrade');
      for(let i=0; i<40; i++) { 
          gs.current.particles.push({
              id: Math.random(),
              x, y,
              vx: (Math.random() - 0.5) * 15,
              vy: (Math.random() - 0.5) * 15,
              color: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'][Math.floor(Math.random()*5)],
              life: 60,
              size: Math.random() * 6 + 4 
          });
      }
  };

  const loadGame = (key: string) => {
      initAudio(); // Activate audio context on interaction
      const data = localStorage.getItem(key);
      if (data) {
          try {
              const p = JSON.parse(data);
              const s = gs.current;
              s.money = p.money || 0;
              s.lvlStack = p.lvlStack || 0;
              s.lvlSpeed = p.lvlSpeed || 0;
              s.lvlMachine = p.lvlMachine || 0;
              if (p.staffLevel > 0) {
                  s.staff.active = true;
                  s.staff.level = p.staffLevel - 1;
                  s.staff.maxHold = p.staffLevel;
              } else {
                  s.staff.active = false;
                  s.staff.level = 0;
              }
              s.salesStaff.active = p.salesActive || false;
              setGameState('PLAYING');
          } catch(e) { console.error(e); }
      }
  };

  const startGame = () => {
      initAudio(); // Activate audio context
      gs.current.money = 0;
      gs.current.lvlStack = 0;
      gs.current.lvlSpeed = 0;
      gs.current.lvlMachine = 0;
      gs.current.inventory = [];
      gs.current.staff = { active: false, level: 0, x: 50, y: 50, state: 'IDLE', holding: 0, maxHold: 1, cooldown: 0 };
      gs.current.salesStaff = { active: false, x: 100, y: 460, salesTimer: 0 };
      gs.current.desk.stock = 0;
      setGameState('PLAYING');
  };

  const saveGame = (key: string) => {
      const s = gs.current;
      const data = {
          money: s.money,
          lvlStack: s.lvlStack,
          lvlSpeed: s.lvlSpeed,
          lvlMachine: s.lvlMachine,
          staffLevel: s.staff.active ? s.staff.level + 1 : 0,
          salesActive: s.salesStaff.active
      };
      localStorage.setItem(key, JSON.stringify(data));
      if (key !== AUTOSAVE_KEY) {
          spawnConfetti(180, 320);
          alert("Game Saved Successfully!");
      }
  };

  const exitToMenu = () => {
      setGameState('START');
      setShowSettings(false);
  };

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const s = gs.current;
    
    // CONTROLS LOCKED IF MENU OPEN
    if (showUpgradeMenu || showSettings) {
        requestAnimationFrame(update);
        return;
    }

    const playerSpeed = CONFIG.speed[s.lvlSpeed].val;
    const maxStack = CONFIG.stack[s.lvlStack].val;
    const machineTime = CONFIG.machine[s.lvlMachine].val;

    // MOVEMENT
    if (s.joystick.active) {
      const len = Math.sqrt(s.joystick.dx ** 2 + s.joystick.dy ** 2);
      if (len > 0) {
        const moveX = (s.joystick.dx / len) * playerSpeed;
        const moveY = (s.joystick.dy / len) * playerSpeed;
        s.player.x = Math.max(20, Math.min(320, s.player.x + moveX));
        s.player.y = Math.max(20, Math.min(ROAD_BOUNDARY_Y, s.player.y + moveY));
      }
    }

    // HIRING (FARM)
    const distToFarmHire = Math.max(Math.abs(s.player.x - (s.hireZoneFarm.x + 30)), Math.abs(s.player.y - (s.hireZoneFarm.y + 30)));
    if (distToFarmHire < 40 && s.staff.cooldown <= 0) {
        if (s.staff.level < 4) {
            const nextLvl = s.staff.active ? s.staff.level + 1 : 0;
            const cost = CONFIG.farmStaff[nextLvl].cost;
            if (s.money >= cost) {
                s.money -= cost;
                s.staff.active = true;
                s.staff.level = nextLvl;
                s.staff.maxHold = nextLvl + 1;
                s.staff.cooldown = 120;
                s.purchaseCooldown = 300; 
                s.lastAffordableCount = 100;
                spawnConfetti(s.hireZoneFarm.x + 30, s.hireZoneFarm.y + 30);
            }
        }
    }
    // HIRING (SALES)
    if (!s.salesStaff.active) {
        const distToSalesHire = Math.max(Math.abs(s.player.x - (s.hireZoneSales.x + 30)), Math.abs(s.player.y - (s.hireZoneSales.y + 30)));
        if (distToSalesHire < 50 && s.staff.cooldown <= 0) { 
            if (s.money >= CONFIG.salesStaff.cost) {
                s.money -= CONFIG.salesStaff.cost;
                s.salesStaff.active = true;
                s.staff.cooldown = 120;
                s.purchaseCooldown = 300;
                s.lastAffordableCount = 100;
                spawnConfetti(s.hireZoneSales.x + 30, s.hireZoneSales.y + 30);
                setAlertMsg("Sales Staff Hired!");
            }
        }
    }
    if (s.staff.cooldown > 0) s.staff.cooldown--;
    if (s.purchaseCooldown > 0) s.purchaseCooldown--;

    // FARMING
    s.patches.forEach(p => { if (p.state === 'GROWING') { p.timer--; if (p.timer <= 0) p.state = 'RIPE'; } });
    if (s.inventory.length < maxStack) {
        s.patches.forEach(p => {
            if (p.state === 'RIPE') {
                const dx = s.player.x - p.x;
                const dy = s.player.y - p.y;
                if (Math.sqrt(dx*dx + dy*dy) < 30) {
                    p.state = 'GROWING';
                    p.timer = 300;
                    s.inventory.push('CORN');
                    if (soundOn) playSfx('pop');
                }
            }
        });
    }

    // ENTITIES LOGIC
    const machineIsFull = s.machine.output.length >= CONFIG.maxMachineOutput;
    if (s.staff.active) {
        const bot = s.staff;
        if (bot.holding < bot.maxHold) {
            const ripe = s.patches.find(p => p.state === 'RIPE');
            if (ripe) {
                const dist = Math.sqrt((ripe.x - bot.x)**2 + (ripe.y - bot.y)**2);
                if (dist < 5) { ripe.state = 'GROWING'; ripe.timer = 300; bot.holding += 1; } else { bot.x += ((ripe.x - bot.x)/dist)*1.2; bot.y += ((ripe.y - bot.y)/dist)*1.2; }
            }
        } else {
            const dist = Math.sqrt((s.machine.x - bot.x)**2 + (s.machine.y - bot.y)**2);
            if (machineIsFull && dist > 50) { /* Wait */ } else if (dist < 10) { s.machine.queue += bot.holding; bot.holding = 0; } else { bot.x += ((s.machine.x - bot.x)/dist)*1.2; bot.y += ((s.machine.y - bot.y)/dist)*1.2; }
        }
    }

    const distToMach = Math.sqrt((s.player.x - s.machine.x)**2 + (s.player.y - s.machine.y)**2);
    if (distToMach < 40) {
        const corns = s.inventory.filter(i => i === 'CORN').length;
        if (corns > 0) { s.inventory = s.inventory.filter(i => i !== 'CORN'); s.machine.queue += corns; }
    }
    if (!s.machine.processing && s.machine.queue > 0 && !machineIsFull) { s.machine.processing = true; s.machine.queue--; s.machine.timer = machineTime; }
    if (s.machine.processing) {
        s.machine.timer--;
        if (s.machine.timer <= 0) {
            s.machine.processing = false;
            if (s.machine.output.length < CONFIG.maxMachineOutput) s.machine.output.push({ id: Date.now(), x: s.machine.x - 30, y: s.machine.y + 20 });
        }
    }
    if (s.inventory.length < maxStack) {
        s.machine.output = s.machine.output.filter(item => {
            if (s.inventory.length >= maxStack) return true;
            if (Math.sqrt((s.player.x - item.x)**2 + (s.player.y - item.y)**2) < 30) { s.inventory.push('BREAD'); return false; }
            return true;
        });
    }

    const STOP_X = 100; 
    if (s.truck.state === 'IDLE') {
        if (Math.random() < 0.01) {
            s.truck.state = 'DRIVING_IN'; s.truck.x = -180;
            const amt = Math.floor(Math.random() * 5) + 1; s.truck.order = amt;
            s.truck.color = ['#d32f2f', '#388e3c', '#1976d2', '#f57c00'][Math.floor(Math.random()*4)];
            s.truck.phrase = `I need ${amt} 🍞`;
        }
    } else if (s.truck.state === 'DRIVING_IN') {
        if (s.truck.x < STOP_X) s.truck.x += 2.0; else { s.truck.state = 'WAITING'; if (s.salesStaff.active) s.salesStaff.salesTimer = 180; }
    } else if (s.truck.state === 'WAITING') {
        let ready = false;
        if (s.salesStaff.active) { if (s.salesStaff.salesTimer > 0) s.salesStaff.salesTimer--; else ready = true; }
        else if (Math.abs(s.player.x - 100) < 40 && Math.abs(s.player.y - 425) < 30) ready = true;

        if (ready && s.desk.stock >= s.truck.order) {
            s.desk.stock -= s.truck.order;
            const gain = s.truck.order * 15;
            s.money += gain;
            if (soundOn) playSfx('coin');
            spawnText(s.truck.x + 50, s.truck.y, `+$${gain}`);
            s.truck.state = 'DRIVING_OUT';
        }
    } else if (s.truck.state === 'DRIVING_OUT') {
        s.truck.x += 2.0; if (s.truck.x > 450) s.truck.state = 'IDLE';
    }

    if (Math.sqrt((s.player.x - s.desk.x)**2 + (s.player.y - s.desk.y)**2) < 60) {
        const idx = s.inventory.indexOf('BREAD');
        if (idx > -1) { s.inventory.splice(idx, 1); s.desk.stock += 1; }
    }

    s.floatingTexts.forEach(t => { t.y -= 1; t.life -= 1; });
    s.floatingTexts = s.floatingTexts.filter(t => t.life > 0);
    s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
    s.particles = s.particles.filter(p => p.life > 0);

    s.saveTimer++;
    if (s.saveTimer > 300) { s.saveTimer = 0; saveGame(AUTOSAVE_KEY); }
    
    // Alert logic
    if (s.purchaseCooldown <= 0) {
        if (s.alertCooldown > 0) s.alertCooldown--;
        else {
            let affordable = 0;
            if (s.lvlStack < 4 && s.money >= CONFIG.stack[s.lvlStack+1].cost) affordable++;
            if (s.lvlSpeed < 3 && s.money >= CONFIG.speed[s.lvlSpeed+1].cost) affordable++;
            if (s.lvlMachine < 2 && s.money >= CONFIG.machine[s.lvlMachine+1].cost) affordable++;
            if (affordable > s.lastAffordableCount) { setAlertMsg("New Upgrade Available!"); s.alertCooldown = 600; }
            s.lastAffordableCount = affordable;
        }
    }

    setUiTick(t => t + 1);
    requestAnimationFrame(update);
  }, [gameState, showUpgradeMenu, showSettings]);

  useEffect(() => {
    if (gameState === 'PLAYING') { const anim = requestAnimationFrame(update); return () => cancelAnimationFrame(anim); }
  }, [gameState, update]);

  const buyUpgrade = (type: 'stack'|'speed'|'machine') => {
      const s = gs.current;
      let cost = 0;
      let success = false;
      if (type === 'stack' && s.lvlStack < 4) { cost = CONFIG.stack[s.lvlStack + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlStack++; success = true; } }
      else if (type === 'speed' && s.lvlSpeed < 3) { cost = CONFIG.speed[s.lvlSpeed + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlSpeed++; success = true; } }
      else if (type === 'machine' && s.lvlMachine < 2) { cost = CONFIG.machine[s.lvlMachine + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachine++; success = true; } }

      if (success) {
          spawnConfetti(180, 320);
          setAlertMsg("Upgrade Successful!");
          s.purchaseCooldown = 300; 
          s.lastAffordableCount = 100;
      }
  };

  const farmCost = CONFIG.farmStaff[gs.current.staff.active ? gs.current.staff.level + 1 : 0]?.cost || 0;

  if (gameState === 'START') {
      return (
          <div className="w-full h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-700 via-purple-900 to-black flex flex-col items-center justify-center text-white gap-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <button onClick={() => setShowSettings(true)} className="absolute top-6 right-6 w-10 h-10 bg-slate-700/50 rounded-full border border-slate-400 flex items-center justify-center hover:bg-slate-600 transition-colors z-50">⚙️</button>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg tracking-widest text-center z-10">TOWNSHIP<br/>TYCOON</h1>
              <div className="flex flex-col gap-4 z-10 w-64">
                  <button onClick={() => startGame()} className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl font-black text-xl shadow-2xl border-b-4 border-green-800 hover:scale-105 active:scale-95 transition-all">NEW GAME</button>
                  {hasSave && <button onClick={() => loadGame(AUTOSAVE_KEY)} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl font-black text-xl shadow-2xl border-b-4 border-blue-800 hover:scale-105 active:scale-95 transition-all">CONTINUE</button>}
                  <div className="flex justify-between gap-2">
                      {[1, 2, 3].map(i => <button key={i} onClick={() => loadGame(`slot_${i}`)} className="flex-1 py-2 bg-slate-700 rounded-lg border-2 border-slate-500 text-xs font-bold hover:bg-slate-600">LOAD {i}</button>)}
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
  const canAffordAny = ((s.lvlStack < 4 && s.money >= CONFIG.stack[s.lvlStack+1].cost) || (s.lvlSpeed < 3 && s.money >= CONFIG.speed[s.lvlSpeed+1].cost) || (s.lvlMachine < 2 && s.money >= CONFIG.machine[s.lvlMachine+1].cost));

  return (
    <div className="flex items-center justify-center w-full h-screen bg-slate-900 overflow-hidden relative">
      <div ref={containerRef} className="relative w-[360px] h-[640px] overflow-hidden bg-black rounded-3xl shadow-2xl border-8 border-slate-800 select-none cursor-pointer"
        onMouseDown={(e) => { if(!showUpgradeMenu && !showSettings) gs.current.joystick = { active: true, originX: e.clientX, originY: e.clientY, dx: 0, dy: 0 }; }}
        onMouseMove={(e) => { if(gs.current.joystick.active) { gs.current.joystick.dx = e.clientX - gs.current.joystick.originX; gs.current.joystick.dy = e.clientY - gs.current.joystick.originY; } }}
        onMouseUp={() => { gs.current.joystick.active = false; }}
        onTouchStart={(e) => { if(!showUpgradeMenu && !showSettings) gs.current.joystick = { active: true, originX: e.touches[0].clientX, originY: e.touches[0].clientY, dx: 0, dy: 0 }; }}
        onTouchMove={(e) => { if(gs.current.joystick.active) { gs.current.joystick.dx = e.touches[0].clientX - gs.current.joystick.originX; gs.current.joystick.dy = e.touches[0].clientY - gs.current.joystick.originY; } }}
        onTouchEnd={() => { gs.current.joystick.active = false; }}
      >
        <div className="absolute inset-0 z-0"><SvgFloor /></div>

        {/* --- ENTITIES (z 10-30) --- */}
        <div className="absolute w-[160px] h-[70px]" style={{ left: s.truck.x, top: s.truck.y, zIndex: 30 }}>
            <SvgTruck color={s.truck.color} />
            {s.truck.state === 'WAITING' && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl border-2 border-slate-300 shadow-xl z-50 animate-bounce"><p className="font-bold text-sm whitespace-nowrap text-slate-800">{s.truck.phrase}</p><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-300 transform rotate-45"></div></div>}
        </div>
        <div className="absolute w-[100px] h-[80px]" style={{ left: s.machine.x, top: s.machine.y, zIndex: 20 }}>
            <SvgMachine working={s.machine.processing} />
            {s.machine.queue > 0 && <div className="absolute -top-4 right-0 bg-blue-500 text-white text-[10px] px-1 rounded">Q: {s.machine.queue}</div>}
        </div>
        {s.machine.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: o.y }}><div className="absolute top-[20px] left-[5px] w-6 h-2 bg-black/30 rounded-full blur-[1px]"></div><div className="w-8 h-6 animate-bounce relative"><SvgBread /></div></div>)}
        <div className="absolute w-[80px] h-[60px]" style={{ left: s.desk.x - 40, top: s.desk.y, zIndex: 20 }}>
             <SvgDesk />
             <div className="absolute -top-4 w-full text-center text-xs font-black text-black drop-shadow bg-white/70 rounded">STOCK: {s.desk.stock} 🍞</div>
        </div>
        {!s.salesStaff.active && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 60, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}

        <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staff.level>=4 ? 'bg-green-600/50 border-green-400' : s.money>=farmCost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneFarm.x, top: s.hireZoneFarm.y, zIndex: 10 }}>
             {s.staff.level>=4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staff.active ? `LVL ${s.staff.level+2}` : "HIRE"}</div><div className="text-xs font-black text-white">${farmCost}</div></>}
        </div>
        {!s.salesStaff.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money>=300 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSales.x, top: s.hireZoneSales.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">$300</div></div>}

        {s.patches.map(p => <div key={p.id} className="absolute w-[40px] h-[60px]" style={{ left: p.x, top: p.y, zIndex: p.y }}><SvgCornPlant state={p.state} /></div>)}
        {s.staff.active && <div className="absolute w-[60px] h-[60px] transition-transform duration-75" style={{ left: s.staff.x - 10, top: s.staff.y, zIndex: s.staff.y }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staff.level)} /><div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{Array.from({ length: s.staff.holding }).map((_, i) => <div key={i} className="w-8 h-8 -mb-5 drop-shadow-md"><SvgCornCob /></div>)}</div></div>}
        {s.salesStaff.active && <div className="absolute w-[60px] h-[60px]" style={{ left: 70, top: 400, zIndex: 19 }}><SvgCharacter type="SALES" isSelling={s.truck.state === 'WAITING' && s.desk.stock >= s.truck.order} /></div>}
        <div className="absolute w-[60px] h-[60px]" style={{ left: s.player.x - 10, top: s.player.y, zIndex: s.player.y }}><SvgCharacter type="PLAYER" /><div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.inventory.map((item, i) => <div key={i} className="w-8 h-8 -mb-5 drop-shadow-md transform transition-transform" style={{ transform: `rotate(${Math.sin(i * 132) * 5}deg)` }}>{item === 'CORN' ? <SvgCornCob /> : <SvgBread />}</div>)}</div></div>

        {/* PARTICLES & TEXT (z 500) */}
        {s.floatingTexts.map(t => <div key={t.id} className="absolute font-black text-green-400 text-xl drop-shadow-md z-[500] pointer-events-none" style={{ left: t.x, top: t.y, opacity: t.life/60 }}>{t.text}</div>)}
        {s.particles.map(p => <div key={p.id} className="absolute w-4 h-4 rounded-full z-[500] pointer-events-none" style={{ left: p.x, top: p.y, backgroundColor: p.color, opacity: p.life/60 }} />)}

        {/* --- UI (z 900) --- */}
        <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-full border-2 border-slate-200 shadow-xl flex items-center gap-2 z-[900] pointer-events-auto">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600" />
            <span className="font-black text-lg text-slate-800">${s.money}</span>
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-[900] backdrop-blur-sm">
            {s.inventory.length} / {CONFIG.stack[s.lvlStack].val}
        </div>

        {/* CONTROLS (Bottom Left) */}
        <div className="absolute bottom-4 left-4 flex gap-4 z-[900] pointer-events-auto">
            <div onClick={(e) => { e.stopPropagation(); setShowUpgradeMenu(true); }} className={`w-14 h-14 bg-purple-600 rounded-xl border-4 border-purple-400 flex items-center justify-center shadow-xl transition-transform active:scale-95 ${canAffordAny ? 'animate-bounce' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/></svg>
            </div>
            <div onClick={(e) => { e.stopPropagation(); setShowSettings(true); }} className="w-14 h-14 bg-gray-600 rounded-xl border-4 border-gray-400 flex items-center justify-center shadow-xl transition-transform active:scale-95">
                <span className="text-2xl">⚙️</span>
            </div>
        </div>

        {/* ALERT POPUP (z 3100 - Top of Everything) */}
        {alertMsg && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-xl border-4 border-white shadow-2xl z-[3100] flex gap-4 items-center animate-bounce">
                <span className="font-bold">{alertMsg}</span>
                <button onClick={(e) => { e.stopPropagation(); setAlertMsg(null); }} className="bg-black text-white px-2 rounded">OK</button>
            </div>
        )}

        {/* MODALS (z 3000 - COVERS GAME) */}
        {(showUpgradeMenu || showSettings) && (
            <div className="absolute inset-0 bg-slate-900/95 z-[3000] flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                {showUpgradeMenu && (
                    <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-black text-2xl text-slate-800">UPGRADES</h2>
                            <button onClick={() => setShowUpgradeMenu(false)} className="text-red-500 font-bold text-xl">X</button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Stack: {CONFIG.stack[s.lvlStack].val} ➔ {s.lvlStack<4 ? CONFIG.stack[s.lvlStack+1].val : 'MAX'}</span></div><button disabled={s.lvlStack>=4} onClick={() => buyUpgrade('stack')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlStack>=4 ? 'bg-gray-400' : s.money >= CONFIG.stack[s.lvlStack+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlStack>=4 ? "MAX" : `$${CONFIG.stack[s.lvlStack+1].cost}`}</button></div>
                            <div className="bg-slate-100 p-2 rounded-lg"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Speed: Lvl {s.lvlSpeed+1} ➔ {s.lvlSpeed<3 ? s.lvlSpeed+2 : 'MAX'}</span></div><button disabled={s.lvlSpeed>=3} onClick={() => buyUpgrade('speed')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlSpeed>=3 ? 'bg-gray-400' : s.money >= CONFIG.speed[s.lvlSpeed+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlSpeed>=3 ? "MAX" : `$${CONFIG.speed[s.lvlSpeed+1].cost}`}</button></div>
                            <div className="bg-slate-100 p-2 rounded-lg"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Machine: {(CONFIG.machine[s.lvlMachine].val/60).toFixed(1)}s ➔ {s.lvlMachine<2 ? (CONFIG.machine[s.lvlMachine+1].val/60).toFixed(1)+'s' : 'MAX'}</span></div><button disabled={s.lvlMachine>=2} onClick={() => buyUpgrade('machine')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachine>=2 ? 'bg-gray-400' : s.money >= CONFIG.machine[s.lvlMachine+1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachine>=2 ? "MAX" : `$${CONFIG.machine[s.lvlMachine+1].cost}`}</button></div>
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
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







import { useEffect, useRef, useCallback } from 'react';

// --- CONFIGURATION ---
const CONFIG = {
    stack: [{ val: 8, cost: 0 }, { val: 10, cost: 100 }, { val: 12, cost: 200 }, { val: 14, cost: 350 }, { val: 16, cost: 500 }],
    speed: [{ val: 1.8, cost: 0 }, { val: 2.2, cost: 150 }, { val: 2.6, cost: 300 }, { val: 3.0, cost: 600 }],

    // Machines
    machineBakery: [{ val: 120, cost: 0 }, { val: 90, cost: 500 }, { val: 60, cost: 1000 }],
    machineSauce: [{ val: 180, cost: 0 }, { val: 150, cost: 1000 }, { val: 120, cost: 2000 }],
    machineCheese: [{ val: 240, cost: 0 }, { val: 200, cost: 2000 }, { val: 160, cost: 4000 }],
    machineJuice: [{ val: 300, cost: 0 }, { val: 240, cost: 4000 }, { val: 180, cost: 8000 }],
    machineChocolate: [{ val: 360, cost: 0 }, { val: 300, cost: 10000 }, { val: 240, cost: 20000 }],

    // Zone 1 Costs
    farmStaff: [{ val: 1, cost: 100 }, { val: 2, cost: 200 }, { val: 3, cost: 300 }, { val: 4, cost: 400 }, { val: 5, cost: 500 }],
    salesStaffBread: { cost: 300 },

    // Zone 2 Costs (More Expensive)
    tomatoStaff: [{ val: 1, cost: 500 }, { val: 2, cost: 1000 }, { val: 3, cost: 1500 }, { val: 4, cost: 2000 }, { val: 5, cost: 2500 }],
    salesStaffKetchup: { cost: 1000 },

    // Zone 3 Costs (Dairy)
    wheatStaff: [{ val: 1, cost: 1500 }, { val: 2, cost: 3000 }, { val: 3, cost: 4500 }, { val: 4, cost: 6000 }, { val: 5, cost: 7500 }],
    salesStaffCheese: { cost: 3000 },

    // Zone 4 Costs (Orchard)
    orchardStaff: [{ val: 1, cost: 5000 }, { val: 2, cost: 10000 }, { val: 3, cost: 15000 }, { val: 4, cost: 20000 }, { val: 5, cost: 25000 }],
    salesStaffJuice: { cost: 8000 },

    // Zone 5 Costs (Chocolatery)
    cocoaStaff: [{ val: 1, cost: 15000 }, { val: 2, cost: 30000 }, { val: 3, cost: 45000 }, { val: 4, cost: 60000 }, { val: 5, cost: 75000 }],
    salesStaffChocolate: { cost: 25000 },

    maxMachineOutput: 12,
    prices: { bread: 15, ketchup: 40, cheese: 85, juice: 150, chocolate: 350 },
    unlocks: { ketchupZone: 5000, dairyZone: 15000, orchardZone: 50000, chocolateZone: 150000 },
    salesDelay: 180, // 3 Seconds @ 60fps

    // Machine Queue Upgrades
    machineQueue: [
        { val: 12, cost: 0 },
        { val: 16, cost: 300 },
        { val: 20, cost: 600 },
        { val: 25, cost: 1000 },
        { val: 30, cost: 2000 },
        { val: 40, cost: 4000 },
        { val: 50, cost: 8000 }
    ],

    // Global Upgrades
    coffeeMachine: [{ val: 0.1, cost: 2000 }, { val: 0.3, cost: 5000 }, { val: 0.6, cost: 10000 }], // Stamina Regen Rate

    ACHIEVEMENTS: [
        { id: 'first_steps', name: 'First Steps', desc: 'Harvest your first crop', reward: '100 Gems', condition: (s: any) => s.lifetime.totalMoney > 0 },
        { id: 'big_spender', name: 'Big Spender', desc: 'Spend over $1,000', reward: '500 Gems', condition: (s: any) => s.lifetime.totalMoney >= 1000 },
        { id: 'factory_leader', name: 'Factory Leader', desc: 'Unlock Night Mode ($50k)', reward: 'Night Mode', condition: (s: any) => s.lifetime.totalMoney >= 50000 },
        { id: 'tycoon', name: 'Tycoon', desc: 'Earn $1,000,000', reward: '10,000 Gems', condition: (s: any) => s.lifetime.totalMoney >= 1000000 },
        { id: 'cheese_whiz', name: 'Cheese Whiz', desc: 'Unlock Dairy Farm', reward: '1,000 Gems', condition: (s: any) => s.unlockedDairy },
        { id: 'juice_master', name: 'Juice Master', desc: 'Unlock Orchard', reward: '2,000 Gems', condition: (s: any) => s.unlockedOrchard },
        { id: 'choc_king', name: 'Choc King', desc: 'Unlock Chocolaterie', reward: '5,000 Gems', condition: (s: any) => s.unlockedChocolate },
        { id: 'orchard_owner', name: 'Orchard Owner', desc: 'Harvest 100 Oranges', reward: '1,000 Gems', condition: (s: any) => s.lifetime.totalJuice >= 100 },
        { id: 'chocolatier', name: 'Chocolatier', desc: 'Produce 50 Chocolate Bars', reward: '2,000 Gems', condition: (s: any) => s.lifetime.totalChocolate >= 50 },
        { id: 'hire_squad', name: 'Hiring Squad', desc: 'Hire 5 Staff Members', reward: '500 Gems', condition: (s: any) => (s.staffCorn.active ? 1 : 0) + (s.staffTomato.active ? 1 : 0) + (s.staffWheat.active ? 1 : 0) + (s.staffOrchard.active ? 1 : 0) + (s.staffCocoa.active ? 1 : 0) >= 5 },
        { id: 'sales_guru', name: 'Sales Guru', desc: 'Hire all Sales Staff', reward: '2,500 Gems', condition: (s: any) => s.salesStaffBread.active && s.salesStaffKetchup.active && s.salesStaffCheese.active && s.salesStaffJuice.active && s.salesStaffChocolate.active },
        { id: 'hoarder', name: 'Hoarder', desc: 'Hold 5000 Gems', reward: '1,000 Gems', condition: (s: any) => s.gems >= 5000 },
        { id: 'marathon', name: 'Marathon', desc: 'Walk 10,000 Steps', reward: 'Snow Theme', condition: (s: any) => s.lifetime.steps >= 10000 },
        { id: 'mars_explorer', name: 'Mars Explorer', desc: 'Earn $5,000,000', reward: 'Mars Theme', condition: (s: any) => s.lifetime.totalMoney >= 5000000 },
        { id: 'golden_truck', name: 'Golden Truck', desc: 'Earn $5,000', reward: 'Golden Truck', condition: (s: any) => s.lifetime.totalMoney >= 5000 },
    ]
};

// --- THEMES ---
const THEMES = {
    DEFAULT: { id: 'DEFAULT', name: 'Sunny Day', bg: 'bg-emerald-500', ground: 'bg-emerald-600', text: 'text-slate-800' },
    NIGHT: { id: 'NIGHT', name: 'Night Mode', bg: 'bg-slate-900', ground: 'bg-slate-800', text: 'text-slate-200' },
    SNOW: { id: 'SNOW', name: 'Winter Wonderland', bg: 'bg-slate-200', ground: 'bg-white', text: 'text-slate-800' },
    MARS: { id: 'MARS', name: 'Mars Colony', bg: 'bg-orange-900', ground: 'bg-orange-800', text: 'text-orange-100' },
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
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const stopAudio = () => {
    if (audioCtx && audioCtx.state === 'running') {
        audioCtx.suspend();
    }
};

// --- AUDIO ENGINE ---
class MusicController {
    ctx: AudioContext | null = null;
    layers: { [key: string]: OscillatorNode | null } = {};
    gains: { [key: string]: GainNode | null } = {};
    isPlaying = false;

    startLayer(name: string, type: 'sine' | 'square' | 'sawtooth' | 'triangle', freq: number, volume: number) {
        if (!this.ctx) return;

        if (this.layers[name]) return; // Already playing

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // LFO for movement (subtle vibrato)
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.5; // Hz
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 5; // Reduced Depth
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 2); // Fade in

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();

        this.layers[name] = osc;
        this.gains[name] = gain;
    }

    stopLayer(name: string) {
        if (!this.ctx || !this.layers[name]) return;
        const gain = this.gains[name];
        if (gain) {
            try {
                gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1); // Fade out
                setTimeout(() => {
                    if (this.layers[name]) {
                        try { this.layers[name]?.stop(); } catch (e) { }
                        this.layers[name] = null;
                    }
                }, 1000);
            } catch (e) { }
        }
    }

    updateMusic(s: any) {
        if (!this.isPlaying || !this.ctx) return;

        // Base Layer (Always on)
        this.startLayer('base', 'sine', 100, 0.05);

        // Layer 1: Zone 2 (Tomato) - Melody
        if (s.unlockedKetchup) this.startLayer('melody', 'triangle', 300, 0.03);

        // Layer 2: Zone 3 (Dairy) - High Hats
        if (s.unlockedDairy) this.startLayer('hihat', 'square', 800, 0.01);

        // Layer 3: Zone 5 (Chocolate) - Harmony
        if (s.unlockedChocolate) this.startLayer('harmony', 'sine', 200, 0.04);
    }

    toggle(on: boolean) {
        this.isPlaying = on;
        if (!on) {
            Object.keys(this.layers).forEach(key => this.stopLayer(key));
        } else {
            // Re-trigger update to start layers if they were stopped
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        }
    }
}

const musicCtrl = new MusicController();

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

// --- MANAGER SYSTEM TYPES & DATA ---
type ManagerType = 'PRODUCTION' | 'LOGISTICS' | 'SALES';
export interface ManagerCard {
    id: string;
    name: string;
    type: ManagerType;
    rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
    desc: string;
    effectValue: number; // e.g. 0.15 for 15% speed
    color: string;
}

const MANAGERS: ManagerCard[] = [
    // PRODUCTION (Green) - Machine Speed
    { id: 'm_prod_1', name: 'Luigi the Baker', type: 'PRODUCTION', rarity: 'COMMON', desc: '+10% Machine Speed', effectValue: 0.10, color: 'bg-green-500' },
    { id: 'm_prod_2', name: 'Chef Pierre', type: 'PRODUCTION', rarity: 'RARE', desc: '+25% Machine Speed', effectValue: 0.25, color: 'bg-green-600' },
    { id: 'm_prod_3', name: 'Factory Joe', type: 'PRODUCTION', rarity: 'LEGENDARY', desc: '+50% Machine Speed', effectValue: 0.50, color: 'bg-green-700' },

    // LOGISTICS (Blue) - Carry Capacity
    { id: 'm_log_1', name: 'Strongman Steve', type: 'LOGISTICS', rarity: 'COMMON', desc: '+1 Carry Capacity', effectValue: 1, color: 'bg-blue-500' },
    { id: 'm_log_2', name: 'Boxer Bob', type: 'LOGISTICS', rarity: 'RARE', desc: '+3 Carry Capacity', effectValue: 3, color: 'bg-blue-600' },
    { id: 'm_log_3', name: 'Atlas', type: 'LOGISTICS', rarity: 'LEGENDARY', desc: '+5 Carry Capacity', effectValue: 5, color: 'bg-blue-700' },

    // SALES (Gold) - Truck Wait Time
    { id: 'm_sale_1', name: 'Smiling Sarah', type: 'SALES', rarity: 'COMMON', desc: '+5s Truck Wait', effectValue: 5, color: 'bg-yellow-500' },
    { id: 'm_sale_2', name: 'The Wolf', type: 'SALES', rarity: 'RARE', desc: '+10s Truck Wait', effectValue: 10, color: 'bg-yellow-600' },
    { id: 'm_sale_3', name: 'Tycoon Tom', type: 'SALES', rarity: 'LEGENDARY', desc: '+20s Truck Wait', effectValue: 20, color: 'bg-yellow-700' },
];

const GACHA_COST = 100; // Gems

// --- HELPER: STAFF CAP COLOR ---
const getStaffCapColor = (level: number) => {
    const colors = ['#fff', '#4caf50', '#2196f3', '#9c27b0', '#ffeb3b'];
    return colors[level] || '#fff';
};

// --- ASSETS: SVGS ---

const SvgFloor = ({ width, theme }: { width: number, theme: string }) => {
    const colors: any = {
        DEFAULT: { grass: '#8bc34a', grassDot: '#689f38', wood: '#e1c699', woodStroke: '#c5a575', asphalt: '#37474f', line: '#ffeb3b', brick: '#a1887f', brickStroke: '#5d4037' },
        NIGHT: { grass: '#1b5e20', grassDot: '#003300', wood: '#3e2723', woodStroke: '#1b0000', asphalt: '#212121', line: '#ffeb3b', brick: '#4e342e', brickStroke: '#261612' },
        SNOW: { grass: '#e3f2fd', grassDot: '#bbdefb', wood: '#cfd8dc', woodStroke: '#90a4ae', asphalt: '#455a64', line: '#81d4fa', brick: '#b0bec5', brickStroke: '#78909c' },
        MARS: { grass: '#d84315', grassDot: '#bf360c', wood: '#4e342e', woodStroke: '#3e2723', asphalt: '#263238', line: '#ff5722', brick: '#5d4037', brickStroke: '#3e2723' },
    };
    const c = colors[theme] || colors.DEFAULT;

    return (
        <svg width="100%" height="100%" preserveAspectRatio="none">
            <defs>
                <pattern id="wood-floor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="40" height="40" fill={c.wood} />
                    <path d="M0 38 L40 38" stroke={c.woodStroke} strokeWidth="2" />
                </pattern>
                <pattern id="asphalt" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill={c.asphalt} />
                    <path d="M50 0 L50 100" stroke={c.line} strokeWidth="4" strokeDasharray="20 10" />
                </pattern>
                <pattern id="grass" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                    <rect width="50" height="50" fill={c.grass} />
                    <circle cx="10" cy="10" r="2" fill={c.grassDot} opacity="0.5" />
                </pattern>
                <pattern id="brick" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                    <rect width="20" height="10" fill={c.brick} />
                    <path d="M0 10 L20 10 M10 0 L10 10" stroke={c.brickStroke} strokeWidth="1" />
                </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="45%" fill="url(#grass)" />
            <rect x="0" y="45%" width="100%" height="35%" fill="url(#wood-floor)" />
            <rect x="0" y="80%" width="100%" height="20%" fill="url(#asphalt)" />
            <rect x="0" y="78%" width="100%" height="20" fill="url(#brick)" stroke={c.brickStroke} strokeWidth="2" />
            <rect x="0" y="43%" width="100%" height="10" fill={c.brickStroke} />
        </svg>
    );
};

const SvgPlant = ({ type, state }: { type: 'CORN' | 'TOMATO' | 'WHEAT' | 'COCOA', state: 'RIPE' | 'GROWING' }) => {
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
    if (type === 'TOMATO') {
        return (
            <svg viewBox="0 0 40 60" className="w-full h-full drop-shadow-md">
                <path d="M20 60 L20 20" stroke="#558b2f" strokeWidth="3" />
                <path d="M20 40 Q5 30 5 15" stroke="#7cb342" strokeWidth="2" fill="none" />
                <path d="M20 40 Q35 30 35 15" stroke="#7cb342" strokeWidth="2" fill="none" />
                <circle cx="20" cy="20" r="12" fill="#d32f2f" stroke="#b71c1c" strokeWidth="1" />
                <path d="M20 8 L24 12 M20 8 L16 12" stroke="#33691e" strokeWidth="2" />
            </svg>
        );
    }
    // WHEAT
    if (type === 'WHEAT') {
        return (
            <svg viewBox="0 0 60 60" className="w-full h-full" style={{ overflow: 'visible' }}>
                <path d="M30 50 Q30 20 20 10" stroke="#e6c07b" strokeWidth="3" fill="none" />
                <path d="M30 50 Q30 20 40 10" stroke="#e6c07b" strokeWidth="3" fill="none" />
                <path d="M30 50 L30 10" stroke="#e6c07b" strokeWidth="3" fill="none" />
                <circle cx="20" cy="10" r="3" fill="#fdd835" />
                <circle cx="40" cy="10" r="3" fill="#fdd835" />
                <circle cx="30" cy="8" r="3" fill="#fdd835" />
            </svg>
        );
    } else if (type === 'COCOA') {
        return (
            <svg viewBox="0 0 60 60" className="w-full h-full" style={{ overflow: 'visible' }}>
                <path d="M30 50 Q10 40 10 20 Q30 10 50 20 Q50 40 30 50 Z" fill="#4e342e" />
                <ellipse cx="20" cy="30" rx="6" ry="8" fill="#795548" />
                <ellipse cx="40" cy="30" rx="6" ry="8" fill="#795548" />
                <ellipse cx="30" cy="20" rx="6" ry="8" fill="#795548" />
                {state === 'RIPE' && (
                    <>
                        <ellipse cx="20" cy="30" rx="4" ry="6" fill="#8d6e63" />
                        <ellipse cx="40" cy="30" rx="4" ry="6" fill="#8d6e63" />
                        <ellipse cx="30" cy="20" rx="4" ry="6" fill="#8d6e63" />
                    </>
                )}
            </svg>
        );
    }
    return null;
};

const SvgTree = ({ state, fruitCount }: { state: 'GROWING' | 'RIPE' | 'SHAKING', fruitCount: number }) => {
    return (
        <svg viewBox="0 0 80 100" className={`w-full h-full drop-shadow-xl ${state === 'SHAKING' ? 'animate-shake' : ''}`}>
            <style>{`@keyframes shake { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(5deg); } 75% { transform: rotate(-5deg); } } .animate-shake { animation: shake 0.2s infinite; }`}</style>
            {/* Trunk */}
            <path d="M40 100 L40 60" stroke="#5d4037" strokeWidth="8" />
            <path d="M40 60 L20 40 M40 60 L60 40" stroke="#5d4037" strokeWidth="6" />

            {/* Leaves */}
            <circle cx="40" cy="30" r="30" fill="#2e7d32" />
            <circle cx="25" cy="40" r="20" fill="#388e3c" />
            <circle cx="55" cy="40" r="20" fill="#388e3c" />
            <circle cx="40" cy="15" r="20" fill="#4caf50" />

            {/* Fruits */}
            {state === 'RIPE' && (
                <>
                    <circle cx="30" cy="30" r="5" fill="#ff9800" stroke="#e65100" strokeWidth="1" />
                    <circle cx="50" cy="35" r="5" fill="#ff9800" stroke="#e65100" strokeWidth="1" />
                    <circle cx="40" cy="20" r="5" fill="#ff9800" stroke="#e65100" strokeWidth="1" />
                </>
            )}
        </svg>
    );
};

const SvgItem = ({ type }: { type: ItemType }) => {
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
            <path d="M15 5 L18 8 M15 5 L12 8" stroke="#33691e" strokeWidth="2" />
        </svg>
    );
    if (type === 'KETCHUP') return (
        <svg viewBox="0 0 20 40" className="w-full h-full drop-shadow-md">
            <rect x="5" y="10" width="10" height="25" rx="2" fill="#d32f2f" />
            <rect x="7" y="2" width="6" height="8" fill="#e0e0e0" />
            <rect x="5" y="18" width="10" height="10" fill="white" opacity="0.8" />
            <path d="M8 20 L12 28" stroke="red" strokeWidth="2" />
        </svg>
    );
    if (type === 'WHEAT') return (
        <svg viewBox="0 0 20 30" className="w-full h-full drop-shadow-sm">
            <path d="M10 30 L10 10" stroke="#e6c17a" strokeWidth="2" />
            <path d="M10 10 L5 2 M10 10 L15 2 M10 15 L5 7 M10 15 L15 7" stroke="#fbc02d" strokeWidth="2" />
        </svg>
    );
    if (type === 'MILK') return (
        <svg viewBox="0 0 20 30" className="w-full h-full drop-shadow-sm">
            <rect x="5" y="10" width="10" height="18" fill="white" stroke="#bdbdbd" strokeWidth="1" />
            <path d="M5 10 L10 2 L15 10 Z" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="1" />
        </svg>
    );
    if (type === 'CHEESE') return (
        <svg viewBox="0 0 30 20" className="w-full h-full drop-shadow-md">
            <path d="M15 10 L28 5 L15 0 L2 5 Z" fill="#ffeb3b" />
            <path d="M2 5 L2 12 L15 18 L28 12 L28 5" fill="#fdd835" />
            <path d="M15 18 L15 10" stroke="#fbc02d" strokeWidth="1" />
        </svg>
    );
    if (type === 'ORANGE') return (
        <svg viewBox="0 0 20 20" className="w-full h-full drop-shadow-sm">
            <circle cx="10" cy="10" r="8" fill="#ff9800" stroke="#e65100" strokeWidth="1" />
            <path d="M10 2 L10 4" stroke="#33691e" strokeWidth="2" />
        </svg>
    );
    if (type === 'JUICE') {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect x="10" y="5" width="20" height="30" fill="#ff9800" stroke="white" strokeWidth="2" />
                <path d="M15 15 L25 15" stroke="white" strokeWidth="2" />
                <rect x="18" y="2" width="4" height="3" fill="white" />
            </svg>
        );
    }
    if (type === 'COCOA') {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full">
                <ellipse cx="20" cy="20" rx="12" ry="16" fill="#5d4037" stroke="#3e2723" strokeWidth="2" />
                <path d="M20 5 L20 35" stroke="#3e2723" strokeWidth="1" />
            </svg>
        );
    }
    if (type === 'CHOCOLATE') {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect x="5" y="10" width="30" height="20" fill="#5d4037" stroke="#8d6e63" strokeWidth="2" />
                <rect x="5" y="10" width="30" height="5" fill="#8d6e63" />
                <text x="20" y="24" fontSize="8" fill="#d7ccc8" textAnchor="middle" fontWeight="bold">CHOC</text>
            </svg>
        );
    }
    if (type === 'TRASH_BAG') {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full">
                <path d="M10 10 L30 10 L35 35 L5 35 Z" fill="#424242" stroke="black" strokeWidth="1" />
                <path d="M15 5 L25 5 L28 10 L12 10 Z" fill="#616161" stroke="black" strokeWidth="1" />
                <path d="M15 15 L25 25" stroke="#757575" strokeWidth="1" />
                <path d="M25 15 L15 25" stroke="#757575" strokeWidth="1" />
            </svg>
        );
    }
    return ( // JUICE
        <svg viewBox="0 0 20 30" className="w-full h-full drop-shadow-md">
            <rect x="5" y="5" width="10" height="20" fill="#ff9800" opacity="0.8" />
            <rect x="5" y="5" width="10" height="20" stroke="#e65100" strokeWidth="1" fill="none" />
            <path d="M8 5 L8 2 L12 2 L12 5" stroke="#e65100" strokeWidth="1" fill="none" />
        </svg>
    );
};

const SvgMachine = ({ type, working, jammed }: { type: 'BAKERY' | 'SAUCE' | 'CHEESE' | 'JUICE' | 'CHOCOLATE', working: boolean, jammed?: boolean }) => {
    const mainColor = type === 'BAKERY' ? '#039be5' : type === 'SAUCE' ? '#e53935' : type === 'CHEESE' ? '#ffeb3b' : type === 'JUICE' ? '#ff9800' : '#5d4037';
    const accentColor = type === 'BAKERY' ? '#0277bd' : type === 'SAUCE' ? '#c62828' : type === 'CHEESE' ? '#fbc02d' : type === 'JUICE' ? '#e65100' : '#3e2723';

    return (
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl">
            <rect x="5" y="40" width="90" height="30" fill="#455a64" rx="4" />
            <rect x="10" y="35" width="80" height="10" fill="#263238" />
            <rect x="25" y="5" width="50" height="40" fill={mainColor} rx="4" stroke={accentColor} strokeWidth="2" />
            <circle cx="50" cy="25" r="8" fill={jammed ? "#000" : (working ? "#ff1744" : "#00e676")} className={working && !jammed ? "animate-pulse" : ""} />
            <path d="M30 5 L20 0 L80 0 L70 5 Z" fill="#cfd8dc" />
            {type === 'SAUCE' && <path d="M35 15 L65 15 L50 35 Z" fill="#b71c1c" opacity="0.3" />}
            {type === 'JUICE' && <rect x="35" y="10" width="30" height="30" fill="white" opacity="0.3" />}
            {type === 'CHOCOLATE' && (
                <>
                    <rect x="30" y="10" width="20" height="20" fill="#8d6e63" />
                    <path d="M30 20 L20 30 L40 30 Z" fill="#8d6e63" />
                </>
            )}
            {jammed && (
                <g className="animate-pulse">
                    <path d="M20 10 L80 40" stroke="black" strokeWidth="4" />
                    <path d="M80 10 L20 40" stroke="black" strokeWidth="4" />
                    <text x="50" y="60" fontSize="20" textAnchor="middle">⚠️</text>
                </g>
            )}
        </svg>
    );
};

const SvgCow = ({ state }: { state: 'IDLE' | 'EATING' | 'MILKING' | 'READY' }) => (
    <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow-lg">
        <rect x="10" y="10" width="40" height="20" rx="5" fill="white" />
        <circle cx="15" cy="15" r="3" fill="black" />
        <circle cx="35" cy="20" r="4" fill="black" />
        <circle cx="45" cy="12" r="2" fill="black" />
        <rect x="10" y="30" width="4" height="8" fill="white" />
        <rect x="46" y="30" width="4" height="8" fill="white" />
        <rect x="5" y="8" width="10" height="12" rx="2" fill="white" />
        <circle cx="8" cy="12" r="1" fill="black" />
        <path d="M50 15 Q55 10 55 20" stroke="black" strokeWidth="1" fill="none" />
        {state === 'EATING' && <path d="M5 20 L0 25" stroke="green" strokeWidth="2" />}
        {state === 'READY' && <circle cx="30" cy="5" r="3" fill="white" stroke="blue" strokeWidth="1" className="animate-ping" />}
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

const SvgTruck = ({ color, isGolden }: { color: string, isGolden?: boolean }) => (
    <svg viewBox="0 0 140 70" className="w-full h-full drop-shadow-lg">
        <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FDB931" />
                <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
        </defs>
        <circle cx="35" cy="60" r="8" fill="#212121" />
        <circle cx="85" cy="60" r="8" fill="#212121" />
        <circle cx="115" cy="60" r="8" fill="#212121" />
        <path d="M95 30 L135 30 L135 55 L95 55 Z" fill={isGolden ? "url(#goldGradient)" : color} stroke={isGolden ? "#B8860B" : "black"} strokeWidth="1" />
        <path d="M110 30 L135 30 L135 45 L110 45 Z" fill="#b3e5fc" />
        <rect x="5" y="5" width="90" height="50" fill={isGolden ? "url(#goldGradient)" : color} stroke={isGolden ? "#B8860B" : "black"} strokeWidth="1" rx="2" />
        <rect x="8" y="8" width="84" height="44" fill="black" opacity="0.1" />
        <rect x="90" y="45" width="10" height="5" fill="#555" />
        {isGolden && <circle cx="10" cy="10" r="2" fill="white" className="animate-ping" />}
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
type ItemType = 'CORN' | 'BREAD' | 'TOMATO' | 'KETCHUP' | 'WHEAT' | 'MILK' | 'CHEESE' | 'ORANGE' | 'JUICE' | 'COCOA' | 'CHOCOLATE' | 'COFFEE' | 'TRASH_BAG';
type FloatingText = { id: number; x: number; y: number; text: string; life: number; };
type Particle = { id: number; x: number; y: number; vx: number; vy: number; color: string; life: number; size: number; };
type Patch = { id: number; type: 'CORN' | 'TOMATO' | 'WHEAT' | 'COCOA'; x: number; y: number; timer: number; state: 'RIPE' | 'GROWING' };
type Tree = { id: number; x: number; y: number; state: 'GROWING' | 'RIPE' | 'SHAKING'; timer: number; fruitCount: number };
type DroppedItem = { id: number; type: ItemType; x: number; y: number; timer: number };
type StaffState = { active: boolean; level: number; x: number; y: number; targetX: number; targetY: number; state: 'IDLE' | 'MOVING' | 'HARVESTING' | 'DEPOSITING' | 'SLEEP' | 'TIRED' | 'DRINKING'; timer: number; holding: ItemType[]; maxHold: number; stamina: number; maxStamina: number; };
type Cow = { id: number; x: number; y: number; state: 'IDLE' | 'EATING' | 'MILKING' | 'READY'; timer: number; milk: number };
type MachineState = { x: number; y: number; processing: boolean; timer: number; queue: number; output: Array<{ id: number, x: number, y: number }>; trash: number; jammed: boolean; };
type SalesStaffState = { active: boolean; x: number; y: number; timer: number; state: 'IDLE' | 'SELLING' | 'SLEEP' | 'TIRED' | 'DRINKING'; stamina: number; maxStamina: number; };

// --- MAIN COMPONENT ---

const GameSandbox: FC = () => {
    const ROAD_BOUNDARY_Y = 445;
    const WORLD_WIDTH = 1800;
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
    const [saveSlots, setSaveSlots] = useState<{ id: string, label: string, date: string }[]>([]);
    const [isSellingManually, setIsSellingManually] = useState(false);
    const [showTrashConfirm, setShowTrashConfirm] = useState(false);
    const [settingsTab, setSettingsTab] = useState<'OPTIONS' | 'ACHIEVEMENTS' | 'ABOUT'>('OPTIONS');
    const [aboutSubTab, setAboutSubTab] = useState<string | null>(null);
    const [showManagerMenu, setShowManagerMenu] = useState(false);
    const [musicOn, setMusicOn] = useState(() => localStorage.getItem('musicOn') !== 'false');
    const [sfxOn, setSfxOn] = useState(() => localStorage.getItem('sfxOn') !== 'false');
    const [toast, setToast] = useState<{ title: string, desc: string } | null>(null);

    const toggleMusic = () => {
        const newState = !musicOn;
        setMusicOn(newState);
        localStorage.setItem('musicOn', String(newState));
    };

    const toggleSfx = () => {
        const newState = !sfxOn;
        setSfxOn(newState);
        localStorage.setItem('sfxOn', String(newState));
    };

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
        lvlMachineCheese: 0,
        lvlMachineJuice: 0,
        lvlMachineChocolate: 0,
        lvlMachineQueue: 0,
        lvlCoffeeMachine: 0, // Stamina Upgrade
        unlockedKetchup: false,
        unlockedDairy: false,
        unlockedOrchard: false,
        unlockedChocolate: false,

        lifetime: { totalMoney: 0, totalBread: 0, totalKetchup: 0, totalCheese: 0, totalJuice: 0, totalChocolate: 0, steps: 0 },
        achievements: [] as string[],

        // MANAGER SYSTEM
        gems: 0,
        managers: {} as Record<string, number>, // id -> level
        activeManagers: { production: null, logistics: null, sales: null } as { production: string | null, logistics: string | null, sales: string | null },
        marketTrend: { type: 'NORMAL', resource: null, multiplier: 1, timer: 0, news: null } as { type: 'NORMAL' | 'SURGE' | 'CRASH', resource: ItemType | null, multiplier: number, timer: number, news: string | null },
        rushHour: { active: false, timer: 0 },
        rentTimer: 36000, // 10 minutes at 60fps

        // Themes
        activeTheme: 'DEFAULT',
        unlockedThemes: ['DEFAULT'],

        camera: { x: 0 },
        player: { x: 160, y: 300 },

        // STAFF
        staffCorn: { active: false, level: 0, x: 100, y: 100, targetX: 100, targetY: 100, state: 'IDLE', timer: 0, holding: [] as ItemType[], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState,
        staffTomato: { active: false, level: 0, x: 460, y: 100, targetX: 460, targetY: 100, state: 'IDLE', timer: 0, holding: [] as ItemType[], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState,
        staffWheat: { active: false, level: 0, x: 820, y: 100, targetX: 820, targetY: 100, state: 'IDLE', timer: 0, holding: [] as ItemType[], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState,
        staffOrchard: { active: false, level: 0, x: 1180, y: 100, targetX: 1180, targetY: 100, state: 'IDLE', timer: 0, holding: [] as ItemType[], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState,
        staffCocoa: { active: false, level: 0, x: 1540, y: 100, targetX: 1540, targetY: 100, state: 'IDLE', timer: 0, holding: [] as ItemType[], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState,

        // SALES STAFF
        salesStaffBread: { active: false, x: 100, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 } as SalesStaffState,
        salesStaffKetchup: { active: false, x: 460, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 } as SalesStaffState,
        salesStaffCheese: { active: false, x: 820, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 } as SalesStaffState,
        salesStaffJuice: { active: false, x: 1180, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 } as SalesStaffState,
        salesStaffChocolate: { active: false, x: 1540, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 } as SalesStaffState,

        truck: {
            x: -200, y: 530,
            state: 'IDLE' as 'IDLE' | 'DRIVING' | 'WAITING' | 'LEAVING',
            targetX: 0,

            orders: { bread: 0, ketchup: 0, cheese: 0, juice: 0, chocolate: 0 },
            color: '#fbc02d',
            phrase: '',
            waitTimer: 0,
            isGolden: false
        },

        machineBakery: { x: 250, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false } as MachineState,
        machineSauce: { x: 610, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false } as MachineState,
        machineCheese: { x: 970, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false } as MachineState,
        machineJuice: { x: 1330, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false } as MachineState,
        machineChocolate: { x: 1690, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false } as MachineState,

        deskBread: { x: 100, y: 460, stock: 0 },
        deskKetchup: { x: 460, y: 460, stock: 0 },
        deskCheese: { x: 820, y: 460, stock: 0 },
        deskJuice: { x: 1180, y: 460, stock: 0 },
        deskChocolate: { x: 1540, y: 460, stock: 0 },

        // HIRE ZONES
        hireZoneFarm: { x: 280, y: 100 },
        hireZoneSales: { x: 200, y: 460 },
        hireZoneTomato: { x: 550, y: 100 },
        hireZoneSalesKetchup: { x: 560, y: 460 },
        hireZoneWheat: { x: 910, y: 100 },
        hireZoneSalesCheese: { x: 920, y: 460 },
        hireZoneOrchard: { x: 1270, y: 100 },
        hireZoneSalesJuice: { x: 1280, y: 460 },
        hireZoneCocoa: { x: 1630, y: 100 },
        hireZoneSalesChocolate: { x: 1640, y: 460 },

        trashZone: { x: 30, y: 100 },

        patches: [] as Patch[],
        cows: [] as Cow[],
        trees: [] as Tree[],
        droppedItems: [] as DroppedItem[],

        floatingTexts: [] as FloatingText[],
        particles: [] as Particle[],

        joystick: { active: false, originX: 0, originY: 0, dx: 0, dy: 0 },

        // Logic flags
        alertCooldown: 0,
        saveTimer: 0,
        purchaseCooldown: 0,
        trashCooldown: 0,
        lastAffordableCount: 0,
        keys: { up: false, down: false, left: false, right: false },
        cheatBuffer: ''
    });

    // Init Patches
    const initPatches = () => {
        const p: Patch[] = [];
        // Corn (Room 1)
        for (let i = 0; i < 9; i++) p.push({ id: i, type: 'CORN', x: 40 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' });
        // Tomato (Room 2)
        for (let i = 0; i < 9; i++) p.push({ id: 100 + i, type: 'TOMATO', x: 400 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' });
        // Wheat (Room 3)
        for (let i = 0; i < 9; i++) p.push({ id: 200 + i, type: 'WHEAT', x: 760 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' });
        // Cocoa (Room 5)
        for (let i = 0; i < 9; i++) p.push({ id: 400 + i, type: 'COCOA', x: 1480 + (i % 3) * 60, y: 40 + Math.floor(i / 3) * 70, timer: 0, state: 'RIPE' });
        return p;
    };

    const initCows = () => {
        const c: Cow[] = [];
        for (let i = 0; i < 3; i++) c.push({ id: i, x: 950 + i * 40, y: 200, state: 'IDLE', timer: 0, milk: 0 });
        return c;
    };

    const initTrees = () => {
        const t: Tree[] = [];
        // Orchard (Room 4)
        for (let i = 0; i < 3; i++) t.push({ id: 300 + i, x: 1120 + i * 80, y: 150, state: 'RIPE', timer: 0, fruitCount: 3 });
        return t;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') gs.current.keys.up = true;
            if (e.key === 'ArrowDown') gs.current.keys.down = true;
            if (e.key === 'ArrowLeft') gs.current.keys.left = true;
            if (e.key === 'ArrowRight') gs.current.keys.right = true;

            // Cheat Code
            const s = gs.current;
            s.cheatBuffer += e.key.toLowerCase();
            if (s.cheatBuffer.length > 20) s.cheatBuffer = s.cheatBuffer.slice(-20);
            if (s.cheatBuffer.length > 20) s.cheatBuffer = s.cheatBuffer.slice(-20);
            // Cheat Code Removed for Submission
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') gs.current.keys.up = false;
            if (e.key === 'ArrowDown') gs.current.keys.down = false;
            if (e.key === 'ArrowLeft') gs.current.keys.left = false;
            if (e.key === 'ArrowRight') gs.current.keys.right = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Enter key to close alerts
    useEffect(() => {
        const handleEnter = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && alertMsg) {
                setAlertMsg(null);
            }
        };
        window.addEventListener('keydown', handleEnter);
        return () => window.removeEventListener('keydown', handleEnter);
    }, [alertMsg]);

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
        for (let i = 0; i < 40; i++) {
            gs.current.particles.push({
                id: Math.random(), x, y,
                vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
                color: ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0'][Math.floor(Math.random() * 5)],
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
                s.lvlMachineCheese = p.lvlMachineCheese || 0;
                s.lvlMachineJuice = p.lvlMachineJuice || 0;
                s.lvlMachineChocolate = p.lvlMachineChocolate || 0;
                s.lvlMachineQueue = p.lvlMachineQueue || 0;
                s.unlockedKetchup = p.unlockedKetchup || false;
                s.unlockedDairy = p.unlockedDairy || false;
                s.unlockedOrchard = p.unlockedOrchard || false;
                s.unlockedChocolate = p.unlockedChocolate || false;
                s.lifetime = p.lifetime || { totalMoney: p.money || 0, totalBread: 0, totalKetchup: 0, totalCheese: 0, totalJuice: 0, totalChocolate: 0, steps: 0 };
                s.achievements = p.achievements || [];
                s.patches = initPatches();
                s.cows = p.cows || initCows();
                s.trees = p.trees || initTrees();
                s.droppedItems = p.droppedItems || [];
                s.inventory = p.playerInventory || [];

                // Load Manager System
                s.gems = p.gems || 0;
                s.managers = p.managers || {};
                s.activeManagers = p.activeManagers || { production: null, logistics: null, sales: null };
                s.activeManagers = p.activeManagers || { production: null, logistics: null, sales: null };
                s.marketTrend = p.marketTrend || { type: 'NORMAL', resource: null, multiplier: 1, timer: 0, news: null };
                s.rentTimer = p.rentTimer || 36000;

                // Load Themes
                s.activeTheme = p.activeTheme || 'DEFAULT';
                s.unlockedThemes = p.unlockedThemes || ['DEFAULT'];

                // Load Staff Levels
                if (p.staffCornLevel) { s.staffCorn.active = true; s.staffCorn.level = p.staffCornLevel - 1; }
                if (p.staffTomatoLevel) { s.staffTomato.active = true; s.staffTomato.level = p.staffTomatoLevel - 1; }
                if (p.staffWheatLevel) { s.staffWheat.active = true; s.staffWheat.level = p.staffWheatLevel - 1; }
                if (p.staffOrchardLevel) { s.staffOrchard.active = true; s.staffOrchard.level = p.staffOrchardLevel - 1; }
                if (p.staffCocoaLevel) { s.staffCocoa.active = true; s.staffCocoa.level = p.staffCocoaLevel - 1; }
                s.salesStaffBread.active = p.salesBreadActive || false;
                s.salesStaffKetchup.active = p.salesKetchupActive || false;
                s.salesStaffCheese.active = !!p.salesCheeseActive;
                s.salesStaffJuice.active = !!p.salesJuiceActive;
                s.salesStaffChocolate.active = p.salesChocolateActive || false;

                // Load Machine/Desk State
                if (p.deskBreadStock) s.deskBread.stock = p.deskBreadStock;
                if (p.deskKetchupStock) s.deskKetchup.stock = p.deskKetchupStock;
                if (p.deskCheeseStock) s.deskCheese.stock = p.deskCheeseStock;
                if (p.deskJuiceStock) s.deskJuice.stock = p.deskJuiceStock;
                if (p.deskChocolateStock) s.deskChocolate.stock = p.deskChocolateStock;
                if (p.machineBakery) s.machineBakery = p.machineBakery;
                if (p.machineSauce) s.machineSauce = p.machineSauce;
                if (p.machineCheese) s.machineCheese = p.machineCheese;
                if (p.machineJuice) s.machineJuice = p.machineJuice;
                if (p.machineChocolate) s.machineChocolate = p.machineChocolate;

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
                // Load Staff 3
                if (p.staffWheatLevel > 0) {
                    s.staffWheat.active = true;
                    s.staffWheat.level = p.staffWheatLevel - 1;
                    s.staffWheat.maxHold = p.staffWheatLevel;
                }

                // Load Sales Staff State Correctly
                s.salesStaffBread.active = !!p.salesBreadActive;
                s.salesStaffKetchup.active = !!p.salesKetchupActive;
                s.salesStaffCheese.active = !!p.salesCheeseActive;

                setGameState('PLAYING');
            } catch (e) { console.error(e); }
        }
    };

    const startGame = () => {
        initAudio();
        const s = gs.current;
        // HARD RESET ALL STATE
        s.money = 0; s.lvlStack = 0; s.lvlSpeed = 0; s.lvlMachineBread = 0; s.lvlMachineSauce = 0; s.lvlMachineCheese = 0; s.lvlMachineJuice = 0; s.lvlMachineChocolate = 0; s.lvlMachineQueue = 0; s.lvlCoffeeMachine = 0;
        s.inventory = [];
        s.unlockedKetchup = false;
        s.unlockedDairy = false;
        s.unlockedOrchard = false;
        s.unlockedChocolate = false;
        s.lifetime = { totalMoney: 0, totalBread: 0, totalKetchup: 0, totalCheese: 0, totalJuice: 0, totalChocolate: 0, steps: 0 };
        s.achievements = [];

        // Reset Manager System
        s.gems = 0;
        s.managers = {};
        s.activeManagers = { production: null, logistics: null, sales: null };
        s.marketTrend = { type: 'NORMAL', resource: null, multiplier: 1, timer: 0, news: null };
        s.rentTimer = 36000;

        // Reset Themes
        s.activeTheme = 'DEFAULT';
        s.unlockedThemes = ['DEFAULT'];

        // Reset Staff
        s.staffCorn = { active: false, level: 0, x: 100, y: 100, targetX: 100, targetY: 100, state: 'IDLE', timer: 0, holding: [], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState;
        s.staffTomato = { active: false, level: 0, x: 460, y: 100, targetX: 460, targetY: 100, state: 'IDLE', timer: 0, holding: [], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState;
        s.staffWheat = { active: false, level: 0, x: 820, y: 100, targetX: 820, targetY: 100, state: 'IDLE', timer: 0, holding: [], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState;
        s.staffOrchard = { active: false, level: 0, x: 1180, y: 100, targetX: 1180, targetY: 100, state: 'IDLE', timer: 0, holding: [], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState;
        s.staffCocoa = { active: false, level: 0, x: 1540, y: 100, targetX: 1540, targetY: 100, state: 'IDLE', timer: 0, holding: [], maxHold: 1, stamina: 100, maxStamina: 100 } as StaffState;
        s.salesStaffBread = { active: false, x: 100, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 };
        s.salesStaffKetchup = { active: false, x: 460, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 };
        s.salesStaffCheese = { active: false, x: 820, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 };
        s.salesStaffJuice = { active: false, x: 1180, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 };
        s.salesStaffChocolate = { active: false, x: 1540, y: 460, timer: 0, state: 'IDLE', stamina: 100, maxStamina: 100 };

        // Reset Machines & Desks
        s.machineBakery = { x: 250, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false };
        s.machineSauce = { x: 610, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false };
        s.machineCheese = { x: 970, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false };
        s.machineJuice = { x: 1330, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false };
        s.machineChocolate = { x: 1690, y: 280, processing: false, timer: 0, queue: 0, output: [], trash: 0, jammed: false };
        s.deskBread.stock = 0;
        s.deskKetchup.stock = 0;
        s.deskCheese.stock = 0;
        s.deskJuice.stock = 0;
        s.deskChocolate.stock = 0;

        // Reset Truck
        s.truck = { x: -200, y: 530, state: 'IDLE', targetX: 0, orders: { bread: 0, ketchup: 0, cheese: 0, juice: 0, chocolate: 0 }, color: '#fbc02d', phrase: '', waitTimer: 0, isGolden: false };

        s.patches = initPatches();
        s.cows = initCows();
        s.trees = initTrees();
        s.droppedItems = [];
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
            lvlMachineCheese: s.lvlMachineCheese,
            lvlMachineJuice: s.lvlMachineJuice,
            lvlMachineChocolate: s.lvlMachineChocolate,
            lvlMachineQueue: s.lvlMachineQueue,
            staffCornLevel: s.staffCorn.active ? s.staffCorn.level + 1 : 0,
            staffTomatoLevel: s.staffTomato.active ? s.staffTomato.level + 1 : 0,
            staffWheatLevel: s.staffWheat.active ? s.staffWheat.level + 1 : 0,
            staffOrchardLevel: s.staffOrchard.active ? s.staffOrchard.level + 1 : 0,
            staffCocoaLevel: s.staffCocoa.active ? s.staffCocoa.level + 1 : 0,
            salesBreadActive: s.salesStaffBread.active,
            salesKetchupActive: s.salesStaffKetchup.active,
            salesCheeseActive: s.salesStaffCheese.active,
            salesJuiceActive: s.salesStaffJuice.active,
            salesChocolateActive: s.salesStaffChocolate.active,
            unlockedKetchup: s.unlockedKetchup,
            unlockedDairy: s.unlockedDairy,
            unlockedOrchard: s.unlockedOrchard,
            unlockedChocolate: s.unlockedChocolate,
            deskBreadStock: s.deskBread.stock,
            deskKetchupStock: s.deskKetchup.stock,
            deskCheeseStock: s.deskCheese.stock,
            deskJuiceStock: s.deskJuice.stock,
            deskChocolateStock: s.deskChocolate.stock,
            playerInventory: s.inventory,
            machineBakery: s.machineBakery,
            machineSauce: s.machineSauce,
            machineCheese: s.machineCheese,
            machineJuice: s.machineJuice,
            machineChocolate: s.machineChocolate,
            lifetime: s.lifetime,
            achievements: s.achievements,
            cows: s.cows,
            trees: s.trees,
            droppedItems: s.droppedItems,
            // Save Manager System
            gems: s.gems,
            managers: s.managers,
            activeManagers: s.activeManagers,
            marketTrend: s.marketTrend,
            rentTimer: s.rentTimer,
            // Save Themes
            activeTheme: s.activeTheme,
            unlockedThemes: s.unlockedThemes,
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
        setToast(null);
    };

    const getTruckPhrase = (bread: number, ketchup: number, cheese: number, juice: number, chocolate: number) => {
        const parts = [];
        if (bread > 0) parts.push(`${bread}🍞`);
        if (ketchup > 0) parts.push(`${ketchup}🍅`);
        if (cheese > 0) parts.push(`${cheese}🧀`);
        if (juice > 0) parts.push(`${juice}🧃`);
        if (chocolate > 0) parts.push(`${chocolate}🍫`);
        if (parts.length > 0) return `I need ${parts.join(' & ')}`;
        return "Thanks!";
    };

    const cleanMachine = (m: MachineState) => {
        const s = gs.current;
        const maxStack = CONFIG.stack[s.lvlStack].val + Math.floor(getManagerBonus('LOGISTICS'));

        if (m.jammed || m.trash > 0) {
            if (s.inventory.length < maxStack) {
                s.inventory.push('TRASH_BAG');
                m.trash = 0;
                m.jammed = false;
                if (sfxOn) playSfx('pop');
                setAlertMsg("Drop the Waste in the Trash Can");
                spawnConfetti(m.x + 40, m.y + 40);
            } else {
                setAlertMsg("Inventory Full!");
            }
        }
    };

    const update = useCallback(() => {
        if (gameState !== 'PLAYING') return;
        const s = gs.current;

        // PAUSE LOGIC
        if (showUpgradeMenu || showSettings || alertMsg || showTrashConfirm) { // Pause on alert too
            animRef.current = requestAnimationFrame(update);
            return;
        }



        // --- RENT ---
        s.rentTimer--;
        if (s.rentTimer <= 0) {
            const rent = 100 * (1 + (s.unlockedKetchup ? 1 : 0) + (s.unlockedDairy ? 1 : 0) + (s.unlockedOrchard ? 1 : 0) + (s.unlockedChocolate ? 1 : 0));
            s.money -= rent;
            s.rentTimer = 36000; // 10 mins
            setAlertMsg(`Rent Paid: -$${rent}`);
            if (sfxOn) playSfx('pop');
        }

        // --- MANAGER BONUSES ---
        const prodBonus = getManagerBonus('PRODUCTION'); // Raw value (e.g. 0.15)
        const logBonus = Math.floor(getManagerBonus('LOGISTICS')); // Flat value
        const salesBonus = getManagerBonus('SALES'); // Raw value

        const playerSpeed = CONFIG.speed[s.lvlSpeed].val;
        const maxStack = CONFIG.stack[s.lvlStack].val + logBonus;
        const breadSpeed = CONFIG.machineBakery[s.lvlMachineBread].val * (1 - prodBonus);
        const sauceSpeed = CONFIG.machineSauce[s.lvlMachineSauce].val * (1 - prodBonus);
        const cheeseSpeed = CONFIG.machineCheese[s.lvlMachineCheese].val * (1 - prodBonus);
        const juiceSpeed = CONFIG.machineJuice[s.lvlMachineJuice].val * (1 - prodBonus);
        const chocolateSpeed = CONFIG.machineChocolate[s.lvlMachineChocolate].val * (1 - prodBonus);
        const maxQueue = CONFIG.machineQueue[s.lvlMachineQueue].val;

        // --- PLAYER MOVEMENT ---
        let inputDx = 0;
        let inputDy = 0;

        if (s.joystick.active) {
            inputDx = s.joystick.dx;
            inputDy = s.joystick.dy;
        } else {
            if (s.keys.up) inputDy -= 1;
            if (s.keys.down) inputDy += 1;
            if (s.keys.left) inputDx -= 1;
            if (s.keys.right) inputDx += 1;
        }

        const len = Math.sqrt(inputDx ** 2 + inputDy ** 2);
        if (len > 0) {
            const moveX = (inputDx / len) * playerSpeed;
            const moveY = (inputDy / len) * playerSpeed;
            let nextX = s.player.x + moveX;
            let nextY = s.player.y + moveY;

            // World Bounds
            const MAX_X = s.unlockedOrchard ? WORLD_WIDTH - 20 : (s.unlockedDairy ? 1080 - 20 : (s.unlockedKetchup ? 720 - 20 : SCREEN_WIDTH - 20));
            nextX = Math.max(20, Math.min(MAX_X, nextX));
            nextY = Math.max(20, Math.min(ROAD_BOUNDARY_Y, nextY));

            // Unlock Checks
            // Zone 2 (Tomato)
            if (!s.unlockedKetchup && nextX > SCREEN_WIDTH - 30) {
                if (s.money >= CONFIG.unlocks.ketchupZone) {
                    s.money -= CONFIG.unlocks.ketchupZone;
                    s.unlockedKetchup = true;
                    spawnConfetti(360, 300);
                    setAlertMsg("TOMATO FARM UNLOCKED!");
                    if (sfxOn) playSfx('unlock');
                } else if (s.alertCooldown <= 0) {
                    setAlertMsg(`Need $${CONFIG.unlocks.ketchupZone} to unlock!`);
                    s.alertCooldown = 60;
                }
            }
            // Zone 3 (Dairy)
            if (s.unlockedKetchup && !s.unlockedDairy && nextX > 700 - 10) {
                if (s.money >= CONFIG.unlocks.dairyZone) {
                    s.money -= CONFIG.unlocks.dairyZone;
                    s.unlockedDairy = true;
                    spawnConfetti(720, 300);
                    setAlertMsg("DAIRY FARM UNLOCKED!");
                    if (sfxOn) playSfx('unlock');
                } else if (s.alertCooldown <= 0) {
                    setAlertMsg(`Need $${CONFIG.unlocks.dairyZone} to unlock!`);
                    s.alertCooldown = 60;
                }
            }
            // Zone 4 (Orchard)
            if (s.unlockedDairy && !s.unlockedOrchard && nextX > 1080 - 30) {
                if (s.money >= CONFIG.unlocks.orchardZone) {
                    s.money -= CONFIG.unlocks.orchardZone;
                    s.unlockedOrchard = true;
                    spawnConfetti(1080, 300);
                    setAlertMsg("ORCHARD UNLOCKED!");
                    if (sfxOn) playSfx('unlock');
                } else if (s.alertCooldown <= 0) {
                    setAlertMsg(`Need $${CONFIG.unlocks.orchardZone} to unlock!`);
                    s.alertCooldown = 60;
                }
            }
            // Zone 5 (Chocolate)
            if (s.unlockedOrchard && !s.unlockedChocolate && nextX > 1440 - 30) {
                if (s.money >= CONFIG.unlocks.chocolateZone) {
                    s.money -= CONFIG.unlocks.chocolateZone;
                    s.unlockedChocolate = true;
                    spawnConfetti(1440, 300);
                    setAlertMsg("CHOCOLATERIE UNLOCKED!");
                    if (sfxOn) playSfx('unlock');
                } else if (s.alertCooldown <= 0) {
                    setAlertMsg(`Need $${CONFIG.unlocks.chocolateZone} to unlock!`);
                    s.alertCooldown = 60;
                }
            }

            s.player.x = nextX;
            s.player.y = nextY;
            s.lifetime.steps += moveX + moveY; // Approx steps
        }

        // --- CAMERA ---
        let targetCam = s.player.x - SCREEN_WIDTH / 2;
        targetCam = Math.max(0, Math.min(targetCam, WORLD_WIDTH - SCREEN_WIDTH));
        s.camera.x += (targetCam - s.camera.x) * 0.1;

        // --- HIRING ---
        const checkHire = (zone: { x: number, y: number }, cost: number, action: () => void) => {
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

        // Zone 3 Hiring
        if (s.unlockedDairy) {
            // Farm Staff 3 (Wheat)
            if (s.staffWheat.level < 4) {
                const cost = CONFIG.wheatStaff[s.staffWheat.active ? s.staffWheat.level + 1 : 0].cost;
                checkHire(s.hireZoneWheat, cost, () => {
                    if (!s.staffWheat.active) { s.staffWheat.active = true; s.staffWheat.level = 0; }
                    else { s.staffWheat.level++; }
                    s.staffWheat.maxHold = s.staffWheat.level + 1;
                });
            }
            // Sales Staff 3 (Cheese)
            if (!s.salesStaffCheese.active) {
                checkHire(s.hireZoneSalesCheese, CONFIG.salesStaffCheese.cost, () => { s.salesStaffCheese.active = true; setAlertMsg("Cheese Sales Staff Hired!"); });
            }
        }

        // Zone 4 Hiring
        if (s.unlockedOrchard) {
            // Farm Staff 4 (Orchard)
            if (s.staffOrchard.level < 4) {
                const cost = CONFIG.orchardStaff[s.staffOrchard.active ? s.staffOrchard.level + 1 : 0].cost;
                checkHire(s.hireZoneOrchard, cost, () => {
                    if (!s.staffOrchard.active) { s.staffOrchard.active = true; s.staffOrchard.level = 0; }
                    else { s.staffOrchard.level++; }
                    s.staffOrchard.maxHold = s.staffOrchard.level + 1;
                });
            }
            // Sales Staff 4 (Juice)
            if (!s.salesStaffJuice.active) {
                checkHire(s.hireZoneSalesJuice, CONFIG.salesStaffJuice.cost, () => { s.salesStaffJuice.active = true; setAlertMsg("Juice Sales Staff Hired!"); });
            }
        }

        if (s.unlockedChocolate) {
            // Farm Staff 5 (Cocoa)
            if (s.staffCocoa.level < 4) {
                const cost = CONFIG.cocoaStaff[s.staffCocoa.active ? s.staffCocoa.level + 1 : 0].cost;
                checkHire(s.hireZoneCocoa, cost, () => {
                    if (!s.staffCocoa.active) { s.staffCocoa.active = true; s.staffCocoa.level = 0; }
                    else { s.staffCocoa.level++; }
                    s.staffCocoa.maxHold = s.staffCocoa.level + 1;
                });
            }
            // Sales Staff 5 (Chocolate)
            if (!s.salesStaffChocolate.active) {
                checkHire(s.hireZoneSalesChocolate, CONFIG.salesStaffChocolate.cost, () => { s.salesStaffChocolate.active = true; setAlertMsg("Chocolate Sales Staff Hired!"); });
            }
        }

        if (s.purchaseCooldown > 0) s.purchaseCooldown--;

        // --- FARMING ---
        s.patches.forEach(p => { if (p.state === 'GROWING') { p.timer--; if (p.timer <= 0) p.state = 'RIPE'; } });

        if (s.inventory.length < maxStack) {
            s.patches.forEach(p => {
                if (p.state === 'RIPE' && (p.type === 'CORN' || (p.type === 'TOMATO' && s.unlockedKetchup) || (p.type === 'WHEAT' && s.unlockedDairy) || (p.type === 'COCOA' && s.unlockedChocolate))) {
                    if (Math.hypot(s.player.x - p.x, s.player.y - p.y) < 30) {
                        p.state = 'GROWING';
                        p.timer = 300;
                        s.inventory.push(p.type);
                        if (sfxOn) playSfx('pop');
                    }
                }
            });
        }

        // --- COWS ---
        s.cows.forEach(c => {
            if (c.state === 'EATING') {
                c.timer--;
                if (c.timer <= 0) {
                    c.state = 'READY';
                    c.milk = 1;
                }
            }
        });

        // Player Interaction with Cows
        s.cows.forEach(c => {
            if (Math.hypot(s.player.x - c.x, s.player.y - c.y) < 40) {
                // Feed
                if (c.state === 'IDLE') {
                    const wheatIdx = s.inventory.indexOf('WHEAT');
                    if (wheatIdx > -1) {
                        s.inventory.splice(wheatIdx, 1);
                        c.state = 'EATING';
                        c.timer = 300; // 5 seconds
                        if (sfxOn) playSfx('pop');
                    }
                }
                // Milk
                else if (c.state === 'READY' && s.inventory.length < maxStack) {
                    c.state = 'IDLE';
                    c.milk = 0;
                    s.inventory.push('MILK');
                    if (sfxOn) playSfx('pop');
                }
            }
        });

        // --- TREES (SHAKE & COLLECT) ---
        if (s.unlockedOrchard) {
            s.trees.forEach(t => {
                if (t.state === 'GROWING') {
                    t.timer++;
                    if (t.timer > 600) { t.state = 'RIPE'; t.timer = 0; t.fruitCount = 3; }
                } else if (t.state === 'SHAKING') {
                    t.timer++;
                    if (t.timer > 30) {
                        t.state = 'GROWING';
                        t.timer = 0;
                        // Spawn Dropped Items
                        for (let i = 0; i < 3; i++) {
                            s.droppedItems.push({
                                id: Date.now() + Math.random(),
                                type: 'ORANGE',
                                x: t.x + (Math.random() * 60 - 30),
                                y: t.y + 40 + (Math.random() * 20),
                                timer: 1200 // 20 seconds life
                            });
                        }
                    }
                }
            });

            // Dropped Items Logic
            s.droppedItems.forEach(item => item.timer--);
            s.droppedItems = s.droppedItems.filter(item => item.timer > 0);

            // Player Collect Dropped Items
            if (s.inventory.length < maxStack) {
                for (let i = s.droppedItems.length - 1; i >= 0; i--) {
                    const item = s.droppedItems[i];
                    if (Math.hypot(s.player.x - item.x, s.player.y - item.y) < 30) {
                        s.inventory.push(item.type);
                        s.droppedItems.splice(i, 1);
                        if (sfxOn) playSfx('pop');
                        spawnText(s.player.x, s.player.y - 40, "+ORANGE");
                        if (s.inventory.length >= maxStack) break;
                    }
                }
            }

            // Player Shake Trees
            s.trees.forEach(t => {
                if (t.state === 'RIPE' && Math.hypot(s.player.x - (t.x + 30), s.player.y - (t.y + 40)) < 50) {
                    t.state = 'SHAKING';
                    t.timer = 0;
                }
            });
        }

        // --- MACHINES ---
        const handleMachine = (m: MachineState, inputType: ItemType, productType: ItemType, speed: number, xPos: number, yPos: number) => {
            // Feed Machine
            if (Math.hypot(s.player.x - m.x, s.player.y - m.y) < 40) {
                const items = s.inventory.filter(i => i === inputType).length;
                if (items > 0) {
                    const space = maxQueue - m.queue;
                    if (space > 0) {
                        const toAdd = Math.min(items, space);
                        // Remove 'toAdd' items of 'inputType' from inventory
                        let removed = 0;
                        s.inventory = s.inventory.filter(i => {
                            if (i === inputType && removed < toAdd) {
                                removed++;
                                return false;
                            }
                            return true;
                        });
                        m.queue += toAdd;
                        if (toAdd < items) {
                            if (s.alertCooldown <= 0) { setAlertMsg("Machine Full! Upgrade Queue."); s.alertCooldown = 120; }
                        }
                    } else {
                        if (s.alertCooldown <= 0) { setAlertMsg("Machine Full! Upgrade Queue."); s.alertCooldown = 120; }
                    }
                }
            }
            // Process
            if (!m.processing && m.queue > 0 && m.output.length < CONFIG.maxMachineOutput && !m.jammed) {
                m.processing = true; m.queue--; m.timer = speed;
            }
            // Process
            if (m.processing && !m.jammed) {
                m.timer--;
                if (m.timer <= 0) {
                    if (m.output.length < CONFIG.maxMachineOutput) {
                        m.processing = false;
                        m.output.push({ id: Date.now() + Math.random(), x: m.x - 30, y: m.y + 20 });

                        // Trash Generation (10% chance per product)
                        if (Math.random() < 0.1) {
                            m.trash++;
                            if (m.trash >= 5) {
                                m.jammed = true;
                                setAlertMsg("MACHINE JAMMED! Click on the machine to fix it.");
                            }
                        }

                        // Start next if queue > 0
                        if (m.queue > 0 && !m.jammed) {
                            m.queue--;
                            m.processing = true;
                            // Speed Bonus Logic
                            const bonus = getManagerBonus('PRODUCTION');
                            // New Speed = Base Speed / (1 + Bonus)
                            m.timer = Math.floor(speed / (1 + bonus));
                        }
                    } else {
                        // Output full! Wait until space clears.
                        m.timer = 0; // Keep timer at 0 so it tries again next tick
                    }
                }
            } else if (m.queue > 0 && !m.processing && !m.jammed) {
                m.queue--;
                m.processing = true;
                const bonus = getManagerBonus('PRODUCTION');
                m.timer = Math.floor(speed / (1 + bonus));
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
        if (s.unlockedDairy) handleMachine(s.machineCheese, 'MILK', 'CHEESE', cheeseSpeed, 970, 280);
        if (s.unlockedOrchard) handleMachine(s.machineJuice, 'ORANGE', 'JUICE', juiceSpeed, 1330, 280);
        if (s.unlockedChocolate) handleMachine(s.machineChocolate, 'COCOA', 'CHOCOLATE', chocolateSpeed, 1690, 280);

        // --- STAFF AI ---
        const updateStaff = (bot: StaffState, targetType: 'CORN' | 'TOMATO' | 'COCOA', machine: MachineState, queueProp: 'queue') => {
            if (!bot.active) return;

            // Universal Stamina Check
            if (bot.stamina <= 0 && bot.state !== 'TIRED' && bot.state !== 'DRINKING' && bot.state !== 'SLEEP') {
                bot.state = 'TIRED';
                return;
            }

            // STAMINA LOGIC
            if (bot.state === 'SLEEP') {
                bot.stamina += 0.1;
                if (bot.stamina >= 100) { bot.stamina = 100; bot.state = 'IDLE'; }
                return;
            }
            if (bot.state === 'TIRED') {
                const coffeeX = 350; const coffeeY = 200;
                const dist = Math.hypot(coffeeX - bot.x, coffeeY - bot.y);
                if (dist < 10) { bot.state = 'DRINKING'; bot.timer = 600; }
                else { bot.x += ((coffeeX - bot.x) / dist) * 1.5; bot.y += ((coffeeY - bot.y) / dist) * 1.5; }
                return;
            }
            if (bot.state === 'DRINKING') {
                bot.timer--;
                const regenRate = CONFIG.coffeeMachine[s.lvlCoffeeMachine]?.val || 0.5;
                bot.stamina += regenRate;
                if (bot.stamina >= 100 || bot.timer <= 0) { bot.stamina = 100; bot.state = 'IDLE'; }
                return;
            }
            if (bot.state !== 'IDLE') {
                bot.stamina -= 0.05;
                if (bot.stamina <= 0) { bot.stamina = 0; bot.state = 'TIRED'; return; }
            }

            const effectiveMaxHold = bot.maxHold + logBonus;
            const holdingCount = bot.holding.length;

            if (holdingCount < effectiveMaxHold) {
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
                    else { bot.x += ((tp.x - bot.x) / dist) * 1.5; bot.y += ((tp.y - bot.y) / dist) * 1.5; }
                }
            } else {
                // Go to machine
                const dist = Math.hypot(machine.x - bot.x, machine.y - bot.y);
                if (dist < 10) {
                    const space = maxQueue - machine[queueProp];
                    if (space > 0) {
                        const toAdd = Math.min(space, bot.holding.length);
                        machine[queueProp] += toAdd;
                        bot.holding.splice(0, toAdd);
                    }
                } else {
                    bot.x += ((machine.x - bot.x) / dist) * 1.5;
                    bot.y += ((machine.y - bot.y) / dist) * 1.5;
                }
            }
        };

        updateStaff(s.staffCorn, 'CORN', s.machineBakery, 'queue');
        if (s.unlockedKetchup) updateStaff(s.staffTomato, 'TOMATO', s.machineSauce, 'queue');
        if (s.unlockedChocolate) updateStaff(s.staffCocoa, 'COCOA', s.machineChocolate, 'queue');

        // Staff Wheat Logic (Complex)
        const updateStaffWheat = (bot: StaffState) => {
            if (!bot.active) return;

            // Universal Stamina Check
            if (bot.stamina <= 0 && bot.state !== 'TIRED' && bot.state !== 'DRINKING' && bot.state !== 'SLEEP') {
                bot.state = 'TIRED';
                return;
            }

            // STAMINA LOGIC
            if (bot.state === 'SLEEP') {
                bot.stamina += 0.1;
                if (bot.stamina >= 100) { bot.stamina = 100; bot.state = 'IDLE'; }
                return;
            }
            if (bot.state === 'TIRED') {
                const coffeeX = 350; const coffeeY = 200;
                const dist = Math.hypot(coffeeX - bot.x, coffeeY - bot.y);
                if (dist < 10) { bot.state = 'DRINKING'; bot.timer = 600; }
                else { bot.x += ((coffeeX - bot.x) / dist) * 1.5; bot.y += ((coffeeY - bot.y) / dist) * 1.5; }
                return;
            }
            if (bot.state === 'DRINKING') {
                bot.timer--;
                const regenRate = CONFIG.coffeeMachine[s.lvlCoffeeMachine]?.val || 0.5;
                bot.stamina += regenRate;
                if (bot.stamina >= 100 || bot.timer <= 0) { bot.stamina = 100; bot.state = 'IDLE'; }
                return;
            }
            if (bot.state !== 'IDLE') {
                bot.stamina -= 0.05;
                if (bot.stamina <= 0) { bot.stamina = 0; bot.state = 'TIRED'; return; }
            }

            const effectiveMaxHold = bot.maxHold + logBonus;
            const holdingMilk = bot.holding.filter((i: string) => i === 'MILK').length;
            const holdingWheat = bot.holding.filter((i: string) => i === 'WHEAT').length;
            const space = effectiveMaxHold - bot.holding.length;

            // 1. If holding Milk, go to Machine
            if (holdingMilk > 0) {
                const machine = s.machineCheese;
                const dist = Math.hypot(machine.x - bot.x, machine.y - bot.y);
                if (dist < 10) {
                    const space = maxQueue - machine.queue;
                    if (space > 0) {
                        const toAdd = Math.min(space, holdingMilk);
                        machine.queue += toAdd;
                        let removed = 0;
                        bot.holding = bot.holding.filter(i => {
                            if (i === 'MILK' && removed < toAdd) {
                                removed++;
                                return false;
                            }
                            return true;
                        });
                    }
                } else {
                    bot.x += ((machine.x - bot.x) / dist) * 1.5;
                    bot.y += ((machine.y - bot.y) / dist) * 1.5;
                }
                return;
            }

            // 2. If holding Wheat, look for Hungry Cows
            if (holdingWheat > 0) {
                let targetCow: Cow | null = null;
                let minDist = 9999;
                s.cows.forEach(c => {
                    if (c.state === 'IDLE') {
                        const d = Math.hypot(c.x - bot.x, c.y - bot.y);
                        if (d < minDist) { minDist = d; targetCow = c; }
                    }
                });
                if (targetCow) {
                    const tc = targetCow as Cow;
                    const dist = Math.hypot(tc.x - bot.x, tc.y - bot.y);
                    if (dist < 10) {
                        tc.state = 'EATING'; tc.timer = 300;
                        const idx = bot.holding.indexOf('WHEAT');
                        if (idx > -1) bot.holding.splice(idx, 1);
                    } else {
                        bot.x += ((tc.x - bot.x) / dist) * 1.5;
                        bot.y += ((tc.y - bot.y) / dist) * 1.5;
                    }
                    return;
                }
            }

            // 3. If has space, look for Ready Cows OR Ripe Wheat
            if (space > 0) {
                // Priority: Milk Ready Cows
                let targetCow: Cow | null = null;
                let minDistCow = 9999;
                s.cows.forEach(c => {
                    if (c.state === 'READY') {
                        const d = Math.hypot(c.x - bot.x, c.y - bot.y);
                        if (d < minDistCow) { minDistCow = d; targetCow = c; }
                    }
                });

                if (targetCow) {
                    const tc = targetCow as Cow;
                    const dist = Math.hypot(tc.x - bot.x, tc.y - bot.y);
                    if (dist < 10) {
                        tc.state = 'IDLE'; tc.milk = 0;
                        bot.holding.push('MILK');
                    } else {
                        bot.x += ((tc.x - bot.x) / dist) * 1.5;
                        bot.y += ((tc.y - bot.y) / dist) * 1.5;
                    }
                    return;
                }

                // Else Harvest Wheat
                let targetPatch: Patch | null = null;
                let minDistPatch = 9999;
                s.patches.forEach(p => {
                    if (p.state === 'RIPE' && p.type === 'WHEAT') {
                        const d = Math.hypot(p.x - bot.x, p.y - bot.y);
                        if (d < minDistPatch) { minDistPatch = d; targetPatch = p; }
                    }
                });

                if (targetPatch) {
                    const tp = targetPatch as Patch;
                    const dist = Math.hypot(tp.x - bot.x, tp.y - bot.y);
                    if (dist < 5) { tp.state = 'GROWING'; tp.timer = 300; bot.holding.push(tp.type); }
                    else { bot.x += ((tp.x - bot.x) / dist) * 1.5; bot.y += ((tp.y - bot.y) / dist) * 1.5; }
                }
            }
        };

        if (s.unlockedDairy) updateStaffWheat(s.staffWheat);

        // Staff Orchard Logic (Shake & Collect)
        const updateStaffOrchard = (bot: StaffState) => {
            if (!bot.active) return;

            // Universal Stamina Check
            if (bot.stamina <= 0 && bot.state !== 'TIRED' && bot.state !== 'DRINKING' && bot.state !== 'SLEEP') {
                bot.state = 'TIRED';
                return;
            }
            // ... (existing orchard logic) ...
            // STAMINA LOGIC
            if (bot.state === 'SLEEP') {
                bot.stamina += 0.1;
                if (bot.stamina >= 100) { bot.stamina = 100; bot.state = 'IDLE'; }
                return;
            }
            if (bot.state === 'TIRED') {
                const coffeeX = 350; const coffeeY = 200;
                const dist = Math.hypot(coffeeX - bot.x, coffeeY - bot.y);
                if (dist < 10) { bot.state = 'DRINKING'; bot.timer = 600; }
                else { bot.x += ((coffeeX - bot.x) / dist) * 1.5; bot.y += ((coffeeY - bot.y) / dist) * 1.5; }
                return;
            }
            if (bot.state === 'DRINKING') {
                bot.timer--;
                const regenRate = CONFIG.coffeeMachine[s.lvlCoffeeMachine]?.val || 0.5;
                bot.stamina += regenRate;
                if (bot.stamina >= 100 || bot.timer <= 0) { bot.stamina = 100; bot.state = 'IDLE'; }
                return;
            }
            if (bot.state !== 'IDLE') {
                bot.stamina -= 0.05;
                if (bot.stamina <= 0) { bot.stamina = 0; bot.state = 'TIRED'; return; }
            }

            const effectiveMaxHold = bot.maxHold + logBonus;
            const space = effectiveMaxHold - bot.holding.length;

            if (space > 0) {
                // Find Ripe Tree
                let targetTree: Tree | null = null;
                let minDist = 9999;
                s.trees.forEach(t => {
                    if (t.state === 'RIPE') {
                        const d = Math.hypot(t.x - bot.x, t.y - bot.y);
                        if (d < minDist) { minDist = d; targetTree = t; }
                    }
                });

                if (targetTree) {
                    const tt = targetTree as Tree;
                    const dist = Math.hypot(tt.x - bot.x, tt.y - bot.y);
                    if (dist < 5) {
                        tt.state = 'SHAKING'; tt.timer = 0;
                        // Staff waits for drop? No, just shakes.
                        // But to collect, needs to wait for drop.
                        // Simplified: Staff shakes, then instantly collects 3 oranges if space allows
                        // Actually, let's stick to the player logic: Shake -> Drop -> Collect
                        // For staff, maybe just Shake -> Instant Collect to save complexity?
                        // Let's make them Shake, then wait a bit, then collect.
                        // For now, simple: Shake.
                    } else {
                        bot.x += ((tt.x - bot.x) / dist) * 1.5;
                        bot.y += ((tt.y - bot.y) / dist) * 1.5;
                    }
                    return;
                }

                // Collect Dropped Items
                let targetItem: DroppedItem | null = null;
                let minItemDist = 9999;
                s.droppedItems.forEach(i => {
                    const d = Math.hypot(i.x - bot.x, i.y - bot.y);
                    if (d < minItemDist) { minItemDist = d; targetItem = i; }
                });

                if (targetItem) {
                    const ti = targetItem as DroppedItem;
                    const dist = Math.hypot(ti.x - bot.x, ti.y - bot.y);
                    if (dist < 10) {
                        bot.holding.push(ti.type);
                        s.droppedItems = s.droppedItems.filter(i => i.id !== ti.id);
                    } else {
                        bot.x += ((ti.x - bot.x) / dist) * 1.5;
                        bot.y += ((ti.y - bot.y) / dist) * 1.5;
                    }
                    return;
                }
            } else {
                // Go to Machine
                const machine = s.machineJuice;
                const dist = Math.hypot(machine.x - bot.x, machine.y - bot.y);
                if (dist < 10) {
                    const space = maxQueue - machine.queue;
                    if (space > 0) {
                        const toAdd = Math.min(space, bot.holding.length);
                        machine.queue += toAdd;
                        bot.holding.splice(0, toAdd);
                    }
                } else {
                    bot.x += ((machine.x - bot.x) / dist) * 1.5;
                    bot.y += ((machine.y - bot.y) / dist) * 1.5;
                }
            }
        };

        if (s.unlockedOrchard) updateStaffOrchard(s.staffOrchard);

        // Update Sales Staff (Stamina & Movement)
        const updateSalesStaff = (bot: SalesStaffState, homeX: number, homeY: number) => {
            if (!bot.active) return;

            // Universal Stamina Check
            if (bot.stamina <= 0 && bot.state !== 'TIRED' && bot.state !== 'DRINKING' && bot.state !== 'SLEEP') {
                bot.state = 'TIRED';
                return;
            }

            // Stamina Recovery
            if (bot.state === 'TIRED') {
                const coffeeX = 350; const coffeeY = 200;
                const dist = Math.hypot(coffeeX - bot.x, coffeeY - bot.y);
                if (dist < 10) {
                    bot.state = 'DRINKING';
                    bot.timer = 600;
                }
                else {
                    bot.x += ((coffeeX - bot.x) / dist) * 1.5;
                    bot.y += ((coffeeY - bot.y) / dist) * 1.5;
                }
                return;
            }
            if (bot.state === 'DRINKING') {
                bot.timer--;
                const regenRate = CONFIG.coffeeMachine[s.lvlCoffeeMachine]?.val || 0.5;
                bot.stamina += regenRate;
                if (bot.stamina >= 100 || bot.timer <= 0) {
                    bot.stamina = 100;
                    bot.state = 'IDLE';
                }
                return;
            }

            // Return to Post if IDLE
            if (bot.state === 'IDLE') {
                const dist = Math.hypot(homeX - bot.x, homeY - bot.y);
                if (dist > 5) {
                    bot.x += ((homeX - bot.x) / dist) * 1.5;
                    bot.y += ((homeY - bot.y) / dist) * 1.5;
                } else {
                    bot.x = homeX;
                    bot.y = homeY;
                }
            }
        };

        updateSalesStaff(s.salesStaffBread, 100, 460);
        if (s.unlockedKetchup) updateSalesStaff(s.salesStaffKetchup, 460, 460);
        if (s.unlockedDairy) updateSalesStaff(s.salesStaffCheese, 820, 460);
        if (s.unlockedOrchard) updateSalesStaff(s.salesStaffJuice, 1180, 460);
        if (s.unlockedChocolate) updateSalesStaff(s.salesStaffChocolate, 1540, 460);


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
        stockDesk(s.deskCheese, 'CHEESE', s.deskCheese.x, s.deskCheese.y);
        stockDesk(s.deskJuice, 'JUICE', s.deskJuice.x, s.deskJuice.y);
        stockDesk(s.deskChocolate, 'CHOCOLATE', s.deskChocolate.x, s.deskChocolate.y);

        // --- TRUCK LOGIC (ADVANCED) ---
        const BREAD_STOP_X = 100;
        const KETCHUP_STOP_X = 460;
        const CHEESE_STOP_X = 820;
        const JUICE_STOP_X = 1180;
        const CHOCOLATE_STOP_X = 1540;
        const EXIT_X = WORLD_WIDTH + 100;

        let manualSellAction = false;

        if (s.truck.state === 'IDLE') {
            // During Rush Hour, truck returns immediately (90% chance per tick)
            const spawnChance = s.rushHour.active ? 0.9 : 0.01;
            if (Math.random() < spawnChance) {
                s.truck.state = 'DRIVING';
                s.truck.x = -180;

                // Generate Order (RANDOMIZED)
                let wantsBread = Math.random() > 0.5;
                let wantsKetchup = s.unlockedKetchup && Math.random() > 0.5;
                let wantsCheese = s.unlockedDairy && Math.random() > 0.5;
                let wantsJuice = s.unlockedOrchard && Math.random() > 0.5;
                let wantsChocolate = s.unlockedChocolate && Math.random() > 0.5;

                if (!wantsBread && !wantsKetchup && !wantsCheese && !wantsJuice && !wantsChocolate) {
                    if (s.unlockedChocolate) wantsChocolate = true;
                    else if (s.unlockedOrchard) wantsJuice = true;
                    else if (s.unlockedDairy) wantsCheese = true;
                    else if (s.unlockedKetchup) wantsKetchup = true;
                    else wantsBread = true;
                }

                s.truck.orders = {
                    bread: wantsBread ? Math.floor(Math.random() * 4) + 1 : 0,
                    ketchup: wantsKetchup ? Math.floor(Math.random() * 3) + 1 : 0,
                    cheese: wantsCheese ? Math.floor(Math.random() * 2) + 1 : 0,
                    juice: wantsJuice ? Math.floor(Math.random() * 2) + 1 : 0,
                    chocolate: wantsChocolate ? Math.floor(Math.random() * 2) + 1 : 0
                };

                // Route Planning
                if (s.truck.orders.bread > 0) s.truck.targetX = BREAD_STOP_X;
                else if (s.truck.orders.ketchup > 0) s.truck.targetX = KETCHUP_STOP_X;
                else if (s.truck.orders.cheese > 0) s.truck.targetX = CHEESE_STOP_X;
                else if (s.truck.orders.juice > 0) s.truck.targetX = JUICE_STOP_X;
                else if (s.truck.orders.chocolate > 0) s.truck.targetX = CHOCOLATE_STOP_X;
                else s.truck.targetX = EXIT_X;

                // Truck Color & Golden Logic
                const colors = ['#d32f2f', '#388e3c', '#1976d2', '#f57c00', '#795548'];
                let newColor = colors[Math.floor(Math.random() * colors.length)];
                while (newColor === s.truck.color) {
                    newColor = colors[Math.floor(Math.random() * colors.length)];
                }
                s.truck.color = newColor;

                // Golden Truck Chance
                s.truck.isGolden = false;
                if (s.achievements.includes('golden_truck') && Math.random() < 0.1) {
                    s.truck.isGolden = true;
                }

                s.truck.phrase = getTruckPhrase(s.truck.orders.bread, s.truck.orders.ketchup, s.truck.orders.cheese, s.truck.orders.juice, s.truck.orders.chocolate);
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
                    // Base Wait 30s + Bonus (Rush Hour = 5s)
                    if (s.rushHour.active) s.truck.waitTimer = 300;
                    else s.truck.waitTimer = 60 * (30 + salesBonus);
                }
            } else {
                const speed = s.rushHour.active ? 12.5 : 2.5;
                if (Math.abs(dist) <= speed) {
                    s.truck.x = s.truck.targetX;
                } else {
                    s.truck.x += dist > 0 ? speed : -speed;
                }
            }
        }
        else if (s.truck.state === 'WAITING') {
            s.truck.waitTimer--;
            if (s.truck.waitTimer <= 0) {
                s.truck.state = 'DRIVING';
                s.truck.targetX = EXIT_X;
                s.truck.phrase = "Out of time!";
            }

            // Determine which desk we are at
            const atBread = Math.abs(s.truck.x - BREAD_STOP_X) < 10;
            const atKetchup = Math.abs(s.truck.x - KETCHUP_STOP_X) < 10;
            const atCheese = Math.abs(s.truck.x - CHEESE_STOP_X) < 10;
            const atJuice = Math.abs(s.truck.x - JUICE_STOP_X) < 10;
            const atChocolate = Math.abs(s.truck.x - CHOCOLATE_STOP_X) < 10;

            let sold = false;

            // Sell Logic (BULK SELL + DELAYED STAFF)
            const checkSale = (desk: any, type: 'bread' | 'ketchup' | 'cheese' | 'juice' | 'chocolate', price: number, salesStaff: SalesStaffState) => {
                const requiredAmount = s.truck.orders[type];
                if (requiredAmount > 0) {
                    const playerClose = Math.hypot(s.player.x - desk.x, s.player.y - desk.y) < 60;

                    // Manual Selling is Instant
                    if (playerClose && desk.stock >= requiredAmount) {
                        manualSellAction = true;
                        // Instant Sell for Player
                        desk.stock -= requiredAmount;
                        s.truck.orders[type] = 0;
                        const totalGain = requiredAmount * price * (s.truck.isGolden ? 2 : 1);
                        s.money += totalGain;
                        s.lifetime.totalMoney += totalGain;
                        if (type === 'bread') s.lifetime.totalBread += requiredAmount;
                        if (type === 'ketchup') s.lifetime.totalKetchup += requiredAmount;
                        if (type === 'cheese') s.lifetime.totalCheese += requiredAmount;
                        if (type === 'juice') s.lifetime.totalJuice += requiredAmount;
                        if (type === 'chocolate') s.lifetime.totalChocolate += requiredAmount;
                        if (type === 'chocolate') s.lifetime.totalChocolate += requiredAmount;
                        if (sfxOn) playSfx('coin');
                        spawnText(s.truck.x + 50, s.truck.y, `+$${totalGain}`);
                        s.truck.phrase = getTruckPhrase(s.truck.orders.bread, s.truck.orders.ketchup, s.truck.orders.cheese, s.truck.orders.juice, s.truck.orders.chocolate);
                        return true;
                    }

                    // Staff Selling (Delayed)
                    if (salesStaff.active && desk.stock >= requiredAmount && (salesStaff.state === 'IDLE' || salesStaff.state === 'SELLING')) {
                        if (salesStaff.state === 'IDLE') {
                            salesStaff.state = 'SELLING';
                            // Sales Bonus reduces sales delay
                            // Bonus is e.g. 15 (value).
                            // New Delay = Base Delay / (1 + Bonus/100)
                            salesStaff.timer = CONFIG.salesDelay;
                        } else if (salesStaff.state === 'SELLING') {
                            // Stamina Drain
                            salesStaff.stamina -= 0.05;
                            if (salesStaff.stamina <= 0) {
                                salesStaff.stamina = 0;
                                salesStaff.state = 'TIRED';
                                return false;
                            }

                            salesStaff.timer--;
                            if (salesStaff.timer <= 0) {
                                salesStaff.state = 'IDLE';
                                // Sell Execution
                                desk.stock -= requiredAmount;
                                s.truck.orders[type] = 0;
                                const totalGain = requiredAmount * price * (s.truck.isGolden ? 2 : 1);
                                s.money += totalGain;
                                s.lifetime.totalMoney += totalGain;
                                if (type === 'bread') s.lifetime.totalBread += requiredAmount;
                                if (type === 'ketchup') s.lifetime.totalKetchup += requiredAmount;
                                if (type === 'cheese') s.lifetime.totalCheese += requiredAmount;
                                if (type === 'juice') s.lifetime.totalJuice += requiredAmount;
                                if (type === 'chocolate') s.lifetime.totalChocolate += requiredAmount;
                                if (type === 'chocolate') s.lifetime.totalChocolate += requiredAmount;
                                if (sfxOn) playSfx('coin');
                                spawnText(s.truck.x + 50, s.truck.y, `+$${totalGain}`);
                                s.truck.phrase = getTruckPhrase(s.truck.orders.bread, s.truck.orders.ketchup, s.truck.orders.cheese, s.truck.orders.juice, s.truck.orders.chocolate);
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

            if (atBread) sold = checkSale(s.deskBread, 'bread', getPrice(CONFIG.prices.bread, 'BREAD'), s.salesStaffBread);
            if (atKetchup) sold = checkSale(s.deskKetchup, 'ketchup', getPrice(CONFIG.prices.ketchup, 'KETCHUP'), s.salesStaffKetchup);
            if (atCheese) sold = checkSale(s.deskCheese, 'cheese', getPrice(CONFIG.prices.cheese, 'CHEESE'), s.salesStaffCheese);
            if (atJuice) sold = checkSale(s.deskJuice, 'juice', getPrice(CONFIG.prices.juice, 'JUICE'), s.salesStaffJuice);
            if (atChocolate) sold = checkSale(s.deskChocolate, 'chocolate', getPrice(CONFIG.prices.chocolate, 'CHOCOLATE'), s.salesStaffChocolate);

            // Check if done with current station or all orders
            if (s.truck.orders.bread === 0 && s.truck.orders.ketchup === 0 && s.truck.orders.cheese === 0 && s.truck.orders.juice === 0 && s.truck.orders.chocolate === 0) {
                s.truck.targetX = EXIT_X;
                s.truck.state = 'DRIVING';
            } else {
                // Move to next stop
                if (atBread && s.truck.orders.bread === 0) {
                    if (s.truck.orders.ketchup > 0) s.truck.targetX = KETCHUP_STOP_X;
                    else if (s.truck.orders.cheese > 0) s.truck.targetX = CHEESE_STOP_X;
                    else if (s.truck.orders.juice > 0) s.truck.targetX = JUICE_STOP_X;
                    else if (s.truck.orders.chocolate > 0) s.truck.targetX = CHOCOLATE_STOP_X;
                    else s.truck.targetX = EXIT_X;
                    s.truck.state = 'DRIVING';
                } else if (atKetchup && s.truck.orders.ketchup === 0) {
                    if (s.truck.orders.cheese > 0) s.truck.targetX = CHEESE_STOP_X;
                    else if (s.truck.orders.juice > 0) s.truck.targetX = JUICE_STOP_X;
                    else if (s.truck.orders.chocolate > 0) s.truck.targetX = CHOCOLATE_STOP_X;
                    else s.truck.targetX = EXIT_X;
                    s.truck.state = 'DRIVING';
                } else if (atCheese && s.truck.orders.cheese === 0) {
                    if (s.truck.orders.juice > 0) s.truck.targetX = JUICE_STOP_X;
                    else if (s.truck.orders.chocolate > 0) s.truck.targetX = CHOCOLATE_STOP_X;
                    else s.truck.targetX = EXIT_X;
                    s.truck.state = 'DRIVING';
                } else if (atJuice && s.truck.orders.juice === 0) {
                    if (s.truck.orders.chocolate > 0) s.truck.targetX = CHOCOLATE_STOP_X;
                    else s.truck.targetX = EXIT_X;
                    s.truck.state = 'DRIVING';
                } else if (atChocolate && s.truck.orders.chocolate === 0) {
                    s.truck.targetX = EXIT_X;
                    s.truck.state = 'DRIVING';
                }
            }
        }

        setIsSellingManually(manualSellAction && !s.salesStaffBread.active && !s.salesStaffKetchup.active && !s.salesStaffCheese.active && !s.salesStaffJuice.active && !s.salesStaffChocolate.active);

        // --- PARTICLES & UTILS ---
        s.floatingTexts.forEach(t => { t.y -= 1; t.life -= 1; });
        s.floatingTexts = s.floatingTexts.filter(t => t.life > 0);
        s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; });
        s.particles = s.particles.filter(p => p.life > 0);

        s.rentTimer--;
        if (s.rentTimer <= 0) {
            let rent = 100;
            if (s.unlockedKetchup) rent += 250;
            if (s.unlockedDairy) rent += 500;
            if (s.unlockedOrchard) rent += 1000;
            if (s.unlockedChocolate) rent += 2000;

            s.money -= rent;
            s.rentTimer = 36000; // 10 minutes
            setAlertMsg(`RENT PAID: -$${rent}`);
            if (sfxOn) playSfx('pop');
        }

        s.saveTimer++;
        if (s.saveTimer > 300) { s.saveTimer = 0; saveGame(AUTOSAVE_KEY); }
        if (s.alertCooldown > 0) s.alertCooldown--;

        // TRASH CAN CHECK
        if (s.trashCooldown > 0) s.trashCooldown--;
        if (s.trashCooldown <= 0 && Math.hypot(s.player.x - s.trashZone.x, s.player.y - s.trashZone.y) < 40 && s.inventory.length > 0) {
            setShowTrashConfirm(true);
        }

        // ACHIEVEMENTS CHECK
        // ACHIEVEMENTS CHECK
        CONFIG.ACHIEVEMENTS.forEach(ach => {
            if (!s.achievements.includes(ach.id) && ach.condition(s)) {
                s.achievements.push(ach.id);
                claimReward(ach.reward);
                setToast({ title: "ACHIEVEMENT UNLOCKED!", desc: ach.name });
                if (sfxOn) playSfx('upgrade');
                setTimeout(() => setToast(null), 4000);
            }
        });

        // MARKET UPDATE
        updateMarket();

        setUiTick(t => t + 1);
        animRef.current = requestAnimationFrame(update);
    }, [gameState, showUpgradeMenu, showSettings, alertMsg, showTrashConfirm]);

    useEffect(() => {
        if (gameState === 'PLAYING') {
            if (musicOn || sfxOn) initAudio(); // RESUME AUDIO if sound is on
            animRef.current = requestAnimationFrame(update);
            return () => cleanupGame();
        }
    }, [gameState, update, musicOn, sfxOn]); // Re-run if sound settings change

    const claimReward = (reward: string) => {
        const s = gs.current;
        if (reward.includes("Gems")) {
            const amount = parseInt(reward.split(" ")[0].replace(/,/g, ''));
            if (!isNaN(amount)) s.gems += amount;
        } else if (reward === "Night Mode") {
            if (!s.unlockedThemes.includes('NIGHT')) s.unlockedThemes.push('NIGHT');
        } else if (reward === "Snow Theme") {
            if (!s.unlockedThemes.includes('SNOW')) s.unlockedThemes.push('SNOW');
        } else if (reward === "Mars Theme") {
            if (!s.unlockedThemes.includes('MARS')) s.unlockedThemes.push('MARS');
        }
    };

    const openBriefcase = () => {
        const s = gs.current;
        if (s.gems >= GACHA_COST) {
            s.gems -= GACHA_COST;
            const random = Math.random();
            let rarity: 'COMMON' | 'RARE' | 'LEGENDARY' = 'COMMON';
            if (random > 0.9) rarity = 'LEGENDARY';
            else if (random > 0.6) rarity = 'RARE';

            const pool = MANAGERS.filter(m => m.rarity === rarity);
            const card = pool[Math.floor(Math.random() * pool.length)];

            if (s.managers[card.id]) {
                s.managers[card.id]++;
                setAlertMsg(`DUPLICATE! ${card.name} Level Up!`);
            } else {
                s.managers[card.id] = 1;
                setAlertMsg(`NEW MANAGER! ${card.name}`);
            }
            if (sfxOn) playSfx('upgrade');
        } else {
            setAlertMsg("Not enough Gems!");
        }
    };

    // --- MARKET LOGIC ---
    const updateMarket = () => {
        const s = gs.current;
        if (s.marketTrend.timer > 0) {
            s.marketTrend.timer--;
            if (s.marketTrend.timer <= 0) {
                s.marketTrend = { type: 'NORMAL', resource: null, multiplier: 1, timer: 0, news: null };
            }
        } else {
            // Random Event Chance (approx every minute: 1/3600 per tick? No, update is 60fps. 1 min = 3600 frames)
            // Let's make it more frequent for testing: 1/1200 (20 secs)
            if (Math.random() < 0.0005) {
                const resources: ItemType[] = ['BREAD', 'KETCHUP', 'CHEESE', 'JUICE', 'CHOCOLATE'];
                // Filter unlocked resources
                const available = resources.filter(r => {
                    if (r === 'BREAD') return true;
                    if (r === 'KETCHUP') return s.unlockedKetchup;
                    if (r === 'CHEESE') return s.unlockedDairy;
                    if (r === 'JUICE') return s.unlockedOrchard;
                    if (r === 'CHOCOLATE') return s.unlockedChocolate;
                    return false;
                });

                if (available.length > 0) {
                    const res = available[Math.floor(Math.random() * available.length)];
                    const isSurge = Math.random() > 0.5;
                    const type = isSurge ? 'SURGE' : 'CRASH';
                    const multiplier = isSurge ? 2.0 : 0.5;
                    const duration = 1800; // 30 seconds

                    s.marketTrend = {
                        type,
                        resource: res,
                        multiplier,
                        timer: duration,
                        news: isSurge ? `MARKET SURGE! ${res} prices DOUBLED!` : `MARKET CRASH! ${res} prices HALVED!`
                    };
                    if (sfxOn) playSfx(isSurge ? 'upgrade' : 'pop'); // Use existing sfx for now
                }
            }
        }


        // RUSH HOUR LOGIC
        if (s.rushHour.active) {
            s.rushHour.timer--;
            if (s.rushHour.timer <= 0) {
                s.rushHour.active = false;
                setAlertMsg("Rush Hour Ended!");
            }
        } else {
            // 0.02% chance per tick (~once per 80s)
            if (Math.random() < 0.0002) {
                s.rushHour.active = true;

                // Dynamic Duration Calculation
                let duration = 900; // Base 15s
                if (s.achievements.includes('sales_guru')) duration += 300; // +5s
                if (s.achievements.includes('golden_truck')) duration += 300; // +5s
                if (s.achievements.includes('tycoon')) duration += 300; // +5s

                s.rushHour.timer = duration;
                setAlertMsg("FESTIVE RUSH HOUR! Trucks are speeding up!");
                if (sfxOn) playSfx('upgrade');
            }
        }
    };

    const getPrice = (basePrice: number, item: ItemType) => {
        const s = gs.current;
        if (s.marketTrend.resource === item) {
            return Math.floor(basePrice * s.marketTrend.multiplier);
        }
        return basePrice;
    };

    const equipManager = (id: string, type: ManagerType) => {
        const s = gs.current;
        const slot = type.toLowerCase() as 'production' | 'logistics' | 'sales';
        if (type === 'PRODUCTION') s.activeManagers.production = id;
        if (type === 'LOGISTICS') s.activeManagers.logistics = id;
        if (type === 'SALES') s.activeManagers.sales = id;
        if (sfxOn) playSfx('pop');
    };  // Force update to reflect changes immediately in UI if needed, though loop handles it

    const buyUpgrade = (type: 'stack' | 'speed' | 'machineBread' | 'machineSauce' | 'machineCheese' | 'machineJuice' | 'machineChocolate' | 'machineQueue' | 'coffeeMachine') => {
        const s = gs.current;
        let cost = 0; let success = false;
        if (type === 'stack' && s.lvlStack < 4) { cost = CONFIG.stack[s.lvlStack + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlStack++; success = true; } }
        else if (type === 'speed' && s.lvlSpeed < 3) { cost = CONFIG.speed[s.lvlSpeed + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlSpeed++; success = true; } }
        else if (type === 'machineBread' && s.lvlMachineBread < 2) { cost = CONFIG.machineBakery[s.lvlMachineBread + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineBread++; success = true; } }
        else if (type === 'machineSauce' && s.lvlMachineSauce < 2) { cost = CONFIG.machineSauce[s.lvlMachineSauce + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineSauce++; success = true; } }
        else if (type === 'machineCheese' && s.lvlMachineCheese < 2) { cost = CONFIG.machineCheese[s.lvlMachineCheese + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineCheese++; success = true; } }
        else if (type === 'machineJuice' && s.lvlMachineJuice < 2) { cost = CONFIG.machineJuice[s.lvlMachineJuice + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineJuice++; success = true; } }
        else if (type === 'machineChocolate' && s.lvlMachineChocolate < 2) { cost = CONFIG.machineChocolate[s.lvlMachineChocolate + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineChocolate++; success = true; } }
        else if (type === 'machineQueue' && s.lvlMachineQueue < 6) { cost = CONFIG.machineQueue[s.lvlMachineQueue + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlMachineQueue++; success = true; } }
        else if (type === 'coffeeMachine' && s.lvlCoffeeMachine < 2) { cost = CONFIG.coffeeMachine[s.lvlCoffeeMachine + 1].cost; if (s.money >= cost) { s.money -= cost; s.lvlCoffeeMachine++; success = true; } }

        if (success) { spawnConfetti(180, 320); setAlertMsg("Upgrade Successful!"); s.purchaseCooldown = 60; }
    };

    const farmCost1 = CONFIG.farmStaff[gs.current.staffCorn.active ? gs.current.staffCorn.level + 1 : 0]?.cost || 0;
    const farmCost2 = CONFIG.tomatoStaff[gs.current.staffTomato.active ? gs.current.staffTomato.level + 1 : 0]?.cost || 0;

    const getManagerBonus = (type: ManagerType) => {
        const s = gs.current;
        const id = s.activeManagers[type.toLowerCase() as 'production' | 'logistics' | 'sales'];
        if (!id) return 0;
        const card = MANAGERS.find(m => m.id === id);
        if (!card) return 0;
        const level = s.managers[id] || 0;
        // Base Value + (Level * 10% of Base)
        return card.effectValue * (1 + (level - 1) * 0.1);
    };

    // --- MENU BACKGROUND PARTICLES ---
    const MenuBackground = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i}
                    className="absolute animate-[fall_3s_infinite_linear]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '-20px',
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: 0.5
                    }}>
                    <div className="text-green-500 font-bold text-xl">$</div>
                </div>
            ))}
            <style>{`@keyframes fall { from { transform: translateY(-20px) rotate(0deg); } to { transform: translateY(110vh) rotate(360deg); } }`}</style>
        </div>
    );

    if (gameState === 'START') {
        const s = gs.current;


        return (
            <div className="w-full h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-700 via-purple-900 to-black flex flex-col items-center justify-center text-white gap-6 relative overflow-hidden">
                <MenuBackground />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-6 right-6 flex gap-2 z-50">
                    <button onClick={() => { setShowSettings(true); setSettingsTab('ABOUT'); }} className="w-10 h-10 bg-slate-700/50 rounded-full border border-slate-400 flex items-center justify-center hover:bg-slate-600 transition-colors font-bold text-xl">?</button>
                    <button onClick={() => { setShowSettings(true); setSettingsTab('OPTIONS'); }} className="w-10 h-10 bg-slate-700/50 rounded-full border border-slate-400 flex items-center justify-center hover:bg-slate-600 transition-colors text-xl">⚙️</button>
                </div>

                {/* PULSING GLOW TITLE */}
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-lg tracking-widest text-center z-10 animate-[pulse-glow_2s_infinite]">TOWNSHIP<br />TYCOON</h1>
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
                        <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 text-center flex flex-col max-h-[80vh]">
                            {settingsTab === 'ABOUT' ? (
                                <div className="flex flex-col h-full">
                                    <h2 className="font-black text-2xl text-slate-800 mb-4">ABOUT</h2>
                                    {!aboutSubTab ? (
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => setAboutSubTab('BASICS')} className="w-full py-3 bg-blue-100 text-blue-800 rounded-xl font-bold border-2 border-blue-200 hover:bg-blue-200">BASICS 🎮</button>
                                            <button onClick={() => setAboutSubTab('STAFF')} className="w-full py-3 bg-green-100 text-green-800 rounded-xl font-bold border-2 border-green-200 hover:bg-green-200">STAFF 👷</button>
                                            <button onClick={() => setAboutSubTab('MACHINES')} className="w-full py-3 bg-orange-100 text-orange-800 rounded-xl font-bold border-2 border-orange-200 hover:bg-orange-200">MACHINES ⚙️</button>
                                            <button onClick={() => setAboutSubTab('UPGRADES')} className="w-full py-3 bg-purple-100 text-purple-800 rounded-xl font-bold border-2 border-purple-200 hover:bg-purple-200">UPGRADES 🚀</button>
                                            <button onClick={() => setAboutSubTab('CREDITS')} className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl font-bold border-2 border-slate-200 hover:bg-slate-200">CREDITS ❤️</button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full min-h-0">
                                            <button onClick={() => setAboutSubTab(null)} className="mb-2 text-left font-bold text-slate-500 hover:text-slate-800">⬅ BACK</button>
                                            <div className="flex-1 overflow-y-auto text-left text-sm text-slate-600 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                {aboutSubTab === 'BASICS' && (
                                                    <>
                                                        <h3 className="font-black text-slate-800 mb-2">HOW TO PLAY</h3>
                                                        <p className="mb-2"><strong>Move:</strong> Use Joystick or Arrow Keys.</p>
                                                        <p className="mb-2"><strong>Harvest:</strong> Walk near ripe crops to collect them.</p>
                                                        <p className="mb-2"><strong>Sell:</strong> Walk to the Truck to sell products.</p>
                                                        <p><strong>Goal:</strong> Earn money, unlock zones, and build a tycoon empire!</p>
                                                    </>
                                                )}
                                                {aboutSubTab === 'STAFF' && (
                                                    <>
                                                        <h3 className="font-black text-slate-800 mb-2">STAFF MANAGEMENT</h3>
                                                        <p className="mb-2"><strong>Hiring:</strong> Hire staff to automate harvesting and selling.</p>
                                                        <p className="mb-2"><strong>Stamina:</strong> Staff get tired! If they sleep (Zzz), click them to wake up.</p>
                                                        <p><strong>Managers:</strong> Equip managers for global bonuses like speed and capacity.</p>
                                                    </>
                                                )}
                                                {aboutSubTab === 'MACHINES' && (
                                                    <>
                                                        <h3 className="font-black text-slate-800 mb-2">MACHINES</h3>
                                                        <p className="mb-2"><strong>Processing:</strong> Machines turn raw crops into valuable products.</p>
                                                        <p className="mb-2"><strong>Queues:</strong> Upgrade machine queues to stack more items.</p>
                                                        <p><strong>Automation:</strong> Staff will automatically feed machines and collect products.</p>
                                                    </>
                                                )}
                                                {aboutSubTab === 'UPGRADES' && (
                                                    <>
                                                        <h3 className="font-black text-slate-800 mb-2">UPGRADES</h3>
                                                        <p className="mb-2"><strong>Stack:</strong> Carry more items at once.</p>
                                                        <p className="mb-2"><strong>Speed:</strong> Move faster.</p>
                                                        <p><strong>Coffee Machine:</strong> Helps staff recover stamina faster.</p>
                                                    </>
                                                )}
                                                {aboutSubTab === 'CREDITS' && (
                                                    <>
                                                        <h3 className="font-black text-slate-800 mb-2">CREDITS</h3>
                                                        <p className="mb-2"><strong>Developed for Superteam x Scrolly Game Jam</strong></p>
                                                        <p><strong>Tools:</strong> React + Tailwind</p>
                                                        <p>Thanks for playing!</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <button onClick={() => setShowSettings(false)} className="w-full py-3 mt-4 bg-slate-800 text-white rounded-xl font-bold border-b-4 border-slate-950 active:scale-95 shrink-0">CLOSE</button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-black text-2xl text-slate-800 mb-4">SETTINGS</h2>
                                    <button onClick={toggleSfx} className={`w-full py-3 mb-4 rounded-xl font-bold border-2 ${sfxOn ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>SFX: {sfxOn ? "ON 🔊" : "OFF 🔇"}</button>
                                    <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">CLOSE</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const s = gs.current;
    const canAffordAny = ((s.lvlStack < 4 && s.money >= CONFIG.stack[s.lvlStack + 1].cost) ||
        (s.lvlSpeed < 3 && s.money >= CONFIG.speed[s.lvlSpeed + 1].cost) ||
        (s.lvlMachineBread < 2 && s.money >= CONFIG.machineBakery[s.lvlMachineBread + 1].cost) ||
        (s.lvlMachineQueue < 6 && s.money >= CONFIG.machineQueue[s.lvlMachineQueue + 1].cost) ||
        (s.unlockedOrchard && s.lvlMachineJuice < 2 && s.money >= CONFIG.machineJuice[s.lvlMachineJuice + 1].cost) ||
        (s.unlockedChocolate && s.lvlMachineChocolate < 2 && s.money >= CONFIG.machineChocolate[s.lvlMachineChocolate + 1].cost));

    const activeTheme = THEMES[s.activeTheme as keyof typeof THEMES] || THEMES.DEFAULT;

    return (
        <div className={`flex items-center justify-center w-full h-screen overflow-hidden relative ${activeTheme.bg}`}>
            <div ref={containerRef} className={`relative w-[360px] h-[640px] overflow-hidden rounded-3xl shadow-2xl border-8 border-slate-800 select-none cursor-pointer ${activeTheme.ground}`}
                onMouseDown={(e) => { if (!showUpgradeMenu && !showSettings && !alertMsg && !showTrashConfirm) { gs.current.joystick = { active: true, originX: e.clientX, originY: e.clientY, dx: 0, dy: 0 }; } }}
                onMouseMove={(e) => { if (gs.current.joystick.active) { gs.current.joystick.dx = e.clientX - gs.current.joystick.originX; gs.current.joystick.dy = e.clientY - gs.current.joystick.originY; } }}
                onMouseUp={() => { gs.current.joystick.active = false; }}
                onTouchStart={(e) => { if (!showUpgradeMenu && !showSettings && !alertMsg && !showTrashConfirm) { gs.current.joystick = { active: true, originX: e.touches[0].clientX, originY: e.touches[0].clientY, dx: 0, dy: 0 }; } }}
                onTouchMove={(e) => { if (gs.current.joystick.active) { gs.current.joystick.dx = e.touches[0].clientX - gs.current.joystick.originX; gs.current.joystick.dy = e.touches[0].clientY - gs.current.joystick.originY; } }}
                onTouchEnd={() => { gs.current.joystick.active = false; }}
            >
                {/* WORLD CONTAINER - MOVES FOR CAMERA */}
                <div style={{ transform: `translateX(${-s.camera.x}px)`, width: `${WORLD_WIDTH}px`, height: '100%', position: 'absolute', transition: 'transform 0.1s linear' }}>
                    <div className="absolute inset-0 z-0"><SvgFloor width={WORLD_WIDTH} theme={s.activeTheme} /></div>

                    {/* ATMOSPHERIC EFFECTS */}
                    {s.activeTheme === 'SNOW' && (
                        <div className="absolute inset-0 z-[600] pointer-events-none overflow-hidden">
                            {[...Array(50)].map((_, i) => (
                                <div key={i} className="absolute bg-white rounded-full opacity-80 animate-[fall_5s_linear_infinite]"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `-${Math.random() * 20}%`,
                                        width: Math.random() * 4 + 2 + 'px',
                                        height: Math.random() * 4 + 2 + 'px',
                                        animationDelay: `-${Math.random() * 5}s`,
                                        animationDuration: `${Math.random() * 3 + 2}s`
                                    }} />
                            ))}
                            <style>{`@keyframes fall { to { transform: translateY(800px); } }`}</style>
                        </div>
                    )}
                    {s.activeTheme === 'MARS' && (
                        <div className="absolute inset-0 z-[0] pointer-events-none">
                            {[...Array(100)].map((_, i) => (
                                <div key={i} className="absolute bg-white rounded-full opacity-50"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 45}%`, // Only in sky area
                                        width: Math.random() * 2 + 'px',
                                        height: Math.random() * 2 + 'px',
                                    }} />
                            ))}
                        </div>
                    )}

                    {/* LOCKED AREA FOG (Cleaned Up) */}
                    {/* LOCKED AREA FOG */}
                    {/* LOCKED ZONE OVERLAYS */}
                    {!s.unlockedKetchup && (
                        <div className="absolute w-[720px] h-full bg-black/50 flex flex-col items-center justify-center" style={{ left: 360, top: 0, zIndex: 500 }}>
                            <div className="text-4xl mb-2">🔒</div>
                            <div className="text-white font-black text-xl drop-shadow-md">LOCKED</div>
                            <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded mt-1">Need ${CONFIG.unlocks.ketchupZone}</div>
                        </div>
                    )}
                    {s.unlockedKetchup && !s.unlockedDairy && (
                        <div className="absolute w-[360px] h-full bg-black/50 flex flex-col items-center justify-center" style={{ left: 720, top: 0, zIndex: 500 }}>
                            <div className="text-4xl mb-2">🔒</div>
                            <div className="text-white font-black text-xl drop-shadow-md">LOCKED</div>
                            <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded mt-1">Need ${CONFIG.unlocks.dairyZone}</div>
                        </div>
                    )}
                    {s.unlockedDairy && !s.unlockedOrchard && (
                        <div className="absolute w-[360px] h-full bg-black/50 flex flex-col items-center justify-center" style={{ left: 1080, top: 0, zIndex: 500 }}>
                            <div className="text-4xl mb-2">🔒</div>
                            <div className="text-white font-black text-xl drop-shadow-md">LOCKED</div>
                            <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded mt-1">Need ${CONFIG.unlocks.orchardZone}</div>
                        </div>
                    )}
                    {s.unlockedOrchard && !s.unlockedChocolate && (
                        <div className="absolute w-[360px] h-full bg-black/50 flex flex-col items-center justify-center" style={{ left: 1440, top: 0, zIndex: 500 }}>
                            <div className="text-4xl mb-2">🔒</div>
                            <div className="text-white font-black text-xl drop-shadow-md">LOCKED</div>
                            <div className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded mt-1">Need ${CONFIG.unlocks.chocolateZone}</div>
                        </div>
                    )}

                    {/* --- ENTITIES --- */}

                    {/* PATCHES (LAYER 1 - BOTTOM) */}
                    {s.patches.map(p => (p.type === 'CORN' || (p.type === 'TOMATO' && s.unlockedKetchup) || (p.type === 'WHEAT' && s.unlockedDairy) || (p.type === 'COCOA' && s.unlockedChocolate)) && <div key={p.id} className="absolute w-[40px] h-[60px]" style={{ left: p.x, top: p.y, zIndex: 1 }}><SvgPlant type={p.type} state={p.state} /></div>)}

                    {s.unlockedOrchard && s.trees.map(t => (
                        <div key={t.id} className="absolute w-[80px] h-[100px]" style={{ left: t.x, top: t.y, zIndex: Math.floor(t.y) }}>
                            <SvgTree state={t.state} fruitCount={t.fruitCount} />
                        </div>
                    ))}

                    {/* DROPPED ITEMS */}
                    {s.droppedItems.map(i => (
                        <div key={i.id} className="absolute w-6 h-6 animate-bounce" style={{ left: i.x, top: i.y, zIndex: Math.floor(i.y) }}>
                            <SvgItem type={i.type} />
                        </div>
                    ))}

                    {/* COWS */}
                    {s.unlockedDairy && s.cows.map(c => (
                        <div key={c.id} className="absolute w-[60px] h-[40px]" style={{ left: c.x, top: c.y, zIndex: Math.floor(c.y) }}>
                            <SvgCow state={c.state} />
                            {c.state === 'READY' && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 rounded-full border border-blue-200 shadow animate-bounce">🥛</div>}
                        </div>
                    ))}

                    {/* TRUCK (Sorted by Y) */}
                    <div className="absolute w-[160px] h-[70px] transition-transform duration-300" style={{ left: s.truck.x, top: s.truck.y, zIndex: Math.floor(s.truck.y), transform: s.truck.state === 'DRIVING' && s.truck.targetX < s.truck.x ? 'scaleX(-1)' : 'scaleX(1)' }}>
                        <SvgTruck color={s.truck.color} isGolden={s.truck.isGolden} />
                        {s.truck.state !== 'IDLE' && <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-xl border-2 border-slate-300 shadow-xl z-50 animate-bounce" style={{ transform: s.truck.state === 'DRIVING' && s.truck.targetX < s.truck.x ? 'scaleX(-1)' : 'scaleX(1)' }}><p className="font-bold text-sm whitespace-nowrap text-slate-800">{s.truck.phrase}</p><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-300 transform rotate-45"></div></div>}
                        {s.truck.state === 'WAITING' && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2 rounded-full">{Math.ceil(s.truck.waitTimer / 60)}s</div>}
                    </div>

                    {/* BAKERY (Sorted by Y) */}
                    <div className="absolute w-[100px] h-[80px] cursor-pointer active:scale-95" style={{ left: s.machineBakery.x, top: s.machineBakery.y, zIndex: Math.floor(s.machineBakery.y) }} onClick={() => cleanMachine(s.machineBakery)}>
                        <SvgMachine type="BAKERY" working={s.machineBakery.processing} jammed={s.machineBakery.jammed} />
                        <div className={`absolute -top-4 right-0 text-white text-[10px] px-1 rounded ${s.machineBakery.queue >= CONFIG.machineQueue[s.lvlMachineQueue].val ? 'bg-red-600 animate-pulse' : 'bg-blue-500'}`}>Q: {s.machineBakery.queue}/{CONFIG.machineQueue[s.lvlMachineQueue].val}</div>
                    </div>
                    {s.machineBakery.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-8 h-6 animate-bounce relative"><SvgItem type="BREAD" /></div></div>)}

                    {/* SAUCE MACHINE (Sorted by Y) */}
                    {s.unlockedKetchup && (
                        <>
                            <div className="absolute w-[100px] h-[80px] cursor-pointer active:scale-95" style={{ left: s.machineSauce.x, top: s.machineSauce.y, zIndex: Math.floor(s.machineSauce.y) }} onClick={() => cleanMachine(s.machineSauce)}>
                                <SvgMachine type="SAUCE" working={s.machineSauce.processing} jammed={s.machineSauce.jammed} />
                                <div className={`absolute -top-4 right-0 text-white text-[10px] px-1 rounded ${s.machineSauce.queue >= CONFIG.machineQueue[s.lvlMachineQueue].val ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}>Q: {s.machineSauce.queue}/{CONFIG.machineQueue[s.lvlMachineQueue].val}</div>
                            </div>
                            {s.machineSauce.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-4 h-8 animate-bounce relative"><SvgItem type="KETCHUP" /></div></div>)}
                        </>
                    )}

                    {/* CHEESE MACHINE (Sorted by Y) */}
                    {s.unlockedDairy && (
                        <>
                            <div className="absolute w-[100px] h-[80px] cursor-pointer active:scale-95" style={{ left: s.machineCheese.x, top: s.machineCheese.y, zIndex: Math.floor(s.machineCheese.y) }} onClick={() => cleanMachine(s.machineCheese)}>
                                <SvgMachine type="CHEESE" working={s.machineCheese.processing} jammed={s.machineCheese.jammed} />
                                <div className={`absolute -top-4 right-0 text-white text-[10px] px-1 rounded ${s.machineCheese.queue >= CONFIG.machineQueue[s.lvlMachineQueue].val ? 'bg-red-600 animate-pulse' : 'bg-yellow-500'}`}>Q: {s.machineCheese.queue}/{CONFIG.machineQueue[s.lvlMachineQueue].val}</div>
                            </div>
                            {s.machineCheese.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-8 h-6 animate-bounce relative"><SvgItem type="CHEESE" /></div></div>)}
                        </>
                    )}

                    {/* JUICE MACHINE (Sorted by Y) */}
                    {s.unlockedOrchard && (
                        <>
                            <div className="absolute w-[100px] h-[80px] cursor-pointer active:scale-95" style={{ left: s.machineJuice.x, top: s.machineJuice.y, zIndex: Math.floor(s.machineJuice.y) }} onClick={() => cleanMachine(s.machineJuice)}>
                                <SvgMachine type="JUICE" working={s.machineJuice.processing} jammed={s.machineJuice.jammed} />
                                <div className={`absolute -top-4 right-0 text-white text-[10px] px-1 rounded ${s.machineJuice.queue >= CONFIG.machineQueue[s.lvlMachineQueue].val ? 'bg-red-600 animate-pulse' : 'bg-orange-500'}`}>Q: {s.machineJuice.queue}/{CONFIG.machineQueue[s.lvlMachineQueue].val}</div>
                            </div>
                            {s.machineJuice.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-6 h-8 animate-bounce relative"><SvgItem type="JUICE" /></div></div>)}
                        </>
                    )}

                    {/* CHOCOLATE MACHINE (Sorted by Y) */}
                    {s.unlockedChocolate && (
                        <>
                            <div className="absolute w-[100px] h-[80px] cursor-pointer active:scale-95" style={{ left: s.machineChocolate.x, top: s.machineChocolate.y, zIndex: Math.floor(s.machineChocolate.y) }} onClick={() => cleanMachine(s.machineChocolate)}>
                                <SvgMachine type="CHOCOLATE" working={s.machineChocolate.processing} jammed={s.machineChocolate.jammed} />
                                <div className={`absolute -top-4 right-0 text-white text-[10px] px-1 rounded ${s.machineChocolate.queue >= CONFIG.machineQueue[s.lvlMachineQueue].val ? 'bg-red-600 animate-pulse' : 'bg-amber-800'}`}>Q: {s.machineChocolate.queue}/{CONFIG.machineQueue[s.lvlMachineQueue].val}</div>
                            </div>
                            {s.machineChocolate.output.map(o => <div key={o.id} className="absolute" style={{ left: o.x, top: o.y, zIndex: Math.floor(o.y) }}><div className="w-8 h-6 animate-bounce relative"><SvgItem type="CHOCOLATE" /></div></div>)}
                        </>
                    )}

                    {/* TRASH CAN */}
                    <div className="absolute w-[40px] h-[40px] bg-slate-700 border-2 border-slate-500 rounded-lg flex items-center justify-center cursor-pointer active:scale-95" style={{ left: s.trashZone.x - 20, top: s.trashZone.y - 20, zIndex: 5 }}
                        onClick={() => {
                            const trashIdx = s.inventory.indexOf('TRASH_BAG');
                            if (trashIdx > -1) {
                                s.inventory.splice(trashIdx, 1);
                                if (sfxOn) playSfx('pop');
                                spawnConfetti(s.trashZone.x, s.trashZone.y);
                                setAlertMsg("Trash Disposed!");
                            } else if (s.inventory.length > 0) {
                                setShowTrashConfirm(true);
                            }
                        }}
                    >
                        <span className="text-xl">🗑️</span>
                    </div>

                    {/* COFFEE MACHINE */}
                    <div className="absolute w-[40px] h-[40px] bg-amber-900 border-2 border-amber-700 rounded-lg flex items-center justify-center" style={{ left: 350, top: 200, zIndex: 5 }}>
                        <span className="text-xl">☕</span>
                        <div className="absolute -bottom-4 w-full text-center text-[8px] font-bold text-black bg-white/70 rounded">LVL {s.lvlCoffeeMachine + 1}</div>
                    </div>

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

                    {/* CHEESE DESK (Sorted by Y) */}
                    {s.unlockedDairy && (
                        <div className="absolute w-[80px] h-[60px]" style={{ left: s.deskCheese.x - 40, top: s.deskCheese.y, zIndex: Math.floor(s.deskCheese.y) }}>
                            <SvgDesk />
                            <div className="absolute -top-4 w-full text-center text-xs font-black text-black drop-shadow bg-white/70 rounded">CHEESE: {s.deskCheese.stock}</div>
                        </div>
                    )}

                    {/* JUICE DESK (Sorted by Y) */}
                    {s.unlockedOrchard && (
                        <div className="absolute w-[80px] h-[60px]" style={{ left: s.deskJuice.x - 40, top: s.deskJuice.y, zIndex: Math.floor(s.deskJuice.y) }}>
                            <SvgDesk />
                            <div className="absolute -top-4 w-full text-center text-xs font-black text-black drop-shadow bg-white/70 rounded">JUICE: {s.deskJuice.stock}</div>
                        </div>
                    )}

                    {/* CHOCOLATE DESK (Sorted by Y) */}
                    {s.unlockedChocolate && (
                        <div className="absolute w-[80px] h-[60px]" style={{ left: s.deskChocolate.x - 40, top: s.deskChocolate.y, zIndex: Math.floor(s.deskChocolate.y) }}>
                            <SvgDesk />
                            <div className="absolute -top-4 w-full text-center text-xs font-black text-black drop-shadow bg-white/70 rounded">CHOC: {s.deskChocolate.stock}</div>
                        </div>
                    )}

                    {/* SELL ZONE INDICATOR */}
                    {!s.salesStaffBread.active && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 60, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}
                    {!s.salesStaffKetchup.active && s.unlockedKetchup && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 420, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}
                    {!s.salesStaffCheese.active && s.unlockedDairy && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 780, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}
                    {!s.salesStaffJuice.active && s.unlockedOrchard && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 1140, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}
                    {!s.salesStaffChocolate.active && s.unlockedChocolate && <div className="absolute w-[80px] h-[50px] bg-blue-500/50 border-4 border-blue-400 rounded-lg flex items-center justify-center animate-pulse" style={{ left: 1500, top: 425, zIndex: 5 }}><span className="text-xl font-black text-white drop-shadow-md tracking-wider">SELL</span></div>}

                    {/* HIRE ZONES ROOM 1 */}
                    <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffCorn.level >= 4 ? 'bg-green-600/50 border-green-400' : s.money >= farmCost1 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneFarm.x, top: s.hireZoneFarm.y, zIndex: 10 }}>
                        {s.staffCorn.level >= 4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffCorn.active ? `LVL ${s.staffCorn.level + 2}` : "HIRE"}</div><div className="text-xs font-black text-white">${farmCost1}</div></>}
                    </div>
                    {!s.salesStaffBread.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money >= 300 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSales.x, top: s.hireZoneSales.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">$300</div></div>}

                    {/* HIRE ZONES ROOM 2 */}
                    {s.unlockedKetchup && (
                        <>
                            <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffTomato.level >= 4 ? 'bg-green-600/50 border-green-400' : s.money >= farmCost2 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneTomato.x, top: s.hireZoneTomato.y, zIndex: 10 }}>
                                {s.staffTomato.level >= 4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffTomato.active ? `LVL ${s.staffTomato.level + 2}` : "HIRE"}</div><div className="text-xs font-black text-white">${farmCost2}</div></>}
                            </div>
                            {!s.salesStaffKetchup.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money >= 1000 ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSalesKetchup.x, top: s.hireZoneSalesKetchup.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">$1000</div></div>}
                        </>
                    )}

                    {/* HIRE ZONES ROOM 3 */}
                    {s.unlockedDairy && (
                        <>
                            <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffWheat.level >= 4 ? 'bg-green-600/50 border-green-400' : s.money >= CONFIG.wheatStaff[s.staffWheat.active ? s.staffWheat.level + 1 : 0]?.cost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneWheat.x, top: s.hireZoneWheat.y, zIndex: 10 }}>
                                {s.staffWheat.level >= 4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffWheat.active ? `LVL ${s.staffWheat.level + 2}` : "HIRE"}</div><div className="text-xs font-black text-white">${CONFIG.wheatStaff[s.staffWheat.active ? s.staffWheat.level + 1 : 0]?.cost}</div></>}
                            </div>
                            {!s.salesStaffCheese.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money >= CONFIG.salesStaffCheese.cost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSalesCheese.x, top: s.hireZoneSalesCheese.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">${CONFIG.salesStaffCheese.cost}</div></div>}
                        </>
                    )}

                    {/* HIRE ZONES ROOM 4 */}
                    {s.unlockedOrchard && (
                        <>
                            <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffOrchard.level >= 4 ? 'bg-green-600/50 border-green-400' : s.money >= CONFIG.orchardStaff[s.staffOrchard.active ? s.staffOrchard.level + 1 : 0]?.cost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneOrchard.x, top: s.hireZoneOrchard.y, zIndex: 10 }}>
                                {s.staffOrchard.level >= 4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffOrchard.active ? `LVL ${s.staffOrchard.level + 2}` : "HIRE"}</div><div className="text-xs font-black text-white">${CONFIG.orchardStaff[s.staffOrchard.active ? s.staffOrchard.level + 1 : 0]?.cost}</div></>}
                            </div>
                            {!s.salesStaffJuice.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money >= CONFIG.salesStaffJuice.cost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSalesJuice.x, top: s.hireZoneSalesJuice.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">${CONFIG.salesStaffJuice.cost}</div></div>}
                        </>
                    )}

                    {/* HIRE ZONES ROOM 5 */}
                    {s.unlockedChocolate && (
                        <>
                            <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.staffCocoa.level >= 4 ? 'bg-green-600/50 border-green-400' : s.money >= CONFIG.cocoaStaff[s.staffCocoa.active ? s.staffCocoa.level + 1 : 0]?.cost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneCocoa.x, top: s.hireZoneCocoa.y, zIndex: 10 }}>
                                {s.staffCocoa.level >= 4 ? <div className="text-lg font-black text-white">MAX</div> : <><div className="text-[8px] text-white font-bold text-center leading-tight">{s.staffCocoa.active ? `LVL ${s.staffCocoa.level + 2}` : "HIRE"}</div><div className="text-xs font-black text-white">${CONFIG.cocoaStaff[s.staffCocoa.active ? s.staffCocoa.level + 1 : 0]?.cost}</div></>}
                            </div>
                            {!s.salesStaffChocolate.active && <div className={`absolute w-[60px] h-[60px] border-4 rounded-xl flex flex-col items-center justify-center p-1 transition-colors ${s.money >= CONFIG.salesStaffChocolate.cost ? 'bg-blue-500/80 border-blue-300' : 'bg-gray-500/80 border-gray-400'}`} style={{ left: s.hireZoneSalesChocolate.x, top: s.hireZoneSalesChocolate.y, zIndex: 10 }}><div className="text-[8px] text-white font-bold text-center leading-tight">SALES</div><div className="text-xs font-black text-white">${CONFIG.salesStaffChocolate.cost}</div></div>}
                        </>
                    )}

                    {/* SALES STAFF (Sorted by Y or Fixed Z) */}
                    {s.salesStaffChocolate.active && s.unlockedChocolate && <div className="absolute w-[60px] h-[60px]" style={{ left: s.salesStaffChocolate.x - 30, top: s.salesStaffChocolate.y - 60, zIndex: 400 }}>
                        <SvgCharacter type="SALES" isSelling={s.salesStaffChocolate.state === 'SELLING'} />
                        {s.salesStaffChocolate.state === 'SELLING' && (
                            <div className="absolute -top-4 left-0 w-full h-2 bg-slate-700 rounded-full overflow-hidden border border-white">
                                <div className="h-full bg-green-500" style={{ width: `${(1 - s.salesStaffChocolate.timer / CONFIG.salesDelay) * 100}%` }} />
                            </div>
                        )}
                    </div>}


                    {/* CHARACTERS (Sorted by Y) */}
                    {s.staffCorn.active && <div className="absolute w-[60px] h-[60px] transition-transform duration-75 cursor-pointer" style={{ left: s.staffCorn.x - 10, top: s.staffCorn.y, zIndex: Math.floor(s.staffCorn.y) }} onClick={(e) => { e.stopPropagation(); if (s.staffCorn.state === 'SLEEP') { s.staffCorn.stamina = 100; s.staffCorn.state = 'IDLE'; if (sfxOn) playSfx('pop'); spawnText(s.staffCorn.x, s.staffCorn.y - 40, "WAKE UP!"); } }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffCorn.level)} />{s.staffCorn.state === 'SLEEP' && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-pulse">💤</div>}<div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffCorn.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}

                    {s.staffTomato.active && s.unlockedKetchup && <div className="absolute w-[60px] h-[60px] transition-transform duration-75 cursor-pointer" style={{ left: s.staffTomato.x - 10, top: s.staffTomato.y, zIndex: Math.floor(s.staffTomato.y) }} onClick={(e) => { e.stopPropagation(); if (s.staffTomato.state === 'SLEEP') { s.staffTomato.stamina = 100; s.staffTomato.state = 'IDLE'; if (sfxOn) playSfx('pop'); spawnText(s.staffTomato.x, s.staffTomato.y - 40, "WAKE UP!"); } }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffTomato.level)} />{s.staffTomato.state === 'SLEEP' && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-pulse">💤</div>}<div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffTomato.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}

                    {s.staffWheat.active && s.unlockedDairy && <div className="absolute w-[60px] h-[60px] transition-transform duration-75 cursor-pointer" style={{ left: s.staffWheat.x - 10, top: s.staffWheat.y, zIndex: Math.floor(s.staffWheat.y) }} onClick={(e) => { e.stopPropagation(); if (s.staffWheat.state === 'SLEEP') { s.staffWheat.stamina = 100; s.staffWheat.state = 'IDLE'; if (sfxOn) playSfx('pop'); spawnText(s.staffWheat.x, s.staffWheat.y - 40, "WAKE UP!"); } }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffWheat.level)} />{s.staffWheat.state === 'SLEEP' && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-pulse">💤</div>}<div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffWheat.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}
                    {s.staffOrchard.active && s.unlockedOrchard && <div className="absolute w-[60px] h-[60px] transition-transform duration-75 cursor-pointer" style={{ left: s.staffOrchard.x - 10, top: s.staffOrchard.y, zIndex: Math.floor(s.staffOrchard.y) }} onClick={(e) => { e.stopPropagation(); if (s.staffOrchard.state === 'SLEEP') { s.staffOrchard.stamina = 100; s.staffOrchard.state = 'IDLE'; if (sfxOn) playSfx('pop'); spawnText(s.staffOrchard.x, s.staffOrchard.y - 40, "WAKE UP!"); } }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffOrchard.level)} />{s.staffOrchard.state === 'SLEEP' && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-pulse">💤</div>}<div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffOrchard.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}
                    {s.staffCocoa.active && s.unlockedChocolate && <div className="absolute w-[60px] h-[60px] transition-transform duration-75 cursor-pointer" style={{ left: s.staffCocoa.x - 10, top: s.staffCocoa.y, zIndex: Math.floor(s.staffCocoa.y) }} onClick={(e) => { e.stopPropagation(); if (s.staffCocoa.state === 'SLEEP') { s.staffCocoa.stamina = 100; s.staffCocoa.state = 'IDLE'; if (sfxOn) playSfx('pop'); spawnText(s.staffCocoa.x, s.staffCocoa.y - 40, "WAKE UP!"); } }}><SvgCharacter type="STAFF" capColor={getStaffCapColor(s.staffCocoa.level)} />{s.staffCocoa.state === 'SLEEP' && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-pulse">💤</div>}<div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">{s.staffCocoa.holding.map((t, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md"><SvgItem type={t} /></div>)}</div></div>}

                    {s.salesStaffBread.active && <div className="absolute w-[60px] h-[60px]" style={{ left: s.salesStaffBread.x - 30, top: s.salesStaffBread.y - 60, zIndex: 400 }}>
                        <SvgCharacter type="SALES" isSelling={s.salesStaffBread.state === 'SELLING'} />
                        {s.salesStaffBread.state === 'SELLING' && (
                            <div className="absolute -top-4 left-0 w-full h-2 bg-slate-700 rounded-full overflow-hidden border border-white">
                                <div className="h-full bg-green-500" style={{ width: `${(1 - s.salesStaffBread.timer / CONFIG.salesDelay) * 100}%` }} />
                            </div>
                        )}
                    </div>}
                    {s.salesStaffKetchup.active && s.unlockedKetchup && <div className="absolute w-[60px] h-[60px]" style={{ left: s.salesStaffKetchup.x - 30, top: s.salesStaffKetchup.y - 60, zIndex: 400 }}>
                        <SvgCharacter type="SALES" isSelling={s.salesStaffKetchup.state === 'SELLING'} />
                        {s.salesStaffKetchup.state === 'SELLING' && (
                            <div className="absolute -top-4 left-0 w-full h-2 bg-slate-700 rounded-full overflow-hidden border border-white">
                                <div className="h-full bg-green-500" style={{ width: `${(1 - s.salesStaffKetchup.timer / CONFIG.salesDelay) * 100}%` }} />
                            </div>
                        )}
                    </div>}
                    {s.salesStaffCheese.active && s.unlockedDairy && <div className="absolute w-[60px] h-[60px]" style={{ left: s.salesStaffCheese.x - 30, top: s.salesStaffCheese.y - 60, zIndex: 400 }}>
                        <SvgCharacter type="SALES" isSelling={s.salesStaffCheese.state === 'SELLING'} />
                        {s.salesStaffCheese.state === 'SELLING' && (
                            <div className="absolute -top-4 left-0 w-full h-2 bg-slate-700 rounded-full overflow-hidden border border-white">
                                <div className="h-full bg-green-500" style={{ width: `${(1 - s.salesStaffCheese.timer / CONFIG.salesDelay) * 100}%` }} />
                            </div>
                        )}
                    </div>}
                    {s.salesStaffJuice.active && s.unlockedOrchard && <div className="absolute w-[60px] h-[60px]" style={{ left: s.salesStaffJuice.x - 30, top: s.salesStaffJuice.y - 60, zIndex: 400 }}>
                        <SvgCharacter type="SALES" isSelling={s.salesStaffJuice.state === 'SELLING'} />
                        {s.salesStaffJuice.state === 'SELLING' && (
                            <div className="absolute -top-4 left-0 w-full h-2 bg-slate-700 rounded-full overflow-hidden border border-white">
                                <div className="h-full bg-green-500" style={{ width: `${(1 - s.salesStaffJuice.timer / CONFIG.salesDelay) * 100}%` }} />
                            </div>
                        )}
                    </div>}

                    <div className="absolute w-[60px] h-[60px]" style={{ left: s.player.x - 10, top: s.player.y, zIndex: Math.floor(s.player.y) }}>
                        <SvgCharacter type="PLAYER" />
                        {isSellingManually && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded animate-pulse whitespace-nowrap">SELLING...</div>}
                        <div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 w-6 flex flex-col-reverse items-center gap-[-10px]">
                            {s.inventory.map((item, i) => <div key={i} className="w-6 h-6 -mb-4 drop-shadow-md transform transition-transform" style={{ transform: `rotate(${Math.sin(i * 132) * 5}deg)` }}><SvgItem type={item} /></div>)}
                        </div>
                    </div>

                    {/* TRASH GUIDE ARROW */}
                    {s.inventory.includes('TRASH_BAG') && (
                        <div className="absolute w-[100px] h-[100px] pointer-events-none flex items-center justify-center z-[1000]" style={{ left: s.player.x - 50, top: s.player.y - 50 }}>
                            <div className="w-full h-full flex items-center justify-center animate-pulse" style={{ transform: `rotate(${Math.atan2(s.trashZone.y - s.player.y, s.trashZone.x - s.player.x) * 180 / Math.PI}deg)` }}>
                                <div className="absolute right-0 text-4xl text-red-500 font-black drop-shadow-md">➤</div>
                            </div>
                        </div>
                    )}

                    {/* PARTICLES */}
                    {s.floatingTexts.map(t => <div key={t.id} className="absolute font-black text-green-400 text-xl drop-shadow-md z-[500] pointer-events-none" style={{ left: t.x, top: t.y, opacity: t.life / 60 }}>{t.text}</div>)}
                    {s.particles.map(p => <div key={p.id} className="absolute w-4 h-4 rounded-full z-[500] pointer-events-none" style={{ left: p.x, top: p.y, backgroundColor: p.color, opacity: p.life / 60 }} />)}
                </div>

                {/* --- UI OVERLAY (Fixed to Screen) --- */}
                {/* RUSH HOUR BANNER */}
                {s.rushHour.active && (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-yellow-500 text-white px-4 py-1 rounded-full shadow-lg z-50 animate-pulse border-2 border-white">
                        🔥 RUSH HOUR! ({Math.ceil(s.rushHour.timer / 60)}s) 🔥
                    </div>
                )}

                {/* NEWS TICKER (Market Trends) */}
                {s.marketTrend.type !== 'NORMAL' && (
                    <div className="absolute top-20 left-0 w-full bg-black/80 text-white py-2 overflow-hidden z-40 border-y-2 border-yellow-500 pointer-events-none">
                        <div className="whitespace-nowrap animate-[ticker_10s_linear_infinite] font-bold text-yellow-400 text-lg">
                            🚨 NEWS FLASH: {s.marketTrend.news} 🚨  ---  {s.marketTrend.news}  ---  {s.marketTrend.news}
                        </div>
                        <style>{`@keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
                    </div>
                )}

                {/* RENT TIMER */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-600 flex items-center gap-2 z-40 pointer-events-none">
                    <span className="text-xs text-slate-300 font-bold">RENT DUE:</span>
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(s.rentTimer / 36000) * 100}%` }}></div>
                    </div>
                </div>

                <div className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-full border-2 border-slate-200 shadow-xl flex items-center gap-2 z-[900] pointer-events-auto">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600" />
                    <span className="font-black text-lg text-slate-800">${s.money}</span>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold z-[900] backdrop-blur-sm">
                    {s.inventory.length} / {CONFIG.stack[s.lvlStack].val}
                </div>

                {/* TOAST NOTIFICATION */}
                {toast && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[3500] animate-[slideDown_0.5s_ease-out]">
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl border-2 border-white shadow-2xl flex flex-col items-center min-w-[200px]">
                            <span className="font-black text-sm tracking-widest">🏆 {toast.title}</span>
                            <span className="text-xs font-bold">{toast.desc}</span>
                        </div>
                    </div>
                )}
                <style>{`@keyframes slideDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`}</style>

                {/* ALERT POPUP (FIXED POSITION & CENTERED) */}
                {alertMsg && (
                    <div className="absolute inset-0 z-[3100] bg-black/50 flex items-center justify-center pointer-events-auto">
                        <div className="bg-yellow-400 text-black px-8 py-6 rounded-2xl border-4 border-white shadow-2xl flex flex-col items-center gap-4 animate-bounce">
                            <span className="font-black text-xl text-center">{alertMsg}</span>
                            <button onClick={(e) => { e.stopPropagation(); setAlertMsg(null); }} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-slate-800 font-bold text-lg shadow-lg transform active:scale-95 transition-transform">OK</button>
                        </div>
                    </div>
                )}

                {/* TRASH CONFIRMATION */}
                {showTrashConfirm && (
                    <div className="absolute inset-0 z-[3200] bg-black/80 flex items-center justify-center pointer-events-auto">
                        <div className="bg-white text-black px-6 py-6 rounded-2xl border-4 border-slate-300 shadow-2xl flex flex-col items-center gap-4 w-64">
                            <span className="text-4xl">🗑️</span>
                            <span className="font-black text-lg text-center leading-tight">CLEAR INVENTORY?</span>
                            <p className="text-xs text-slate-500 text-center">This will delete all items you are carrying.</p>
                            <div className="flex gap-2 w-full mt-2">
                                <button onClick={(e) => { e.stopPropagation(); s.inventory = []; setShowTrashConfirm(false); playSfx('pop'); }} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold shadow hover:bg-red-600 active:scale-95">YES</button>
                                <button onClick={(e) => { e.stopPropagation(); setShowTrashConfirm(false); s.trashCooldown = 120; }} className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg font-bold shadow hover:bg-slate-300 active:scale-95">NO</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTROLS */}
                <div className="absolute bottom-4 left-4 flex gap-4 z-[900] pointer-events-auto">
                    <div onClick={(e) => { e.stopPropagation(); setShowUpgradeMenu(true); }} className={`w-14 h-14 bg-purple-600 rounded-xl border-4 border-purple-400 flex items-center justify-center shadow-xl transition-transform active:scale-95 ${canAffordAny ? 'animate-bounce' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m17 11-5-5-5 5" /><path d="m17 18-5-5-5 5" /></svg>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setShowManagerMenu(true); }} className="w-14 h-14 bg-blue-600 rounded-xl border-4 border-blue-400 flex items-center justify-center shadow-xl transition-transform active:scale-95">
                        <span className="text-2xl">💼</span>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setShowSettings(true); }} className="w-14 h-14 bg-gray-600 rounded-xl border-4 border-gray-400 flex items-center justify-center shadow-xl transition-transform active:scale-95">
                        <span className="text-2xl">⚙️</span>
                    </div>
                </div>

                {/* MODALS */}
                {(showUpgradeMenu || showSettings || showManagerMenu) && (
                    <div className="absolute inset-0 bg-slate-900/95 z-[3000] flex flex-col items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                        {showManagerMenu && (
                            <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 max-h-[80vh] flex flex-col">
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <h2 className="font-black text-2xl text-slate-800">MANAGERS</h2>
                                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold text-xs border border-purple-200">💎 {s.gems}</div>
                                    <button onClick={() => setShowManagerMenu(false)} className="text-red-500 font-bold text-xl">X</button>
                                </div>

                                {/* GACHA BUTTON */}
                                <button onClick={openBriefcase} className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl font-black text-white border-b-4 border-yellow-700 shadow-lg mb-4 active:scale-95 shrink-0">
                                    BUY BRIEFCASE (💎{GACHA_COST})
                                </button>

                                {/* ACTIVE BONUSES SUMMARY */}
                                <div className="bg-slate-100 p-3 rounded-xl mb-4 text-xs text-slate-600 border border-slate-200">
                                    <div className="font-bold text-slate-800 mb-1">ACTIVE BONUSES:</div>
                                    <div className="flex justify-between"><span>🏭 Speed:</span> <span className="font-bold text-green-600">+{Math.round(getManagerBonus('PRODUCTION') * 100)}%</span></div>
                                    <div className="flex justify-between"><span>📦 Capacity:</span> <span className="font-bold text-blue-600">+{Math.floor(getManagerBonus('LOGISTICS'))}</span></div>
                                    <div className="flex justify-between"><span>💰 Truck Wait:</span> <span className="font-bold text-purple-600">+{Math.round(getManagerBonus('SALES'))}s</span></div>
                                </div>

                                {/* MANAGER LIST */}
                                <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0">
                                    {MANAGERS.map(m => {
                                        const level = s.managers[m.id] || 0;
                                        const isActive = s.activeManagers.production === m.id || s.activeManagers.logistics === m.id || s.activeManagers.sales === m.id;
                                        return (
                                            <div key={m.id} className={`p-2 rounded-xl border-2 flex gap-2 items-center ${level > 0 ? 'bg-slate-50 border-slate-200' : 'bg-slate-100 border-slate-200 opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-lg ${m.color} flex items-center justify-center text-xl shadow-inner shrink-0`}>
                                                    {m.type === 'PRODUCTION' && '🏭'}
                                                    {m.type === 'LOGISTICS' && '📦'}
                                                    {m.type === 'SALES' && '💰'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-black text-xs text-slate-800 truncate">{m.name}</div>
                                                        {level > 0 && <div className="text-[10px] font-bold text-slate-500">Lvl {level}</div>}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 leading-tight">{m.desc}</div>
                                                </div>
                                                {level > 0 && (
                                                    <button onClick={() => equipManager(m.id, m.type)} className={`px-3 py-1 rounded-lg font-bold text-[10px] ${isActive ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>
                                                        {isActive ? 'EQUIPPED' : 'EQUIP'}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {showUpgradeMenu && (
                            <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 max-h-[80vh] flex flex-col">
                                <div className="flex justify-between items-center mb-4 shrink-0">
                                    <h2 className="font-black text-2xl text-slate-800">UPGRADES</h2>
                                    <button onClick={() => setShowUpgradeMenu(false)} className="text-red-500 font-bold text-xl">X</button>
                                </div>
                                {/* SCROLLABLE UPGRADE LIST */}
                                <div className="flex flex-col gap-3 overflow-y-auto pr-2 flex-1 min-h-0">
                                    {/* STACK */}
                                    <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Player Stack: {CONFIG.stack[s.lvlStack].val} ➔ {s.lvlStack < 4 ? CONFIG.stack[s.lvlStack + 1].val : 'MAX'}</span></div><button disabled={s.lvlStack >= 4} onClick={() => buyUpgrade('stack')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlStack >= 4 ? 'bg-gray-400' : s.money >= CONFIG.stack[s.lvlStack + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlStack >= 4 ? "MAX" : `$${CONFIG.stack[s.lvlStack + 1].cost}`}</button></div>

                                    {/* SPEED */}
                                    <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Player Speed: Lvl {s.lvlSpeed + 1} ➔ {s.lvlSpeed < 3 ? s.lvlSpeed + 2 : 'MAX'}</span></div><button disabled={s.lvlSpeed >= 3} onClick={() => buyUpgrade('speed')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlSpeed >= 3 ? 'bg-gray-400' : s.money >= CONFIG.speed[s.lvlSpeed + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlSpeed >= 3 ? "MAX" : `$${CONFIG.speed[s.lvlSpeed + 1].cost}`}</button></div>

                                    {/* BAKERY SPEED */}
                                    <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Bakery Speed: {(CONFIG.machineBakery[s.lvlMachineBread].val / 60).toFixed(1)}s ➔ {s.lvlMachineBread < 2 ? (CONFIG.machineBakery[s.lvlMachineBread + 1].val / 60).toFixed(1) + 's' : 'MAX'}</span></div><button disabled={s.lvlMachineBread >= 2} onClick={() => buyUpgrade('machineBread')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineBread >= 2 ? 'bg-gray-400' : s.money >= CONFIG.machineBakery[s.lvlMachineBread + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineBread >= 2 ? "MAX" : `$${CONFIG.machineBakery[s.lvlMachineBread + 1].cost}`}</button></div>

                                    {/* SAUCE SPEED */}
                                    {s.unlockedKetchup ? (
                                        <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Sauce Speed: {(CONFIG.machineSauce[s.lvlMachineSauce].val / 60).toFixed(1)}s ➔ {s.lvlMachineSauce < 2 ? (CONFIG.machineSauce[s.lvlMachineSauce + 1].val / 60).toFixed(1) + 's' : 'MAX'}</span></div><button disabled={s.lvlMachineSauce >= 2} onClick={() => buyUpgrade('machineSauce')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineSauce >= 2 ? 'bg-gray-400' : s.money >= CONFIG.machineSauce[s.lvlMachineSauce + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineSauce >= 2 ? "MAX" : `$${CONFIG.machineSauce[s.lvlMachineSauce + 1].cost}`}</button></div>
                                    ) : (
                                        <div className="bg-slate-200 p-2 rounded-lg shrink-0 opacity-50"><div className="text-center text-xs font-bold text-slate-500">Unlock Zone 2 for more upgrades</div></div>
                                    )}

                                    {/* CHEESE SPEED */}
                                    {s.unlockedDairy ? (
                                        <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Cheese Speed: {(CONFIG.machineCheese[s.lvlMachineCheese].val / 60).toFixed(1)}s ➔ {s.lvlMachineCheese < 2 ? (CONFIG.machineCheese[s.lvlMachineCheese + 1].val / 60).toFixed(1) + 's' : 'MAX'}</span></div><button disabled={s.lvlMachineCheese >= 2} onClick={() => buyUpgrade('machineCheese')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineCheese >= 2 ? 'bg-gray-400' : s.money >= CONFIG.machineCheese[s.lvlMachineCheese + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineCheese >= 2 ? "MAX" : `$${CONFIG.machineCheese[s.lvlMachineCheese + 1].cost}`}</button></div>
                                    ) : (
                                        <div className="bg-slate-200 p-2 rounded-lg shrink-0 opacity-50"><div className="text-center text-xs font-bold text-slate-500">Unlock Zone 3 for more upgrades</div></div>
                                    )}

                                    {/* JUICE SPEED */}
                                    {s.unlockedOrchard ? (
                                        <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Juice Speed: {(CONFIG.machineJuice[s.lvlMachineJuice].val / 60).toFixed(1)}s ➔ {s.lvlMachineJuice < 2 ? (CONFIG.machineJuice[s.lvlMachineJuice + 1].val / 60).toFixed(1) + 's' : 'MAX'}</span></div><button disabled={s.lvlMachineJuice >= 2} onClick={() => buyUpgrade('machineJuice')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineJuice >= 2 ? 'bg-gray-400' : s.money >= CONFIG.machineJuice[s.lvlMachineJuice + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineJuice >= 2 ? "MAX" : `$${CONFIG.machineJuice[s.lvlMachineJuice + 1].cost}`}</button></div>
                                    ) : (
                                        <div className="bg-slate-200 p-2 rounded-lg shrink-0 opacity-50"><div className="text-center text-xs font-bold text-slate-500">Unlock Zone 4 for more upgrades</div></div>
                                    )}

                                    {/* CHOCOLATE SPEED */}
                                    {s.unlockedChocolate ? (
                                        <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Choc Speed: {(CONFIG.machineChocolate[s.lvlMachineChocolate].val / 60).toFixed(1)}s ➔ {s.lvlMachineChocolate < 2 ? (CONFIG.machineChocolate[s.lvlMachineChocolate + 1].val / 60).toFixed(1) + 's' : 'MAX'}</span></div><button disabled={s.lvlMachineChocolate >= 2} onClick={() => buyUpgrade('machineChocolate')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineChocolate >= 2 ? 'bg-gray-400' : s.money >= CONFIG.machineChocolate[s.lvlMachineChocolate + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineChocolate >= 2 ? "MAX" : `$${CONFIG.machineChocolate[s.lvlMachineChocolate + 1].cost}`}</button></div>
                                    ) : (
                                        <div className="bg-slate-200 p-2 rounded-lg shrink-0 opacity-50"><div className="text-center text-xs font-bold text-slate-500">Unlock Zone 5 for more upgrades</div></div>
                                    )}

                                    {/* MACHINE QUEUE */}
                                    <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Machine Queue: {CONFIG.machineQueue[s.lvlMachineQueue].val} ➔ {s.lvlMachineQueue < 6 ? CONFIG.machineQueue[s.lvlMachineQueue + 1].val : 'MAX'}</span></div><button disabled={s.lvlMachineQueue >= 6} onClick={() => buyUpgrade('machineQueue')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlMachineQueue >= 6 ? 'bg-gray-400' : s.money >= CONFIG.machineQueue[s.lvlMachineQueue + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlMachineQueue >= 6 ? "MAX" : `$${CONFIG.machineQueue[s.lvlMachineQueue + 1].cost}`}</button></div>

                                    {/* COFFEE MACHINE */}
                                    <div className="bg-slate-100 p-2 rounded-lg shrink-0"><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>Coffee Machine: Lvl {s.lvlCoffeeMachine + 1} ➔ {s.lvlCoffeeMachine < 2 ? 'Lvl ' + (s.lvlCoffeeMachine + 2) : 'MAX'}</span></div><button disabled={s.lvlCoffeeMachine >= 2} onClick={() => buyUpgrade('coffeeMachine')} className={`w-full py-2 rounded-lg font-black text-white ${s.lvlCoffeeMachine >= 2 ? 'bg-gray-400' : s.money >= CONFIG.coffeeMachine[s.lvlCoffeeMachine + 1].cost ? 'bg-green-500 shadow-md' : 'bg-red-400 opacity-50'}`}>{s.lvlCoffeeMachine >= 2 ? "MAX" : `$${CONFIG.coffeeMachine[s.lvlCoffeeMachine + 1].cost}`}</button></div>
                                </div>
                            </div>
                        )}
                        {showSettings && (
                            <div className="bg-white w-full max-w-xs rounded-2xl p-4 shadow-2xl border-4 border-slate-300 text-center flex flex-col max-h-[80vh]">
                                <div className="flex gap-2 mb-4 border-b-2 border-slate-200 pb-2">
                                    <button onClick={() => setSettingsTab('OPTIONS')} className={`flex-1 py-2 font-black text-sm rounded-lg ${settingsTab === 'OPTIONS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>OPTIONS</button>
                                    <button onClick={() => setSettingsTab('ACHIEVEMENTS')} className={`flex-1 py-2 font-black text-sm rounded-lg ${settingsTab === 'ACHIEVEMENTS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>ACHIEVEMENTS</button>
                                    <button onClick={() => setSettingsTab('ABOUT')} className={`flex-1 py-2 font-black text-sm rounded-lg ${settingsTab === 'ABOUT' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>ABOUT</button>
                                </div>

                                {settingsTab === 'ABOUT' ? (
                                    <div className="flex flex-col h-full">
                                        {!aboutSubTab ? (
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => setAboutSubTab('BASICS')} className="w-full py-3 bg-blue-100 text-blue-800 rounded-xl font-bold border-2 border-blue-200 hover:bg-blue-200">BASICS 🎮</button>
                                                <button onClick={() => setAboutSubTab('STAFF')} className="w-full py-3 bg-green-100 text-green-800 rounded-xl font-bold border-2 border-green-200 hover:bg-green-200">STAFF 👷</button>
                                                <button onClick={() => setAboutSubTab('MACHINES')} className="w-full py-3 bg-orange-100 text-orange-800 rounded-xl font-bold border-2 border-orange-200 hover:bg-orange-200">MACHINES ⚙️</button>
                                                <button onClick={() => setAboutSubTab('UPGRADES')} className="w-full py-3 bg-purple-100 text-purple-800 rounded-xl font-bold border-2 border-purple-200 hover:bg-purple-200">UPGRADES 🚀</button>
                                                <button onClick={() => setAboutSubTab('CREDITS')} className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl font-bold border-2 border-slate-200 hover:bg-slate-200">CREDITS ❤️</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col h-full">
                                                <button onClick={() => setAboutSubTab(null)} className="mb-2 text-left font-bold text-slate-500 hover:text-slate-800">⬅ BACK</button>
                                                <div className="flex-1 overflow-y-auto text-left text-sm text-slate-600 p-2 bg-slate-50 rounded-lg border border-slate-200">
                                                    {aboutSubTab === 'BASICS' && (
                                                        <>
                                                            <h3 className="font-black text-slate-800 mb-2">HOW TO PLAY</h3>
                                                            <p className="mb-2"><strong>Move:</strong> Use Joystick or Arrow Keys.</p>
                                                            <p className="mb-2"><strong>Harvest:</strong> Walk near ripe crops to collect them.</p>
                                                            <p className="mb-2"><strong>Sell:</strong> Walk to the Truck to sell products.</p>
                                                            <p className="mb-2"><strong>Economy:</strong> Watch the News Ticker for price changes and pay your Daily Rent!</p>
                                                            <p><strong>Goal:</strong> Earn money, unlock zones, and build a tycoon empire!</p>
                                                        </>
                                                    )}
                                                    {aboutSubTab === 'STAFF' && (
                                                        <>
                                                            <h3 className="font-black text-slate-800 mb-2">STAFF MANAGEMENT</h3>
                                                            <p className="mb-2"><strong>Hiring:</strong> Hire staff to automate harvesting and selling.</p>
                                                            <p className="mb-2"><strong>Stamina:</strong> Staff get tired! If they sleep (Zzz), click them to wake up.</p>
                                                            <p><strong>Managers:</strong> Equip managers for global bonuses like speed and capacity.</p>
                                                        </>
                                                    )}
                                                    {aboutSubTab === 'MACHINES' && (
                                                        <>
                                                            <h3 className="font-black text-slate-800 mb-2">MACHINES</h3>
                                                            <p className="mb-2"><strong>Processing:</strong> Machines turn raw crops into valuable products.</p>
                                                            <p className="mb-2"><strong>Queues:</strong> Upgrade machine queues to stack more items.</p>
                                                            <p className="mb-2"><strong>Maintenance:</strong> Machines produce trash. Click to clean them and dump trash in the bin!</p>
                                                            <p><strong>Automation:</strong> Staff will automatically feed machines and collect products.</p>
                                                        </>
                                                    )}
                                                    {aboutSubTab === 'UPGRADES' && (
                                                        <>
                                                            <h3 className="font-black text-slate-800 mb-2">UPGRADES</h3>
                                                            <p className="mb-2"><strong>Stack:</strong> Carry more items at once.</p>
                                                            <p className="mb-2"><strong>Speed:</strong> Move faster.</p>
                                                            <p><strong>Coffee Machine:</strong> Helps staff recover stamina faster.</p>
                                                        </>
                                                    )}
                                                    {aboutSubTab === 'CREDITS' && (
                                                        <>
                                                            <h3 className="font-black text-slate-800 mb-2">CREDITS</h3>
                                                            <p className="mb-2"><strong>Developed for Superteam x Scrolly Game Jam</strong></p>
                                                            <p><strong>Tools:</strong> React + Tailwind</p>
                                                            <p>Thanks for playing!</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <button onClick={() => setShowSettings(false)} className="w-full py-3 mt-4 bg-slate-800 text-white rounded-xl font-bold border-b-4 border-slate-950 active:scale-95 shrink-0">CLOSE</button>
                                    </div>
                                ) : settingsTab === 'OPTIONS' ? (
                                    <>
                                        <h2 className="font-black text-2xl text-slate-800 mb-4">SETTINGS</h2>
                                        <button onClick={() => setSoundOn(!soundOn)} className={`w-full py-3 mb-4 rounded-xl font-bold border-2 ${soundOn ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>SOUND: {soundOn ? "ON 🔊" : "OFF 🔇"}</button>

                                        <p className="text-xs font-bold text-slate-400 mb-2">VISUAL THEME</p>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {Object.values(THEMES).map(t => {
                                                const unlocked = s.unlockedThemes.includes(t.id);
                                                return (
                                                    <button key={t.id} disabled={!unlocked} onClick={() => s.activeTheme = t.id} className={`py-2 rounded-lg font-bold text-xs border-2 ${s.activeTheme === t.id ? 'bg-slate-800 text-white border-slate-950' : unlocked ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                                                        {unlocked ? t.name : '???'}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <p className="text-xs font-bold text-slate-400 mb-2">MANUAL SAVE SLOTS</p>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {[1, 2, 3].map(i => <button key={i} onClick={() => saveGame(`slot_${i}`)} className="py-2 bg-blue-500 text-white rounded font-bold text-xs hover:bg-blue-600">SLOT {i}</button>)}
                                        </div>
                                        <div className="flex gap-2 mt-auto">
                                            <button onClick={exitToMenu} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold border-b-4 border-red-800 active:scale-95">EXIT</button>
                                            <button onClick={() => setShowSettings(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold border-b-4 border-slate-950 active:scale-95">CLOSE</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0">
                                            {CONFIG.ACHIEVEMENTS.map(ach => {
                                                const unlocked = s.achievements.includes(ach.id);
                                                return (
                                                    <div key={ach.id} className={`p-3 rounded-xl border-2 text-left relative overflow-hidden shrink-0 ${unlocked ? 'bg-yellow-50 border-yellow-400' : 'bg-slate-100 border-slate-200 grayscale opacity-70'}`}>
                                                        <div className="flex justify-between items-start relative z-10">
                                                            <div>
                                                                <div className={`font-black text-sm ${unlocked ? 'text-yellow-700' : 'text-slate-500'}`}>{ach.name}</div>
                                                                <div className="text-[10px] text-slate-500 font-bold">{ach.desc}</div>
                                                            </div>
                                                            {unlocked && <span className="text-xl">🏆</span>}
                                                        </div>
                                                        <div className="mt-2 text-[10px] font-bold bg-black/5 text-black px-2 py-1 rounded inline-block">Reward: {ach.reward}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button onClick={() => setShowSettings(false)} className="w-full py-3 mt-4 bg-slate-800 text-white rounded-xl font-bold border-b-4 border-slate-950 active:scale-95 shrink-0">CLOSE</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div >
    );
};

export default GameSandbox;
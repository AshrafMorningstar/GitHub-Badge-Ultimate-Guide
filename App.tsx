import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BADGES, RARITY_COLORS } from './constants';
import { Badge, ChatMessage, ModelType, UserProfile, UserStats, BadgeCategory } from './types';
import { askFastAI, askReasoningAI, askSearchAI, generateBadgeConcept } from './services/geminiService';
import { 
  Trophy, Star, Zap, Search, Bot, Image as ImageIcon, 
  X, ExternalLink, ChevronRight, Shield, Globe, 
  LayoutDashboard, Map, BookOpen, Github, User, Loader2, CheckCircle2,
  Sun, Moon, Filter, ArrowUpDown, Lock, Unlock, PlusCircle, Sparkles, Tag,
  MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- Components ---

interface HeroProps {
  onConnect: (username: string) => Promise<void>;
  loading: boolean;
  user: UserProfile | null;
  error: string | null;
}

const Hero: React.FC<HeroProps> = ({ onConnect, loading, user, error }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onConnect(usernameInput.trim());
    }
  };

  return (
    <div className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden z-10">
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center space-x-2 mb-8 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
           <span className="text-xs font-bold text-github-light-muted dark:text-github-muted tracking-wide uppercase">Interactive Guide 2024</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-github-light-text dark:text-white mb-8 tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          GitHub <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
             Badges
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-github-light-muted dark:text-github-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          The ultimate achievement tracker for developers. Visualize your progress, discover hidden strategies, and level up your profile.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {!user ? (
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto group">
              <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500 ${isFocused ? 'opacity-75' : ''}`}></div>
              <div className="relative flex items-center bg-white dark:bg-github-darker/90 backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-white/20 dark:border-white/10">
                <div className="pl-4 text-github-light-muted dark:text-github-muted">
                  <Github size={20} />
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="github-username"
                  className="flex-1 bg-transparent border-none focus:ring-0 text-github-light-text dark:text-white placeholder:text-gray-400 text-lg py-2 px-3 font-medium"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-github-light-text dark:bg-white text-white dark:text-github-darker font-bold px-6 py-2.5 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Analyze'}
                </button>
              </div>
            </form>
          ) : (
             <div className="inline-flex items-center gap-5 bg-white/60 dark:bg-github-darker/60 backdrop-blur-xl p-3 pr-8 rounded-full border border-white/20 dark:border-white/10 shadow-2xl hover:scale-105 transition-transform duration-300 group">
                <img src={user.avatar_url} alt={user.login} className="w-14 h-14 rounded-full ring-2 ring-white dark:ring-white/10 shadow-md group-hover:ring-blue-500 transition-all" />
                <div className="text-left">
                  <h3 className="text-lg font-bold text-github-light-text dark:text-white leading-none mb-1.5">
                    {user.name || user.login}
                  </h3>
                  <div className="flex gap-4 text-xs font-medium text-github-light-muted dark:text-github-muted">
                     <span className="flex items-center gap-1"><User size={12}/> {user.followers}</span>
                     <span className="flex items-center gap-1"><BookOpen size={12}/> {user.public_repos}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setUsernameInput('')} 
                  className="ml-4 p-2 bg-gray-200/50 dark:bg-white/10 rounded-full text-github-light-muted hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Disconnect"
                >
                   <X size={16} />
                </button>
             </div>
          )}
          {error && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
              <X size={14} /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BadgeCard: React.FC<{ badge: Badge; onClick: () => void }> = ({ badge, onClick }) => {
  const isOwned = badge.owned;
  
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white/80 dark:bg-github-dark/40 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-3xl p-6 transition-all duration-300 ease-out hover:scale-[1.02] cursor-pointer overflow-hidden ${
        isOwned 
          ? 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border-green-500/30 dark:border-green-500/30 hover:shadow-green-500/10' 
          : 'hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30'
      }`}
    >
      {/* Tooltip Slide-up */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-white/90 dark:bg-[#0d1117]/95 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-20 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
         <div>
            <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
               <Zap size={16} className="fill-current" />
               <span className="text-xs font-black uppercase tracking-widest">Strategy Guide</span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              {badge.howToEarn}
            </p>
         </div>
         <div className="mt-6 flex items-center justify-between text-xs font-semibold">
             <span className="text-gray-400 uppercase tracking-wider">Tap for Details</span>
             {!isOwned && (
               <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
                 <PlusCircle size={14} /> Manual Unlock
               </span>
             )}
         </div>
      </div>

      {/* Top Status Indicators */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 items-end z-10">
        {badge.retired && (
          <span className="px-2.5 py-1 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-red-200 dark:border-red-500/20">
            Retired
          </span>
        )}
        {isOwned && !badge.tiers && (
           <span className="px-2.5 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-green-200 dark:border-green-500/20 flex items-center gap-1.5">
            <CheckCircle2 size={12} className="fill-current text-green-700/20 dark:text-green-400/20" /> Owned
          </span>
        )}
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-all duration-500 ${
            isOwned 
            ? 'bg-gradient-to-br from-white to-gray-50 dark:from-white/10 dark:to-transparent border border-white/20 shadow-lg shadow-green-900/5' 
            : 'bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'
          }`}>
            <span className="drop-shadow-md transform group-hover:scale-110 transition-transform duration-500">{badge.icon}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-current bg-current bg-opacity-5 ${RARITY_COLORS[badge.rarity]}`}>
               {badge.rarity}
             </span>
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-400 border border-gray-200 dark:border-gray-700">
               {badge.category}
             </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {badge.name}
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
            {badge.description}
          </p>
        </div>
      
        {/* Tier Progress */}
        {badge.tiers && (
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5">
            <div className="flex justify-between items-end mb-2">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
               {badge.tiers[0].progress !== undefined && (
                 <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                   {badge.tiers[badge.tiers.length-1].progress} <span className="text-gray-300">/</span> {badge.tiers[badge.tiers.length-1].target}
                 </span>
               )}
            </div>
            <div className="flex gap-1.5 h-2 w-full">
              {badge.tiers.map((tier, idx) => (
                 <div key={idx} className="flex-1 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out shadow-sm ${
                        tier.unlocked 
                          ? (tier.name === 'Gold' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500' : 'bg-gradient-to-r from-green-400 to-green-600') 
                          : 'bg-transparent'
                      }`}
                      style={{ 
                        width: tier.unlocked ? '100%' : tier.progress && tier.target ? `${(tier.progress / tier.target) * 100}%` : '0%'
                      }}
                    />
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BadgeDetailModal = ({ 
  badge, 
  isOpen, 
  onClose, 
  onToggleOwned 
}: { 
  badge: Badge | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onToggleOwned: (badgeId: string) => void;
}) => {
  if (!isOpen || !badge) return null;

  const isUnlocked = badge.owned || badge.tiers?.some(t => t.unlocked);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-gray-100/80 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300" />
      
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-[#0d1117] border border-white/20 dark:border-white/10 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ring-1 ring-black/5"
      >
        <div className="relative h-40 bg-gradient-to-b from-gray-50 to-white dark:from-white/5 dark:to-[#0d1117] flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl bg-white dark:bg-[#161b22] shadow-2xl border border-white/50 dark:border-white/10 relative z-10 transform translate-y-8">
              {badge.icon}
            </div>
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-md rounded-full text-gray-500 transition-colors z-20"
            >
              <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-12 scrollbar-hide">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                {badge.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-current bg-current bg-opacity-5 ${RARITY_COLORS[badge.rarity]}`}>
                   {badge.rarity}
                 </span>
                 <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 border border-gray-200 dark:border-white/10">
                   {badge.category}
                 </span>
              </div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto">
                {badge.description}
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                 <h3 className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-3 uppercase tracking-widest">
                   <Zap size={14} className="fill-current" /> Strategy
                 </h3>
                 <p className="text-blue-900 dark:text-blue-200 text-sm font-medium leading-relaxed">
                   {badge.howToEarn}
                 </p>
              </div>
              
              <div className={`p-6 rounded-3xl border ${isUnlocked ? 'bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10'}`}>
                 <h3 className={`text-xs font-black flex items-center gap-2 mb-3 uppercase tracking-widest ${isUnlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                   {isUnlocked ? <Unlock size={14} /> : <Lock size={14} />} Status
                 </h3>
                 {isUnlocked ? (
                   <p className="text-green-900 dark:text-green-200 text-sm font-medium">
                     Unlocked! You have added this badge to your collection.
                   </p>
                 ) : (
                   <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                     Locked. Follow the strategy to unlock this achievement.
                   </p>
                 )}
              </div>
           </div>

           {badge.tiers && (
             <div className="mb-8 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
               <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <LayoutDashboard size={14} /> Tier Breakdown
               </h3>
               <div className="space-y-4">
                 {badge.tiers.map((tier, idx) => (
                   <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border ${tier.unlocked ? 'bg-green-500 border-green-400 text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-300'}`}>
                           {tier.unlocked ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${tier.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                             {tier.name}
                          </div>
                          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                             Goal: {tier.requirement}
                          </div>
                        </div>
                      </div>
                      {tier.progress !== undefined && (
                         <div className="text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-white/10 px-2 py-1 rounded-md border border-gray-100 dark:border-white/5">
                           {Math.min(100, Math.round((tier.progress / tier.target!) * 100))}%
                         </div>
                      )}
                   </div>
                 ))}
               </div>
             </div>
           )}

           <button 
              onClick={() => onToggleOwned(badge.id)}
              className={`w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition-all transform active:scale-95 ${badge.owned ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 'bg-gray-900 text-white dark:bg-white dark:text-black hover:shadow-lg hover:-translate-y-1'}`}
            >
              {badge.owned ? 'Remove from Collection' : 'Mark as Owned'}
            </button>
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ badges, theme }: { badges: Badge[], theme: string }) => {
  const ownedCount = badges.filter(b => b.owned || b.tiers?.some(t => t.unlocked)).length;
  
  const data = [
    { name: 'Common', count: BADGES.filter(b => b.rarity === 'Common').length, color: '#94a3b8' },
    { name: 'Rare', count: BADGES.filter(b => b.rarity === 'Rare').length, color: '#60a5fa' },
    { name: 'Epic', count: BADGES.filter(b => b.rarity === 'Epic').length, color: '#c084fc' },
    { name: 'Legendary', count: BADGES.filter(b => b.rarity === 'Legendary').length, color: '#facc15' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <BarChart size={20} className="text-blue-500" />
          Rarity Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={40}>
              <XAxis dataKey="name" stroke={theme === 'dark' ? '#8b949e' : '#64748b'} fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke={theme === 'dark' ? '#8b949e' : '#64748b'} fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff', 
                  borderColor: theme === 'dark' ? '#30363d' : '#e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  color: theme === 'dark' ? '#c9d1d9' : '#0f172a',
                  padding: '12px'
                }}
                itemStyle={{ color: theme === 'dark' ? '#c9d1d9' : '#0f172a', fontWeight: 600, fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[12, 12, 12, 12]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <LayoutDashboard size={20} className="text-green-500" />
          Collection Progress
        </h3>
        <div className="flex-1 flex flex-col justify-center space-y-10">
          <div className="text-center">
             <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
               {Math.round((ownedCount / BADGES.length) * 100)}%
             </div>
             <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-xs">Completion Rate</p>
          </div>
          
          <div className="relative">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-3">
              <span className="text-gray-500 dark:text-gray-400">Total Badges</span>
              <span className="text-gray-900 dark:text-white">{ownedCount} / {BADGES.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${(ownedCount / BADGES.length) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/40 dark:border-white/10 flex items-center gap-4">
             <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
               <Trophy size={24} className="fill-current" />
             </div>
             <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Current Rank</div>
                <div className="font-bold text-gray-900 dark:text-white text-lg">
                  {ownedCount === 0 ? "Novice Explorer" : ownedCount < 4 ? "Badge Collector" : "Achievement Hunter"}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIChatModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I can help you with GitHub badges. Ask me about strategies, latest updates, or even to visualize a badge concept.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ModelType>(ModelType.SMART);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let responseMsg: ChatMessage = { role: 'model', text: '' };

    if (mode === ModelType.FAST) {
      const text = await askFastAI(userMsg.text);
      responseMsg.text = text;
    } else if (mode === ModelType.CREATIVE) {
      const imageUrl = await generateBadgeConcept(userMsg.text, '1K');
      if (imageUrl) {
        responseMsg.text = `Here is a concept design for "${userMsg.text}":`;
        responseMsg.images = [imageUrl];
      } else {
        responseMsg.text = "I couldn't generate an image at this time.";
      }
    } else {
      if (userMsg.text.toLowerCase().includes('new') || userMsg.text.toLowerCase().includes('update') || userMsg.text.toLowerCase().includes('what is')) {
        const { text, sources } = await askSearchAI(userMsg.text);
        responseMsg.text = text;
        responseMsg.sources = sources;
      } else if (userMsg.text.toLowerCase().includes('plan') || userMsg.text.toLowerCase().includes('strategy') || userMsg.text.toLowerCase().includes('how to')) {
        responseMsg.isThinking = true;
        setMessages(prev => [...prev, { role: 'model', text: 'Thinking...', isThinking: true }]);
        
        const text = await askReasoningAI(userMsg.text);
        
        setMessages(prev => prev.slice(0, -1)); 
        responseMsg = { role: 'model', text, isThinking: false };
      } else {
         const text = await askReasoningAI(userMsg.text);
         responseMsg.text = text;
      }
    }

    setMessages(prev => [...prev, responseMsg]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0d1117] border border-white/20 dark:border-white/10 w-full max-w-2xl h-[650px] rounded-[2rem] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 px-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-xl z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
               <Bot size={20} />
            </div>
            <div>
              <span className="block font-bold text-gray-900 dark:text-white">Badge Expert</span>
              <span className="block text-[10px] text-green-500 uppercase tracking-wider font-bold">Online</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-[#0d1117] scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm shadow-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-[#161b22] text-gray-700 dark:text-gray-300 rounded-tl-sm border border-gray-100 dark:border-white/5'
              }`}>
                {msg.isThinking && (
                  <div className="flex items-center space-x-2 text-gray-400 mb-2 text-xs font-medium italic">
                     <Zap size={12} className="animate-pulse text-yellow-500" />
                     <span>Deep thinking process engaged...</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {msg.images && msg.images.map((img, i) => (
                   <img key={i} src={img} alt="Generated badge" className="mt-4 rounded-2xl border border-gray-100 dark:border-white/10 max-w-full shadow-lg" />
                ))}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                          <ExternalLink size={10} className="mr-1" />
                          {src.title.substring(0, 20)}...
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && !messages[messages.length-1].isThinking && (
             <div className="flex justify-start">
               <div className="bg-white dark:bg-[#161b22] p-4 rounded-3xl rounded-tl-sm flex space-x-1.5 items-center border border-gray-100 dark:border-white/5">
                 <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-200"></div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-[#161b22] border-t border-gray-100 dark:border-white/5">
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
             {[
               { id: ModelType.FAST, icon: Zap, label: 'Fast', color: 'blue' },
               { id: ModelType.SMART, icon: Search, label: 'Smart Search', color: 'purple' },
               { id: ModelType.CREATIVE, icon: ImageIcon, label: 'Visual', color: 'pink' }
             ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center space-x-1.5 text-xs px-4 py-2 rounded-full border transition-all font-semibold ${
                    mode === m.id 
                    ? `bg-${m.color}-50 dark:bg-${m.color}-500/10 border-${m.color}-200 dark:border-${m.color}-500/30 text-${m.color}-600 dark:text-${m.color}-400` 
                    : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <m.icon size={12} /> <span>{m.label}</span>
                </button>
             ))}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === ModelType.CREATIVE ? "Describe a badge concept to generate..." : "Ask anything about badges..."
              }
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl pl-5 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white font-medium"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'roadmap' | 'stats'>('gallery');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  
  const [globalSearch, setGlobalSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'category'>('name');
  const [filterStatus, setFilterStatus] = useState<'all' | 'owned' | 'unowned'>('all');
  const [filterCategory, setFilterCategory] = useState<'All' | BadgeCategory>('All');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.localStorage && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as string;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchGithubStats = async (username: string) => {
    setLoadingUser(true);
    setErrorUser(null);
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found or API limit exceeded");
      const profile: UserProfile = await userRes.json();

      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      let totalStars = 0;
      if (reposRes.ok) {
        const repos = await reposRes.json();
        totalStars = Array.isArray(repos) ? repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0) : 0;
      }

      let mergedPRs = 0;
      try {
        const prRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged`);
        if (prRes.ok) {
           const prData = await prRes.json();
           mergedPRs = prData.total_count;
        }
      } catch (e) {
         console.warn("Search API failed", e);
      }

      const stats: UserStats = { totalStars, mergedPRs };
      setUser(profile);
      updateBadges(stats, profile);

    } catch (error) {
      console.error(error);
      setErrorUser(error instanceof Error ? error.message : "Failed to connect");
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const updateBadges = (stats: UserStats, profile: UserProfile) => {
    const updated = badges.map(badge => {
       const newBadge = { ...badge };
       
       if (badge.tiers) {
         const isStarstruck = badge.id === 'starstruck';
         const isPullShark = badge.id === 'pull-shark';
         const metric = isStarstruck ? stats.totalStars : (isPullShark ? stats.mergedPRs : 0);

         newBadge.tiers = badge.tiers.map(tier => {
            const match = tier.requirement.match(/\d+/);
            const target = match ? parseInt(match[0], 10) : 0;
            return {
              ...tier,
              target: target,
              progress: metric,
              unlocked: metric >= target
            };
         });
       }

       if (badge.id === 'arctic-code-vault') {
          newBadge.owned = new Date(profile.created_at) < new Date('2020-02-02');
       }

       if (newBadge.tiers) {
         newBadge.owned = newBadge.tiers.some(t => t.unlocked);
       }

       return newBadge;
    });
    setBadges(updated);
  };

  const handleManualToggle = (badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId) {
        const newOwned = !b.owned;
        const updated = { ...b, owned: newOwned };
        if (selectedBadge?.id === badgeId) setSelectedBadge(updated);
        return updated;
      }
      return b;
    }));
  };

  const filteredBadges = useMemo(() => {
    let result = [...badges];
    if (globalSearch) {
      const lower = globalSearch.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(lower) || 
        b.description.toLowerCase().includes(lower) ||
        b.howToEarn.toLowerCase().includes(lower)
      );
    }
    if (filterStatus === 'owned') {
      result = result.filter(b => b.owned || b.tiers?.some(t => t.unlocked));
    } else if (filterStatus === 'unowned') {
      result = result.filter(b => !b.owned && !b.tiers?.some(t => t.unlocked));
    }
    if (filterCategory !== 'All') {
      result = result.filter(b => b.category === filterCategory);
    }
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'rarity') {
        const order = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
        return order[b.rarity] - order[a.rarity];
      }
      return 0;
    });
    return result;
  }, [badges, globalSearch, sortBy, filterStatus, filterCategory]);

  const categories = ['All', ...new Set(BADGES.map(b => b.category))];

  return (
    <div className="min-h-screen bg-github-light-page dark:bg-github-darker text-github-light-text dark:text-github-text font-sans selection:bg-blue-500/30 selection:text-white transition-colors duration-500 overflow-x-hidden">
       {/* Ambient Global Background - Premium and Subtle */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
         <div className="absolute -top-[30%] -left-[10%] w-[800px] h-[800px] bg-purple-500/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob opacity-70"></div>
         <div className="absolute top-[20%] -right-[20%] w-[600px] h-[600px] bg-blue-500/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000 opacity-60"></div>
         <div className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] bg-pink-500/5 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000 opacity-50"></div>
      </div>

      <Hero 
        onConnect={fetchGithubStats} 
        loading={loadingUser} 
        user={user} 
        error={errorUser}
      />

      {/* Floating Command Bar */}
      <div className="sticky top-6 z-40 px-4 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 transition-all duration-300">
             
             {/* Navigation Pills */}
             <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl w-full md:w-auto">
               {['gallery', 'roadmap', 'stats'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${
                     activeTab === tab 
                     ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm' 
                     : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
             </div>

             <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/10 mx-2"></div>

             {/* Smart Search */}
             <div className="flex-1 w-full relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Filter badges by name, strategy..." 
                  className="w-full bg-transparent border-none text-sm font-medium text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-0 py-2.5 pl-9"
                />
             </div>

             <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/10 mx-2"></div>

             {/* Actions */}
             <div className="flex items-center gap-2 w-full md:w-auto">
               <button
                 onClick={toggleTheme}
                 className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
               >
                 {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               </button>
               <button 
                 onClick={() => setIsChatOpen(true)}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg"
               >
                 <MessageSquare size={18} />
                 <span>Ask Expert</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Context Filters */}
            <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar mask-gradient">
               {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                      filterCategory === cat 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    {cat === 'All' ? 'All Categories' : cat}
                  </button>
               ))}
               <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1"></div>
               <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
               >
                  <option value="name">Sort: Name</option>
                  <option value="rarity">Sort: Rarity</option>
               </select>
               <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
               >
                  <option value="all">All Status</option>
                  <option value="owned">Owned</option>
                  <option value="unowned">Missing</option>
               </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map(badge => (
                <BadgeCard 
                  key={badge.id} 
                  badge={badge} 
                  onClick={() => setSelectedBadge(badge)}
                />
              ))}
              {filteredBadges.length === 0 && (
                <div className="col-span-full py-20 text-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-gray-400">
                  <Search size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-bold">No badges found.</p>
                  <p className="text-sm">Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Your Quest Log</h2>
                <p className="text-gray-500 dark:text-gray-400">Follow this path to maximize your profile impact.</p>
             </div>

             <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30"></div>
                
                <div className="space-y-10">
                  {[
                    { title: 'Beginner Quest', diff: 'Easy', color: 'green', items: ['Create Account', 'Quickdraw', 'Pull Shark (Bronze)'] },
                    { title: 'Contributor Arc', diff: 'Medium', color: 'blue', items: ['Starstruck (Silver)', 'Pull Shark (Silver)', 'YOLO'] },
                    { title: 'Legendary Status', diff: 'Hard', color: 'purple', items: ['Starstruck (Gold)', 'Pull Shark (Gold)', 'Mars 2020'] }
                  ].map((quest, idx) => (
                    <div key={idx} className="relative pl-24 group">
                       <div className={`absolute left-4 top-0 w-8 h-8 rounded-full border-4 border-white dark:border-[#0d1117] flex items-center justify-center bg-${quest.color}-500 shadow-lg z-10`}>
                          <span className="text-white font-bold text-xs">{idx + 1}</span>
                       </div>
                       
                       <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">{quest.title}</h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-${quest.color}-100 dark:bg-${quest.color}-500/20 text-${quest.color}-600 dark:text-${quest.color}-300 uppercase tracking-widest`}>
                              {quest.diff}
                            </span>
                          </div>
                          <ul className="space-y-3">
                            {quest.items.map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                                <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-white/20 flex items-center justify-center">
                                  {user && <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-white/20"></div>}
                                </div>
                                {item}
                              </li>
                            ))}
                          </ul>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'stats' && <DashboardStats badges={badges} theme={theme} />}

      </main>

      <footer className="relative z-10 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0d1117] py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Designed for the GitHub Community. Not affiliated with GitHub.
          </p>
        </div>
      </footer>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <BadgeDetailModal 
        badge={selectedBadge} 
        isOpen={!!selectedBadge} 
        onClose={() => setSelectedBadge(null)} 
        onToggleOwned={handleManualToggle}
      />
    </div>
  );
};

export default App;
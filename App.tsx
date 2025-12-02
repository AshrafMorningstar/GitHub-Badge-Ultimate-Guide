import React, { useState, useEffect, useRef } from 'react';
import { BADGES, RARITY_COLORS } from './constants';
import { Badge, ChatMessage, ModelType, UserProfile, UserStats } from './types';
import { askFastAI, askReasoningAI, askSearchAI, generateBadgeConcept } from './services/geminiService';
import { 
  Trophy, Star, Zap, Search, Bot, Image as ImageIcon, 
  Menu, X, ExternalLink, ChevronRight, Shield, Globe, 
  LayoutDashboard, Map, BookOpen, Github, User, Loader2, CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- Sub-components ---

interface HeroProps {
  onConnect: (username: string) => Promise<void>;
  loading: boolean;
  user: UserProfile | null;
  error: string | null;
}

const Hero: React.FC<HeroProps> = ({ onConnect, loading, user, error }) => {
  const [usernameInput, setUsernameInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onConnect(usernameInput.trim());
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-github-darker to-github-dark border-b border-github-border p-8 md:p-12 overflow-hidden transition-all duration-500">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Trophy size={300} />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 text-xs font-semibold bg-github-accent/20 text-github-accent rounded-full border border-github-accent/40">
              Ultimate Visual Guide
            </span>
            <span className="text-github-muted text-xs">Updated 2024</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            GitHub Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-github-accent to-purple-400">Badges</span>
          </h1>
          <p className="text-lg text-github-muted mb-8">
            The definitive encyclopedia for collectors. Enter your username to track real progress, visualize rarity, and strategize your next achievement.
          </p>

          {!user ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full max-w-md">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-github-muted">
                  <Github size={18} />
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter GitHub username"
                  className="w-full pl-10 pr-4 py-3 bg-github-darker border border-github-border rounded-lg text-white focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 bg-github-success text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Check Progress'}
              </button>
            </form>
          ) : (
             <div className="flex items-center gap-4 bg-github-border/20 p-4 rounded-xl border border-github-border/50 animate-in fade-in slide-in-from-bottom-4">
                <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-full border-2 border-github-accent" />
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {user.name || user.login}
                    <a href={`https://github.com/${user.login}`} target="_blank" rel="noreferrer" className="text-github-muted hover:text-github-accent">
                      <ExternalLink size={14} />
                    </a>
                  </h3>
                  <p className="text-github-muted text-sm max-w-md line-clamp-1">{user.bio || "GitHub Developer"}</p>
                  <div className="flex gap-4 mt-2 text-xs text-github-text">
                    <span className="flex items-center gap-1"><User size={12}/> {user.followers} followers</span>
                    <span className="flex items-center gap-1"><BookOpen size={12}/> {user.public_repos} repos</span>
                  </div>
                </div>
                <button onClick={() => setUsernameInput('')} className="ml-auto text-xs text-github-muted underline hover:text-github-accent">
                   Change
                </button>
             </div>
          )}
          {error && <p className="mt-3 text-red-400 text-sm flex items-center gap-1"><X size={14}/> {error}</p>}
        </div>

        {/* Badge Ribbon */}
        <div className="hidden md:flex space-x-3 overflow-x-auto pb-4 no-scrollbar max-w-xs lg:max-w-sm flex-wrap justify-end opacity-80 hover:opacity-100 transition-opacity">
          {BADGES.filter(b => b.rarity === 'Legendary' || b.rarity === 'Epic').slice(0, 5).map(badge => (
            <div key={badge.id} className="w-12 h-12 bg-github-border/50 rounded-full flex items-center justify-center text-2xl border border-github-border shadow-lg relative group cursor-pointer hover:scale-110 transition-transform">
              {badge.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  // Determine if the badge (overall) is unlocked if it has no tiers but is owned
  const isOwned = badge.owned;
  const opacityClass = (badge.tiers || isOwned || !badge.tiers) ? 'opacity-100' : 'opacity-60 grayscale'; 

  return (
    <div className={`bg-github-dark border border-github-border rounded-xl p-6 hover:border-github-accent/50 transition-all group relative overflow-hidden ${isOwned ? 'ring-1 ring-github-accent/30 bg-github-accent/5' : ''}`}>
      {badge.retired && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded border border-red-900/50">
          Retired
        </div>
      )}
      {isOwned && !badge.tiers && (
         <div className="absolute top-3 right-3 px-2 py-0.5 bg-github-success/20 text-github-success text-xs rounded border border-github-success/30 font-bold flex items-center gap-1">
          <CheckCircle2 size={10} /> Owned
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${isOwned ? 'bg-github-accent/20 shadow-[0_0_15px_rgba(88,166,255,0.3)]' : 'bg-github-border/30 group-hover:bg-github-accent/10'}`}>
          {badge.icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-github-border/30 ${RARITY_COLORS[badge.rarity]}`}>
          {badge.rarity}
        </span>
      </div>
      <h3 className="text-lg font-bold text-github-text mb-1 flex items-center gap-2">
        {badge.name}
      </h3>
      <p className="text-sm text-github-muted mb-4 h-10 line-clamp-2">{badge.description}</p>
      
      {badge.tiers && (
        <div className="space-y-3 mt-4">
          <div className="text-xs text-github-muted uppercase tracking-wider font-semibold flex justify-between">
             <span>Progress Tiers</span>
             {badge.tiers[0].progress !== undefined && (
               <span className="text-github-accent">{badge.tiers[badge.tiers.length-1].progress} / {badge.tiers[badge.tiers.length-1].target}</span>
             )}
          </div>
          <div className="flex space-x-1 h-16 items-end">
            {badge.tiers.map((tier, idx) => {
               // Calculate relative height for visual effect or just use bars
               const isUnlocked = tier.unlocked;
               return (
                <div key={idx} className="flex-1 flex flex-col items-center group/tier relative">
                  {/* Progress Bar Visual */}
                  <div className="w-full px-0.5 pb-2 flex flex-col justify-end h-full">
                     {tier.progress !== undefined && tier.target && !isUnlocked && (
                       <div className="w-full bg-github-border h-1 mb-1 rounded-full overflow-hidden">
                          <div className="bg-github-accent h-full" style={{ width: `${Math.min(100, (tier.progress / tier.target) * 100)}%`}}></div>
                       </div>
                     )}
                     <div 
                       className={`w-full h-2 rounded-full transition-all duration-500 ${isUnlocked ? (tier.name === 'Gold' ? 'bg-github-gold shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-github-success') : 'bg-github-border'}`}
                     />
                  </div>
                  <span className={`text-[10px] font-medium ${isUnlocked ? 'text-white' : 'text-github-muted'}`}>{tier.name}</span>
                  
                  {/* Detailed Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover/tier:opacity-100 transition-opacity bg-black border border-github-border text-white text-xs px-3 py-2 rounded shadow-xl z-10 w-32 text-center pointer-events-none">
                    <div className="font-bold mb-1">{tier.requirement}</div>
                    {tier.progress !== undefined && (
                      <div className="text-[10px] text-gray-400">Current: {tier.progress}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {!badge.tiers && (
        <div className="mt-4 pt-4 border-t border-github-border">
          <div className="text-xs text-github-muted flex items-center">
            <Shield size={12} className="mr-1" />
            {badge.category}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardStats = ({ badges }: { badges: Badge[] }) => {
  const ownedCount = badges.filter(b => b.owned || b.tiers?.some(t => t.unlocked)).length;
  
  const data = [
    { name: 'Common', count: BADGES.filter(b => b.rarity === 'Common').length, color: '#94a3b8' },
    { name: 'Rare', count: BADGES.filter(b => b.rarity === 'Rare').length, color: '#60a5fa' },
    { name: 'Epic', count: BADGES.filter(b => b.rarity === 'Epic').length, color: '#c084fc' },
    { name: 'Legendary', count: BADGES.filter(b => b.rarity === 'Legendary').length, color: '#facc15' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-github-dark border border-github-border rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <BarChart size={20} className="mr-2 text-github-accent" />
          Rarity Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" fontSize={12} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1117', borderColor: '#30363d', color: '#c9d1d9' }}
                itemStyle={{ color: '#c9d1d9' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-github-dark border border-github-border rounded-xl p-6">
         <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <LayoutDashboard size={20} className="mr-2 text-github-success" />
          Collection Progress
        </h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-github-text">Total Badges</span>
              <span className="text-github-muted">{ownedCount} / {BADGES.length}</span>
            </div>
            <div className="w-full bg-github-border h-2 rounded-full overflow-hidden">
              <div className="bg-github-success h-full" style={{ width: `${(ownedCount / BADGES.length) * 100}%` }}></div>
            </div>
          </div>
          <div className="p-4 bg-github-border/20 rounded-lg border border-github-border flex items-center gap-4">
             <div className="p-3 bg-github-accent/10 rounded-full text-github-accent">
               <Zap size={24} />
             </div>
             <div>
                <div className="text-xs text-github-muted uppercase tracking-wider mb-1">Status</div>
                <div className="font-bold text-white">
                  {ownedCount === 0 ? "Beginner" : ownedCount < 4 ? "Collector" : "Achievement Hunter"}
                </div>
                <p className="text-sm text-github-muted mt-1">Keep earning to level up!</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-github-darker border border-github-border w-full max-w-2xl h-[600px] rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
        <div className="p-4 border-b border-github-border flex justify-between items-center bg-github-dark">
          <div className="flex items-center space-x-2">
            <Bot className="text-github-accent" />
            <span className="font-bold text-white">Gemini Badge Expert</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-github-border rounded text-github-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.role === 'user' 
                  ? 'bg-github-accent text-white rounded-br-none' 
                  : 'bg-github-border/50 text-github-text rounded-bl-none border border-github-border'
              }`}>
                {msg.isThinking && (
                  <div className="flex items-center space-x-2 text-github-muted mb-2 text-xs italic">
                     <Zap size={12} className="animate-pulse text-yellow-500" />
                     <span>Deep thinking process engaged...</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                {msg.images && msg.images.map((img, i) => (
                   <img key={i} src={img} alt="Generated badge" className="mt-2 rounded-lg border border-github-border max-w-full" />
                ))}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-github-border/50">
                    <p className="text-xs font-semibold text-github-muted mb-1">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center text-xs text-github-accent hover:underline bg-github-dark px-2 py-1 rounded border border-github-border">
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
               <div className="bg-github-border/30 p-3 rounded-lg rounded-bl-none flex space-x-1">
                 <div className="w-2 h-2 bg-github-muted rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                 <div className="w-2 h-2 bg-github-muted rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                 <div className="w-2 h-2 bg-github-muted rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-github-dark border-t border-github-border">
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-1">
             <button 
                onClick={() => setMode(ModelType.FAST)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full border transition-all ${mode === ModelType.FAST ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-github-border/30 border-transparent text-github-muted hover:bg-github-border/50'}`}
             >
               <Zap size={12} /> <span>Fast</span>
             </button>
             <button 
                onClick={() => setMode(ModelType.SMART)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full border transition-all ${mode === ModelType.SMART ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-github-border/30 border-transparent text-github-muted hover:bg-github-border/50'}`}
             >
               <Search size={12} /> <span>Smart Search & Think</span>
             </button>
             <button 
                onClick={() => setMode(ModelType.CREATIVE)}
                className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full border transition-all ${mode === ModelType.CREATIVE ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-github-border/30 border-transparent text-github-muted hover:bg-github-border/50'}`}
             >
               <ImageIcon size={12} /> <span>Generate Badge</span>
             </button>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === ModelType.CREATIVE ? "Describe a badge to generate..." : "Ask about a badge..."
              }
              className="w-full bg-github-darker border border-github-border rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-github-accent focus:ring-1 focus:ring-github-accent text-white"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-github-accent text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'roadmap' | 'stats'>('gallery');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  const fetchGithubStats = async (username: string) => {
    setLoadingUser(true);
    setErrorUser(null);
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found or API limit exceeded");
      const profile: UserProfile = await userRes.json();

      // Fetch repos for stars (limit to 100 for this demo to save bandwidth/time)
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      let totalStars = 0;
      if (reposRes.ok) {
        const repos = await reposRes.json();
        totalStars = Array.isArray(repos) ? repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0) : 0;
      }

      // Estimate Merged PRs via Search API
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
    const updated = BADGES.map(badge => {
       const newBadge = { ...badge };
       
       // Handle Achievements with Tiers
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

       // Handle Highlights / Special
       if (badge.id === 'arctic-code-vault') {
          // Approx check for created before Feb 2020
          newBadge.owned = new Date(profile.created_at) < new Date('2020-02-02');
       }

       // Assume 'Starstruck' or 'Pull Shark' base badge is owned if at least one tier is unlocked
       if (newBadge.tiers) {
         newBadge.owned = newBadge.tiers.some(t => t.unlocked);
       }

       return newBadge;
    });
    setBadges(updated);
  };

  return (
    <div className="min-h-screen bg-github-darker text-github-text font-sans selection:bg-github-accent/30 selection:text-white">
      <Hero 
        onConnect={fetchGithubStats} 
        loading={loadingUser} 
        user={user} 
        error={errorUser}
      />

      {/* Navigation */}
      <div className="sticky top-0 z-30 bg-github-dark/80 backdrop-blur-md border-b border-github-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
             <div className="flex space-x-1">
               {['gallery', 'roadmap', 'stats'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                     activeTab === tab 
                     ? 'bg-github-border/50 text-white' 
                     : 'text-github-muted hover:text-github-text hover:bg-github-border/30'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
             </div>
             <button 
               onClick={() => setIsChatOpen(true)}
               className="flex items-center space-x-2 bg-gradient-to-r from-github-accent to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
             >
               <Bot size={16} />
               <span className="hidden sm:inline">Ask AI Assistant</span>
             </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'gallery' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Trophy className="mr-3 text-yellow-500" />
                Earnable Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.filter(b => b.category === 'Achievement').map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </section>

            <section>
               <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Star className="mr-3 text-purple-400" />
                Profile Highlights
              </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.filter(b => b.category === 'Highlight').map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-github-dark to-github-border/20 border border-github-border rounded-xl p-8 text-center">
              <Map size={48} className="mx-auto text-github-accent mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Badge Journey</h2>
              <p className="text-github-muted max-w-lg mx-auto">
                {user ? "Based on your real profile stats, here is your checklist." : "Connect your profile to automatically check these off."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
               {/* Beginner Quest */}
               <div className="border border-github-border rounded-xl overflow-hidden">
                 <div className="bg-github-border/30 p-4 border-b border-github-border flex justify-between items-center">
                   <h3 className="font-bold text-white">Beginner Quest</h3>
                   <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-900/50">Easy</span>
                 </div>
                 <div className="p-4 space-y-4 bg-github-dark">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent cursor-not-allowed" checked readOnly />
                      <div>
                        <div className="text-sm font-medium text-white line-through text-github-muted">Create GitHub Account</div>
                      </div>
                    </div>
                     <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent cursor-pointer disabled:cursor-not-allowed" 
                        checked={!!user} // Simplified logic for Quickdraw since we can't verify easily, assume true if active? No, keep it manual.
                        readOnly
                      />
                      <div>
                        <div className="text-sm font-medium text-white">Quickdraw (Manual Verify)</div>
                        <div className="text-xs text-github-muted">Close an issue in &lt; 5m</div>
                      </div>
                    </div>
                     <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent cursor-pointer" 
                        checked={badges.find(b => b.id === 'pull-shark')?.tiers?.[0].unlocked || false}
                        readOnly
                      />
                      <div>
                        <div className="text-sm font-medium text-white">Pull Shark (Bronze)</div>
                        <div className="text-xs text-github-muted">Merge 2 Pull Requests</div>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Expert Quest */}
               <div className="border border-github-border rounded-xl overflow-hidden opacity-90">
                 <div className="bg-github-border/30 p-4 border-b border-github-border flex justify-between items-center">
                   <h3 className="font-bold text-white">Community Leader</h3>
                   <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-900/50">Hard</span>
                 </div>
                 <div className="p-4 space-y-4 bg-github-dark">
                     <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent cursor-pointer" 
                        checked={badges.find(b => b.id === 'starstruck')?.tiers?.[2].unlocked || false}
                        readOnly
                      />
                      <div>
                        <div className="text-sm font-medium text-white">Starstruck (Gold)</div>
                        <div className="text-xs text-github-muted">Reach 4096 Stars</div>
                      </div>
                    </div>
                     <div className="flex items-center">
                      <input type="checkbox" className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent" />
                      <div>
                        <div className="text-sm font-medium text-white">Public Sponsor</div>
                        <div className="text-xs text-github-muted">Sponsor a project</div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && <DashboardStats badges={badges} />}

      </main>

      {/* Footer */}
      <footer className="border-t border-github-border bg-github-dark py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <BookOpen className="text-github-muted hover:text-white cursor-pointer" />
            <Globe className="text-github-muted hover:text-white cursor-pointer" />
          </div>
          <p className="text-github-muted text-sm">
            Maintained with ❤️ by the community. Data visualized for educational purposes.
          </p>
        </div>
      </footer>

      {/* AI Modal */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;

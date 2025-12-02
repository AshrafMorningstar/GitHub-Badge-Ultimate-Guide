import React, { useState, useEffect, useRef } from 'react';
import { BADGES, RARITY_COLORS } from './constants';
import { Badge, ChatMessage, ModelType } from './types';
import { askFastAI, askReasoningAI, askSearchAI, generateBadgeConcept } from './services/geminiService';
import { 
  Trophy, Star, Zap, Search, Bot, Image as ImageIcon, 
  Menu, X, ExternalLink, ChevronRight, Shield, Globe, 
  LayoutDashboard, Map, BookOpen
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// --- Sub-components (in defined scope to avoid pitfalls) ---

const Hero = () => (
  <div className="relative bg-gradient-to-r from-github-darker to-github-dark border-b border-github-border p-8 md:p-12 overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
      <Trophy size={300} />
    </div>
    <div className="relative z-10 max-w-5xl mx-auto">
      <div className="flex items-center space-x-2 mb-4">
        <span className="px-3 py-1 text-xs font-semibold bg-github-accent/20 text-github-accent rounded-full border border-github-accent/40">
          Ultimate Visual Guide
        </span>
        <span className="text-github-muted text-xs">Updated 2024</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
        GitHub Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-github-accent to-purple-400">Badges</span>
      </h1>
      <p className="text-lg text-github-muted max-w-2xl mb-8">
        The definitive encyclopedia for collectors. Track progress, visualize rarity, and use AI to strategize your next achievement.
      </p>
      
      {/* Badge Ribbon */}
      <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
        {BADGES.filter(b => b.rarity === 'Legendary' || b.rarity === 'Epic').map(badge => (
          <div key={badge.id} className="flex-shrink-0 w-16 h-16 bg-github-border/50 rounded-full flex items-center justify-center text-3xl border border-github-border shadow-lg relative group cursor-pointer hover:scale-110 transition-transform">
            {badge.icon}
            <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap z-20">
              {badge.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  return (
    <div className="bg-github-dark border border-github-border rounded-xl p-6 hover:border-github-accent/50 transition-colors group relative overflow-hidden">
      {badge.retired && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded border border-red-900/50">
          Retired
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-github-border/30 flex items-center justify-center text-2xl group-hover:bg-github-accent/10 transition-colors">
          {badge.icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-github-border/30 ${RARITY_COLORS[badge.rarity]}`}>
          {badge.rarity}
        </span>
      </div>
      <h3 className="text-lg font-bold text-github-text mb-1">{badge.name}</h3>
      <p className="text-sm text-github-muted mb-4 h-10 line-clamp-2">{badge.description}</p>
      
      {badge.tiers && (
        <div className="space-y-2 mt-4">
          <div className="text-xs text-github-muted uppercase tracking-wider font-semibold">Progress Tiers</div>
          <div className="flex space-x-1">
            {badge.tiers.map((tier, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group/tier relative">
                <div 
                  className={`w-full h-1.5 rounded-full mb-1 ${tier.unlocked ? 'bg-github-success' : 'bg-github-border'}`}
                />
                <span className="text-[10px] text-github-muted">{tier.name}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/tier:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none">
                  {tier.requirement}
                </div>
              </div>
            ))}
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

const DashboardStats = () => {
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
              <span className="text-github-muted">7 / {BADGES.length}</span>
            </div>
            <div className="w-full bg-github-border h-2 rounded-full overflow-hidden">
              <div className="bg-github-success h-full" style={{ width: `${(7 / BADGES.length) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-github-text">Achievements</span>
              <span className="text-github-muted">4 / 4</span>
            </div>
            <div className="w-full bg-github-border h-2 rounded-full overflow-hidden">
              <div className="bg-github-accent h-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-github-border/20 rounded-lg border border-github-border">
            <div className="text-xs text-github-muted uppercase tracking-wider mb-1">Next Goal</div>
            <div className="font-bold text-white flex items-center">
              <span className="mr-2">YOLO Badge</span>
              <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/40">Epic</span>
            </div>
            <p className="text-sm text-github-muted mt-1">Merge a PR without review.</p>
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
      // Smart/Default Mode - Decide between Search or Reasoning
      if (userMsg.text.toLowerCase().includes('new') || userMsg.text.toLowerCase().includes('update') || userMsg.text.toLowerCase().includes('what is')) {
        const { text, sources } = await askSearchAI(userMsg.text);
        responseMsg.text = text;
        responseMsg.sources = sources;
      } else if (userMsg.text.toLowerCase().includes('plan') || userMsg.text.toLowerCase().includes('strategy') || userMsg.text.toLowerCase().includes('how to')) {
        responseMsg.isThinking = true;
        // Optimization: Show thinking state in UI before response comes back
        setMessages(prev => [...prev, { role: 'model', text: 'Thinking...', isThinking: true }]);
        
        const text = await askReasoningAI(userMsg.text);
        
        // Remove the temporary thinking message and add real one
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
        {/* Header */}
        <div className="p-4 border-b border-github-border flex justify-between items-center bg-github-dark">
          <div className="flex items-center space-x-2">
            <Bot className="text-github-accent" />
            <span className="font-bold text-white">Gemini Badge Expert</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-github-border rounded text-github-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
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

        {/* Input Area */}
        <div className="p-4 bg-github-dark border-t border-github-border">
          {/* Mode Toggles */}
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

  return (
    <div className="min-h-screen bg-github-darker text-github-text font-sans selection:bg-github-accent/30 selection:text-white">
      <Hero />

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
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Trophy className="mr-3 text-yellow-500" />
                Earnable Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BADGES.filter(b => b.category === 'Achievement').map(badge => (
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
                {BADGES.filter(b => b.category === 'Highlight').map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-github-dark to-github-border/20 border border-github-border rounded-xl p-8 text-center">
              <Map size={48} className="mx-auto text-github-accent mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your Badge Journey</h2>
              <p className="text-github-muted max-w-lg mx-auto">
                Follow this roadmap to maximize your profile's visual appeal.
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
                      <input type="checkbox" className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent" checked readOnly />
                      <div>
                        <div className="text-sm font-medium text-white line-through text-github-muted">Create GitHub Account</div>
                      </div>
                    </div>
                     <div className="flex items-center">
                      <input type="checkbox" className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent" />
                      <div>
                        <div className="text-sm font-medium text-white">Quickdraw</div>
                        <div className="text-xs text-github-muted">Close an issue in &lt; 5m</div>
                      </div>
                    </div>
                     <div className="flex items-center">
                      <input type="checkbox" className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent" />
                      <div>
                        <div className="text-sm font-medium text-white">Pull Shark (Bronze)</div>
                        <div className="text-xs text-github-muted">Merge 2 Pull Requests</div>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Expert Quest */}
               <div className="border border-github-border rounded-xl overflow-hidden opacity-75">
                 <div className="bg-github-border/30 p-4 border-b border-github-border flex justify-between items-center">
                   <h3 className="font-bold text-white">Community Leader</h3>
                   <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-900/50">Hard</span>
                 </div>
                 <div className="p-4 space-y-4 bg-github-dark">
                     <div className="flex items-center">
                      <input type="checkbox" className="mr-3 w-5 h-5 rounded border-github-border bg-github-darker accent-github-accent" />
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

        {activeTab === 'stats' && <DashboardStats />}

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
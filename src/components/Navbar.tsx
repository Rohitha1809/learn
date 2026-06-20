import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, Moon, Search, LogOut, ChevronDown, User, ShieldAlert, 
  BookOpen, Layers, Key, Mail, Lock, UserPlus, Sparkles, AlertCircle, HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, currentView, setCurrentView, logout, login, registerUser, theme, setTheme 
  } = useApp();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Auth Form stats
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'learner' | 'author' | 'admin'>('learner');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Quick personas selector to assist quick evaluation
  const personas = [
    { name: 'Alex Rivet (Author)', email: 'alex@learndcrack.com' },
    { name: 'Dr. Sarah Chen (Author)', email: 'sarah@learndcrack.com' },
    { name: 'Marcus Volt (Student)', email: 'marcus@learndcrack.com' },
    { name: 'Elena Ross (Admin)', email: 'elena@learndcrack.com' }
  ];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setAuthModalOpen(false);
          setCurrentView('dashboard');
        } else {
          setAuthError(res.error || 'Authentication rejected');
        }
      } else if (authMode === 'register') {
        const res = await registerUser({
          name,
          email,
          password,
          role,
          skills: role === 'author' ? ['Coaching', 'Node.js'] : ['Learning'],
          learning_interests: ['Web Development', 'AI & Machine Learning']
        });
        if (res.success) {
          setAuthModalOpen(false);
          setCurrentView('dashboard');
        } else {
          setAuthError(res.error || 'Could not instantiate account');
        }
      } else {
        // Forgot Password Sim
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setAuthSuccess(data.message || 'Dispatched reset instruction link.');
        } else {
          setAuthError(data.error || 'Account not registered');
        }
      }
    } catch (err: any) {
      setAuthError('Connection anomaly occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const loadQuickPersona = async (pEmail: string) => {
    setAuthError('');
    setSubmitting(true);
    const res = await login(pEmail, 'password123');
    setSubmitting(false);
    if (res.success) {
      setDropdownOpen(false);
      setCurrentView('dashboard');
    }
  };

  const navItemClass = (view: string) => {
    const isActive = currentView === view;
    if (theme === 'light') {
      return `font-sans text-[15px] font-semibold pb-1 cursor-pointer transition-colors ${
        isActive ? 'text-[#16a34a] border-b-2 border-[#16a34a]' : 'text-slate-600 hover:text-slate-900'
      }`;
    }
    return `font-sans text-[15px] font-semibold pb-1 cursor-pointer transition-colors ${
      isActive ? 'text-[#4be277] border-b-2 border-[#4be277]' : 'text-[#bccbb9] hover:text-white'
    }`;
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 border-b shadow-md backdrop-blur-lg ${
        theme === 'light' 
          ? 'bg-white/90 border-slate-200 text-slate-800' 
          : 'bg-[#0b1326]/90 border-[#3d4a3d]/20 text-white'
      }`}>
        <div className="flex justify-between items-center h-16 px-4 md:px-12 max-w-7xl mx-auto">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentView('home'); }} 
            className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
          >
            <Sparkles className={`w-6 h-6 ${theme === 'light' ? 'text-green-600' : 'text-[#4be277]'}`} />
            <span className={`font-display text-2xl font-bold tracking-tight ${
              theme === 'light' ? 'text-slate-900' : 'text-[#4be277]'
            }`}>
              LearnDrack <span className="text-xs font-mono px-1.5 py-0.5 rounded ml-1 bg-green-500/15 font-normal">relational V2</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <button onClick={() => setCurrentView('home')} className={navItemClass('home')}>
              Home
            </button>
            <button onClick={() => setCurrentView('domains')} className={navItemClass('domains')}>
              Domains
            </button>
            
            {currentUser && (
              <button onClick={() => setCurrentView('dashboard')} className={navItemClass('dashboard')}>
                My Dashboard
              </button>
            )}

            {currentUser && (currentUser.role === 'author' || currentUser.role === 'admin') && (
              <button onClick={() => setCurrentView('create')} className={navItemClass('create')}>
                Creator Dashboard
              </button>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button onClick={() => setCurrentView('admin')} className={navItemClass('admin')}>
                Admin Console
              </button>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Dark & Light mode switcher */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg border cursor-pointer hover:scale-105 transition-all ${
                theme === 'light' 
                  ? 'border-slate-200 text-slate-700 bg-slate-50' 
                  : 'border-slate-800 text-[#bccbb9] bg-slate-900/40'
              }`}
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setCurrentView('domains')} 
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                theme === 'light' ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-800 text-[#bccbb9]'
              }`}
              title="Search and Categories"
            >
              <Search className="w-4 h-4" />
            </button>

            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 border p-0.5 pr-2.5 rounded-full transition-all cursor-pointer active:scale-95 ${
                    theme === 'light'
                      ? 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                      : 'border-[#4be277]/20 bg-[#131b2e]/60 hover:border-[#4be277]/40'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full overflow-hidden border ${
                    theme === 'light' ? 'border-green-600' : 'border-[#4be277]/50'
                  }`}>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`hidden sm:inline font-sans font-semibold text-xs ${
                    theme === 'light' ? 'text-slate-800' : 'text-[#dae2fd]'
                  }`}>
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className={`absolute right-0 mt-3 w-72 rounded-xl border p-3.5 shadow-2xl z-50 text-left animate-fade-in ${
                    theme === 'light' 
                      ? 'bg-white border-slate-200 text-slate-800' 
                      : 'bg-[#131b2e] border-[#3d4a3d]/40 text-slate-100'
                  }`}>
                    <div className="px-2 pb-3 mb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                      <p className="font-display font-bold text-sm">{currentUser.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[9px] bg-green-500/20 text-green-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {currentUser.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{currentUser.xp} XP</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1.5">{currentUser.email}</p>
                    </div>

                    {/* Quick switch evaluation matrix */}
                    <div className={`px-2.5 py-2 mb-2 rounded ${
                      theme === 'light' ? 'bg-slate-100' : 'bg-[#0b1326]/70'
                    }`}>
                      <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 mb-1.5">
                        Relational Persona Switcher:
                      </p>
                      <div className="flex flex-col gap-1">
                        {personas.map((per) => (
                          <button
                            key={per.email}
                            disabled={submitting}
                            onClick={() => loadQuickPersona(per.email)}
                            className={`text-left text-xs p-1 rounded transition-colors block w-full truncate ${
                              currentUser.email === per.email 
                                ? 'bg-green-500/10 text-green-600 font-semibold' 
                                : 'text-slate-400 hover:text-green-500 block hover:bg-green-500/5'
                            }`}
                          >
                            {per.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer text-xs font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out (Clear JWT)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => {
                  setCurrentView('auth');
                }}
                className={`text-xs px-4 py-2 font-semibold rounded-lg font-sans shadow cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all ${
                  theme === 'light'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-[#4be277] text-slate-900 hover:bg-[#3cd066]'
                }`}
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Relational Authentication / JWT Setup Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative animate-fade-in ${
            theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-800 text-white'
          }`}>
            {/* Close Button */}
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 font-bold text-lg"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-display font-bold text-xl">
                {authMode === 'login' && 'Authorize JWT Session'}
                {authMode === 'register' && 'Configure New Relational User'}
                {authMode === 'forgot' && 'Reset My Password'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'login' && 'Enter credential tokens and secure details'}
                {authMode === 'register' && 'Register and choose your platform authority tier'}
                {authMode === 'forgot' && 'Simulate recovery dispatch instructions'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg flex items-center gap-2 text-xs text-red-500">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 bg-green-500/10 border border-green-500/30 p-2.5 rounded-lg flex items-center gap-2 text-xs text-green-500">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex Rivet/Student"
                      className={`w-full py-2 pl-10 pr-3 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className={`w-full py-2 pl-10 pr-3 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full py-2 pl-10 pr-3 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
                      }`}
                    />
                  </div>
                </div>
              )}

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 font-display">Authority Tier (Role)</label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {(['learner', 'author', 'admin'] as const).map((rTier) => (
                      <button
                        key={rTier}
                        type="button"
                        onClick={() => setRole(rTier)}
                        className={`py-2 text-xs border rounded-lg font-bold capitalize transition-all cursor-pointer ${
                          role === rTier 
                            ? 'bg-green-500/25 border-green-500 text-green-500' 
                            : theme === 'light' ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {rTier === 'learner' ? 'Student' : rTier === 'author' ? 'Creator' : 'Admin'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-slate-950 bg-[#4be277] hover:bg-[#3cd066] font-display font-bold text-sm cursor-pointer shadow transition-all disabled:opacity-50"
              >
                {submitting ? 'Connecting...' : (
                  authMode === 'login' ? 'Authenticate Securely' : authMode === 'register' ? 'Register Account' : 'Dispatch Discovery Link'
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-200/20 text-center flex flex-col gap-1.5 text-xs">
              {authMode === 'login' && (
                <>
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                    className="text-[#4be277] hover:underline cursor-pointer"
                  >
                    Don't have an account? Sign Up
                  </button>
                  <button 
                    onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }}
                    className="text-slate-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </>
              )}

              {authMode === 'register' && (
                <button 
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-[#4be277] hover:underline cursor-pointer"
                >
                  Already have an account? Sign In
                </button>
              )}

              {authMode === 'forgot' && (
                <button 
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                  className="text-[#4be277] hover:underline cursor-pointer"
                >
                  Return to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

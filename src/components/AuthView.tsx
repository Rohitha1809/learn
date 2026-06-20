import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, Lock, User as UserIcon, Shield, Sparkles, AlertCircle, 
  CheckCircle2, ArrowLeft, ArrowRight, BookOpen, Key, Award, Terminal
} from 'lucide-react';

export default function AuthView() {
  const { 
    login, registerUser, setCurrentView, theme 
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'learner' | 'author' | 'admin'>('learner');
  
  // State indicators
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg('Session authenticated. Access granted!');
          setTimeout(() => {
            setCurrentView('dashboard');
          }, 800);
        } else {
          setErrorMsg(res.error || 'The entered token credentials could not be verified.');
        }
      } else if (authMode === 'register') {
        const res = await registerUser({
          name,
          email,
          password,
          role,
          skills: role === 'author' ? ['Syllabus Creator', 'Backend Systems'] : ['Algorithm Design'],
          learning_interests: ['Distributed Databases', 'Fault Tolerance Masterclass']
        });
        if (res.success) {
          setSuccessMsg('Account created successfully! Welcome to LearnDrack.');
          setTimeout(() => {
            setCurrentView('dashboard');
          }, 800);
        } else {
          setErrorMsg(res.error || 'Failed to initialize account registry.');
        }
      } else {
        // Forgot password simulation
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok) {
          setSuccessMsg(data.message || 'If that email exists, an instruction link has been dispatched.');
        } else {
          setErrorMsg(data.error || 'An account with that email does not exist.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('A network timeout or validation discrepancy occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`pt-24 pb-20 min-h-screen flex items-center justify-center transition-all ${
      theme === 'light' ? 'bg-[#f8fafc]' : 'bg-[#070d19]'
    }`}>
      <div className="w-full max-w-5xl px-4 md:px-8">
        
        {/* Back Link */}
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex items-center gap-2 mb-6 cursor-pointer font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
            theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-[#4be277]" />
          Back to Directory
        </button>

        {/* Master Card Split Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border shadow-2xl ${
          theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#11192e] border-slate-800'
        }`}>
          
          {/* Left panel: Product features description (5 Columns) */}
          <div className="lg:col-span-5 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#0c1322] via-[#111c33] to-[#080e1a] border-r border-slate-8e0">
            {/* Ambient Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(75,226,119,0.06)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-60 h-60 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                LearnDrack Gateway v2.0
              </div>

              <div>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  High-yield systems <span className="text-[#4be277]">architecting</span> pathways.
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mt-3 leading-relaxed">
                  Gain specialized certification, access advanced fault-tolerance syllabus criteria, and chat with customized Elena Volkov AI technical mentors.
                </p>
              </div>

              {/* Benefit pillars */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-white text-left">Enterprise Curriculums</h4>
                    <p className="text-[11px] text-slate-400 text-left mt-0.5">Explore modular course chapters outlining Paxos, Raft, and container network metrics.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-white text-left">AI evaluation practice</h4>
                    <p className="text-[11px] text-slate-405 text-left mt-0.5">Generate customized lesson tests dynamically and log your performance criteria.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-white text-left">Verified Authority Tiers</h4>
                    <p className="text-[11px] text-slate-400 text-left mt-0.5">Toggle student, creator (CMS), or administrator profiles with one login token.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 text-left relative z-10">
              <p className="text-[11px] text-slate-500 font-mono">
                LearnDrack Relational V2. Secure JWT tokens signed dynamically.
              </p>
            </div>
          </div>

          {/* Right panel: Active credentials form (7 Columns) */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center text-left">
            
            <div className="mb-6">
              <h3 className={`font-sans text-2xl font-extrabold tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {authMode === 'login' && 'Sign into your account'}
                {authMode === 'register' && 'Assemble secure account profile'}
                {authMode === 'forgot' && 'Account Password Recovery'}
              </h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                {authMode === 'login' && 'Input registered authority details to proceed.'}
                {authMode === 'register' && 'Configure custom authority level credentials.'}
                {authMode === 'forgot' && 'Provide account email address to dispatch instructions link.'}
              </p>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div id="auth-error-alert" className="mb-4 bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-red-500 animate-fade-in">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authorization alert</span>
                  <p className="mt-0.5 text-red-400/90">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div id="auth-success-alert" className="mb-4 bg-green-500/10 border border-green-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-green-500 animate-fade-in">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-green-400" />
                <div>
                  <span className="font-extrabold">Registry coordinated</span>
                  <p className="mt-0.5 text-green-300">{successMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Full Name (Only on Registration) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold font-mono text-slate-450 uppercase mb-1.5">Your Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-450" />
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Jean-Luc Picard"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        theme === 'light' 
                          ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' 
                          : 'bg-[#070d19] border-slate-800 text-white placeholder-slate-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold font-mono text-slate-450 uppercase mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-450" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. picard@starfleet.com"
                    className={`w-full h-11 pl-10 pr-4 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' 
                        ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' 
                        : 'bg-[#070d19] border-slate-800 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input (Login & Registration Only) */}
              {authMode !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold font-mono text-slate-450 uppercase">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[10px] font-semibold text-[#4be277] hover:underline cursor-pointer"
                      >
                        Recovery Options?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-450" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-11 pl-10 pr-4 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        theme === 'light' 
                          ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400' 
                          : 'bg-[#070d19] border-slate-800 text-white placeholder-slate-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Choose Role / Authority Level (Only on Register) */}
              {authMode === 'register' && (
                <div className="pt-2">
                  <span className="block text-xs font-bold font-mono text-slate-450 uppercase mb-2">Authority Level (Platform Tier)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {[
                      { id: 'learner', label: 'Student', desc: 'Verify progress' },
                      { id: 'author', label: 'Creator', desc: 'Publish syllabus' },
                      { id: 'admin', label: 'Admin', desc: 'Configure system' }
                    ].map((tierItem) => (
                      <button
                        key={tierItem.id}
                        type="button"
                        onClick={() => setRole(tierItem.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          role === tierItem.id 
                            ? 'border-green-500 bg-green-500/10 text-[#4be277]' 
                            : theme === 'light' 
                              ? 'border-slate-205 bg-slate-50 text-slate-700 hover:bg-slate-100' 
                              : 'border-slate-800 bg-[#070d19] text-slate-300 hover:bg-[#0c1322]'
                        }`}
                      >
                        <span className="font-sans font-bold text-xs">{tierItem.label}</span>
                        <span className="text-[9px] text-slate-400 mt-1">{tierItem.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Authority Credentials */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#4be277] hover:bg-[#3cd066] text-slate-950 font-display font-extrabold text-xs uppercase tracking-widest transition-transform cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-50 mt-4"
              >
                {loading ? 'Symmetric token dispatching...' : (
                  authMode === 'login' ? 'Sign In / Secure Session' : authMode === 'register' ? 'Register Authority Profile' : 'Dispatch Discovery code'
                )}
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

            </form>

            {/* Alternating Links */}
            <div className="mt-8 pt-6 border-t border-slate-200/10 text-center flex flex-col gap-2.5 text-xs text-slate-400">
              {authMode === 'login' && (
                <p>
                  Don't have a secure authority account?{' '}
                  <button
                    onClick={() => { setAuthMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[#4be277] font-semibold hover:underline cursor-pointer"
                  >
                    Register Profile
                  </button>
                </p>
              )}

              {authMode === 'register' && (
                <p>
                  Already authorized in database?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[#4be277] font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}

              {authMode === 'forgot' && (
                <p>
                  Remembered your registered credentials?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[#4be277] font-semibold hover:underline cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

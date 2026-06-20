import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Tv, Award, Flame, Zap, CheckCircle2, ChevronRight, BookOpen, 
  HelpCircle, ShieldCheck, Database, Layout, Sparkles, TrendingUp,
  User, Mail, ArrowRight, UserCheck, RefreshCw, PenTool, Check, Bookmark, PlusCircle
} from 'lucide-react';
import { Course } from '../types';

export default function DashboardView() {
  const { 
    currentUser, enrollments, courses, activityLogs, bookmarks, toggleBookmark,
    setCurrentView, setSelectedCourseId, fetchEnrollments, fetchActivityLogs, updateUserProfile, theme
  } = useApp();

  // Selected sub-tab within dashboard layout
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'profile'>('overview');

  // Load Analytics state (Feature 8)
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Recommendations state (Feature 6)
  const [recs, setRecs] = useState<any | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Profile Edit form states (Feature 1)
  const [pName, setPName] = useState(currentUser?.name || '');
  const [pEmail, setPEmail] = useState(currentUser?.email || '');
  const [pBio, setPBio] = useState(currentUser?.bio || '');
  const [pAvatar, setPAvatar] = useState(currentUser?.avatar || '');
  const [pSkills, setPSkills] = useState(currentUser?.skills?.join(', ') || '');
  const [pInterests, setPInterests] = useState(currentUser?.learning_interests?.join(', ') || '');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profile edits inputs when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setPName(currentUser.name);
      setPEmail(currentUser.email);
      setPBio(currentUser.bio || '');
      setPAvatar(currentUser.avatar || '');
      setPSkills(currentUser.skills?.join(', ') || '');
      setPInterests(currentUser.learning_interests?.join(', ') || '');
    }
  }, [currentUser]);

  // Load backend analytics
  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed fetching dynamic analytics', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Get AI recommendations
  const getRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch('/api/ai/recommendations', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRecs(data);
      }
    } catch (e) {
      console.error('Recommendations failed to bind', e);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    fetchActivityLogs();
    fetchAnalyticsData();
    getRecommendations();
  }, [currentUser]);

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course');
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileErr('');
    setSavingProfile(true);

    try {
      const result = await updateUserProfile({
        name: pName,
        email: pEmail,
        bio: pBio,
        avatar: pAvatar,
        skills: pSkills,
        learning_interests: pInterests
      });
      if (result.success) {
        setProfileMessage('System synchronized successfully. Profile properties locked.');
        fetchAnalyticsData(); // recalculate XP
      } else {
        setProfileErr(result.error || 'Server rejected updates');
      }
    } catch (err: any) {
      setProfileErr('Could not sync user metrics');
    } finally {
      setSavingProfile(false);
    }
  };

  // Find enrolled courses lists
  const activeEnrolledCourses = enrollments.map(en => {
    const courseEntity = courses.find(c => c.id === en.course_id);
    if (!courseEntity) return null;
    return {
      ...courseEntity,
      progress: en.progress,
      enRec: en
    };
  }).filter(Boolean) as Array<Course & { progress: number; enRec: any }>;

  // Bookmark matches
  const bookmarkedCourses = courses.filter(c => bookmarks.some(b => b.course_id === c.id));

  return (
    <div className={`pt-24 pb-20 min-h-screen transition-all ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#070d19] text-white'
    }`}>
      <div className="px-4 md:px-12 max-w-7xl mx-auto text-left animate-fade-in">
        
        {/* Upper Header Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-slate-200/10">
          <div>
            <p className="font-mono text-xs uppercase text-[#4be277] tracking-wider font-bold">Relational Portal Dashboard</p>
            <h1 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
              Welcome back, {currentUser?.name || "Acquiring Student"}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Track multi-module syllabus completions, execute evaluations, download summarizer concept revisions and load advanced AI pathway metrics.
            </p>
          </div>

          {/* Quick dashboard sub-menu switch */}
          <div className={`flex p-1 rounded-xl border ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#11192e] border-slate-800'
          }`}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#4be277] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview & Progress
            </button>
            <button
              onClick={() => { setActiveTab('recommendations'); getRecommendations(); }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'recommendations'
                  ? 'bg-[#4be277] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Recommendations
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#4be277] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Edit My Profile
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left side: Stats Cards, Courses & Bookmarks (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Dynamic Analytics Panel Dashboard (Feature 8) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Streak count */}
                <div className={`p-5 rounded-xl border flex items-center gap-4 relative overflow-hidden backdrop-blur-sm ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
                }`}>
                  <div className="w-11 h-11 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 border border-orange-500/20">
                    <Flame className="w-5.5 h-5.5 fill-current" />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`font-sans font-extrabold text-xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {analytics?.student?.streak || currentUser?.streak || 1} Days
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Active Streak</p>
                  </div>
                </div>

                {/* Experience Points count */}
                <div className={`p-5 rounded-xl border flex items-center gap-4 relative overflow-hidden backdrop-blur-sm ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
                }`}>
                  <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
                    <Zap className="w-5.5 h-5.5 fill-current animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`font-sans font-extrabold text-xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {(analytics?.student?.xp || currentUser?.xp || 100).toLocaleString()} XP
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Total Gain Points</p>
                  </div>
                </div>

                {/* Average Score */}
                <div className={`p-5 rounded-xl border flex items-center gap-4 relative overflow-hidden backdrop-blur-sm ${
                  theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-[#3d4a3d]/20'
                }`}>
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                    <Award className="w-5.5 h-5.5 text-emerald-400" />
                  </div>
                  <div className="space-y-0.5">
                    <p className={`font-sans font-extrabold text-xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {analytics?.student?.averageScore !== "N/A" ? `${analytics?.student?.averageScore} / 5` : "0 / 5"}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Avg Quiz Evaluations</p>
                  </div>
                </div>

              </div>

              {/* My Learning Pathway Section */}
              <div className={`p-6 rounded-2xl border ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  Enrolled Subjects ({activeEnrolledCourses.length})
                </h3>

                {activeEnrolledCourses.length === 0 ? (
                  <div className="text-center py-12 bg-slate-500/5 rounded-xl border border-dashed border-slate-200/10">
                    <p className="text-xs text-slate-400">You are not actively enrolled in any courses yet.</p>
                    <button 
                      onClick={() => setCurrentView('domains')}
                      className="mt-4 px-4 py-2 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 font-bold rounded text-green-500 transition-all cursor-pointer"
                    >
                      Explore Certified Pathways
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-slate-100/10">
                    {activeEnrolledCourses.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleCourseClick(item.id)}
                        className="pt-4 first:pt-0 group cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex-1 space-y-2 min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-bold text-green-500 bg-green-500/10 px-2 rounded-md tracking-wider">
                              {item.tags[0] || 'ADVANCED'}
                            </span>
                            <h4 className={`font-sans text-sm font-bold group-hover:text-green-500 transition-all truncate ${
                              theme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}>
                              {item.title}
                            </h4>
                          </div>
                          
                          {/* Progress sliders */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-500 h-full transition-all duration-300"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] font-bold text-slate-400 shrink-0">{item.progress}% Completed</span>
                          </div>
                        </div>

                        <button className="h-9 px-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 font-bold text-xs flex items-center gap-1 shrink-0 transition-all hover:bg-green-500 hover:text-slate-950 cursor-pointer">
                          Resume Chapter <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bookmarks saved list */}
              <div className={`p-6 rounded-2xl border ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                  <Bookmark className="w-5 h-5 text-green-500" />
                  My Saved bookmarks ({bookmarkedCourses.length})
                </h3>

                {bookmarkedCourses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">You don't have any bookmarked items inside your lists.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bookmarkedCourses.map((c) => (
                      <div 
                        key={c.id}
                        className={`p-4 rounded-xl border relative group flex flex-col justify-between ${
                          theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <span className="font-mono text-[8px] bg-slate-500/10 px-1.5 py-0.5 rounded font-bold">{c.tags[0] || 'CLASSIC'}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(c.id); }}
                              className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"
                              title="Unsave bookmark"
                            >
                              ★
                            </button>
                          </div>
                          <h4 
                            onClick={() => handleCourseClick(c.id)}
                            className="font-sans text-xs font-bold hover:text-green-500 transition-colors cursor-pointer mt-2 leading-snug line-clamp-2"
                          >
                            {c.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t border-slate-200/10 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 truncate">Author: {c.authorName}</span>
                          <button 
                            onClick={() => handleCourseClick(c.id)}
                            className="text-[10px] text-green-500 font-bold hover:underline"
                          >
                            Go study ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right side: Activity log details & Technical checklist (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Overview Card */}
              <div className={`p-6 rounded-2xl border text-center ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <div className="relative w-18 h-18 mx-auto mb-3">
                  <img 
                    src={currentUser?.avatar} 
                    alt={currentUser?.name}
                    className="w-full h-full rounded-full object-cover border-2 border-green-500" 
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-slate-950 p-1 rounded-full text-[9px] font-bold">
                    ✓
                  </div>
                </div>
                <h4 className="font-display font-bold text-base">{currentUser?.name}</h4>
                <p className="text-xs text-slate-400 capitalize bg-slate-500/10 inline-block px-2.5 py-0.5 rounded-full font-semibold mt-1">
                  {currentUser?.role === 'author' ? 'Content Creator' : currentUser?.role} Title
                </p>

                {currentUser?.bio && (
                  <p className="text-xs text-slate-400 line-clamp-3 mt-3 italic leading-relaxed">
                    "{currentUser.bio}"
                  </p>
                )}

                {/* Relational profile skills (Feature 1) */}
                {currentUser?.skills && currentUser.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200/10 text-left">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400">Profile Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {currentUser.skills.map((sk, idx) => (
                        <span key={idx} className="text-[9px] bg-sky-500/10 text-sky-400 font-semibold px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relational profile interests (Feature 1) */}
                {currentUser?.learning_interests && currentUser.learning_interests.length > 0 && (
                  <div className="mt-3 text-left">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400">Interests:</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {currentUser.learning_interests.map((it, idx) => (
                        <span key={idx} className="text-[9px] bg-green-500/10 text-green-400 font-semibold px-2 py-0.5 rounded">
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Log system feed (Feature 8 admin/student sync) */}
              <div className={`p-6 rounded-2xl border text-left ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-400 mb-4">
                  My Activity timelineLog
                </h3>

                <div className="space-y-4">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex gap-2.5 text-xs">
                      <div className="w-5 h-5 rounded-full bg-slate-500/10 flex items-center justify-center shrink-0 border border-slate-400/10 mt-0.5">
                        {log.type === 'lesson_completed' ? '✓' : '✦'}
                      </div>
                      <div>
                        <p className="font-sans font-medium text-slate-350">
                          {log.title} <span className="text-slate-400 font-normal">{log.subtitle}</span>
                        </p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {activityLogs.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No logs on record yet.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* FEATURE 6: AI-Powered Learning Recommendations Section */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            
            {/* Recommendation Hero Banner */}
            <div className="p-6 md:p-8 rounded-2xl border bg-gradient-to-br from-green-500/5 to-emerald-500/10 border-green-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-1.5 text-green-500 font-bold text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4" />
                  Gemini-3.5-Flash Insights Engine
                </div>
                <h2 className="font-sans font-bold text-2xl md:text-3xl text-white">
                  Your Advanced Cognitive Recommendations
                </h2>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  LearnDrack queries real student statistics (interests, scores, completed pathways, and profiles) against generative AI models to construct structured learning counseling.
                </p>
              </div>

              <button 
                onClick={getRecommendations}
                disabled={loadingRecs}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#4be277] text-slate-950 click-trigger flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {loadingRecs ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Querying Model...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Recompute Insights
                  </>
                )}
              </button>
            </div>

            {loadingRecs ? (
              <div className="text-center py-20">
                <RefreshCw className="w-8 h-8 text-green-500 animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400 font-mono">Formulating relational parameters & fine-tuning advise...</p>
              </div>
            ) : recs ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Path advisory & Topics (7 columns) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Career advice */}
                  <div className={`p-6 rounded-2xl border text-left ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
                  }`}>
                    <h4 className="font-display font-extrabold text-white text-base">Recommended Career Path</h4>
                    <span className="inline-block mt-2 bg-green-500/10 text-[#4be277] font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      {recs.career_path || 'Principal Cloud Reliability Engineer'}
                    </span>
                    <p className="text-slate-400 text-xs md:text-sm mt-4 leading-relaxed font-sans">
                      {recs.coaching_advice || 'Based on your profile skills in React/TypeScript, we advise learning Raft and Paxos synchronization methodologies. Focus on horizontally elastic systems to double your platform performance.'}
                    </p>
                  </div>

                  {/* Topics checkboxes */}
                  <div className={`p-6 rounded-2xl border text-left ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
                  }`}>
                    <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-3">Topic Areas to Target:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recs.recommended_topics?.map((topic: string, i: number) => (
                        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-green-500/5 text-xs text-green-400">
                          <Check className="w-4 h-4 shrink-0" />
                          <span className="font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Recommended Catalog courses (5 columns) */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-450 text-left">
                    Matching Certified Courses
                  </h3>

                  {recs.recommendedCourses?.map((match: any) => (
                    <div 
                      key={match.id}
                      onClick={() => handleCourseClick(match.id)}
                      className={`p-5 rounded-2xl border hover:border-green-500/40 transition-all cursor-pointer group text-left flex gap-4 ${
                        theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/50 border-slate-800'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200/10 bg-slate-800">
                        <img 
                          src={match.thumbnail} 
                          alt={match.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all" 
                        />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="font-mono text-[8.5px] text-[#4be277] bg-green-500/10 px-2 rounded-md font-bold uppercase tracking-widest">
                          {match.tags?.[0] || 'HOT PATHWAY'}
                        </span>
                        <h4 className="font-sans font-bold text-xs truncate text-white group-hover:text-green-500 transition-colors">
                          {match.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {match.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {(!recs.recommendedCourses || recs.recommendedCourses.length === 0) && (
                    <p className="text-xs text-slate-500 italic">No courses align to calculated vectors. Please expand user profile skills.</p>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xs text-slate-400">Click recompute to compile profile vector analytics.</p>
              </div>
            )}

          </div>
        )}

        {/* FEATURE 1: Relational Profile Editor Panel */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className={`p-6 md:p-8 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
            }`}>
              <h3 className="font-display font-bold text-xl mb-1">Modify System Profile</h3>
              <p className="text-xs text-slate-400 mb-6">
                Specify skills, career tags, name changes, or learning categories. Updates immediately award 50 experience XP points!
              </p>

              {profileMessage && (
                <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileMessage}</span>
                </div>
              )}

              {profileErr && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{profileErr}</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-5 text-left">
                
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Display Username</label>
                  <input 
                    type="text"
                    required
                    value={pName}
                    onChange={e => setPName(e.target.value)}
                    className={`w-full p-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-900' : 'bg-slate-900 border-slate-750 text-white'
                    }`}
                  />
                </div>

                {/* 2. Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Email Coordinates</label>
                  <input 
                    type="email"
                    required
                    value={pEmail}
                    onChange={e => setPEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-900' : 'bg-slate-900 border-slate-755 text-white'
                    }`}
                  />
                </div>

                {/* 3. Avatar URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono flex justify-between">
                    <span>Avatar Image URL</span>
                    <span className="text-[10px] text-[#4be277] italic font-sans font-normal">Recommend hosting on Unsplash</span>
                  </label>
                  <input 
                    type="text"
                    value={pAvatar}
                    onChange={e => setPAvatar(e.target.value)}
                    className={`w-full p-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-900' : 'bg-slate-900 border-slate-760 text-white'
                    }`}
                  />
                </div>

                {/* 4. Biography */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Biographical summary</label>
                  <textarea 
                    rows={3}
                    value={pBio}
                    onChange={e => setPBio(e.target.value)}
                    placeholder="Tell our engineering community about your specialization..."
                    className={`w-full p-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-900' : 'bg-slate-900 border-slate-770 text-white'
                    }`}
                  />
                </div>

                {/* 5. Comma Separated skills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">
                    Professional Skills <span className="text-[10px] font-normal text-slate-400">(Comma separated)</span>
                  </label>
                  <input 
                    type="text"
                    value={pSkills}
                    onChange={e => setPSkills(e.target.value)}
                    placeholder="Python, Transformers, PyTorch, RAG"
                    className={`w-full p-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-900' : 'bg-slate-900 border-slate-780 text-white'
                    }`}
                  />
                </div>

                {/* 6. Comma Separated interests */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">
                    Learning Interests <span className="text-[10px] font-normal text-slate-400">(Comma separated)</span>
                  </label>
                  <input 
                    type="text"
                    value={pInterests}
                    onChange={e => setPInterests(e.target.value)}
                    placeholder="Web Development, Cloud Architecture, AI & Machine Learning"
                    className={`w-full p-2.5 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-green-500 ${
                      theme === 'light' ? 'bg-slate-50 border-slate-250 text-slate-900' : 'bg-slate-900 border-slate-790 text-white'
                    }`}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-lg font-display text-[#003915] bg-[#4be277] hover:bg-[#3cd066] font-bold text-sm cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
                >
                  {savingProfile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Save & Sync profile parameters
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

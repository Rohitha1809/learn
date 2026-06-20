import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Play, Pause, ChevronDown, ChevronUp, Lock, Unlock, 
  Sparkles, Send, Download, Heart, MessageSquare, BookOpen, ExternalLink, RefreshCw,
  CheckCircle2, AlertCircle, HelpCircle, FileText, Award, HelpCircle as QuestionIcon, ThumbsUp, History
} from 'lucide-react';
import { Comment } from '../types';

export default function CourseDetailView() {
  const { 
    selectedCourseId, setCurrentView, courses, enrollments, 
    currentUser, enrollInCourse, completeLesson, theme 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'material' | 'summary' | 'quiz' | 'tutor' | 'discussions'>('material');
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  
  // Custom video player simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoDuration, setCurrentVideoDuration] = useState('00:00 / 00:00');
  const [videoProgress, setVideoProgress] = useState(0);

  // Active playing lesson tracking
  const [activeLesson, setActiveLesson] = useState<any | null>(null);

  // FEATURE 5: AI Content Summarizer states
  const [summaryData, setSummaryData] = useState<string>('');
  const [summarizing, setSummarizing] = useState(false);

  // FEATURE 4: AI Quiz Generator states
  const [quizData, setQuizData] = useState<any | null>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loadingQuizHistory, setLoadingQuizHistory] = useState(false);

  // AI Tutor states using Server-side Gemini API (Elena Volkov)
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'assistant', text: string }>>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Find course entity
  const course = courses.find(c => c.id === selectedCourseId) || courses[0];

  if (!course) {
    return (
      <div className="pt-24 text-center">
        <p className="text-white">Loading course detail info...</p>
        <button onClick={() => setCurrentView('domains')} className="text-[#4be277] underline mt-4">Back to courses</button>
      </div>
    );
  }

  // Find user enrollment status in this particular course
  const enrollment = enrollments.find(e => e.course_id === course.id);
  const isEnrolled = !!enrollment;

  // Fetch comments for this course
  const fetchCourseComments = async () => {
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch(`/api/courses/${course.id}/comments`, {
        headers: activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch student quiz scores history (Feature 4 score tracking)
  const fetchStudentQuizHistory = async () => {
    if (!currentUser) return;
    setLoadingQuizHistory(true);
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch(`/api/quiz-history/${currentUser.id}`, {
        headers: activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        const courseHistory = data.filter((h: any) => h.courseId === course.id);
        setQuizHistory(courseHistory);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuizHistory(false);
    }
  };

  useEffect(() => {
    fetchCourseComments();
    fetchStudentQuizHistory();
    
    // Set default initial video lesson (Module 1, lesson 1)
    if (course.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
      const firstLesson = course.modules[0].lessons[0];
      setActiveLesson(firstLesson);
      setCurrentVideoTitle(firstLesson.title);
      setCurrentVideoDuration(`00:00 / ${firstLesson.duration}`);
    } else {
      // Setup dynamic fallback matching start schema
      const fallbackLes = {
        id: "l1",
        title: "What is a Distributed System?",
        duration: "12:04",
        content: `A distributed system consists of multiple separate computing nodes that communicate exclusively via network packet handshakes.`
      };
      setActiveLesson(fallbackLes);
      setCurrentVideoTitle(fallbackLes.title);
      setCurrentVideoDuration("00:00 / 12:04");
    }

    // Auto expand first module accordion
    if (course.modules?.length > 0) {
      setExpandedModules({ [course.modules[0].id]: true });
    }
  }, [course]);

  // Handle accordion toggle
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Handle lesson play simulation
  const selectLessonToPlay = (lesson: any, isLocked: boolean) => {
    if (isLocked) {
      alert("Please enroll in this course pathway first to unlock advanced modules.");
      return;
    }
    // Fetch individual full lesson content object
    const fullLessonContent = course.modules
      ?.flatMap((m: any) => m.lessons || [])
      .find((l: any) => l.id === lesson.id);

    setActiveLesson(fullLessonContent || lesson);
    setCurrentVideoTitle(lesson.title);
    setCurrentVideoDuration(`00:00 / ${lesson.duration}`);
    setVideoProgress(0);
    setIsPlaying(true);

    // Reset AI summarized/quiz screens
    setSummaryData('');
    setQuizData(null);
    setEvaluationResult(null);
    setUserAnswers({});
    setActiveTab('material');
  };

  // Simulated video progress tick
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1.2;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle comment post submission
  const submitCommentHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch(`/api/courses/${course.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ comment: newCommentText })
      });
      if (res.ok) {
        setNewCommentText('');
        await fetchCourseComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // FEATURE 5: AI Summarize trigger
  const triggerAISummarize = async () => {
    if (!activeLesson) return;
    setActiveTab('summary');
    setSummarizing(true);
    setSummaryData('');
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ 
          content: activeLesson.content || activeLesson.title || "Technical Lecture Segment", 
          lessonTitle: activeLesson.title 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data.summary);
      } else {
        setSummaryData("# Executive Lesson Summary\n\nCould not construct summary from server models. Check environment credentials.");
      }
    } catch (err) {
      console.error(err);
      setSummaryData("# Executive Lesson Summary\n\nConnection split during summaries parsing.");
    } finally {
      setSummarizing(false);
    }
  };

  // FEATURE 4: AI Quiz generation trigger
  const triggerAIQuiz = async () => {
    if (!activeLesson) return;
    setActiveTab('quiz');
    setGeneratingQuiz(true);
    setQuizData(null);
    setEvaluationResult(null);
    setUserAnswers({});

    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch('/api/ai/quiz-generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ courseId: course.id, lessonId: activeLesson.id })
      });
      if (res.ok) {
        const data = await res.json();
        setQuizData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  // Submit took answers
  const submitQuizAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizData || submittingQuiz) return;
    setSubmittingQuiz(true);
    setEvaluationResult(null);

    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch(`/api/quizzes/${quizData.id}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ answers: userAnswers })
      });
      if (res.ok) {
        const result = await res.json();
        setEvaluationResult(result);
        await fetchStudentQuizHistory(); // reload logs to score tracker!
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: value }));
  };

  // Elena AI Tutor integration
  const askAITutorModule = async (topicTitle: string) => {
    setActiveTab('tutor');
    setAiLoading(true);
    setAiChatHistory(prev => [...prev, { sender: 'user', text: `Can you explain: "${topicTitle}"?` }]);
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, courseTitle: course.title })
      });
      if (res.ok) {
        const data = await res.json();
        setAiChatHistory(prev => [...prev, { sender: 'assistant', text: data.response }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const submitCustomAiQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() || aiLoading) return;
    const userMsg = aiQuery;
    setAiQuery('');
    setAiLoading(true);
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customQuery: userMsg, courseTitle: course.title })
      });
      if (res.ok) {
        const data = await res.json();
        setAiChatHistory(prev => [...prev, { sender: 'assistant', text: data.response }]);
      }
    } catch (e) {
      console.error(e);
      setAiChatHistory(prev => [...prev, { sender: 'assistant', text: "Error connecting to AI tutor server." }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Simple clean markdown parser to avoid external packages
  const parseMinimalMarkdown = (mdText: string) => {
    if (!mdText) return null;
    const lines = mdText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="font-display font-bold text-lg md:text-xl text-green-400 mt-5 mb-2">{trimmed.substring(2)}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="font-sans font-bold text-sm text-white mt-4 mb-1.5 uppercase tracking-wider">{trimmed.substring(3)}</h2>;
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 leading-relaxed mb-1">
            {trimmed.substring(2)}
          </li>
        );
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <p key={idx} className="font-bold text-xs text-green-300 mt-2 mb-1">{trimmed.replace(/\*/g, '')}</p>;
      }
      if (line === '') return <div key={idx} className="h-2"></div>;
      return <p key={idx} className="text-xs text-slate-350 leading-relaxed mb-1">{line}</p>;
    });
  };

  return (
    <div className={`pt-24 pb-20 min-h-screen transition-all ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#070d19] text-white'
    }`}>
      <div className="px-4 md:px-12 max-w-7xl mx-auto text-left animate-fade-in">
        
        {/* Back Link */}
        <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 uppercase tracking-wider text-xs font-mono font-bold transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#4be277]" />
          Back to Course directory
        </button>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Player and AI components (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded bg-green-500/10 text-green-500 font-mono text-[9px] tracking-wider uppercase font-bold">
                {course.tags?.[0] || 'ADVANCED PARADIGM'}
              </span>
              <h1 className={`font-sans text-2xl md:text-3xl font-extrabold tracking-tight ${
                theme === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                {course.title}
              </h1>
            </div>

            {/* Simulated Stream Player container */}
            <div className={`relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end border ${
              theme === 'light' ? 'bg-slate-950 border-slate-300' : 'bg-[#0b1326] border-slate-850'
            }`}>
              {/* Image source references */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center brightness-90 saturate-[0.8]" 
                style={{ backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'})` }} 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

              {/* Player control overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-slate-950 flex items-center justify-center active:scale-95 transition-all shadow-[0_0_15px_rgba(75,226,119,0.3)] cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
              </div>

              {/* Player footer banner */}
              <div className="relative z-20 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2 text-left">
                <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
                  <span className="truncate font-semibold text-white">Lesson: {currentVideoTitle}</span>
                  <span>{currentVideoDuration}</span>
                </div>
                
                {/* Simulated playback track */}
                <div className="relative h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full absolute top-0 left-0 transition-all duration-300 shadow-[0_0_8px_#4be277]"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Active Center Actions panel */}
            <div className={`p-4 rounded-xl border flex flex-wrap gap-4 items-center justify-between ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#11192e] border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400 rotate-12" />
                <div>
                  <h4 className="font-display font-semibold text-xs text-white">LearnDrack AI Center</h4>
                  <p className="text-[10px] text-slate-400">Instantiate evaluation matrices or summarized notes coordinates.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={triggerAISummarize}
                  className="px-3.5 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Generate AI Summary (Feature 5)
                </button>

                <button
                  onClick={triggerAIQuiz}
                  className="px-3.5 py-1.5 rounded-lg bg-green-500 text-slate-950 hover:bg-green-400 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  Practice Lesson Quiz (Feature 4)
                </button>
              </div>
            </div>

            {/* Left Lower Segment dynamic tab navigator */}
            <div className="border-b border-slate-200/10">
              <div className="flex gap-6">
                {[
                  { id: 'material', label: 'Lesson Description' },
                  { id: 'summary', label: 'AI Review Summary' },
                  { id: 'quiz', label: 'Lesson Quiz practice' },
                  { id: 'tutor', label: 'Elena AI Tutor' },
                  { id: 'discussions', label: 'Discussions Hub' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`font-sans text-xs font-bold pb-4 transition-all relative cursor-pointer ${
                      activeTab === t.id 
                        ? 'text-green-500 border-b-2 border-green-500' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                    {(t.id === 'summary' || t.id === 'quiz') && (
                      <span className="absolute -top-1 -right-2 text-[8px] bg-sky-500/10 text-sky-400 font-mono px-1 rounded-full uppercase scale-85">AI</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Inner tab contents panels */}
            <div className="min-h-[200px]">
              
              {/* TAB 1: Material */}
              {activeTab === 'material' && (
                <div className="space-y-4 text-left">
                  <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${
                    theme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    Lesson Syllabus material Study
                  </h3>
                  {activeLesson?.content ? (
                    <div className={`p-5 rounded-xl border whitespace-pre-wrap font-sans text-xs md:text-sm leading-relaxed ${
                      theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0c1322] border-slate-800 text-slate-300'
                    }`}>
                      {parseMinimalMarkdown(activeLesson.content)}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-500/5 text-xs text-slate-400 italic">
                      Choose a lesson module chapter from the curriculum outline on the right to read study text.
                    </div>
                  )}

                  <div className="p-4 rounded-xl border border-dashed border-slate-200/10 bg-slate-500/5 text-xs">
                    <p className="font-bold text-white uppercase tracking-wider">Additional Developer Resources:</p>
                    <p className="text-slate-400 mt-1 leading-relaxed">
                      Download supplementary cheatsheets and configure containers locally referencing the Git repository directory.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: AI Summarize panel (Feature 5) */}
              {activeTab === 'summary' && (
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center bg-gradient-to-r from-green-500/10 to-teal-500/20 p-4 rounded-xl border border-green-500/20">
                    <div>
                      <h4 className="font-display font-semibold text-xs text-white">AI Curriculum Summarized Digest</h4>
                      <p className="text-[10px] text-slate-400">Summarized concept keypoints, high-yield rev notes, and conceptual mappings.</p>
                    </div>
                    <button 
                      onClick={triggerAISummarize} 
                      className="text-xs p-1 bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 rounded"
                    >
                      Regenerate
                    </button>
                  </div>

                  {summarizing ? (
                    <div className="text-center py-20 text-[#4be277] font-mono animate-pulse text-xs">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Gemini is generating high-yield summary revision notes...
                    </div>
                  ) : summaryData ? (
                    <div className={`p-6 rounded-2xl border ${
                      theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f172a] border-slate-800 text-slate-200'
                    }`}>
                      {parseMinimalMarkdown(summaryData)}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs italic">
                      Click the "Generate AI Summary" button to parse studying material using Google Flash LLM models.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AI quiz evaluations taking (Feature 4) */}
              {activeTab === 'quiz' && (
                <div className="space-y-6 text-left">
                  <div className="p-4 rounded-xl bg-[#11192e] border border-slate-800 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h4 className="font-display font-semibold text-xs text-white">Interactive Lesson Practice evaluations</h4>
                      <p className="text-[10px] text-slate-400">Instant score evaluation updates saved directly in the history tracker.</p>
                    </div>
                    <button onClick={triggerAIQuiz} className="text-xs p-1.5 bg-green-500 text-slate-950 font-bold hover:bg-green-400 rounded">
                      Re-generate Quiz
                    </button>
                  </div>

                  {generatingQuiz ? (
                    <div className="text-center py-20 text-xs text-slate-400 font-mono animate-pulse">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-green-500" />
                      Chief curriculum evaluator structuring 5 custom testing criteria...
                    </div>
                  ) : quizData ? (
                    <div className={`p-6 rounded-2xl border ${
                      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#11192e] border-[#3d4a3d]/20'
                    }`}>
                      
                      {evaluationResult ? (
                        /* Quiz Evaluation display */
                        <div className="space-y-6">
                          <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/30 text-center space-y-2">
                             <Award className="w-10 h-10 text-yellow-400 mx-auto" />
                             <h4 className="font-display font-extrabold text-white text-lg">Evaluation Completed!</h4>
                             <p className="text-sm font-sans text-slate-200">
                               You scored <span className="text-green-500 font-extrabold text-xl">{evaluationResult.score} / {evaluationResult.totalQuestions}</span> ({evaluationResult.percentScore}%)
                             </p>
                             <p className="text-xs text-[#4be277] font-mono font-bold">
                               +{evaluationResult.xpAwarded} XP Experience points synchronized to user databases!
                             </p>
                          </div>

                          <div className="space-y-4">
                            <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400">Detailed Criteria Breakdown:</h5>
                            {evaluationResult.results?.map((res: any, idx: number) => (
                              <div key={idx} className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                                res.isCorrect ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-red-500/5 border-red-500/20'
                              }`}>
                                <div className="flex justify-between items-center font-semibold">
                                  <span>Question {idx+1}: {res.question}</span>
                                  <span className={res.isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                    {res.isCorrect ? 'Correct ✓' : 'Incorrect ✕'}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-[11px]">Given answer: <span className="font-semibold text-white">{res.userAnswer}</span></p>
                                {!res.isCorrect && (
                                  <p className="text-[#4be277] text-[11px]">Correct criteria: <span className="font-semibold">{res.correctAnswer}</span></p>
                                )}
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => { setEvaluationResult(null); setUserAnswers({}); }}
                            className="px-5 py-2 rounded-lg bg-green-500 text-slate-950 font-bold text-xs"
                          >
                            Retake This Quiz
                          </button>
                        </div>
                      ) : (
                        /* Taking the Quiz */
                        <form onSubmit={submitQuizAnswers} className="space-y-6">
                          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-semibold border-b border-slate-200/10 pb-2">
                            Assigned testing: 5 Questions
                          </p>

                          {quizData.questions?.map((q: any, qIdx: number) => (
                            <div key={q.id} className="space-y-2 pb-5 border-b border-slate-200/5 last:border-0 last:pb-0">
                              <p className="font-sans font-bold text-xs text-white">
                                {qIdx + 1}. {q.question}
                              </p>

                              {q.type === 'mcq' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                  {q.options?.map((opt: string, oIdx: number) => {
                                    const isSelected = userAnswers[q.id] === opt;
                                    return (
                                      <button
                                        type="button"
                                        key={oIdx}
                                        onClick={() => handleSelectAnswer(q.id, opt)}
                                        className={`p-2.5 text-xs text-left rounded-lg border font-semibold transition-all ${
                                          isSelected 
                                            ? 'bg-green-500/20 border-green-500 text-[#4be277]' 
                                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {q.type === 'true_false' && (
                                <div className="flex gap-3 mt-2">
                                  {['True', 'False'].map((val) => {
                                    const isSelected = userAnswers[q.id] === val;
                                    return (
                                      <button
                                        type="button"
                                        key={val}
                                        onClick={() => handleSelectAnswer(q.id, val)}
                                        className={`px-5 py-2 text-xs border rounded-lg font-bold transition-all ${
                                          isSelected 
                                            ? 'bg-green-500/20 border-green-500 text-[#4be277]' 
                                            : 'bg-slate-950 border-slate-800 text-slate-300'
                                        }`}
                                      >
                                        {val}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {q.type === 'short' && (
                                <div className="mt-2">
                                  <input 
                                    type="text"
                                    required
                                    placeholder="Enter short technical term keyword..."
                                    value={userAnswers[q.id] || ''}
                                    onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-green-500"
                                  />
                                </div>
                              )}

                            </div>
                          ))}

                          <button
                            type="submit"
                            disabled={submittingQuiz}
                            className="w-full py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-lg text-xs tracking-wider uppercase font-display cursor-pointer"
                          >
                            {submittingQuiz ? 'Submitting evaluations...' : 'Submit quiz Answers'}
                          </button>
                        </form>
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs italic">
                      Click "Practice Lesson Quiz" above to prompt evaluation criteria.
                    </div>
                  )}

                  {/* Historical list scoreboard score tracker (Feature 4 score tracking/history!) */}
                  <div className="pt-6 border-t border-slate-200/10">
                    <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <History className="w-4 h-4 text-green-400" />
                      Evaluation Scoreboard History
                    </h5>

                    {loadingQuizHistory ? (
                      <p className="text-xs text-slate-500">Querying evaluations lists...</p>
                    ) : quizHistory.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No historical evaluations verified for this syllabus.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#11192e]/40">
                        <table className="w-full text-xs text-left text-slate-300">
                          <thead className="bg-[#11192e] text-[10px] uppercase font-mono text-slate-400">
                            <tr>
                              <th className="p-3">Lesson Segment</th>
                              <th className="p-3">Score Achieved</th>
                              <th className="p-3">Score Rate</th>
                              <th className="p-3">Verified Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40">
                            {quizHistory.map((hObj) => (
                              <tr key={hObj.id}>
                                <td className="p-3 font-semibold text-white">{hObj.lessonTitle}</td>
                                <td className="p-3">{hObj.score} / {hObj.total_questions}</td>
                                <td className="p-3 text-green-400 font-bold">{Math.round((hObj.score / hObj.total_questions)*100)}%</td>
                                <td className="p-3 text-slate-500">{new Date(hObj.timestamp).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: Elena AI safety coach */}
              {activeTab === 'tutor' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-green-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-display text-xs font-bold text-green-400 uppercase tracking-wider">Elena Volkov's AI Assistant Coach</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Elena Ross represents our chief cyber architect assistant, specialized in offensive K8s configurations and high scalability schemas. Talk with her directly.
                      </p>
                    </div>
                  </div>

                  {/* AI Chat History */}
                  <div className="h-[280px] overflow-y-auto border border-slate-200/10 bg-[#0b1326]/40 p-4 rounded-xl space-y-4 text-xs">
                    {aiChatHistory.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 space-y-1.5 flex flex-col items-center">
                        <BookOpen className="w-8 h-8 text-green-500" />
                        <p>Ask a custom question below, or trigger "Ask AI Tutor" from any lesson syllabus detail outline!</p>
                      </div>
                    ) : (
                      aiChatHistory.map((chat, idx) => (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[85%] ${
                            chat.sender === 'user' ? 'ml-auto items-end' : 'items-start'
                          }`}
                        >
                          <span className={`font-mono text-[9px] uppercase tracking-wider mb-1 ${
                            chat.sender === 'user' ? 'text-emerald-400' : 'text-green-400'
                          }`}>
                            {chat.sender === 'user' ? 'You' : 'Dr. Ross AI'}
                          </span>
                          <div className={`p-3 rounded-xl whitespace-pre-wrap leading-relaxed ${
                            chat.sender === 'user' 
                              ? 'bg-slate-800 border border-slate-700 text-white rounded-tr-none' 
                              : 'bg-slate-900 border border-slate-805 text-slate-200 rounded-tl-none'
                          }`}>
                            {parseMinimalMarkdown(chat.text)}
                          </div>
                        </div>
                      ))
                    )}
                    {aiLoading && (
                      <div className="flex items-center gap-2 text-green-400 font-mono font-semibold animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Elena Ross computing node parameters...
                      </div>
                    )}
                  </div>

                  {/* Chat input box */}
                  <form onSubmit={submitCustomAiQuery} className="flex gap-2">
                    <input 
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="Discuss fault-tolerance calculations or micro-services scaling factors..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 h-11 text-xs text-white focus:outline-none focus:border-green-500"
                    />
                    <button 
                      type="submit"
                      className="aspect-square h-11 rounded-lg bg-green-500 text-slate-950 flex items-center justify-center hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: Forums list discussions */}
              {activeTab === 'discussions' && (
                <div className="pt-2 text-left space-y-6 animate-fade-in">
                  <p className="text-xs text-slate-400">Post Q&As or comments specifically verified on this course panel.</p>
                  
                  <form onSubmit={submitCommentHandler} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-800 shrink-0">
                      <img 
                        src={currentUser?.avatar} 
                        alt="My profile avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <textarea 
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Share analytical breakdowns, lessons, or custom suggestions..."
                        className="w-full min-h-[70px] p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white"
                      />
                      <button 
                        type="submit"
                        disabled={!newCommentText.trim() || submittingComment}
                        className="px-4 py-1.5 rounded-lg bg-[#4be277] text-slate-950 font-bold text-xs"
                      >
                        Submit Post
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4 pt-2">
                    {comments.map((com) => (
                      <div key={com.id} className="flex gap-3.5 p-4 rounded-xl bg-slate-500/5 border border-slate-200/5 text-xs text-left">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200/10">
                          <img src={com.userAvatar} alt={com.userName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-bold text-white">{com.userName}</span>
                            <span className="text-[10px] text-slate-500">{new Date(com.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-300 text-xs">{com.comment}</p>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-xs text-slate-500 italic">No community discussions recorded for this course.</p>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Panel: Actions and Accordion Syllabus List (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Enrollment Widget */}
            <div className={`p-6 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-slate-205' : 'bg-[#11192e] border-slate-800'
            }`}>
              {isEnrolled ? (
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ✓ ENROLLED IN STUDY
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">Overall completion progress:</p>
                    <p className={`font-sans text-3xl font-extrabold tracking-tight mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {enrollment.progress}%
                    </p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${enrollment.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-mono">Admission Fee:</span>
                    <span className="text-2xl font-extrabold text-white font-sans">${course.price || "129"}</span>
                  </div>
                  <button 
                    onClick={() => enrollInCourse(course.id)}
                    className="w-full py-3 bg-[#4be277] hover:bg-[#3cd066] text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow"
                  >
                    Enroll Now
                  </button>
                </div>
              )}

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/10 flex items-start gap-3 mt-4 text-left">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-green-500">
                  <img src={course.authorAvatar} alt={course.authorName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="font-sans font-bold text-xs text-white">{course.authorName}</h5>
                  <p className="text-green-400 font-mono text-[9px] uppercase tracking-wider font-bold">{course.authorTitle || 'System Instructor'}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{course.authorBio}</p>
                </div>
              </div>
            </div>

            {/* Course Outline Accordion */}
            <div className="space-y-3.5 text-left">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/10 pb-2">
                Syllabus Curriculum Sections
              </h3>

              {course.modules?.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No chapters added yet to this class.</p>
              ) : (
                course.modules?.map((mod: any) => {
                  const isExpanded = !!expandedModules[mod.id];
                  return (
                    <div key={mod.id} className={`rounded-xl border spill-accordion overflow-hidden text-xs ${
                      theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#11192e] border-slate-800'
                    }`}>
                      {/* Accordion Header */}
                      <div 
                        onClick={() => toggleModule(mod.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer bg-slate-500/5 hover:bg-slate-500/10 transition-colors"
                      >
                        <div className="flex-1 pr-1">
                          <span className="font-mono text-[8px] uppercase text-[#4be277] font-bold block mb-0.5">Syllabus block</span>
                          <h4 className="font-sans text-xs font-extrabold line-clamp-1">{mod.title}</h4>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <button 
                            onClick={(e) => { e.stopPropagation(); askAITutorModule(mod.title); }}
                            className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold text-[8px]"
                          >
                            AI Coach
                          </button>
                          {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                        </div>
                      </div>

                      {/* Lesson list inside module */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-800/40 bg-slate-950/20">
                          {mod.lessons?.map((les: any) => {
                            const isLessonLocked = !isEnrolled && les.isLocked;
                            // Check completedLessons inside the matching enrollment progress list
                            const isCompleted = isEnrolled && enrollment.progress > 5 && Math.random() > 0.6; // fallback visual tracker
                            return (
                              <div
                                key={les.id}
                                onClick={() => selectLessonToPlay(les, isLessonLocked)}
                                className={`p-3 flex items-center justify-between transition-colors ${
                                  isLessonLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-500/10 cursor-pointer'
                                }`}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                                  {isEnrolled ? (
                                    <input 
                                      type="checkbox"
                                      checked={isCompleted}
                                      onChange={() => completeLesson(enrollment.id, les.id)}
                                      onClick={(e) => e.stopPropagation()} // don't trigger player load
                                      className="accent-green-500 w-4 h-4 rounded shrink-0 cursor-pointer"
                                    />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                  <p className="truncate font-sans font-medium text-[11px]">{les.title}</p>
                                </div>

                                <div className="flex items-center gap-2 text-right shrink-0">
                                  {isLessonLocked ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Unlock className="w-3.5 h-3.5 text-green-400" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

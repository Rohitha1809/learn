import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CloudUpload, Plus, X, Layers, AlertCircle, Sparkles, PlusCircle, CheckCircle,
  Edit2, Trash2, BookOpen, Eye, Heart, PlusCircle as PlusIcon, Settings, BarChart, FileText
} from 'lucide-react';

export default function CreateContentView() {
  const { 
    domains, fetchCourses, courses, currentUser, theme, setCurrentView, setSelectedCourseId 
  } = useApp();

  // Selected tab: list vs creation
  const [activeSegment, setActiveSegment] = useState<'manage' | 'create'>('manage');

  // Creation/Edition course Form parameters
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domainId, setDomainId] = useState('');
  const [price, setPrice] = useState('129.00');
  const [courseStatus, setCourseStatus] = useState<'draft' | 'public'>('public');
  const [enteredTag, setEnteredTag] = useState('');
  const [tags, setTags] = useState<string[]>(['RESONANCE', 'ADVANCED']);

  // Editing state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Lesson adding sub-form states
  const [managingCourseId, setManagingCourseId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonModule, setLessonModule] = useState('Module 1: Foundations of Distribution');
  const [lessonDuration, setLessonDuration] = useState('15:00');
  const [lessonPreview, setLessonPreview] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragOverThumb, setDragOverThumb] = useState(false);

  // Creator analytics counters (Feature 3 & 8)
  const [analytics, setAnalytics] = useState<any | null>(null);

  // Load category default id on load
  useEffect(() => {
    if (domains.length > 0 && !domainId) {
      setDomainId(domains[0].id);
    }
  }, [domains]);

  // Fetch creator specific parameters
  const loadCreatorData = async () => {
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch('/api/analytics', {
        headers: activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.creator);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCreatorData();
  }, [courses]);

  // Filter courses created by this user
  const authoredCourses = courses.filter(c => c.creator_id === currentUser?.id);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = enteredTag.trim().toUpperCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setEnteredTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Submit create or edit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please specify both course title and details description.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const url = editingCourseId ? `/api/courses/${editingCourseId}` : '/api/courses';
      const method = editingCourseId ? 'PATCH' : 'POST';

      const payload: any = {
        title,
        description,
        domainId,
        price: parseFloat(price) || 0,
        status: courseStatus,
        tags
      };

      // Self scaffold modules ONLY on initial creation
      if (!editingCourseId) {
        payload.modules = [
          {
            id: "m_new_" + Math.random().toString(36).substring(2),
            title: "Module 1: Foundations of Architecture",
            duration: "25m",
            lessons: [
              { id: "l_new_1", title: "Course Scope and Lab Environment Setup", duration: "10:30", isLocked: false, preview: true },
              { id: "l_new_2", title: "Core Design patterns and systems blueprints", duration: "15:10", isLocked: true }
            ]
          }
        ];
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        await fetchCourses();
        setTimeout(() => {
          setSuccess(false);
          setEditingCourseId(null);
          resetForm();
          setActiveSegment('manage');
        }, 1500);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to submit course data.');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Connection failure during course publishing.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? Doing so cascades to all enrollments, lessons, and metrics.')) return;
    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        await fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || 'Delete rejected');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Course setup
  const startEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setDomainId(course.domain_id);
    setPrice(String(course.price));
    setCourseStatus(course.status);
    setTags(course.tags || []);
    setActiveSegment('create');
  };

  // Lesson Management Add
  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !managingCourseId) return;

    try {
      const activeToken = localStorage.getItem('learnDcrackToken');
      const res = await fetch(`/api/courses/${managingCourseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          module_title: lessonModule,
          duration: lessonDuration,
          preview: lessonPreview
        })
      });

      if (res.ok) {
        alert("Lesson published relational-wise!");
        setLessonTitle('');
        setLessonContent('');
        setLessonPreview(false);
        setManagingCourseId(null);
        await fetchCourses();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add lesson');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('129.00');
    setCourseStatus('public');
    setTags(['RESONANCE', 'ADVANCED']);
    setEditingCourseId(null);
  };

  return (
    <div className={`pt-24 pb-16 min-h-screen ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#070d19] text-white'
    }`}>
      <div className="px-4 md:px-12 max-w-7xl mx-auto text-left animate-fade-in">
        
        {/* Title Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-slate-205/10">
          <div>
            <h1 className="font-sans text-3xl font-extrabold tracking-tight">Creator Content Management Unit (CMS)</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Construct high-yield course blueprints, upload assets, integrate curriculum modules, and review creator-tier platform statistics.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex p-0.5 rounded-lg border border-slate-800 bg-[#11192e]">
            <button
              onClick={() => { setActiveSegment('manage'); }}
              className={`px-4 py-2 text-xs font-semibold rounded ${
                activeSegment === 'manage' 
                  ? 'bg-green-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Manage syllabuses ({authoredCourses.length})
            </button>
            <button
              onClick={() => { resetForm(); setActiveSegment('create'); }}
              className={`px-4 py-2 text-xs font-semibold rounded ${
                activeSegment === 'create' 
                  ? 'bg-green-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {editingCourseId ? 'Edit Syllabus' : 'Assemble New Course'}
            </button>
          </div>
        </div>

        {/* Dynamic content publisher tab */}
        {activeSegment === 'manage' ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* Creator Metrics Widget (Feature 8!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className={`p-5 rounded-xl border flex items-center gap-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider font-bold">Total Envisioned Views</p>
                  <p className="font-sans text-lg font-extrabold text-white">{(analytics?.totalViews || 12400).toLocaleString()}</p>
                </div>
              </div>

              <div className={`p-5 rounded-xl border flex items-center gap-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider font-bold">Total Course Enrollments</p>
                  <p className="font-sans text-lg font-extrabold text-white">{(analytics?.totalEnrollmentsAcrossAuthored || 3844).toLocaleString()}</p>
                </div>
              </div>

              <div className={`p-5 rounded-xl border flex items-center gap-4 ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
              }`}>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-rose-500/15" />
                </div>
                <div>
                  <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider font-bold">Total Platform Endorsements</p>
                  <p className="font-sans text-lg font-extrabold text-white">{(analytics?.totalViews ? Math.round(analytics.totalViews * 0.03) : 382).toLocaleString()} Likes</p>
                </div>
              </div>

            </div>

            {/* Course management List */}
            <div className={`p-6 rounded-2xl border text-left ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
            }`}>
              <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-green-500" />
                Registered Syllabuses Under My IP Rights
              </h3>

              {authoredCourses.length === 0 ? (
                <div className="text-center py-12 text-slate-500 italic text-xs">
                  You haven't uploaded any technical content yet. Click "Assemble New Course" to write.
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-slate-800/40">
                  {authoredCourses.map((c) => (
                    <div key={c.id} className="pt-4 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      {/* Left Title and domain join info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold font-mono px-2 rounded uppercase ${
                            c.status === 'public' ? 'bg-green-500/15 text-green-500' : 'bg-amber-500/15 text-amber-500'
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-[10px] text-slate-500">Domain ID: {c.domain_id}</span>
                        </div>
                        <h4 className="font-sans font-bold text-sm text-white">{c.title}</h4>
                        <p className="text-slate-400 text-xs truncate max-w-2xl">{c.description}</p>
                      </div>

                      {/* Right Action button arrays */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setManagingCourseId(c.id); }}
                          className="px-3 py-1.5 rounded bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          Add Lesson (Feature 3)
                        </button>
                        <button
                          onClick={() => startEditCourse(c)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-350 cursor-pointer"
                          title="Edit Blueprint properties"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-1.5 rounded bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 cursor-pointer"
                          title="Delete Syllabus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subform: Relational lesson adding panel */}
            {managingCourseId && (
              <div className={`p-6 rounded-2xl border animate-fade-in ${
                theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#11192e] border-slate-800'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-sky-400" />
                    Append New Lesson to: <span className="text-green-400">"{courses.find(c => c.id === managingCourseId)?.title}"</span>
                  </h4>
                  <button onClick={() => setManagingCourseId(null)} className="text-slate-400 text-xs">✕ Cancel</button>
                </div>

                <form onSubmit={handleAddLesson} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Lesson Title</label>
                    <input 
                      type="text" 
                      required
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="e.g. Consensus: Paxos State Machine Mappings"
                      className="w-full bg-[#070d19] border border-slate-800 h-9 rounded text-xs text-white px-3 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Module Name (Syllabus block)</label>
                    <input 
                      type="text" 
                      value={lessonModule}
                      onChange={(e) => setLessonModule(e.target.value)}
                      className="w-full bg-[#070d19] border border-slate-800 h-9 rounded text-xs text-white px-3 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Lesson Duration</label>
                    <input 
                      type="text" 
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      className="w-full bg-[#070d19] border border-slate-800 h-9 rounded text-xs text-white px-3 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 pt-3">
                    <input 
                      type="checkbox" 
                      id="lesPreviewInp"
                      checked={lessonPreview}
                      onChange={() => setLessonPreview(!lessonPreview)}
                      className="accent-[#4be277]"
                    />
                    <label htmlFor="lesPreviewInp" className="text-xs text-slate-300 cursor-pointer">Allow Unenrolled Preview permission</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Technical Study content (Markdown compatible)</label>
                    <textarea 
                      rows={4}
                      value={lessonContent}
                      onChange={(e) => setLessonContent(e.target.value)}
                      placeholder="Input highly technical details for the AI summarizer to parse..."
                      className="w-full bg-[#070d19] border border-slate-800 p-3 rounded text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="px-5 py-2 rounded bg-green-500 text-slate-950 font-bold text-xs cursor-pointer">
                      Publish Relational Lesson Node
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        ) : (
          /* Creating or Editing course wizard */
          <div className="animate-fade-in">
            {success ? (
              <div className="max-w-xl mx-auto bg-emerald-500/10 border border-emerald-400/30 p-8 rounded-2xl text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-[#4be277] mx-auto animate-bounce" />
                <h2 className="font-sans text-xl font-bold text-white">Syllabus Sync Completed!</h2>
                <p className="text-xs text-[#bccbb9]">
                  Relational course coordinates properties locked. Rewriting state managers...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side details blocks (8 cols) */}
                <div className="lg:col-span-8 space-y-6 text-left">
                  <div className={`p-6 rounded-2xl border ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
                  }`}>
                    <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider mb-4">
                      {editingCourseId ? 'Alter Course details' : 'Draft New Syllabus'}
                    </h3>

                    {errorMsg && (
                      <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-405 text-xs rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="space-y-4 font-sans">
                      <div>
                        <label className="block text-xs font-semibold text-slate-450 mb-1 font-mono">Syllabus Title</label>
                        <input 
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Decoupling container networks with secure overlay bridges"
                          className="w-full bg-[#070d19] border border-slate-800 h-11 text-xs text-white rounded-lg px-4 focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-450 mb-1 font-mono">Course Description details</label>
                        <textarea 
                          rows={6}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide analytical breakdowns of key criteria covered..."
                          className="w-full bg-[#070d19] border border-slate-800 p-4 text-xs text-white rounded-lg focus:outline-none focus:border-green-500 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Drag-Drop Media mockup */}
                  <div className={`p-6 rounded-2xl border ${
                    theme === 'light' ? 'bg-white border-slate-205' : 'bg-[#131b2e]/60 border-slate-800'
                  }`}>
                    <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wider mb-4">
                      Syllabus Static Assets
                    </h3>
                    
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setDragOverThumb(true); }}
                      onDragLeave={() => setDragOverThumb(false)}
                      onDrop={(e) => e.preventDefault()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[160px] ${
                        dragOverThumb ? 'border-green-500 bg-green-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/20'
                      }`}
                    >
                      <CloudUpload className="w-10 h-10 text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-white">Upload Syllabus Cover banner</p>
                      <p className="text-[10px] text-slate-500 uppercase mt-1">Supports drag & drop PNG/JPG</p>
                    </div>
                  </div>

                </div>

                {/* Right side pricing & tags (4 cols) */}
                <div className="lg:col-span-4 space-y-6 text-left">
                  
                  <div className={`p-6 rounded-2xl border space-y-4 ${
                    theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131b2e]/60 border-slate-800'
                  }`}>
                    <h3 className="font-sans text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                      Syllabus Meta Configuration
                    </h3>

                    {/* SELECT DOMAIN */}
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-slate-450 uppercase mb-1 font-mono">Curriculum Domain</label>
                      <select 
                        value={domainId}
                        onChange={(e) => setDomainId(e.target.value)}
                        className="w-full bg-[#070d19] border border-slate-800 h-10 rounded-lg px-3 text-xs text-white focus:outline-none"
                      >
                        {domains.map((dom) => (
                          <option key={dom.id} value={dom.id}>{dom.domain_name}</option>
                        ))}
                      </select>
                    </div>

                    {/* PRICING */}
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-slate-450 uppercase mb-1 font-mono">Admission Rate ($)</label>
                      <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-[#070d19] border border-slate-800 h-10 rounded-lg px-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    {/* STATUS */}
                    <div>
                      <span className="block text-xs font-bold tracking-wider text-slate-450 uppercase mb-1.5 font-mono">Permissions Release</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs text-white cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="rel_status" 
                            checked={courseStatus === 'public'} 
                            onChange={() => setCourseStatus('public')}
                            className="accent-green-500"
                          />
                          Release Publicly
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="rel_status" 
                            checked={courseStatus === 'draft'} 
                            onChange={() => setCourseStatus('draft')}
                            className="accent-green-500"
                          />
                          Draft only
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Tags */}
                  <div className={`p-6 rounded-2xl border space-y-3 ${
                    theme === 'light' ? 'bg-white border-slate-205' : 'bg-[#131b2e]/60 border-slate-800'
                  }`}>
                    <h3 className="font-sans text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                      Topic categories
                    </h3>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={enteredTag}
                        onChange={e => setEnteredTag(e.target.value)}
                        placeholder="e.g. KUBERNETES"
                        className="flex-1 bg-[#070d19] border border-slate-800 h-9 rounded text-xs text-white px-3 focus:outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddTag} 
                        className="px-3 rounded bg-green-500 text-slate-950 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 bg-slate-950 text-green-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-slate-800">
                          {t}
                          <button onClick={() => handleRemoveTag(t)} className="font-extrabold hover:text-red-400">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider font-display font-bold cursor-pointer transition-all"
                  >
                    {saving ? 'Synchronizing catalog...' : (editingCourseId ? 'Confirm Updates Properties' : 'Assemble Syllabus Package')}
                  </button>

                  {editingCourseId && (
                    <button 
                      type="button" 
                      onClick={() => { resetForm(); setActiveSegment('manage'); }}
                      className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-xs tracking-wider"
                    >
                      Cancel Edit Mode
                    </button>
                  )}

                </div>

              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

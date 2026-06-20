import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Layers, Trash2, Eye, ShieldAlert, BadgeInfo, CheckCircle, Flame, BarChart2 
} from 'lucide-react';
import { User, Course } from '../types';

export default function AdminView() {
  const { courses, fetchCourses, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'stats'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch users list
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Modify user role API
  const updateRoleHandler = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setSuccessMsg('User role updated successfully!');
        await fetchAllUsers();
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete course pathway API
  const deleteCourseHandler = async (courseId: string) => {
    const confirmation = window.confirm("Are you sure you want to permanently delete this course syllabus from LearnDcrack database?");
    if (!confirmation) return;

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccessMsg('Syllabus removed from platform registry!');
        await fetchCourses();
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4 md:px-12 max-w-7xl mx-auto text-left animate-fade-in min-h-screen">
      
      {/* Title block */}
      <div className="mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] uppercase font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          System Administrator Space
        </div>
        <h1 className="font-sans text-3xl font-extrabold text-white">Platform Control center</h1>
        <p className="text-[#bccbb9] text-xs md:text-sm">
          Core administration box. Moderate user roles, audit course pathways, and inspect platform status metrics.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-[#4be277] text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Admin tabs */}
      <div className="border-b border-[#3d4a3d]/25 mb-8">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`font-sans text-xs uppercase tracking-wider font-bold pb-4 transition-all flex items-center gap-2 ${
              activeTab === 'users' ? 'text-[#4be277] border-b-2 border-[#4be277]' : 'text-[#bccbb9] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Users ({users.length})
          </button>
          
          <button
            onClick={() => setActiveTab('courses')}
            className={`font-sans text-xs uppercase tracking-wider font-bold pb-4 transition-all flex items-center gap-2 ${
              activeTab === 'courses' ? 'text-[#4be277] border-b-2 border-[#4be277]' : 'text-[#bccbb9] hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Manage Syllabi ({courses.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`font-sans text-xs uppercase tracking-wider font-bold pb-4 transition-all flex items-center gap-2 ${
              activeTab === 'stats' ? 'text-[#4be277] border-b-2 border-[#4be277]' : 'text-[#bccbb9] hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Control Statistics
          </button>
        </div>
      </div>

      {/* Tab contexts */}
      {activeTab === 'users' && (
        <div className="bg-[#131b2e]/60 rounded-xl border border-[#3d4a3d]/25 overflow-hidden">
          {loading ? (
            <p className="p-8 text-xs text-[#bccbb9] text-center">Fetching platform members list...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#3d4a3d]/20 bg-[#131b2e] text-[#bccbb9] font-mono text-[10px] uppercase">
                    <th className="p-4 font-bold">User / Profile</th>
                    <th className="p-4 font-bold">Registry Email</th>
                    <th className="p-4 font-bold">Role level</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3d4a3d]/10">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#171f33]/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden shrink-0">
                          <img src={u.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuChBBPgrMA-HTnu9ZVuWIXbm3h3I2NjRPcmXzb_PuZe2Gxu_j9t5lMnTy3wvFkP2eSx9JkJEg_73YJXnu5YM25KZr9Z-mSjvjvWdbnY2vP68lBwe0feIHWYvIX5smgD-Zy-YdKuCu-upP_siEniw2EDJngCyeMxosrAr6s-EyZabS51QEs33vJX1E1lFwGHfaq1NMztGPXqEJ04z8DruupI_x2tZezhTO9hYHoXkWoaH8kR_8tPb8mPvXfuno8IyeBbZrl9a_pcVKJD"} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-white font-sans">{u.name}</span>
                      </td>
                      <td className="p-4 font-mono text-[#bccbb9]">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-400' :
                          u.role === 'author' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-[#4be277]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select 
                          value={u.role} 
                          onChange={(e) => updateRoleHandler(u.id, e.target.value)}
                          className="bg-[#131b2e] border border-[#3d4a3d]/30 rounded px-2.5 py-1 text-[11px] text-white focus:outline-none cursor-pointer"
                        >
                          <option value="learner">Learner</option>
                          <option value="author">Author</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-[#131b2e]/60 rounded-xl border border-[#3d4a3d]/25 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#3d4a3d]/20 bg-[#131b2e] text-[#bccbb9] font-mono text-[10px] uppercase">
                  <th className="p-4 font-bold">Course Syllabus Title</th>
                  <th className="p-4 font-bold">Author</th>
                  <th className="p-4 font-bold">Modules</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Removal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d4a3d]/10">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#171f33]/40 transition-colors">
                    <td className="p-4 font-semibold text-white font-sans max-w-sm truncate">{c.title}</td>
                    <td className="p-4 text-[#bccbb9]">{c.authorName}</td>
                    <td className="p-4 font-mono text-[#bccbb9]">{c.modules.length} modules</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        c.status === 'public' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-[#bccbb9]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteCourseHandler(c.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                        title="Delete Course Syllabus"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
          
          <div className="p-6 rounded-xl bg-[#131b2e]/60 border border-[#3d4a3d]/25 space-y-1.5">
            <p className="font-mono text-[10px] uppercase text-[#bccbb9] tracking-wider">Total Registers</p>
            <p className="font-sans text-3xl font-bold text-white">{users.length} Users</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">100% Active session logs</p>
          </div>

          <div className="p-6 rounded-xl bg-[#131b2e]/60 border border-[#3d4a3d]/25 space-y-1.5">
            <p className="font-mono text-[10px] uppercase text-[#bccbb9] tracking-wider">Active Syllabi</p>
            <p className="font-sans text-3xl font-bold text-white">{courses.length} courses</p>
            <p className="text-[10px] text-purple-400 font-semibold mt-1">100% verified paths</p>
          </div>

          <div className="p-6 rounded-xl bg-[#131b2e]/60 border border-[#3d4a3d]/25 space-y-1.5">
            <p className="font-mono text-[10px] uppercase text-[#bccbb9] tracking-wider">Active Enrollments</p>
            <p className="font-sans text-3xl font-bold text-[#4be277]">2 Enrollments</p>
            <p className="text-[10px] text-[#bccbb9]/60 mt-1">Calculated progress tracking</p>
          </div>

          <div className="p-6 rounded-xl bg-[#131b2e]/60 border border-[#3d4a3d]/25 space-y-1.5">
            <p className="font-mono text-[10px] uppercase text-[#bccbb9] tracking-wider">Site Telemetry status</p>
            <p className="font-sans text-3xl font-bold text-emerald-400">ONLINE</p>
            <p className="text-[10px] text-[#bccbb9]/60 mt-1">API Node: port 3000</p>
          </div>

        </div>
      )}

    </div>
  );
}

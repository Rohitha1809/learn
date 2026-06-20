import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, Domain, Enrollment, ActivityLog } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  courses: Course[];
  fetchCourses: () => Promise<void>;
  domains: Domain[];
  fetchDomains: () => Promise<void>;
  enrollments: Enrollment[];
  fetchEnrollments: () => Promise<void>;
  bookmarks: any[];
  fetchBookmarks: () => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  activityLogs: ActivityLog[];
  fetchActivityLogs: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  completeLesson: (enrollmentId: string, lessonId: string) => Promise<void>;
  logout: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (payload: any) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (payload: any) => Promise<{ success: boolean; error?: string }>;
  loadingAuth: boolean;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('learnDcrackToken'));
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Unified secured request helper
  const secureFetch = async (url: string, options: RequestInit = {}) => {
    const activeToken = localStorage.getItem('learnDcrackToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
    };
    return fetch(url, { ...options, headers });
  };

  const fetchDomains = async () => {
    try {
      const res = await secureFetch('/api/domains');
      if (res.ok) {
        const data = await res.json();
        setDomains(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await secureFetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEnrollments = async () => {
    if (!token) return;
    try {
      const res = await secureFetch('/api/enrollments');
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookmarks = async () => {
    if (!token) return;
    try {
      const res = await secureFetch('/api/bookmarks');
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBookmark = async (courseId: string) => {
    if (!token) return;
    try {
      const res = await secureFetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      });
      if (res.ok) {
        await fetchBookmarks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const res = await secureFetch('/api/activity-logs');
      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // JWT Login query
  const login = async (email: string, password: string) => {
    try {
      const res = await secureFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('learnDcrackToken', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        
        // Refresh session context data
        await Promise.all([
          fetchEnrollments(),
          fetchBookmarks(),
          fetchActivityLogs(),
          fetchCourses()
        ]);
        return { success: true };
      }
      return { success: false, error: data.error || 'Server rejected authorization context' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network split occurred' };
    }
  };

  // JWT Register query
  const registerUser = async (payload: any) => {
    try {
      const res = await secureFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('learnDcrackToken', data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        
        await Promise.all([
          fetchEnrollments(),
          fetchBookmarks(),
          fetchActivityLogs(),
          fetchCourses()
        ]);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration timeout' };
    }
  };

  // Profile Update query
  const updateUserProfile = async (payload: any) => {
    try {
      const res = await secureFetch('/api/profile/update', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to sync user metrics' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('learnDcrackToken');
    setToken(null);
    setCurrentUser(null);
    setEnrollments([]);
    setBookmarks([]);
    setCurrentView('home');
  };

  const enrollInCourse = async (courseId: string) => {
    if (!token) return;
    try {
      const res = await secureFetch('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify({ contentId: courseId })
      });
      if (res.ok) {
        await Promise.all([
          fetchEnrollments(),
          fetchCourses(),
          fetchActivityLogs()
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const completeLesson = async (enrollmentId: string, lessonId: string) => {
    try {
      const res = await secureFetch(`/api/enrollments/${enrollmentId}/lesson-complete`, {
        method: 'POST',
        body: JSON.stringify({ lessonId })
      });
      if (res.ok) {
        await Promise.all([
          fetchEnrollments(),
          fetchActivityLogs(),
          fetchCourses()
        ]);
        // Update local user object XP too
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            xp: currentUser.xp + 20
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Validate existing stored token session on startup
  const validateSessionOnStartup = async () => {
    setLoadingAuth(true);
    const activeToken = localStorage.getItem('learnDcrackToken');
    if (activeToken) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
          setToken(activeToken);
        } else {
          // Token expired
          localStorage.removeItem('learnDcrackToken');
          setToken(null);
        }
      } catch (err) {
        console.warn('Authentication token validation skipped due to offline context', err);
      }
    }
    setLoadingAuth(false);
  };

  useEffect(() => {
    const init = async () => {
      await validateSessionOnStartup();
      await fetchDomains();
      await fetchCourses();
    };
    init();
  }, []);

  // Sync additional data once authenticated
  useEffect(() => {
    if (token && currentUser) {
      fetchEnrollments();
      fetchBookmarks();
      fetchActivityLogs();
    }
  }, [token, currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      token,
      currentView,
      setCurrentView,
      selectedCourseId,
      setSelectedCourseId,
      courses,
      fetchCourses,
      domains,
      fetchDomains,
      enrollments,
      fetchEnrollments,
      bookmarks,
      fetchBookmarks,
      toggleBookmark,
      activityLogs,
      fetchActivityLogs,
      enrollInCourse,
      completeLesson,
      logout,
      login,
      registerUser,
      updateUserProfile,
      loadingAuth,
      theme,
      setTheme
    }}>
      <div className={theme === 'dark' ? 'dark-mode-root' : 'light-mode-root'}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

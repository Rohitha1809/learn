export interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'author' | 'admin';
  avatar: string;
  bio: string;
  streak: number;
  xp: number;
  createdAt: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  tags: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  preview?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
}

export interface Course {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  authorBio: string;
  domainId: string;
  title: string;
  description: string;
  contentType: 'course' | 'tutorial' | 'article';
  thumbnail: string;
  mediaUrl?: string;
  tags: string[];
  status: 'draft' | 'public';
  views: number;
  likes: number;
  enrolledCount: number;
  createdAt: string;
  modules: Module[];
  price?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isAuthor?: boolean;
  contentId: string;
  comment: string;
  likes: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  contentId: string;
  progress: number;
  completedLessons: string[];
}

export interface ActivityLog {
  id: string;
  type: 'lesson_completed' | 'badge_earned' | 'enrolled';
  title: string;
  subtitle: string;
  timestamp: string;
}

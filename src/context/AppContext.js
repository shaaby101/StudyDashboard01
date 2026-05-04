'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

// Mock data
const ROLE_PROFILES = {
  student: {
    id: 'STU001',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@campus.edu',
    role: 'student',
    avatar: 'AM',
    department: 'Computer Science',
    semester: 5,
    enrolledCourses: ['CS301', 'CS302', 'CS303', 'CS304', 'CS305'],
  },
  faculty: {
    id: 'FAC001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@campus.edu',
    role: 'faculty',
    avatar: 'PS',
    department: 'Computer Science',
    subjects: ['CS301', 'CS303'],
  },
  admin: {
    id: 'ADM001',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@campus.edu',
    role: 'admin',
    avatar: 'RK',
    designation: 'Principal',
  },
  parent: {
    id: 'PAR001',
    name: 'Rajesh Mehta',
    email: 'rajesh.mehta@example.com',
    role: 'parent',
    avatar: 'RM',
    wardId: 'STU001',
    wardName: 'Arjun Mehta',
  },
};

const DEMO_USERS = [
  {
    email: 'student@demo.edu',
    password: 'studesh123',
    role: 'student',
    name: 'Arjun Mehta',
  },
  {
    email: 'faculty@demo.edu',
    password: 'studesh123',
    role: 'faculty',
    name: 'Dr. Priya Sharma',
  },
  {
    email: 'admin@demo.edu',
    password: 'studesh123',
    role: 'admin',
    name: 'Prof. Rajesh Kumar',
  },
  {
    email: 'parent@demo.edu',
    password: 'studesh123',
    role: 'parent',
    name: 'Ananya Mehta',
  },
];

const MOCK_COURSES = [
  { id: 'CS301', name: 'Data Structures & Algorithms', code: 'CS301', faculty: 'Dr. Priya Sharma', credits: 4 },
  { id: 'CS302', name: 'Operating Systems', code: 'CS302', faculty: 'Dr. Ankit Verma', credits: 4 },
  { id: 'CS303', name: 'Database Management Systems', code: 'CS303', faculty: 'Dr. Priya Sharma', credits: 3 },
  { id: 'CS304', name: 'Computer Networks', code: 'CS304', faculty: 'Prof. Neha Gupta', credits: 3 },
  { id: 'CS305', name: 'Software Engineering', code: 'CS305', faculty: 'Dr. Sanjay Patel', credits: 3 },
];

const generateAttendanceData = () => {
  const subjects = ['CS301', 'CS302', 'CS303', 'CS304', 'CS305'];
  const data = {};
  subjects.forEach(sub => {
    const total = Math.floor(Math.random() * 15) + 25;
    const attended = Math.floor(total * (0.55 + Math.random() * 0.4));
    data[sub] = {
      total,
      attended,
      percentage: Math.round((attended / total) * 100),
      records: Array.from({ length: total }, (_, i) => ({
        date: new Date(2026, 0, 6 + i * 2).toISOString().split('T')[0],
        present: i < attended,
      })),
    };
  });
  return data;
};

const MOCK_ATTENDANCE = generateAttendanceData();

const MOCK_SCHEDULE = [
  { id: 1, day: 'Monday', time: '09:00 - 10:00', subject: 'CS301', room: 'LH-101', type: 'Lecture' },
  { id: 2, day: 'Monday', time: '10:15 - 11:15', subject: 'CS303', room: 'LH-102', type: 'Lecture' },
  { id: 3, day: 'Monday', time: '14:00 - 16:00', subject: 'CS301', room: 'Lab-A', type: 'Lab' },
  { id: 4, day: 'Tuesday', time: '09:00 - 10:00', subject: 'CS302', room: 'LH-103', type: 'Lecture' },
  { id: 5, day: 'Tuesday', time: '10:15 - 11:15', subject: 'CS304', room: 'LH-101', type: 'Lecture' },
  { id: 6, day: 'Tuesday', time: '11:30 - 12:30', subject: 'CS305', room: 'LH-104', type: 'Lecture' },
  { id: 7, day: 'Wednesday', time: '09:00 - 10:00', subject: 'CS301', room: 'LH-101', type: 'Lecture' },
  { id: 8, day: 'Wednesday', time: '10:15 - 11:15', subject: 'CS303', room: 'LH-102', type: 'Lecture' },
  { id: 9, day: 'Wednesday', time: '14:00 - 16:00', subject: 'CS303', room: 'Lab-B', type: 'Lab' },
  { id: 10, day: 'Thursday', time: '09:00 - 10:00', subject: 'CS302', room: 'LH-103', type: 'Lecture' },
  { id: 11, day: 'Thursday', time: '10:15 - 11:15', subject: 'CS304', room: 'LH-101', type: 'Lecture' },
  { id: 12, day: 'Thursday', time: '11:30 - 12:30', subject: 'CS305', room: 'LH-104', type: 'Lecture' },
  { id: 13, day: 'Friday', time: '09:00 - 10:00', subject: 'CS301', room: 'LH-101', type: 'Lecture' },
  { id: 14, day: 'Friday', time: '10:15 - 12:15', subject: 'CS302', room: 'Lab-C', type: 'Lab' },
];

const MOCK_FACULTY_LIST = [
  { id: 'FAC001', name: 'Dr. Priya Sharma', department: 'Computer Science', subjects: ['CS301', 'CS303'], status: 'active' },
  { id: 'FAC002', name: 'Dr. Ankit Verma', department: 'Computer Science', subjects: ['CS302'], status: 'active' },
  { id: 'FAC003', name: 'Prof. Neha Gupta', department: 'Computer Science', subjects: ['CS304'], status: 'on-leave' },
  { id: 'FAC004', name: 'Dr. Sanjay Patel', department: 'Computer Science', subjects: ['CS305'], status: 'active' },
  { id: 'FAC005', name: 'Dr. Meera Iyer', department: 'Electronics', subjects: ['EC301', 'EC302'], status: 'active' },
  { id: 'FAC006', name: 'Prof. Amit Joshi', department: 'Mechanical', subjects: ['ME301'], status: 'active' },
];

const MOCK_LEAVE_REQUESTS = [
  { id: 1, faculty: 'Prof. Neha Gupta', type: 'Medical', from: '2026-05-01', to: '2026-05-05', status: 'approved', reason: 'Medical appointment' },
  { id: 2, faculty: 'Dr. Priya Sharma', type: 'Casual', from: '2026-05-10', to: '2026-05-10', status: 'pending', reason: 'Personal work' },
];

const MOCK_SYLLABUS = {
  CS301: {
    title: 'Data Structures & Algorithms',
    units: [
      { name: 'Unit 1: Introduction & Arrays', topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Time & Space Complexity'] },
      { name: 'Unit 2: Trees', topics: ['Binary Trees', 'BST', 'AVL Trees', 'B-Trees', 'Tree Traversals'] },
      { name: 'Unit 3: Graphs', topics: ['Graph Representations', 'BFS', 'DFS', 'Shortest Path', 'MST'] },
      { name: 'Unit 4: Sorting & Searching', topics: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Hashing', 'Binary Search'] },
      { name: 'Unit 5: Advanced Topics', topics: ['Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'Divide & Conquer'] },
    ],
  },
  CS302: {
    title: 'Operating Systems',
    units: [
      { name: 'Unit 1: OS Fundamentals', topics: ['Process Management', 'Threads', 'CPU Scheduling', 'Process Synchronization'] },
      { name: 'Unit 2: Memory Management', topics: ['Paging', 'Segmentation', 'Virtual Memory', 'Page Replacement'] },
      { name: 'Unit 3: File Systems', topics: ['File Organization', 'Directory Structure', 'Disk Scheduling', 'RAID'] },
      { name: 'Unit 4: Deadlocks', topics: ['Deadlock Prevention', 'Deadlock Avoidance', 'Deadlock Detection', 'Recovery'] },
    ],
  },
  CS303: {
    title: 'Database Management Systems',
    units: [
      { name: 'Unit 1: Relational Model', topics: ['ER Model', 'Relational Algebra', 'SQL Basics', 'Normalization'] },
      { name: 'Unit 2: SQL Advanced', topics: ['Joins', 'Subqueries', 'Views', 'Stored Procedures', 'Triggers'] },
      { name: 'Unit 3: Transactions', topics: ['ACID Properties', 'Concurrency Control', 'Locking', 'Deadlock Handling'] },
      { name: 'Unit 4: NoSQL & Indexing', topics: ['B+ Trees', 'Hashing', 'MongoDB Basics', 'CAP Theorem'] },
    ],
  },
  CS304: {
    title: 'Computer Networks',
    units: [
      { name: 'Unit 1: Network Fundamentals', topics: ['OSI Model', 'TCP/IP', 'Network Topologies', 'Switching'] },
      { name: 'Unit 2: Data Link Layer', topics: ['Framing', 'Error Detection', 'Flow Control', 'MAC Protocols'] },
      { name: 'Unit 3: Network Layer', topics: ['IP Addressing', 'Routing Algorithms', 'Subnetting', 'IPv6'] },
      { name: 'Unit 4: Transport & Application', topics: ['TCP', 'UDP', 'DNS', 'HTTP', 'Email Protocols'] },
    ],
  },
  CS305: {
    title: 'Software Engineering',
    units: [
      { name: 'Unit 1: Software Process', topics: ['SDLC Models', 'Agile', 'Scrum', 'Requirements Engineering'] },
      { name: 'Unit 2: Design', topics: ['UML Diagrams', 'Design Patterns', 'Architecture', 'Component Design'] },
      { name: 'Unit 3: Testing', topics: ['Unit Testing', 'Integration Testing', 'Black Box', 'White Box', 'Test Driven Development'] },
      { name: 'Unit 4: Project Management', topics: ['Estimation', 'Risk Management', 'Quality Assurance', 'Maintenance'] },
    ],
  },
};

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [studyHours, setStudyHours] = useState({
    'STU001': { name: 'Arjun Mehta', hours: 12.5 },
    'STU002': { name: 'Priya Patel', hours: 8.2 },
    'STU003': { name: 'Rahul Kumar', hours: 5.5 },
  });
  
  const logStudyTime = useCallback((studentId, studentName, minutes) => {
    setStudyHours(prev => {
      const current = prev[studentId] || { name: studentName, hours: 0 };
      return {
        ...prev,
        [studentId]: {
          ...current,
          hours: current.hours + (minutes / 60)
        }
      };
    });
  }, []);

  const [syllabus, setSyllabus] = useState(MOCK_SYLLABUS);
  const [appointments, setAppointments] = useState([
    { id: 1, facultyId: 'FAC001', faculty: 'Dr. Priya Sharma', date: '2026-05-10', time: '10:00 AM', status: 'confirmed', subject: 'CS301 Progress', requesterName: 'Rajesh Mehta', requesterRole: 'parent', message: 'Looking forward to our meeting.' },
    { id: 2, facultyId: 'FAC004', faculty: 'Dr. Sanjay Patel', date: '2026-05-12', time: '02:00 PM', status: 'pending', subject: 'General Performance', requesterName: 'Arjun Mehta', requesterRole: 'student' }
  ]);
  const [results, setResults] = useState([
    { subject: 'CS301', name: 'Data Structures & Algorithms', midTerm: 85, final: 90, grade: 'A' },
    { subject: 'CS302', name: 'Operating Systems', midTerm: 78, final: 82, grade: 'B+' },
    { subject: 'CS303', name: 'Database Management Systems', midTerm: 92, final: 95, grade: 'A+' },
    { subject: 'CS304', name: 'Computer Networks', midTerm: 65, final: 70, grade: 'B' },
  ]);
  const [materials, setMaterials] = useState([
    { id: 1, name: 'DSA_Unit1_Notes.pdf', size: '2.4 MB', date: '2026-04-28', subject: 'CS301' },
    { id: 2, name: 'DBMS_ER_Diagram_Examples.pdf', size: '1.8 MB', date: '2026-04-25', subject: 'CS303' },
    { id: 3, name: 'Graph_Algorithms_Slides.pptx', size: '5.1 MB', date: '2026-04-20', subject: 'CS301' },
  ]);
  const [forums, setForums] = useState({
    'CS301': [
      {
        id: 1,
        author: 'Arjun Mehta',
        role: 'student',
        question: 'Can someone explain AVL tree rotations?',
        timestamp: '2 hours ago',
        answers: [],
        aiPrompted: false,
      }
    ]
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Low attendance in CS304 — 68%', time: '2 hours ago', read: false },
    { id: 2, type: 'info', message: 'New syllabus uploaded for CS301', time: '5 hours ago', read: false },
    { id: 3, type: 'success', message: 'Leave request approved', time: '1 day ago', read: true },
  ]);

  // --- NEW WINNING FEATURES STATE ---
  const [studentStats, setStudentStats] = useState({
    xp: 2450,
    level: 12,
    nextLevelXp: 3000,
    streak: 5,
    rank: 'Gold II'
  });

  const [badges, setBadges] = useState([
    { id: 1, name: 'Night Owl', icon: '🌙', description: 'Used Study Corner after 10 PM', rarity: 'rare' },
    { id: 2, name: 'Consistency King', icon: '🔥', description: '5 day study streak', rarity: 'legendary' },
    { id: 3, name: 'Top Helper', icon: '🤝', description: 'Answered 5 forum questions', rarity: 'common' }
  ]);

  const [academicRisk, setAcademicRisk] = useState({
    overall: 'Low',
    score: 15, // 0-100, lower is better
    factors: [
      { id: 1, text: 'Strong performance in Lab sessions', type: 'positive' },
      { id: 2, text: 'Low engagement in OS Lectures (65%)', type: 'warning' }
    ]
  });

  const addXp = useCallback((amount) => {
    setStudentStats(prev => {
      const newXp = prev.xp + amount;
      if (newXp >= prev.nextLevelXp) {
        setNotifications(n => [{
          id: Date.now(),
          type: 'success',
          message: `Level Up! You reached Level ${prev.level + 1}`,
          time: 'Just now',
          read: false
        }, ...n]);
        return {
          ...prev,
          xp: newXp,
          level: prev.level + 1,
          nextLevelXp: Math.round(prev.nextLevelXp * 1.5)
        };
      }
      return { ...prev, xp: newXp };
    });
  }, []);


  useEffect(() => {
    const savedTheme = localStorage.getItem('studesh-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Hydrate user from localStorage for immediate UI responsiveness
    const savedUser = localStorage.getItem('studesh-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  const applyUserProfile = useCallback((serverUser) => {
    if (!serverUser) return null;
    const profile = ROLE_PROFILES[serverUser.role] || {};
    const initials = serverUser.name
      ? serverUser.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map(part => part[0])
          .join('')
          .toUpperCase()
      : 'U';
    return {
      ...profile,
      ...serverUser,
      avatar: profile.avatar || initials,
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        const fullUser = applyUserProfile(data.user);
        setUser(fullUser);
        localStorage.setItem('studesh-user', JSON.stringify(fullUser));
        return;
      }
    } catch (error) {
      // Ignore fetch failures and treat as logged out.
    }
    // Only clear if we don't have a demo user (demo users have 'DEMO' in their ID)
    setUser(prev => {
      if (prev?.id?.includes('DEMO')) return prev;
      localStorage.removeItem('studesh-user');
      return null;
    });
  }, [applyUserProfile]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await refreshUser();
      if (active) setLoadingUser(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [refreshUser]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('studesh-theme', next);
      return next;
    });
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const demoUser = DEMO_USERS.find(
      (account) =>
        account.email.toLowerCase() === normalizedEmail &&
        account.password === String(password || '')
    );

    if (demoUser) {
      const demoProfile = applyUserProfile({
        id: `${demoUser.role.toUpperCase()}-DEMO`,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
      });
      setUser(demoProfile);
      localStorage.setItem('studesh-user', JSON.stringify(demoProfile));
      return { ok: true, user: demoProfile, demo: true };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data?.error || 'Login failed.' };
      }
      const nextUser = applyUserProfile(data.user);
      setUser(nextUser);
      localStorage.setItem('studesh-user', JSON.stringify(nextUser));
      return { ok: true, user: nextUser };
    } catch (error) {
      return { ok: false, error: 'Login failed.' };
    }
  }, [applyUserProfile]);

  const register = useCallback(async ({ name, email, password, role }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data?.error || 'Registration failed.' };
      }
      const nextUser = applyUserProfile(data.user);
      setUser(nextUser);
      return { ok: true, user: nextUser };
    } catch (error) {
      return { ok: false, error: 'Registration failed.' };
    }
  }, [applyUserProfile]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout failures.
    }
    setUser(null);
    localStorage.removeItem('studesh-user');
  }, []);

  const addAppointment = useCallback((apt) => {
    setAppointments(prev => [apt, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), type: 'info', message: `New appointment request from ${apt.requesterName} (${apt.requesterRole})`, time: 'Just now', read: false },
      ...prev
    ]);
  }, []);

  const respondToAppointment = useCallback((id, status, message) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status, message } : apt));
  }, []);

  const enrollCourse = useCallback((courseId) => {
    setUser(prev => {
      if (prev?.role !== 'student' || prev.enrolledCourses?.includes(courseId)) return prev;
      return { ...prev, enrolledCourses: [...(prev.enrolledCourses || []), courseId] };
    });
  }, []);

  const addCourse = useCallback((course, courseSyllabus) => {
    setCourses(prev => [...prev, course]);
    setSyllabus(prev => ({ ...prev, [course.id]: courseSyllabus }));
    setUser(prev => {
      if (prev?.role === 'faculty') {
        return { ...prev, subjects: [...(prev.subjects || []), course.id] };
      }
      return prev;
    });
  }, []);

  const addMaterial = useCallback((material) => {
    setMaterials(prev => [material, ...prev]);
  }, []);

  const removeMaterial = useCallback((id) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }, []);

  const addForumQuestion = useCallback((courseId, question) => {
    setForums(prev => {
      const courseForums = prev[courseId] || [];
      return {
        ...prev,
        [courseId]: [
          {
            id: Date.now(),
            author: user?.name,
            role: user?.role,
            question,
            timestamp: 'Just now',
            answers: [],
            aiPrompted: false,
          },
          ...courseForums
        ]
      };
    });
  }, [user]);

  const addForumAnswer = useCallback((courseId, questionId, content, isAi = false) => {
    setForums(prev => {
      const courseForums = prev[courseId] || [];
      return {
        ...prev,
        [courseId]: courseForums.map(q => 
          q.id === questionId 
            ? { 
                ...q, 
                answers: [...q.answers, {
                  id: Date.now(),
                  author: isAi ? 'AI Companion' : user?.name,
                  role: isAi ? 'ai' : user?.role,
                  content,
                  timestamp: 'Just now'
                }] 
              }
            : q
        )
      };
    });
  }, [user]);

  const promptAiAnswer = useCallback((courseId, questionId) => {
    setForums(prev => {
      const courseForums = prev[courseId] || [];
      return {
        ...prev,
        [courseId]: courseForums.map(q => 
          q.id === questionId ? { ...q, aiPrompted: true } : q
        )
      };
    });
  }, []);

  const markAttendance = useCallback((courseId, studentId, present) => {
    setAttendance(prev => {
      const updated = { ...prev };
      if (updated[courseId]) {
        updated[courseId] = {
          ...updated[courseId],
          total: updated[courseId].total + 1,
          attended: updated[courseId].attended + (present ? 1 : 0),
          percentage: Math.round(((updated[courseId].attended + (present ? 1 : 0)) / (updated[courseId].total + 1)) * 100),
        };
      }
      return updated;
    });
  }, []);

  const value = {
    theme,
    toggleTheme,
    user,
    loadingUser,
    login,
    register,
    logout,
    sidebarCollapsed,
    setSidebarCollapsed,
    courses,
    attendance,
    markAttendance,
    schedule: MOCK_SCHEDULE,
    facultyList: MOCK_FACULTY_LIST,
    leaveRequests: MOCK_LEAVE_REQUESTS,
    syllabus,
    notifications,
    setNotifications,
    enrollCourse,
    addCourse,
    materials,
    addMaterial,
    removeMaterial,
    forums,
    addForumQuestion,
    addForumAnswer,
    promptAiAnswer,
    appointments,
    addAppointment,
    respondToAppointment,
    results,
    studyHours,
    logStudyTime,
    studentStats,
    addXp,
    badges,
    academicRisk
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

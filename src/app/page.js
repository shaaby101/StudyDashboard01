'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconGraduation, IconUsers, IconBuilding, IconArrowRight, IconBrain, IconChart, IconCalendar } from '@/components/Icons';
import styles from './page.module.css';

const ROLES = [
  {
    key: 'student',
    title: 'Student',
    description: 'Access attendance, courses, and your AI study companion',
    icon: IconGraduation,
    features: ['Real-time Attendance', 'AI Study Companion', 'Course Materials'],
    gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
    path: '/student',
  },
  {
    key: 'parent',
    title: 'Parent',
    description: "Track your ward's academic progress and schedule appointments",
    icon: IconUsers,
    features: ['Track Attendance', 'View Results', 'Faculty Appointments'],
    gradient: 'linear-gradient(135deg, #0984E3, #74B9FF)',
    path: '/parent',
  },
  {
    key: 'faculty',
    title: 'Faculty',
    description: 'Manage attendance, schedules, and upload course materials',
    icon: IconUsers,
    features: ['Mark Attendance', 'Schedule Management', 'Upload Syllabus'],
    gradient: 'linear-gradient(135deg, #00B894, #55EFC4)',
    path: '/faculty',
  },
  {
    key: 'admin',
    title: 'Administrator',
    description: 'Campus-wide metrics, analytics, and AI timetable generation',
    icon: IconBuilding,
    features: ['Campus Analytics', 'Faculty Overview', 'AI Timetable'],
    gradient: 'linear-gradient(135deg, #E17055, #FDCB6E)',
    path: '/admin',
  },
];

export default function LandingPage() {
  const { user, theme, toggleTheme } = useApp();
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(`/${user.role}`);
    }
    setLoaded(true);
  }, [user, router]);

  const handleRoleSelect = (role) => {
    router.push(`/login?role=${role.key}`);
  };

  if (user) return null;

  return (
    <div className={styles.landing}>
      {/* Animated background */}
      <div className={styles.bgGradient}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgOrb3} />
      </div>

      <div className={`${styles.container} ${loaded ? styles.loaded : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <IconGraduation size={28} />
            </div>
            <div>
              <h1 className={styles.brandName}>Studesh</h1>
              <p className={styles.brandTagline}>Campus Intelligence Platform</p>
            </div>
          </div>
          <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <IconBrain size={14} />
              <span>AI-Powered Campus Ecosystem</span>
            </div>
            <h2 className={styles.heroTitle}>
              Transform How Your
              <br />
              <span className={styles.heroAccent}>Campus Connects</span>
            </h2>
            <p className={styles.heroDescription}>
              A unified digital ecosystem that brings together students, faculty, and administration
              — powered by contextual AI to elevate every aspect of academic life.
            </p>
          </div>

          {/* Feature pills */}
          <div className={styles.featurePills}>
            <div className={styles.pill}>
              <IconChart size={16} />
              <span>Smart Analytics</span>
            </div>
            <div className={styles.pill}>
              <IconBrain size={16} />
              <span>AI Companion</span>
            </div>
            <div className={styles.pill}>
              <IconCalendar size={16} />
              <span>Auto Scheduling</span>
            </div>
          </div>
        </section>

        {/* Role Cards */}
        <section className={styles.roles}>
          <p className={styles.rolesLabel}>Select your role to continue</p>
          <div className={styles.roleGrid}>
            {ROLES.map((role, index) => (
              <button
                key={role.key}
                className={`${styles.roleCard} ${hoveredRole === role.key ? styles.roleCardHovered : ''}`}
                onMouseEnter={() => setHoveredRole(role.key)}
                onMouseLeave={() => setHoveredRole(null)}
                onClick={() => handleRoleSelect(role)}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={styles.roleIconWrapper} style={{ background: role.gradient }}>
                  <role.icon size={28} />
                </div>
                <h3 className={styles.roleTitle}>{role.title}</h3>
                <p className={styles.roleDesc}>{role.description}</p>
                <div className={styles.roleFeatures}>
                  {role.features.map(f => (
                    <span key={f} className={styles.roleFeature}>{f}</span>
                  ))}
                </div>
                <div className={styles.roleArrow}>
                  <span>Enter Dashboard</span>
                  <IconArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Built with ✦ for modern campuses</p>
        </footer>
      </div>
    </div>
  );
}

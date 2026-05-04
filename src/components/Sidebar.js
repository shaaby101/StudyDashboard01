'use client';

import { useApp } from '@/context/AppContext';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconDashboard, IconUsers, IconCalendar, IconBook, IconChart,
  IconBrain, IconSettings, IconLogout, IconChevronLeft, IconChevronRight,
  IconGraduation, IconBuilding, IconFileText, IconUpload, IconMail, IconGrid, IconWand
} from './Icons';
import styles from './Sidebar.module.css';

export const NAV_ITEMS = {
  student: [
    { label: 'Dashboard', icon: IconDashboard, path: '/student' },
    { label: 'Attendance', icon: IconChart, path: '/student/attendance' },
    { label: 'AI Companion', icon: IconBrain, path: '/student/ai' },
    { label: 'Study Corner', icon: IconBrain, path: '/student/study-corner' },
    { label: 'Courses', icon: IconBook, path: '/student/courses' },
    { label: 'Schedule', icon: IconCalendar, path: '/student/schedule' },
    { label: 'Appointments', icon: IconCalendar, path: '/student/appointments' },
    { label: 'Forum', icon: IconGrid, path: '/student/forum' },
  ],
  faculty: [
    { label: 'Dashboard', icon: IconDashboard, path: '/faculty' },
    { label: 'Mark Attendance', icon: IconUsers, path: '/faculty/attendance' },
    { label: 'My Schedule', icon: IconCalendar, path: '/faculty/schedule' },
    { label: 'Materials', icon: IconUpload, path: '/faculty/materials' },
    { label: 'Appointments', icon: IconCalendar, path: '/faculty/appointments' },
    { label: 'Forum', icon: IconGrid, path: '/faculty/forum' },
    { label: 'Leave', icon: IconMail, path: '/faculty/leave' },
  ],
  admin: [
    { label: 'Dashboard', icon: IconDashboard, path: '/admin' },
    { label: 'Analytics', icon: IconChart, path: '/admin/analytics' },
    { label: 'Faculty', icon: IconUsers, path: '/admin/faculty' },
    { label: 'Timetable AI', icon: IconWand, path: '/admin/timetable' },
    { label: 'Departments', icon: IconBuilding, path: '/admin/departments' },
  ],
  parent: [
    { label: 'Dashboard', icon: IconDashboard, path: '/parent' },
    { label: 'Appointments', icon: IconCalendar, path: '/parent/appointments' },
  ],
};

export default function Sidebar() {
  const { user, logout, sidebarCollapsed, setSidebarCollapsed, theme, toggleTheme } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];
  const roleLabel = user.role === 'admin' ? 'Administrator' : user.role === 'faculty' ? 'Faculty' : user.role === 'parent' ? 'Parent' : 'Student';

  return (
    <>
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <IconGraduation size={24} />
          </div>
          {!sidebarCollapsed && (
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Studesh</span>
              <span className={styles.logoSub}>Campus Intelligence</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {!sidebarCollapsed && <span className={styles.navSectionLabel}>Menu</span>}
            {items.map(item => {
              const isActive = pathname === item.path || 
                (item.path !== `/${user.role}` && pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={() => router.push(item.path)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {isActive && <div className={styles.activeIndicator} />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          {/* Theme Toggle */}
          <button className={styles.navItem} onClick={toggleTheme} title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <div className={styles.themeToggle}>
              <div className={`${styles.themeToggleTrack} ${theme === 'dark' ? styles.dark : ''}`}>
                <div className={styles.themeToggleThumb}>
                  {theme === 'light' ? '☀️' : '🌙'}
                </div>
              </div>
            </div>
            {!sidebarCollapsed && <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* User Profile */}
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{user.avatar}</div>
            {!sidebarCollapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{roleLabel}</span>
              </div>
            )}
          </div>

          {/* Logout */}
          <button className={styles.navItem} onClick={() => { logout(); router.push('/'); }}>
            <IconLogout size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          className={styles.collapseBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
        </button>
      </aside>

      {/* Mobile Overlay */}
      <div className={styles.mobileOverlay} onClick={() => setSidebarCollapsed(true)} />
    </>
  );
}

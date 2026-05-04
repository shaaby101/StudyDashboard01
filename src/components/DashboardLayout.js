'use client';

import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { IconBell, IconSearch, IconMenu } from '@/components/Icons';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, requiredRole }) {
  const { user, sidebarCollapsed, setSidebarCollapsed, notifications } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (requiredRole && user.role !== requiredRole) {
      router.push(`/${user.role}`);
    }
  }, [user, requiredRole, router]);

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={`${styles.main} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <IconMenu size={20} />
            </button>
            <div className={styles.searchBox}>
              <IconSearch size={16} />
              <input
                type="text"
                placeholder="Search anything..."
                className={styles.searchInput}
              />
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </div>
          </div>
          <div className={styles.topBarRight}>
            <div className={styles.notifWrapper}>
              <button
                className={styles.notifBtn}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <IconBell size={20} />
                {unreadCount > 0 && <span className={styles.notifBadge}>{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className={styles.notifDropdown}>
                  <div className={styles.notifHeader}>
                    <h4>Notifications</h4>
                    <button className={styles.notifClear}>Mark all read</button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}>
                      <div className={`${styles.notifDot} ${styles[n.type]}`} />
                      <div>
                        <p className={styles.notifMessage}>{n.message}</p>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

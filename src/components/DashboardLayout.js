'use client';

import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar, { NAV_ITEMS } from '@/components/Sidebar';
import { IconBell, IconSearch, IconMenu } from '@/components/Icons';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children, requiredRole }) {
  const { user, loadingUser, sidebarCollapsed, setSidebarCollapsed, notifications } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim() || !user) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    
    const roleItems = NAV_ITEMS[user.role] || [];
    const results = roleItems.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchDropdown(true);
  }, [searchQuery, user]);

  // Handle clicking a search result
  const handleSelectResult = (path) => {
    router.push(path);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  useEffect(() => {
    if (loadingUser) return;
    if (!user) {
      router.replace('/');
    } else if (requiredRole && user.role !== requiredRole) {
      router.replace(`/${user.role}`);
    }
  }, [user, requiredRole, router, loadingUser]);

  if (loadingUser) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
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
            <div className={styles.searchBox} style={{ position: 'relative' }}>
              <IconSearch size={16} />
              <input
                type="text"
                placeholder="Search features (e.g. 'Attendance')..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchResults.length > 0) setShowSearchDropdown(true); }}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              />
              <kbd className={styles.searchKbd}>⌘K</kbd>

              {showSearchDropdown && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                  background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                  border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden'
                }}>
                  {searchResults.map((result, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSelectResult(result.path)}
                      style={{
                        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                        cursor: 'pointer', borderBottom: i < searchResults.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        color: 'var(--text-primary)', fontSize: '0.875rem'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <result.icon size={16} />
                      {result.label}
                    </div>
                  ))}
                </div>
              )}
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

'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import AnimatedCounter from '@/components/AnimatedCounter';
import { BarChart } from '@/components/Charts';
import { IconUsers, IconCalendar, IconUpload, IconMail, IconArrowRight, IconCheck, IconClock } from '@/components/Icons';
import { useRouter } from 'next/navigation';
import styles from './faculty.module.css';

export default function FacultyDashboard() {
  const { user, courses, schedule, leaveRequests } = useApp();
  const router = useRouter();

  if (!user) return null;

  const mySubjects = courses.filter(c => user.subjects?.includes(c.id));
  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayClasses = schedule.filter(s => s.day === today && user.subjects?.includes(s.subject));
  const myLeaves = leaveRequests.filter(l => l.faculty === user.name);
  const totalStudents = 45; // mock

  return (
    <DashboardLayout requiredRole="faculty">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user.name?.split(' ').pop()} 👋</h1>
            <p>Faculty Dashboard — {user.department}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-4 stagger-children">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <IconUsers size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={totalStudents} /></div>
            <div className="stat-label">Students Under You</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <IconCalendar size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={todayClasses.length} /></div>
            <div className="stat-label">Classes Today</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
              <IconUpload size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={mySubjects.length} /></div>
            <div className="stat-label">Subjects Assigned</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)', color: '#E67E22' }}>
              <IconMail size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={myLeaves.length} /></div>
            <div className="stat-label">Leave Requests</div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Today's Classes */}
          <div className={`glass-card-static ${styles.card}`}>
            <div className={styles.cardHeader}>
              <h3>Today&apos;s Schedule</h3>
              <span className="badge badge-accent">{today}</span>
            </div>
            {todayClasses.length === 0 ? (
              <div className={styles.emptyState}>No classes scheduled today! 🎉</div>
            ) : (
              <div className={styles.classList}>
                {todayClasses.map(c => (
                  <div key={c.id} className={styles.classItem}>
                    <div className={styles.classTime}>
                      <IconClock size={14} />
                      <span>{c.time}</span>
                    </div>
                    <div>
                      <h4>{courses.find(co => co.id === c.subject)?.name || c.subject}</h4>
                      <span className={styles.classMeta}>{c.room} • {c.type}</span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push('/faculty/attendance')}
                    >
                      <IconCheck size={14} /> Mark
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Subjects */}
          <div className={`glass-card-static ${styles.card}`}>
            <div className={styles.cardHeader}>
              <h3>My Subjects</h3>
            </div>
            <div className={styles.subjectList}>
              {mySubjects.map(sub => (
                <div key={sub.id} className={styles.subjectItem}>
                  <div className={styles.subjectIcon}>{sub.code.slice(-2)}</div>
                  <div>
                    <h4>{sub.name}</h4>
                    <span className={styles.subjectMeta}>{sub.credits} Credits</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/faculty/attendance')}>
              <IconUsers size={24} />
              <span>Mark Attendance</span>
            </button>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/faculty/schedule')}>
              <IconCalendar size={24} />
              <span>View Schedule</span>
            </button>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/faculty/materials')}>
              <IconUpload size={24} />
              <span>Upload Materials</span>
            </button>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/faculty/leave')}>
              <IconMail size={24} />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

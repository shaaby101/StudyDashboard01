'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import AnimatedCounter from '@/components/AnimatedCounter';
import { BarChart, GaugeChart } from '@/components/Charts';
import { IconChart, IconBook, IconBrain, IconCalendar, IconAlertTriangle, IconArrowRight, IconTrendingUp } from '@/components/Icons';
import { useRouter } from 'next/navigation';
import styles from './student.module.css';

export default function StudentDashboard() {
  const { user, attendance, courses, schedule } = useApp();
  const router = useRouter();

  if (!user) return null;

  const enrolledCourses = courses.filter(c => user.enrolledCourses?.includes(c.id));
  const overallAttendance = Math.round(
    Object.values(attendance).reduce((sum, a) => sum + a.percentage, 0) / Object.keys(attendance).length
  );
  const lowAttendance = Object.entries(attendance).filter(([_, a]) => a.percentage < 75);
  const totalClasses = Object.values(attendance).reduce((sum, a) => sum + a.total, 0);
  const totalAttended = Object.values(attendance).reduce((sum, a) => sum + a.attended, 0);

  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todaySchedule = schedule.filter(s => s.day === today);

  const courseName = (code) => courses.find(c => c.id === code)?.name || code;

  return (
    <DashboardLayout requiredRole="student">
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Welcome back, {user.name?.split(' ')[0]} 👋</h1>
            <p>Here&apos;s your academic overview for today</p>
          </div>
          <div className={styles.headerActions}>
            <button className="btn btn-primary" onClick={() => router.push('/student/ai')}>
              <IconBrain size={18} />
              AI Companion
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-4 stagger-children ${styles.statsGrid}`}>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <IconChart size={22} />
            </div>
            <div className="stat-value">
              <AnimatedCounter value={overallAttendance} suffix="%" />
            </div>
            <div className="stat-label">Overall Attendance</div>
            <div className={`stat-change ${overallAttendance >= 75 ? 'positive' : 'negative'}`}>
              {overallAttendance >= 75 ? <IconTrendingUp size={12} /> : <IconAlertTriangle size={12} />}
              {overallAttendance >= 75 ? 'On track' : 'Below 75%'}
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <IconBook size={22} />
            </div>
            <div className="stat-value">
              <AnimatedCounter value={enrolledCourses.length} />
            </div>
            <div className="stat-label">Enrolled Courses</div>
            <div className="stat-change positive">
              <span>Semester {user.semester}</span>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
              <IconCalendar size={22} />
            </div>
            <div className="stat-value">
              <AnimatedCounter value={totalAttended} />
              <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>/{totalClasses}</span>
            </div>
            <div className="stat-label">Classes Attended</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: lowAttendance.length > 0 ? 'var(--danger-light)' : 'var(--success-light)', color: lowAttendance.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
              <IconAlertTriangle size={22} />
            </div>
            <div className="stat-value">
              <AnimatedCounter value={lowAttendance.length} />
            </div>
            <div className="stat-label">Shortage Alerts</div>
            {lowAttendance.length > 0 && (
              <div className="stat-change negative">Needs attention</div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Attendance Overview */}
          <div className={`glass-card-static ${styles.chartCard}`}>
            <div className={styles.cardHeader}>
              <h3>Subject-wise Attendance</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/student/attendance')}>
                View Details <IconArrowRight size={14} />
              </button>
            </div>
            <div className={styles.chartWrapper}>
              <BarChart
                data={Object.values(attendance).map(a => a.percentage)}
                labels={Object.keys(attendance).map(k => k)}
                colors={Object.values(attendance).map(a =>
                  a.percentage >= 75 ? '#00B894' : a.percentage >= 60 ? '#FDCB6E' : '#E17055'
                )}
                height={240}
              />
            </div>
          </div>

          {/* Today's Schedule */}
          <div className={`glass-card-static ${styles.scheduleCard}`}>
            <div className={styles.cardHeader}>
              <h3>Today&apos;s Schedule</h3>
              <span className="badge badge-accent">{today}</span>
            </div>
            {todaySchedule.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No classes today! 🎉</p>
              </div>
            ) : (
              <div className={styles.scheduleList}>
                {todaySchedule.map(s => (
                  <div key={s.id} className={styles.scheduleItem}>
                    <div className={styles.scheduleTime}>
                      <span>{s.time.split(' - ')[0]}</span>
                      <span className={styles.scheduleDash}>—</span>
                      <span>{s.time.split(' - ')[1]}</span>
                    </div>
                    <div className={styles.scheduleInfo}>
                      <h4>{courseName(s.subject)}</h4>
                      <div className={styles.scheduleMeta}>
                        <span>{s.room}</span>
                        <span className={`badge ${s.type === 'Lab' ? 'badge-info' : 'badge-accent'}`}>{s.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shortage Alerts */}
        {lowAttendance.length > 0 && (
          <div className={`glass-card-static ${styles.alertCard}`}>
            <div className={styles.cardHeader}>
              <h3 style={{ color: 'var(--danger)' }}>
                <IconAlertTriangle size={18} style={{ marginRight: 8 }} />
                Attendance Shortage Alerts
              </h3>
            </div>
            <div className={styles.alertGrid}>
              {lowAttendance.map(([code, data]) => (
                <div key={code} className={styles.alertItem}>
                  <div className={styles.alertTop}>
                    <span className={styles.alertCode}>{code}</span>
                    <span className={`badge ${data.percentage < 60 ? 'badge-danger' : 'badge-warning'}`}>
                      {data.percentage}%
                    </span>
                  </div>
                  <h4>{courseName(code)}</h4>
                  <p className={styles.alertText}>
                    Attended {data.attended} of {data.total} classes.
                    Need {Math.ceil((0.75 * data.total - data.attended) / (1 - 0.75))} more consecutive classes to reach 75%.
                  </p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${data.percentage}%`,
                      background: data.percentage < 60
                        ? 'linear-gradient(135deg, #E17055, #FDCB6E)'
                        : 'linear-gradient(135deg, #FDCB6E, #00B894)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button className={`glass-card ${styles.actionCard}`} onClick={() => router.push('/student/attendance')}>
              <IconChart size={24} />
              <span>Attendance Details</span>
            </button>
            <button className={`glass-card ${styles.actionCard}`} onClick={() => router.push('/student/ai')}>
              <IconBrain size={24} />
              <span>AI Study Companion</span>
            </button>
            <button className={`glass-card ${styles.actionCard}`} onClick={() => router.push('/student/courses')}>
              <IconBook size={24} />
              <span>Course Materials</span>
            </button>
            <button className={`glass-card ${styles.actionCard}`} onClick={() => router.push('/student/schedule')}>
              <IconCalendar size={24} />
              <span>Full Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

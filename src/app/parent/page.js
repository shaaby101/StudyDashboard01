'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { IconChart, IconBook, IconUsers, IconCalendar } from '@/components/Icons';
import styles from './parent.module.css';

export default function ParentDashboard() {
  const { user, attendance, results } = useApp();

  if (!user || user.role !== 'parent') return null;

  // Calculate overall attendance
  const subjects = Object.keys(attendance);
  const totalClasses = subjects.reduce((sum, sub) => sum + attendance[sub].total, 0);
  const attendedClasses = subjects.reduce((sum, sub) => sum + attendance[sub].attended, 0);
  const overallAttendance = totalClasses ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  // Calculate GPA
  const gradePoints = { 'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 0 };
  const totalPoints = results.reduce((sum, r) => sum + (gradePoints[r.grade] || 0), 0);
  const averageGpa = results.length ? (totalPoints / results.length).toFixed(2) : 'N/A';

  return (
    <DashboardLayout requiredRole="parent">
      <div className={styles.page}>
        
        {/* Hero Section */}
        <div className={styles.hero}>
          <div>
            <span className={styles.badge}>Parent Portal</span>
            <h2>Welcome, {user.name}</h2>
            <p>Academic overview for your ward: <strong>{user.wardName}</strong></p>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.primaryAction}>Book Appointment</button>
            <button className={styles.secondaryAction}>Download Report</button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span>Overall Attendance</span>
            <strong>{overallAttendance}%</strong>
            <p>Across {subjects.length} subjects</p>
          </div>
          <div className={styles.summaryCard}>
            <span>Current GPA</span>
            <strong>{averageGpa}</strong>
            <p>Out of 10.0</p>
          </div>
          <div className={styles.summaryCard}>
            <span>Upcoming Assessments</span>
            <strong>2</strong>
            <p>Next: CS301 Midterm</p>
          </div>
          <div className={styles.summaryCard}>
            <span>Alerts</span>
            <strong style={{ color: overallAttendance < 75 ? 'var(--error)' : 'var(--success)' }}>
              {overallAttendance < 75 ? '1' : '0'}
            </strong>
            <p>{overallAttendance < 75 ? 'Low attendance warning' : 'All good'}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Attendance Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 style={{ margin: 0 }}>Attendance Breakdown</h3>
              <span>This Semester</span>
            </div>
            <div className={styles.attendanceList}>
              {subjects.map(sub => (
                <div key={sub} className={styles.attendanceRow}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px' }}>{sub}</strong>
                    <p>{attendance[sub].attended} / {attendance[sub].total} classes attended</p>
                  </div>
                  <span className={styles.attendanceValue} style={{ color: attendance[sub].percentage < 75 ? 'var(--error)' : 'var(--accent)' }}>
                    {attendance[sub].percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 style={{ margin: 0 }}>Recent Results</h3>
              <span>Latest Exams</span>
            </div>
            <ul className={styles.scheduleList}>
              {results.map((res, i) => (
                <li key={i} className={styles.scheduleItem}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px' }}>{res.subject}</strong>
                    <p>{res.name}</p>
                  </div>
                  <div className={styles.scheduleMeta}>
                    <span className={styles.badge} style={{ background: res.grade.includes('A') ? 'var(--success-light)' : 'var(--accent-light)', color: res.grade.includes('A') ? 'var(--success)' : 'var(--accent)' }}>
                      Grade {res.grade}
                    </span>
                    <span>{res.final}/100 Score</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

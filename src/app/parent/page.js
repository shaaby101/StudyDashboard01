'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from './parent.module.css';

export default function ParentDashboard() {
  const { user } = useApp();
  const studentName = user?.studentName || 'Assigned student';
  const department = user?.department || 'General';

  const summary = [
    { label: 'Attendance', value: '88%', detail: '5% up this month' },
    { label: 'Assignments Due', value: '2', detail: 'Next due in 3 days' },
    { label: 'Upcoming Exams', value: '1', detail: 'CS303 on May 18' },
    { label: 'Leaves', value: '0', detail: 'No pending requests' },
  ];

  const attendance = [
    { subject: 'CS301', attended: 22, total: 26 },
    { subject: 'CS303', attended: 19, total: 22 },
    { subject: 'CS304', attended: 17, total: 21 },
  ];

  const upcoming = [
    { day: 'Mon', time: '09:00', subject: 'CS301 Lecture', room: 'LH-101' },
    { day: 'Wed', time: '10:15', subject: 'CS303 Lab', room: 'Lab-B' },
    { day: 'Fri', time: '11:30', subject: 'CS304 Seminar', room: 'Room-12' },
  ];

  const alerts = [
    { title: 'New syllabus update', detail: 'CS301 Unit 3 has new materials.' },
    { title: 'Faculty message', detail: 'CS303 practical rescheduled to May 8.' },
  ];

  return (
    <DashboardLayout requiredRole="parent">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parent Overview</h1>
          <p>Stay connected with your student's progress and schedule.</p>
        </div>
        <div className={styles.hero}>
          <div>
            <span className={styles.badge}>Student</span>
            <h2>{studentName}</h2>
            <p>{department} Department</p>
          </div>
          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryAction}>Message Advisor</button>
            <button type="button" className={styles.secondaryAction}>Request Meeting</button>
          </div>
        </div>

        <div className={styles.summaryGrid}>
          {summary.map((item) => (
            <div key={item.label} className={styles.summaryCard}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>Attendance Snapshot</h3>
              <span>Last 30 days</span>
            </div>
            <div className={styles.attendanceList}>
              {attendance.map((item) => {
                const percent = Math.round((item.attended / item.total) * 100);
                return (
                  <div key={item.subject} className={styles.attendanceRow}>
                    <div>
                      <strong>{item.subject}</strong>
                      <p>{item.attended} of {item.total} classes attended</p>
                    </div>
                    <div className={styles.attendanceValue}>{percent}%</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3>Upcoming Schedule</h3>
              <span>This week</span>
            </div>
            <ul className={styles.scheduleList}>
              {upcoming.map((item) => (
                <li key={`${item.day}-${item.time}`} className={styles.scheduleItem}>
                  <div>
                    <strong>{item.subject}</strong>
                    <p>{item.room}</p>
                  </div>
                  <div className={styles.scheduleMeta}>
                    <span>{item.day}</span>
                    <span>{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className={styles.alertGrid}>
          {alerts.map((alert) => (
            <div key={alert.title} className={styles.alertCard}>
              <h4>{alert.title}</h4>
              <p>{alert.detail}</p>
            </div>
          ))}
          <div className={styles.alertCard}>
            <h4>Quick Links</h4>
            <ul className={styles.quickLinks}>
              <li>View fee status</li>
              <li>Download academic calendar</li>
              <li>Raise support ticket</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

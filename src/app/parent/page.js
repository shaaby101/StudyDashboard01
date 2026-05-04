'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from './parent.module.css';

export default function ParentDashboard() {
  const { user } = useApp();

  return (
    <DashboardLayout requiredRole="parent">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Parent Overview</h1>
          <p>Stay connected with your student's progress and schedule.</p>
        </div>
        <div className={styles.card}>
          <div>
            <h3>Student</h3>
            <p>{user?.studentName || 'Assigned student'}</p>
          </div>
          <div>
            <h3>Department</h3>
            <p>{user?.department || 'General'}</p>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Reach out to faculty for any updates.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

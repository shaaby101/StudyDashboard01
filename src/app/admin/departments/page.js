'use client';

import DashboardLayout from '@/components/DashboardLayout';
import AnimatedCounter from '@/components/AnimatedCounter';
import { BarChart } from '@/components/Charts';
import { IconBuilding, IconUsers, IconGraduation } from '@/components/Icons';
import styles from './departments.module.css';

const DEPARTMENTS = [
  { name: 'Computer Science', code: 'CS', students: 450, faculty: 12, courses: 24, attendance: 82, color: '#6C5CE7' },
  { name: 'Electronics & Communication', code: 'ECE', students: 320, faculty: 10, courses: 20, attendance: 76, color: '#00B894' },
  { name: 'Mechanical Engineering', code: 'ME', students: 280, faculty: 8, courses: 18, attendance: 74, color: '#FDCB6E' },
  { name: 'Civil Engineering', code: 'CE', students: 200, faculty: 6, courses: 14, attendance: 70, color: '#E17055' },
];

export default function AdminDepartments() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Departments</h1>
          <p>Overview of all academic departments</p>
        </div>

        <div className={styles.deptGrid}>
          {DEPARTMENTS.map(dept => (
            <div key={dept.code} className={`glass-card-static ${styles.deptCard}`}>
              <div className={styles.deptHeader}>
                <div className={styles.deptIcon} style={{ background: `${dept.color}20`, color: dept.color }}>
                  <IconBuilding size={24} />
                </div>
                <div>
                  <h3>{dept.name}</h3>
                  <span className={styles.deptCode}>{dept.code}</span>
                </div>
              </div>

              <div className={styles.deptStats}>
                <div className={styles.deptStat}>
                  <IconGraduation size={16} />
                  <span className={styles.statNum}><AnimatedCounter value={dept.students} /></span>
                  <span className={styles.statLabel}>Students</span>
                </div>
                <div className={styles.deptStat}>
                  <IconUsers size={16} />
                  <span className={styles.statNum}><AnimatedCounter value={dept.faculty} /></span>
                  <span className={styles.statLabel}>Faculty</span>
                </div>
                <div className={styles.deptStat}>
                  <span className={styles.statNum} style={{ color: dept.attendance >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                    <AnimatedCounter value={dept.attendance} suffix="%" />
                  </span>
                  <span className={styles.statLabel}>Attendance</span>
                </div>
              </div>

              <div className="progress-bar" style={{ marginTop: 4 }}>
                <div className="progress-fill" style={{ width: `${dept.attendance}%`, background: dept.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Chart */}
        <div className={`glass-card-static ${styles.chartCard}`}>
          <h3>Department Comparison — Average Attendance</h3>
          <BarChart
            data={DEPARTMENTS.map(d => d.attendance)}
            labels={DEPARTMENTS.map(d => d.code)}
            colors={DEPARTMENTS.map(d => d.color)}
            height={250}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

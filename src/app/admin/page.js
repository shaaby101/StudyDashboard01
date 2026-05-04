'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import AnimatedCounter from '@/components/AnimatedCounter';
import { LineChart, DonutChart, BarChart } from '@/components/Charts';
import { IconUsers, IconGraduation, IconChart, IconTrendingUp, IconBrain, IconBuilding, IconArrowRight, IconWand } from '@/components/Icons';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { facultyList } = useApp();
  const router = useRouter();

  const totalStudents = 1250;
  const totalFaculty = facultyList.length;
  const avgAttendance = 78;
  const aiEngagement = 342;
  const departments = 4;

  return (
    <DashboardLayout requiredRole="admin">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>Campus Command Center</h1>
            <p>Institution-wide overview and metrics</p>
          </div>
          <button className="btn btn-primary" onClick={() => router.push('/admin/timetable')}>
            <IconWand size={18} />
            Generate Timetable
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-4 stagger-children">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <IconGraduation size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={totalStudents} /></div>
            <div className="stat-label">Total Students</div>
            <div className="stat-change positive"><IconTrendingUp size={12} /> +5.2% this sem</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <IconUsers size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={totalFaculty} /></div>
            <div className="stat-label">Faculty Members</div>
            <div className="stat-change positive">
              {facultyList.filter(f => f.status === 'active').length} active
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
              <IconChart size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={avgAttendance} suffix="%" /></div>
            <div className="stat-label">Avg Attendance</div>
            <div className="stat-change positive"><IconTrendingUp size={12} /> +2.1%</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)', color: '#E67E22' }}>
              <IconBrain size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={aiEngagement} /></div>
            <div className="stat-label">AI Queries Today</div>
            <div className="stat-change positive"><IconTrendingUp size={12} /> High engagement</div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Attendance Trend */}
          <div className={`glass-card-static ${styles.card}`}>
            <div className={styles.cardHeader}>
              <h3>Attendance Trend (Last 12 Weeks)</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/admin/analytics')}>
                View Analytics <IconArrowRight size={14} />
              </button>
            </div>
            <LineChart
              datasets={[
                { data: [72, 74, 71, 76, 78, 75, 80, 79, 82, 78, 81, 78], color: '#6C5CE7', fill: true },
                { data: [68, 70, 65, 72, 74, 70, 75, 73, 77, 74, 76, 75], color: '#00B894', fill: true },
              ]}
              labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']}
              height={250}
            />
            <div className={styles.chartLegend}>
              <span><span className={styles.dot} style={{ background: '#6C5CE7' }} /> Overall</span>
              <span><span className={styles.dot} style={{ background: '#00B894' }} /> CS Department</span>
            </div>
          </div>

          {/* Department Distribution */}
          <div className={`glass-card-static ${styles.card}`}>
            <div className={styles.cardHeader}>
              <h3>Students by Department</h3>
            </div>
            <div className={styles.donutWrapper}>
              <DonutChart
                data={[450, 320, 280, 200]}
                labels={['CS', 'Electronics', 'Mechanical', 'Civil']}
                colors={['#6C5CE7', '#00B894', '#FDCB6E', '#E17055']}
                size={200}
                thickness={24}
              />
              <div className={styles.donutLegend}>
                {[
                  { label: 'Computer Science', value: 450, color: '#6C5CE7' },
                  { label: 'Electronics', value: 320, color: '#00B894' },
                  { label: 'Mechanical', value: 280, color: '#FDCB6E' },
                  { label: 'Civil', value: 200, color: '#E17055' },
                ].map(item => (
                  <div key={item.label} className={styles.donutItem}>
                    <span className={styles.dot} style={{ background: item.color }} />
                    <span className={styles.donutLabel}>{item.label}</span>
                    <span className={styles.donutValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Overview */}
        <div className={`glass-card-static ${styles.card}`}>
          <div className={styles.cardHeader}>
            <h3>Faculty Overview</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push('/admin/faculty')}>
              View All <IconArrowRight size={14} />
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.department}</td>
                  <td>{f.subjects.join(', ')}</td>
                  <td>
                    <span className={`badge ${f.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {f.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/admin/analytics')}>
              <IconChart size={24} /><span>Analytics</span>
            </button>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/admin/faculty')}>
              <IconUsers size={24} /><span>Faculty</span>
            </button>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/admin/timetable')}>
              <IconWand size={24} /><span>AI Timetable</span>
            </button>
            <button className="glass-card" style={{ padding: '20px', cursor: 'pointer', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 500 }} onClick={() => router.push('/admin/departments')}>
              <IconBuilding size={24} /><span>Departments</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

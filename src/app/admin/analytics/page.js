'use client';

import DashboardLayout from '@/components/DashboardLayout';
import AnimatedCounter from '@/components/AnimatedCounter';
import { LineChart, BarChart, DonutChart } from '@/components/Charts';
import { IconTrendingUp, IconChart, IconUsers, IconBrain } from '@/components/Icons';
import styles from './analytics.module.css';

export default function AdminAnalytics() {
  const weeklyData = [72, 74, 71, 76, 78, 75, 80, 79, 82, 78, 81, 78];
  const deptAttendance = [82, 76, 74, 70];
  const aiUsageWeekly = [120, 145, 180, 210, 250, 280, 342];

  return (
    <DashboardLayout requiredRole="admin">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Campus Analytics</h1>
          <p>Data-driven insights for quality monitoring and decision-making</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-4 stagger-children">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <IconChart size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={78} suffix="%" /></div>
            <div className="stat-label">Overall Attendance Rate</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <IconTrendingUp size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={92} suffix="%" /></div>
            <div className="stat-label">Faculty Productivity</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
              <IconBrain size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={2847} /></div>
            <div className="stat-label">AI Queries This Month</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-light)', color: '#E67E22' }}>
              <IconUsers size={22} />
            </div>
            <div className="stat-value"><AnimatedCounter value={156} /></div>
            <div className="stat-label">Students Below 75%</div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          {/* Attendance Trend */}
          <div className={`glass-card-static ${styles.chartCard}`}>
            <h3>Attendance Trend (12 Weeks)</h3>
            <LineChart
              datasets={[
                { data: weeklyData, color: '#6C5CE7', fill: true },
              ]}
              labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']}
              height={260}
            />
          </div>

          {/* AI Engagement Growth */}
          <div className={`glass-card-static ${styles.chartCard}`}>
            <h3>AI Engagement Growth</h3>
            <BarChart
              data={aiUsageWeekly}
              labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
              colors={aiUsageWeekly.map(() => '#6C5CE7')}
              height={260}
            />
          </div>
        </div>

        <div className={styles.chartsGrid}>
          {/* Department-wise Attendance */}
          <div className={`glass-card-static ${styles.chartCard}`}>
            <h3>Attendance by Department</h3>
            <BarChart
              data={deptAttendance}
              labels={['CS', 'ECE', 'ME', 'CE']}
              colors={['#6C5CE7', '#00B894', '#FDCB6E', '#E17055']}
              height={220}
            />
          </div>

          {/* Subject Distribution */}
          <div className={`glass-card-static ${styles.chartCard}`}>
            <h3>AI Queries by Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <DonutChart
                data={[480, 350, 290, 210, 180]}
                labels={['DSA', 'OS', 'DBMS', 'CN', 'SE']}
                colors={['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#74B9FF']}
                size={180}
                thickness={22}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                {[
                  { l: 'DSA', c: '#6C5CE7' },
                  { l: 'OS', c: '#00B894' },
                  { l: 'DBMS', c: '#FDCB6E' },
                  { l: 'CN', c: '#E17055' },
                  { l: 'SE', c: '#74B9FF' },
                ].map(i => (
                  <span key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: i.c, display: 'inline-block' }} />
                    {i.l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

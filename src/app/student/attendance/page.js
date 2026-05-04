'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { BarChart, GaugeChart } from '@/components/Charts';
import { IconAlertTriangle, IconCheck, IconX } from '@/components/Icons';
import styles from './attendance.module.css';

export default function StudentAttendance() {
  const { attendance, courses } = useApp();

  const courseName = (code) => courses.find(c => c.id === code)?.name || code;
  const sorted = Object.entries(attendance).sort((a, b) => a[1].percentage - b[1].percentage);

  return (
    <DashboardLayout requiredRole="student">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Attendance Dashboard</h1>
          <p>Detailed breakdown of your attendance across all enrolled courses</p>
        </div>

        {/* Gauge Charts Row */}
        <div className={styles.gaugeGrid}>
          {sorted.map(([code, data]) => (
            <div key={code} className={`glass-card-static ${styles.gaugeCard}`}>
              <GaugeChart
                value={data.percentage}
                color={data.percentage >= 75 ? '#00B894' : data.percentage >= 60 ? '#FDCB6E' : '#E17055'}
                label={code}
                size={150}
              />
              <h4>{courseName(code)}</h4>
              <p className={styles.gaugeInfo}>{data.attended}/{data.total} classes</p>
              {data.percentage < 75 && (
                <span className="badge badge-danger" style={{ marginTop: 4 }}>
                  <IconAlertTriangle size={10} /> Below 75%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Detailed Table */}
        <div className={`glass-card-static ${styles.tableCard}`}>
          <h3>Attendance Records</h3>
          <div className={styles.tableWrapper}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Classes</th>
                  <th>Attended</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(([code, data]) => (
                  <tr key={code}>
                    <td>
                      <div>
                        <strong>{code}</strong>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                          {courseName(code)}
                        </div>
                      </div>
                    </td>
                    <td>{data.total}</td>
                    <td style={{ color: 'var(--success)' }}>{data.attended}</td>
                    <td style={{ color: 'var(--danger)' }}>{data.total - data.attended}</td>
                    <td>
                      <div className={styles.percentBar}>
                        <span style={{
                          color: data.percentage >= 75 ? 'var(--success)' : data.percentage >= 60 ? '#E67E22' : 'var(--danger)',
                          fontWeight: 700,
                          fontFamily: 'var(--font-display)'
                        }}>
                          {data.percentage}%
                        </span>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{
                            width: `${data.percentage}%`,
                            background: data.percentage >= 75
                              ? 'linear-gradient(135deg, #00B894, #55EFC4)'
                              : data.percentage >= 60
                                ? 'linear-gradient(135deg, #FDCB6E, #F39C12)'
                                : 'linear-gradient(135deg, #E17055, #FDCB6E)'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {data.percentage >= 75 ? (
                        <span className="badge badge-success"><IconCheck size={10} /> Safe</span>
                      ) : data.percentage >= 60 ? (
                        <span className="badge badge-warning"><IconAlertTriangle size={10} /> Warning</span>
                      ) : (
                        <span className="badge badge-danger"><IconX size={10} /> Critical</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar Heatmap placeholder */}
        <div className={`glass-card-static ${styles.heatmapCard}`}>
          <h3>Monthly Attendance Pattern</h3>
          <div className={styles.heatmapGrid}>
            {Array.from({ length: 30 }, (_, i) => {
              const present = Math.random() > 0.25;
              const weekend = (i % 7 === 5 || i % 7 === 6);
              return (
                <div
                  key={i}
                  className={styles.heatmapCell}
                  style={{
                    background: weekend
                      ? 'var(--bg-tertiary)'
                      : present
                        ? 'var(--success)'
                        : 'var(--danger)',
                    opacity: weekend ? 0.3 : 0.7,
                  }}
                  title={`Day ${i + 1}: ${weekend ? 'Weekend' : present ? 'Present' : 'Absent'}`}
                />
              );
            })}
          </div>
          <div className={styles.heatmapLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--success)' }} />
              <span>Present</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--danger)' }} />
              <span>Absent</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--bg-tertiary)' }} />
              <span>Weekend</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

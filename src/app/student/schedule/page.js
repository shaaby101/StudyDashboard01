'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from './schedule.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:15', '11:30', '14:00', '15:15'];

export default function StudentSchedule() {
  const { schedule, courses } = useApp();
  const courseName = (code) => courses.find(c => c.id === code)?.name || code;
  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  const colorMap = {
    CS301: '#6C5CE7',
    CS302: '#00B894',
    CS303: '#E17055',
    CS304: '#74B9FF',
    CS305: '#FDCB6E',
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Weekly Schedule</h1>
          <p>Your class timetable for the current semester</p>
        </div>

        <div className={`glass-card-static ${styles.timetable}`}>
          <div className={styles.grid}>
            {/* Header Row */}
            <div className={styles.cornerCell} />
            {DAYS.map(day => (
              <div key={day} className={`${styles.dayHeader} ${day === today ? styles.today : ''}`}>
                {day.slice(0, 3)}
                {day === today && <span className={styles.todayDot} />}
              </div>
            ))}

            {/* Time Rows */}
            {TIMES.map(time => (
              <React.Fragment key={time}>
                <div className={styles.timeCell}>{time}</div>
                {DAYS.map(day => {
                  const cls = schedule.find(s => s.day === day && s.time.startsWith(time));
                  return (
                    <div key={`${day}-${time}`} className={styles.cell}>
                      {cls && (
                        <div
                          className={styles.classBlock}
                          style={{
                            borderLeft: `3px solid ${colorMap[cls.subject] || '#6C5CE7'}`,
                            background: `${colorMap[cls.subject] || '#6C5CE7'}15`,
                          }}
                        >
                          <span className={styles.classSubject}>{cls.subject}</span>
                          <span className={styles.className}>{courseName(cls.subject)}</span>
                          <span className={styles.classRoom}>{cls.room}</span>
                          <span className={`badge ${cls.type === 'Lab' ? 'badge-info' : 'badge-accent'}`} style={{ fontSize: '0.625rem', marginTop: 4 }}>
                            {cls.type}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {Object.entries(colorMap).map(([code, color]) => (
            <div key={code} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: color }} />
              <span>{code} — {courseName(code)}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

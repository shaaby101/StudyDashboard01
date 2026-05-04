'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from '../../student/schedule/schedule.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:15', '11:30', '14:00', '15:15'];

export default function FacultySchedule() {
  const { schedule, courses, user } = useApp();
  const courseName = (code) => courses.find(c => c.id === code)?.name || code;
  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const mySchedule = schedule.filter(s => user?.subjects?.includes(s.subject));

  const colorMap = { CS301: '#6C5CE7', CS303: '#E17055' };

  return (
    <DashboardLayout requiredRole="faculty">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>My Teaching Schedule</h1>
          <p>Your weekly teaching timetable</p>
        </div>

        <div className={`glass-card-static ${styles.timetable}`}>
          <div className={styles.grid}>
            <div className={styles.cornerCell} />
            {DAYS.map(day => (
              <div key={day} className={`${styles.dayHeader} ${day === today ? styles.today : ''}`}>
                {day.slice(0, 3)}
                {day === today && <span className={styles.todayDot} />}
              </div>
            ))}
            {TIMES.map(time => (
              <React.Fragment key={time}>
                <div className={styles.timeCell}>{time}</div>
                {DAYS.map(day => {
                  const cls = mySchedule.find(s => s.day === day && s.time.startsWith(time));
                  return (
                    <div key={`${day}-${time}`} className={styles.cell}>
                      {cls && (
                        <div className={styles.classBlock} style={{
                          borderLeft: `3px solid ${colorMap[cls.subject] || '#6C5CE7'}`,
                          background: `${colorMap[cls.subject] || '#6C5CE7'}15`,
                        }}>
                          <span className={styles.classSubject}>{cls.subject}</span>
                          <span className={styles.className}>{courseName(cls.subject)}</span>
                          <span className={styles.classRoom}>{cls.room}</span>
                          <span className={`badge ${cls.type === 'Lab' ? 'badge-info' : 'badge-accent'}`} style={{ fontSize: '0.625rem', marginTop: 4 }}>{cls.type}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

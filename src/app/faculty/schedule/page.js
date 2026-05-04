'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import styles from '../../student/schedule/schedule.module.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:15', '11:30', '14:00', '15:15'];

export default function FacultySchedule() {
  const { schedule, courses, user, appointments } = useApp();
  const courseName = (code) => courses.find(c => c.id === code)?.name || code;
  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const mySchedule = schedule.filter(s => user?.subjects?.includes(s.subject));
  const myConfirmedAppointments = appointments.filter(apt => apt.status === 'confirmed' && (apt.facultyId === user?.id || apt.faculty === user?.name));

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

        {/* Confirmed Appointments Section */}
        {myConfirmedAppointments.length > 0 && (
          <div className={`glass-card-static`} style={{ marginTop: 32, padding: 24, borderRadius: 'var(--radius-xl)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 16 }}>Upcoming Appointments</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myConfirmedAppointments.map(apt => (
                <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{apt.requesterName} <span style={{fontSize:'0.65rem', textTransform:'capitalize', padding:'2px 6px', background:'var(--bg-secondary)', borderRadius: '4px', marginLeft: 6}}>{apt.requesterRole}</span></h4>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{apt.subject}</p>
                    {apt.message && <p style={{ margin: '4px 0 0', color: 'var(--accent)', fontSize: '0.75rem' }}>Note: {apt.message}</p>}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                    <div><strong>{apt.date}</strong></div>
                    <div>{apt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

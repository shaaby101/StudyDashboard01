'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { IconCalendar, IconUsers, IconClock, IconCheck } from '@/components/Icons';
import styles from '../parent.module.css';

export default function ParentAppointments() {
  const { facultyList, appointments, addAppointment, user } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newApt, setNewApt] = useState({ faculty: '', date: '', time: '', subject: '' });

  const handleBook = (e) => {
    e.preventDefault();
    if (!newApt.faculty || !newApt.date || !newApt.time) return;
    
    addAppointment({
      id: Date.now(),
      facultyId: newApt.faculty,
      faculty: facultyList.find(f => f.id === newApt.faculty)?.name || 'Faculty',
      date: newApt.date,
      time: newApt.time,
      subject: newApt.subject,
      status: 'pending',
      requesterName: user?.name,
      requesterRole: 'parent'
    });
    setShowForm(false);
    setNewApt({ faculty: '', date: '', time: '', subject: '' });
  };

  return (
    <DashboardLayout requiredRole="parent">
      <div className={styles.page}>
        <div className={styles.headerRow}>
          <div>
            <h1>Faculty Appointments</h1>
            <p>Schedule and manage meetings with your ward's professors</p>
          </div>
          <button className={styles.bookBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Book Appointment'}
          </button>
        </div>

        {showForm && (
          <form className={`glass-card-static ${styles.bookForm}`} onSubmit={handleBook}>
            <h3>Schedule New Appointment</h3>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Select Faculty</label>
                <select 
                  value={newApt.faculty} 
                  onChange={e => setNewApt({...newApt, faculty: e.target.value})}
                  required
                >
                  <option value="">-- Choose Faculty --</option>
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  value={newApt.date} 
                  onChange={e => setNewApt({...newApt, date: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Time</label>
                <input 
                  type="time" 
                  value={newApt.time} 
                  onChange={e => setNewApt({...newApt, time: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Reason / Subject</label>
              <input 
                type="text" 
                placeholder="e.g. Mid-term performance discussion" 
                value={newApt.subject} 
                onChange={e => setNewApt({...newApt, subject: e.target.value})}
                required 
              />
            </div>
            <button type="submit" className={styles.submitBtn}>Confirm Booking</button>
          </form>
        )}

        <div className={styles.appointmentsList}>
          {appointments.length === 0 ? (
            <div className={styles.emptyState}>No appointments scheduled.</div>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} className={`glass-card-static ${styles.aptCard}`}>
                <div className={styles.aptHeader}>
                  <div className={styles.aptFaculty}>
                    <div className={styles.aptAvatar}><IconUsers size={20} /></div>
                    <div>
                      <h4>{apt.faculty}</h4>
                      <p>{apt.subject}</p>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
                <div className={styles.aptMeta}>
                  <div className={styles.aptMetaItem}>
                    <IconCalendar size={16} />
                    <span>{apt.date}</span>
                  </div>
                  <div className={styles.aptMetaItem}>
                    <IconClock size={16} />
                    <span>{apt.time}</span>
                  </div>
                </div>
                {apt.message && (
                  <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-primary)', borderRadius: 8, fontSize: '0.875rem', borderLeft: '3px solid var(--accent)' }}>
                    <strong>Faculty Note:</strong> {apt.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

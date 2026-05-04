'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { IconCalendar, IconUsers, IconClock, IconCheck, IconX } from '@/components/Icons';
import styles from './appointments.module.css';

export default function FacultyAppointments() {
  const { user, appointments, respondToAppointment } = useApp();
  const [replyMessage, setReplyMessage] = useState({});

  // Get appointments for this faculty
  const myAppointments = appointments.filter(apt => apt.facultyId === user?.id || apt.faculty === user?.name);

  return (
    <DashboardLayout requiredRole="faculty">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Appointment Requests</h1>
          <p>Manage meeting requests from students and parents</p>
        </div>

        <div className={styles.appointmentsList}>
          {myAppointments.length === 0 ? (
            <div className={styles.emptyState}>No appointments scheduled.</div>
          ) : (
            myAppointments.map(apt => (
              <div key={apt.id} className={`glass-card-static ${styles.aptCard}`}>
                <div className={styles.aptHeader}>
                  <div className={styles.aptFaculty}>
                    <div className={styles.aptAvatar}><IconUsers size={20} /></div>
                    <div>
                      <h4>{apt.requesterName} <span className={styles.roleBadge}>{apt.requesterRole}</span></h4>
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

                {/* Response Area */}
                {apt.status === 'pending' && (
                  <div className={styles.responseArea}>
                    <input 
                      type="text" 
                      placeholder="Add an optional message (e.g. Please bring your mid-term paper)" 
                      value={replyMessage[apt.id] || ''}
                      onChange={e => setReplyMessage({...replyMessage, [apt.id]: e.target.value})}
                      className={styles.replyInput}
                    />
                    <div className={styles.actionBtns}>
                      <button 
                        className={styles.approveBtn} 
                        onClick={() => respondToAppointment(apt.id, 'confirmed', replyMessage[apt.id] || 'Looking forward to it.')}
                      >
                        <IconCheck size={16} /> Approve
                      </button>
                      <button 
                        className={styles.rejectBtn} 
                        onClick={() => respondToAppointment(apt.id, 'rejected', replyMessage[apt.id] || 'I am unavailable at this time.')}
                      >
                        <IconX size={16} /> Reject
                      </button>
                    </div>
                  </div>
                )}
                {apt.message && apt.status !== 'pending' && (
                  <div className={styles.facultyMessage}>
                    <strong>Your Response:</strong> {apt.message}
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

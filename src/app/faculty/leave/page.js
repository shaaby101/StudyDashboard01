'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { IconPlus, IconCheck, IconClock } from '@/components/Icons';
import styles from './leave.module.css';

export default function FacultyLeave() {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState('casual');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Casual', from: '2026-05-10', to: '2026-05-10', status: 'pending', reason: 'Personal work' },
    { id: 2, type: 'Medical', from: '2026-04-15', to: '2026-04-16', status: 'approved', reason: 'Medical checkup' },
    { id: 3, type: 'Casual', from: '2026-03-20', to: '2026-03-20', status: 'rejected', reason: 'Family function' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeave = {
      id: Date.now(),
      type: leaveType.charAt(0).toUpperCase() + leaveType.slice(1),
      from: fromDate,
      to: toDate,
      status: 'pending',
      reason,
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setLeaveType('casual');
    setFromDate('');
    setToDate('');
    setReason('');
  };

  return (
    <DashboardLayout requiredRole="faculty">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>Leave Management</h1>
            <p>Apply for leave and track your requests</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <IconPlus size={18} />
            Apply Leave
          </button>
        </div>

        {submitted && (
          <div className={styles.successBanner}>
            <IconCheck size={18} />
            Leave request submitted successfully!
          </div>
        )}

        {showForm && (
          <form className={`glass-card-static ${styles.form}`} onSubmit={handleSubmit}>
            <h3>New Leave Request</h3>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                  <option value="casual">Casual Leave</option>
                  <option value="medical">Medical Leave</option>
                  <option value="earned">Earned Leave</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">From Date</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Describe the reason..." required />
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        )}

        {/* Leave History */}
        <div className={`glass-card-static ${styles.historyCard}`}>
          <h3>Leave History</h3>
          <div className={styles.leaveList}>
            {leaves.map(leave => (
              <div key={leave.id} className={styles.leaveItem}>
                <div className={styles.leaveType}>
                  <span className={`badge ${leave.type === 'Medical' ? 'badge-danger' : 'badge-accent'}`}>
                    {leave.type}
                  </span>
                </div>
                <div className={styles.leaveInfo}>
                  <h4>{leave.from} → {leave.to}</h4>
                  <p>{leave.reason}</p>
                </div>
                <span className={`badge ${
                  leave.status === 'approved' ? 'badge-success' :
                  leave.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                }`}>
                  {leave.status === 'pending' && <IconClock size={10} />}
                  {leave.status === 'approved' && <IconCheck size={10} />}
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

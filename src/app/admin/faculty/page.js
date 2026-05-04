'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { IconUsers, IconCheck, IconClock } from '@/components/Icons';
import styles from './faculty-admin.module.css';

export default function AdminFaculty() {
  const { facultyList, leaveRequests } = useApp();

  return (
    <DashboardLayout requiredRole="admin">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Faculty Management</h1>
          <p>Overview of all faculty members and their status</p>
        </div>

        <div className={`glass-card-static ${styles.card}`}>
          <h3>All Faculty ({facultyList.length})</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map(f => (
                <tr key={f.id}>
                  <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-tertiary)' }}>{f.id}</span></td>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.department}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {f.subjects.map(s => (
                        <span key={s} className="badge badge-accent">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${f.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {f.status === 'active' ? <><IconCheck size={10} /> Active</> : <><IconClock size={10} /> On Leave</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`glass-card-static ${styles.card}`}>
          <h3>Leave Requests</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.faculty}</strong></td>
                  <td><span className={`badge ${l.type === 'Medical' ? 'badge-danger' : 'badge-accent'}`}>{l.type}</span></td>
                  <td>{l.from}</td>
                  <td>{l.to}</td>
                  <td>{l.reason}</td>
                  <td>
                    <span className={`badge ${
                      l.status === 'approved' ? 'badge-success' :
                      l.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

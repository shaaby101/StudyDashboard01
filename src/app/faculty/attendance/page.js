'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { IconCheck, IconX, IconUsers } from '@/components/Icons';
import styles from './mark.module.css';

const MOCK_STUDENTS = [
  { id: 'S001', name: 'Arjun Mehta', rollNo: 'CS21001' },
  { id: 'S002', name: 'Sneha Reddy', rollNo: 'CS21002' },
  { id: 'S003', name: 'Rahul Verma', rollNo: 'CS21003' },
  { id: 'S004', name: 'Priya Singh', rollNo: 'CS21004' },
  { id: 'S005', name: 'Amit Kumar', rollNo: 'CS21005' },
  { id: 'S006', name: 'Divya Gupta', rollNo: 'CS21006' },
  { id: 'S007', name: 'Karan Patel', rollNo: 'CS21007' },
  { id: 'S008', name: 'Neha Joshi', rollNo: 'CS21008' },
  { id: 'S009', name: 'Rohan Sharma', rollNo: 'CS21009' },
  { id: 'S010', name: 'Anjali Iyer', rollNo: 'CS21010' },
];

export default function FacultyAttendance() {
  const { user, courses } = useApp();
  const [selectedSubject, setSelectedSubject] = useState(user?.subjects?.[0] || '');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const mySubjects = courses.filter(c => user?.subjects?.includes(c.id));

  const toggleStudent = (id) => {
    setAttendanceMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markAllPresent = () => {
    const all = {};
    MOCK_STUDENTS.forEach(s => all[s.id] = true);
    setAttendanceMap(all);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const presentCount = Object.values(attendanceMap).filter(Boolean).length;

  return (
    <DashboardLayout requiredRole="faculty">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Mark Attendance</h1>
          <p>Select a subject and mark attendance for today&apos;s class</p>
        </div>

        {/* Subject Selector */}
        <div className={styles.controls}>
          <div className={styles.subjectTabs}>
            {mySubjects.map(sub => (
              <button
                key={sub.id}
                className={`${styles.subjectTab} ${selectedSubject === sub.id ? styles.active : ''}`}
                onClick={() => { setSelectedSubject(sub.id); setAttendanceMap({}); setSubmitted(false); }}
              >
                {sub.code} — {sub.name}
              </button>
            ))}
          </div>
          <div className={styles.controlActions}>
            <span className={styles.countBadge}>
              <IconUsers size={14} />
              {presentCount}/{MOCK_STUDENTS.length} Present
            </span>
            <button className="btn btn-secondary btn-sm" onClick={markAllPresent}>Mark All Present</button>
          </div>
        </div>

        {/* Student List */}
        <div className={`glass-card-static ${styles.studentList}`}>
          <div className={styles.listHeader}>
            <span>Roll No</span>
            <span>Student Name</span>
            <span>Status</span>
          </div>
          {MOCK_STUDENTS.map(student => {
            const present = attendanceMap[student.id] || false;
            return (
              <div
                key={student.id}
                className={`${styles.studentRow} ${present ? styles.present : ''}`}
                onClick={() => toggleStudent(student.id)}
              >
                <span className={styles.rollNo}>{student.rollNo}</span>
                <span className={styles.studentName}>{student.name}</span>
                <button
                  className={`${styles.statusBtn} ${present ? styles.statusPresent : styles.statusAbsent}`}
                  onClick={(e) => { e.stopPropagation(); toggleStudent(student.id); }}
                >
                  {present ? <><IconCheck size={14} /> Present</> : <><IconX size={14} /> Absent</>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div className={styles.submitArea}>
          {submitted ? (
            <div className={styles.successMsg}>
              <IconCheck size={20} />
              Attendance submitted successfully!
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
              Submit Attendance ({presentCount}/{MOCK_STUDENTS.length})
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

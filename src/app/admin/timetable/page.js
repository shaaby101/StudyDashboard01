'use client';

import DashboardLayout from '@/components/DashboardLayout';
import React, { useState } from 'react';
import { IconWand, IconPlus, IconX, IconDownload, IconRefresh, IconCheck } from '@/components/Icons';
import styles from './timetable.module.css';

const DEFAULT_CONFIG = {
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  startTime: '09:00',
  endTime: '17:00',
  classDuration: 60,
  breakDuration: 15,
  lunchStart: '13:00',
  lunchDuration: 60,
};

const DEFAULT_FACULTY = [
  { id: 1, name: 'Dr. Priya Sharma', subjects: ['Data Structures', 'DBMS'], maxHours: 16 },
  { id: 2, name: 'Dr. Ankit Verma', subjects: ['Operating Systems'], maxHours: 12 },
  { id: 3, name: 'Prof. Neha Gupta', subjects: ['Computer Networks'], maxHours: 12 },
  { id: 4, name: 'Dr. Sanjay Patel', subjects: ['Software Engineering'], maxHours: 12 },
];

const COLORS = ['#6C5CE7', '#00B894', '#E17055', '#74B9FF', '#FDCB6E', '#A29BFE'];

function generateTimetable(faculty, config) {
  const days = config.workingDays;
  const slots = [];
  
  // Generate time slots
  let currentMinutes = parseInt(config.startTime.split(':')[0]) * 60 + parseInt(config.startTime.split(':')[1]);
  const endMinutes = parseInt(config.endTime.split(':')[0]) * 60 + parseInt(config.endTime.split(':')[1]);
  const lunchMinutes = parseInt(config.lunchStart.split(':')[0]) * 60 + parseInt(config.lunchStart.split(':')[1]);
  
  while (currentMinutes + config.classDuration <= endMinutes) {
    // Skip lunch
    if (currentMinutes >= lunchMinutes && currentMinutes < lunchMinutes + config.lunchDuration) {
      currentMinutes = lunchMinutes + config.lunchDuration;
      continue;
    }
    
    const startH = Math.floor(currentMinutes / 60);
    const startM = currentMinutes % 60;
    const endM = currentMinutes + config.classDuration;
    const endH = Math.floor(endM / 60);
    const endMin = endM % 60;
    
    slots.push({
      start: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      end: `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
    });
    
    currentMinutes += config.classDuration + config.breakDuration;
  }

  // Generate assignments
  const timetable = {};
  const facultyHours = {};
  faculty.forEach(f => { facultyHours[f.id] = 0; });

  days.forEach(day => {
    timetable[day] = [];
    slots.forEach(slot => {
      // Find available faculty
      const available = faculty.filter(f => {
        const hoursUsed = facultyHours[f.id];
        const weeklyLimit = f.maxHours;
        return hoursUsed < weeklyLimit;
      });

      if (available.length > 0) {
        // Pick faculty with least hours used
        const chosen = available.sort((a, b) => facultyHours[a.id] - facultyHours[b.id])[0];
        const subject = chosen.subjects[Math.floor(Math.random() * chosen.subjects.length)];
        
        timetable[day].push({
          ...slot,
          faculty: chosen.name,
          subject,
          room: `LH-${100 + Math.floor(Math.random() * 10)}`,
          color: COLORS[faculty.indexOf(chosen) % COLORS.length],
        });
        
        facultyHours[chosen.id] += config.classDuration / 60;
      } else {
        timetable[day].push({ ...slot, empty: true });
      }
    });
  });

  return { timetable, slots };
}

export default function TimetableGenerator() {
  const [facultyList, setFacultyList] = useState(DEFAULT_FACULTY);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [generated, setGenerated] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newFaculty, setNewFaculty] = useState({ name: '', subjects: '', maxHours: 12 });

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const result = generateTimetable(facultyList, config);
    setGenerated(result);
    setIsGenerating(false);
  };

  const exportCSV = () => {
    if (!generated) return;
    const days = config.workingDays;

    // Header row
    const headers = ['Time Slot', ...days];
    const rows = [headers];

    // One row per time slot; each day cell has Subject / Faculty / Room on separate lines
    generated.slots.forEach((slot, si) => {
      const row = [`${slot.start} - ${slot.end}`];
      days.forEach(day => {
        const cell = generated.timetable[day]?.[si];
        if (cell && !cell.empty) {
          // Newlines inside a quoted CSV cell render as separate lines in Excel
          row.push(`${cell.subject}\n${cell.faculty}\n${cell.room}`);
        } else {
          row.push('Free');
        }
      });
      rows.push(row);
    });

    // Wrap every value in quotes; escape inner quotes by doubling them
    const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const csvContent = rows.map(row => row.map(escape).join(',')).join('\r\n');

    // UTF-8 BOM ensures Excel opens the file with correct encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const addFaculty = () => {
    if (!newFaculty.name || !newFaculty.subjects) return;
    setFacultyList(prev => [...prev, {
      id: Date.now(),
      name: newFaculty.name,
      subjects: newFaculty.subjects.split(',').map(s => s.trim()),
      maxHours: parseInt(newFaculty.maxHours) || 12,
    }]);
    setNewFaculty({ name: '', subjects: '', maxHours: 12 });
  };

  const removeFaculty = (id) => {
    setFacultyList(prev => prev.filter(f => f.id !== id));
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>AI Timetable Generator</h1>
            <p>Generate conflict-free timetables automatically</p>
          </div>
        </div>

        <div className={styles.configGrid}>
          {/* Faculty List */}
          <div className={`glass-card-static ${styles.card}`}>
            <h3>Faculty & Subjects</h3>
            <div className={styles.facultyList}>
              {facultyList.map(f => (
                <div key={f.id} className={styles.facultyItem}>
                  <div>
                    <strong>{f.name}</strong>
                    <div className={styles.subjectTags}>
                      {f.subjects.map(s => (
                        <span key={s} className={styles.subjectTag}>{s}</span>
                      ))}
                    </div>
                    <span className={styles.hoursLabel}>{f.maxHours}h/week</span>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFaculty(f.id)}>
                    <IconX size={14} />
                  </button>
                </div>
              ))}
            </div>
            {/* Add Faculty */}
            <div className={styles.addForm}>
              <input
                placeholder="Faculty name"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty(p => ({ ...p, name: e.target.value }))}
              />
              <input
                placeholder="Subjects (comma separated)"
                value={newFaculty.subjects}
                onChange={(e) => setNewFaculty(p => ({ ...p, subjects: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Max hrs"
                value={newFaculty.maxHours}
                onChange={(e) => setNewFaculty(p => ({ ...p, maxHours: e.target.value }))}
                style={{ width: '80px' }}
              />
              <button className="btn btn-secondary btn-sm" onClick={addFaculty}>
                <IconPlus size={14} />
              </button>
            </div>
          </div>

          {/* Configuration */}
          <div className={`glass-card-static ${styles.card}`}>
            <h3>Schedule Configuration</h3>
            <div className={styles.configForm}>
              <div className="form-group">
                <label className="form-label">Class Duration (min)</label>
                <input
                  type="number"
                  value={config.classDuration}
                  onChange={(e) => setConfig(p => ({ ...p, classDuration: parseInt(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Break Duration (min)</label>
                <input
                  type="number"
                  value={config.breakDuration}
                  onChange={(e) => setConfig(p => ({ ...p, breakDuration: parseInt(e.target.value) }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  value={config.startTime}
                  onChange={(e) => setConfig(p => ({ ...p, startTime: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  value={config.endTime}
                  onChange={(e) => setConfig(p => ({ ...p, endTime: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lunch Start</label>
                <input
                  type="time"
                  value={config.lunchStart}
                  onChange={(e) => setConfig(p => ({ ...p, lunchStart: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lunch Duration (min)</label>
                <input
                  type="number"
                  value={config.lunchDuration}
                  onChange={(e) => setConfig(p => ({ ...p, lunchDuration: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <button
              className={`btn btn-primary btn-lg w-full ${styles.generateBtn}`}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className={styles.spinner} />
                  Generating...
                </>
              ) : (
                <>
                  <IconWand size={18} />
                  Generate Timetable
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Timetable */}
        {generated && (
          <div className={`glass-card-static ${styles.resultCard}`}>
            <div className={styles.resultHeader}>
              <h3><IconCheck size={18} style={{ color: 'var(--success)' }} /> Generated Timetable</h3>
              <div className={styles.resultActions}>
                <button className="btn btn-secondary btn-sm" onClick={handleGenerate}>
                  <IconRefresh size={14} /> Regenerate
                </button>
                <button className="btn btn-primary btn-sm" onClick={exportCSV}>
                  <IconDownload size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className={styles.timetableGrid}>
              <div className={styles.ttCorner}>Time</div>
              {config.workingDays.map(day => (
                <div key={day} className={styles.ttDayHeader}>{day.slice(0, 3)}</div>
              ))}
              {generated.slots.map((slot, si) => (
                <React.Fragment key={`slot-${si}`}>
                  <div className={styles.ttTimeCell}>
                    {slot.start}
                    <br />
                    <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>{slot.end}</span>
                  </div>
                  {config.workingDays.map((day, di) => {
                    const cell = generated.timetable[day]?.[si];
                    return (
                      <div key={`${day}-${si}`} className={styles.ttCell}>
                        {cell && !cell.empty ? (
                          <div className={styles.ttBlock} style={{
                            borderLeft: `3px solid ${cell.color}`,
                            background: `${cell.color}12`,
                          }}>
                            <span className={styles.ttSubject}>{cell.subject}</span>
                            <span className={styles.ttFaculty}>{cell.faculty}</span>
                            <span className={styles.ttRoom}>{cell.room}</span>
                          </div>
                        ) : (
                          <div className={styles.ttEmpty}>—</div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

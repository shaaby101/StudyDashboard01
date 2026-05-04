'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { IconUpload, IconFileText, IconCheck, IconX } from '@/components/Icons';
import styles from './materials.module.css';

export default function FacultyMaterials() {
  const { user, courses, syllabus } = useApp();
  const [selectedSubject, setSelectedSubject] = useState(user?.subjects?.[0] || '');
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'DSA_Unit1_Notes.pdf', size: '2.4 MB', date: '2026-04-28', subject: 'CS301' },
    { id: 2, name: 'DBMS_ER_Diagram_Examples.pdf', size: '1.8 MB', date: '2026-04-25', subject: 'CS303' },
    { id: 3, name: 'Graph_Algorithms_Slides.pptx', size: '5.1 MB', date: '2026-04-20', subject: 'CS301' },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const mySubjects = courses.filter(c => user?.subjects?.includes(c.id));
  const filteredFiles = uploadedFiles.filter(f => f.subject === selectedSubject);

  const handleUpload = () => {
    const newFile = {
      id: Date.now(),
      name: `Course_Material_${Date.now()}.pdf`,
      size: '1.2 MB',
      date: new Date().toISOString().split('T')[0],
      subject: selectedSubject,
    };
    setUploadedFiles(prev => [newFile, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <DashboardLayout requiredRole="faculty">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Course Materials</h1>
          <p>Upload syllabus, notes, and resources to power the student AI companion</p>
        </div>

        <div className={styles.subjectTabs}>
          {mySubjects.map(sub => (
            <button
              key={sub.id}
              className={`${styles.tab} ${selectedSubject === sub.id ? styles.active : ''}`}
              onClick={() => setSelectedSubject(sub.id)}
            >
              {sub.code} — {sub.name}
            </button>
          ))}
        </div>

        {/* Upload Zone */}
        <div
          className={`glass-card-static ${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
          onClick={handleUpload}
        >
          <IconUpload size={40} />
          <h3>Drop files here or click to upload</h3>
          <p>Supports PDF, PPTX, DOCX, TXT — Max 25MB</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
            Uploaded materials will be used by the AI companion for contextual student assistance
          </p>
        </div>

        {uploadSuccess && (
          <div className={styles.successBanner}>
            <IconCheck size={18} />
            File uploaded successfully! The AI companion will now use this material.
          </div>
        )}

        {/* Uploaded Files */}
        <div className={`glass-card-static ${styles.filesCard}`}>
          <h3>Uploaded Materials ({filteredFiles.length})</h3>
          {filteredFiles.length === 0 ? (
            <div className={styles.emptyState}>No materials uploaded for this subject yet</div>
          ) : (
            <div className={styles.fileList}>
              {filteredFiles.map(file => (
                <div key={file.id} className={styles.fileItem}>
                  <div className={styles.fileIcon}>
                    <IconFileText size={20} />
                  </div>
                  <div className={styles.fileInfo}>
                    <h4>{file.name}</h4>
                    <span>{file.size} • Uploaded {file.date}</span>
                  </div>
                  <button className={styles.removeBtn}>
                    <IconX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Syllabus Preview */}
        {syllabus[selectedSubject] && (
          <div className={`glass-card-static ${styles.syllabusPreview}`}>
            <h3>Current Syllabus — {syllabus[selectedSubject].title}</h3>
            <div className={styles.unitGrid}>
              {syllabus[selectedSubject].units.map((unit, i) => (
                <div key={i} className={styles.unitItem}>
                  <h4>{unit.name}</h4>
                  <div className={styles.topicList}>
                    {unit.topics.map((t, j) => (
                      <span key={j} className={styles.topicChip}>{t}</span>
                    ))}
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

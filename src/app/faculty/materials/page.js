'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState, useRef } from 'react';
import { IconUpload, IconFileText, IconCheck, IconX } from '@/components/Icons';
import styles from './materials.module.css';

export default function FacultyMaterials() {
  const { user, courses, syllabus, addCourse, materials, addMaterial, removeMaterial } = useApp();
  const [selectedSubject, setSelectedSubject] = useState(user?.subjects?.[0] || '');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', topics: '' });
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const mySubjects = courses.filter(c => user?.subjects?.includes(c.id));
  const filteredFiles = materials.filter(f => f.subject === selectedSubject);

  const handleFileUpload = (e) => {
    const files = e.target.files || e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${sizeMB} MB`,
        date: new Date().toISOString().split('T')[0],
        subject: selectedSubject,
        fileObj: file,
      };
      addMaterial(newFile);
    });
    
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) return;
    
    const courseObj = {
      id: newCourse.code.toUpperCase(),
      name: newCourse.name,
      code: newCourse.code.toUpperCase(),
      faculty: user?.name || 'Faculty',
      credits: 3
    };
    
    const syllabusObj = {
      title: newCourse.name,
      units: [
        {
          name: 'Unit 1: Introduction',
          topics: newCourse.topics.split(',').map(t => t.trim()).filter(Boolean)
        }
      ]
    };
    
    addCourse(courseObj, syllabusObj);
    setNewCourse({ code: '', name: '', topics: '' });
    setShowCourseForm(false);
    setSelectedSubject(courseObj.id);
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
          <button 
            className={`${styles.tab} ${showCourseForm ? styles.active : ''}`}
            onClick={() => setShowCourseForm(!showCourseForm)}
            style={{ borderStyle: 'dashed' }}
          >
            + New Course
          </button>
        </div>

        {showCourseForm && (
          <form className={`glass-card-static ${styles.formCard}`} onSubmit={handleCreateCourse}>
            <h3>Create New Course & Syllabus</h3>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Course Code</label>
                <input 
                  placeholder="e.g. AI401" 
                  value={newCourse.code} 
                  onChange={e => setNewCourse({...newCourse, code: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Course Name</label>
                <input 
                  placeholder="e.g. Artificial Intelligence" 
                  value={newCourse.name} 
                  onChange={e => setNewCourse({...newCourse, name: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Initial Topics (Comma separated)</label>
              <input 
                placeholder="e.g. Neural Networks, Machine Learning, Deep Learning" 
                value={newCourse.topics} 
                onChange={e => setNewCourse({...newCourse, topics: e.target.value})}
                required 
              />
            </div>
            <button type="submit" className={styles.submitBtn}>Add Course & Coursework</button>
          </form>
        )}

        {/* Upload Zone */}
        <div
          className={`glass-card-static ${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e); }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            multiple 
          />
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
                  <button className={styles.removeBtn} onClick={() => removeMaterial(file.id)}>
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

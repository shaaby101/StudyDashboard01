'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { IconBook, IconChevronDown, IconFileText } from '@/components/Icons';
import { useState } from 'react';
import styles from './courses.module.css';

export default function StudentCourses() {
  const { courses, syllabus, user, enrollCourse, materials } = useApp();
  const [expandedCourse, setExpandedCourse] = useState(null);

  const enrolledCourses = courses.filter(c => user?.enrolledCourses?.includes(c.id));
  const availableCourses = courses.filter(c => !user?.enrolledCourses?.includes(c.id));

  const handleDownload = (e, mat) => {
    e.stopPropagation();
    let url;
    if (mat.fileObj) {
      url = URL.createObjectURL(mat.fileObj);
    } else {
      const blob = new Blob([`Content for ${mat.name}\n\nThis is a generated file since the original was mock data.`], { type: 'text/plain' });
      url = URL.createObjectURL(blob);
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = mat.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>My Courses</h1>
          <p>Enrolled courses and syllabus for Semester {user?.semester}</p>
        </div>

        <div className={styles.courseList}>
          {enrolledCourses.map(course => {
            const expanded = expandedCourse === course.id;
            const courseSyllabus = syllabus[course.id];
            return (
              <div key={course.id} className={`glass-card-static ${styles.courseItem}`}>
                <button
                  className={styles.courseHeader}
                  onClick={() => setExpandedCourse(expanded ? null : course.id)}
                >
                  <div className={styles.courseLeft}>
                    <div className={styles.courseIcon}>
                      <IconBook size={20} />
                    </div>
                    <div>
                      <div className={styles.courseCode}>{course.code}</div>
                      <h3>{course.name}</h3>
                      <div className={styles.courseMeta}>
                        <span>{course.faculty}</span>
                        <span>•</span>
                        <span>{course.credits} Credits</span>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.chevron} ${expanded ? styles.expanded : ''}`}>
                    <IconChevronDown size={20} />
                  </div>
                </button>

                {expanded && courseSyllabus && (
                  <div className={styles.syllabusContent}>
                    {materials?.filter(m => m.subject === course.id).length > 0 && (
                      <div className={styles.materialsSection}>
                        <h4 className={styles.materialsHeader}>Course Materials</h4>
                        <div className={styles.materialsList}>
                          {materials.filter(m => m.subject === course.id).map(mat => (
                            <div key={mat.id} className={styles.materialItem}>
                              <IconFileText size={16} />
                              <div className={styles.materialInfo}>
                                <span className={styles.materialName}>{mat.name}</span>
                                <span className={styles.materialSize}>{mat.size}</span>
                              </div>
                              <button className={styles.downloadBtn} onClick={(e) => handleDownload(e, mat)}>
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <h4 className={styles.materialsHeader} style={{ marginTop: materials?.filter(m => m.subject === course.id).length > 0 ? '16px' : '0' }}>Course Syllabus</h4>
                    {courseSyllabus.units.map((unit, i) => (
                      <div key={i} className={styles.unitCard}>
                        <h4>{unit.name}</h4>
                        <div className={styles.topicList}>
                          {unit.topics.map((topic, j) => (
                            <span key={j} className={styles.topicChip}>{topic}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {availableCourses.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Available Courses</h2>
            <div className={styles.courseList}>
              {availableCourses.map(course => (
                <div key={course.id} className={`glass-card-static ${styles.courseItem}`}>
                  <div className={styles.courseHeader} style={{ cursor: 'default' }}>
                    <div className={styles.courseLeft}>
                      <div className={styles.courseIcon}>
                        <IconBook size={20} />
                      </div>
                      <div>
                        <div className={styles.courseCode}>{course.code}</div>
                        <h3>{course.name}</h3>
                        <div className={styles.courseMeta}>
                          <span>{course.faculty}</span>
                          <span>•</span>
                          <span>{course.credits} Credits</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={styles.enrollBtn}
                      onClick={() => enrollCourse(course.id)}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

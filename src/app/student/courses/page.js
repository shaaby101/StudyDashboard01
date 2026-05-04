'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { IconBook, IconChevronDown } from '@/components/Icons';
import { useState } from 'react';
import styles from './courses.module.css';

export default function StudentCourses() {
  const { courses, syllabus, user } = useApp();
  const [expandedCourse, setExpandedCourse] = useState(null);

  const enrolledCourses = courses.filter(c => user?.enrolledCourses?.includes(c.id));

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
      </div>
    </DashboardLayout>
  );
}

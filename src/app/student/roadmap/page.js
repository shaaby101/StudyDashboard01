'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import { IconBrain, IconArrowRight, IconTrendingUp, IconBriefcase, IconAward } from '@/components/Icons';
import styles from './roadmap.module.css';

export default function CareerRoadmap() {
  const { user, courses } = useApp();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking an AI generation process
    const timer = setTimeout(() => {
      setRoadmap({
        careerGoal: "Full Stack AI Engineer",
        description: "Your strong performance in Computer Science and interest in AI suggest a path toward building intelligent web ecosystems.",
        milestones: [
          {
            title: "Phase 1: Foundations",
            status: "completed",
            tasks: ["Master Data Structures", "Proficiency in React.js", "Attend 90% of CS301 Lectures"],
            icon: <IconTrendingUp size={20} />
          },
          {
            title: "Phase 2: Specialization",
            status: "current",
            tasks: ["Advanced Python for AI", "Contextual LLM Integration", "Participate in Campus Hackathon"],
            icon: <IconBrain size={20} />
          },
          {
            title: "Phase 3: Industry Ready",
            status: "upcoming",
            tasks: ["Internship at Tech Corp", "Build a Production-ready Portfolio", "Certification in Cloud Computing"],
            icon: <IconBriefcase size={20} />
          }
        ],
        skillGap: ["System Design", "Cloud Infrastructure (AWS/GCP)", "Agile Methodologies"]
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  return (
    <DashboardLayout requiredRole="student">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1>AI Career Roadmap</h1>
            <p>Personalized path based on your academic performance and interests</p>
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <IconBrain size={18} /> Regenerate with AI
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.spinner} />
            <p>Analyzing your academic data and industry trends...</p>
          </div>
        ) : (
          <div className={styles.roadmapGrid}>
            {/* Main Path */}
            <div className={`glass-card-static ${styles.pathCard}`}>
              <div className={styles.goalHeader}>
                <div className={styles.goalIcon}><IconAward size={32} /></div>
                <div>
                  <h2 className={styles.goalTitle}>{roadmap.careerGoal}</h2>
                  <p className={styles.goalDesc}>{roadmap.description}</p>
                </div>
              </div>

              <div className={styles.timeline}>
                {roadmap.milestones.map((ms, idx) => (
                  <div key={idx} className={`${styles.milestone} ${styles[ms.status]}`}>
                    <div className={styles.milestoneIcon}>{ms.icon}</div>
                    <div className={styles.milestoneContent}>
                      <h3>{ms.title}</h3>
                      <ul className={styles.taskList}>
                        {ms.tasks.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    {ms.status === 'current' && <span className={styles.activeTag}>Current Focus</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className={styles.sidebar}>
               <div className={`glass-card-static ${styles.skillCard}`}>
                  <h3>Skill Gap Analysis</h3>
                  <p>AI suggests you focus on these areas to reach your goal:</p>
                  <div className={styles.skillList}>
                    {roadmap.skillGap.map(skill => (
                      <div key={skill} className={styles.skillItem}>
                        <span>{skill}</span>
                        <IconArrowRight size={14} />
                      </div>
                    ))}
                  </div>
               </div>

               <div className={`glass-card-static ${styles.nextStepsCard}`}>
                  <h3>Recommended Electives</h3>
                  <p>Based on your roadmap, prioritize these in Semester 6:</p>
                  <div className={styles.electiveList}>
                    <div className={styles.electiveItem}>
                      <strong>CS402: Distributed Systems</strong>
                      <span>92% Roadmap Match</span>
                    </div>
                    <div className={styles.electiveItem}>
                      <strong>AI501: Natural Language Processing</strong>
                      <span>88% Roadmap Match</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

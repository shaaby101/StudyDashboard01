'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { IconGrid, IconBrain, IconSend, IconChevronDown } from '@/components/Icons';
import styles from './Forum.module.css';

function generateAIForumAnswer(question, courseId, syllabus) {
  const course = syllabus[courseId];
  if (!course) return "Based on the course materials, I can help clarify this.";
  
  const allTopics = course.units.flatMap(u => u.topics);
  const q = question.toLowerCase();
  
  const matchedTopic = allTopics.find(t => q.includes(t.toLowerCase()));
  if (matchedTopic) {
    return `Hey! This is covered under **${matchedTopic}** in the syllabus. It's a key concept that relates to the broader topics in ${course.title}. I recommend reviewing the recent lecture notes for a detailed breakdown.`;
  }
  
  return `Great question! Based on our ${course.title} syllabus, this ties into the core concepts we are studying. Make sure to check the course materials uploaded by the professor for more context!`;
}

export default function ForumView({ requiredRole }) {
  const { user, courses, syllabus, forums, addForumQuestion, addForumAnswer, promptAiAnswer } = useApp();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [replyContent, setReplyContent] = useState({});

  const userCourses = courses.filter(c => 
    requiredRole === 'student' ? user?.enrolledCourses?.includes(c.id) : user?.subjects?.includes(c.id)
  );

  // Initialize selected course if empty
  if (!selectedCourse && userCourses.length > 0) {
    setSelectedCourse(userCourses[0].id);
  }

  const courseForums = forums[selectedCourse] || [];

  const handleAsk = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !selectedCourse) return;
    addForumQuestion(selectedCourse, newQuestion);
    setNewQuestion('');
  };

  const handleReply = (questionId) => {
    const content = replyContent[questionId];
    if (!content?.trim()) return;
    addForumAnswer(selectedCourse, questionId, content);
    setReplyContent({ ...replyContent, [questionId]: '' });
  };

  const handleAiRequest = (questionId, questionText) => {
    promptAiAnswer(selectedCourse, questionId);
    setTimeout(() => {
      const answer = generateAIForumAnswer(questionText, selectedCourse, syllabus);
      addForumAnswer(selectedCourse, questionId, answer, true);
    }, 1000);
  };

  return (
    <DashboardLayout requiredRole={requiredRole}>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.forumIcon}>
              <IconGrid size={24} />
            </div>
            <div>
              <h1>Class Discussion</h1>
              <p>Ask questions and help your peers in {userCourses.find(c => c.id === selectedCourse)?.name}</p>
            </div>
          </div>
          
          <select 
            className={styles.courseSelect}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {userCourses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
          </select>
        </div>

        {/* Ask Question Form */}
        <form className={`glass-card-static ${styles.askForm}`} onSubmit={handleAsk}>
          <input 
            type="text" 
            placeholder="Ask a question to the class..." 
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            className={styles.askInput}
          />
          <button type="submit" className={styles.askBtn} disabled={!newQuestion.trim()}>
            Post Question
          </button>
        </form>

        {/* Forum Threads */}
        <div className={styles.threads}>
          {courseForums.length === 0 ? (
            <div className={styles.emptyState}>No questions yet. Be the first to ask!</div>
          ) : (
            courseForums.map(q => (
              <div key={q.id} className={`glass-card-static ${styles.thread}`}>
                <div className={styles.questionHeader}>
                  <div className={styles.authorAvatar}>{q.author.charAt(0)}</div>
                  <div className={styles.questionMeta}>
                    <span className={styles.authorName}>{q.author} <span className={styles.badge}>{q.role}</span></span>
                    <span className={styles.time}>{q.timestamp}</span>
                  </div>
                </div>
                <h3 className={styles.questionText}>{q.question}</h3>

                {/* AI Prompt trigger if no answers */}
                {q.answers.length === 0 && !q.aiPrompted && (
                  <div className={styles.aiPrompt}>
                    <p>No one has answered yet. Want the AI Companion to take a look?</p>
                    <button onClick={() => handleAiRequest(q.id, q.question)} className={styles.aiBtn}>
                      <IconBrain size={16} /> Ask AI
                    </button>
                  </div>
                )}
                {q.answers.length === 0 && q.aiPrompted && (
                  <div className={styles.aiPrompt}>
                    <p>AI is thinking...</p>
                  </div>
                )}

                {/* Answers */}
                <div className={styles.answers}>
                  {q.answers.map(ans => (
                    <div key={ans.id} className={`${styles.answer} ${ans.role === 'ai' ? styles.aiAnswer : ''}`}>
                      <div className={styles.answerHeader}>
                        {ans.role === 'ai' ? <IconBrain size={16} color="var(--accent)" /> : <div className={styles.authorAvatarSmall}>{ans.author.charAt(0)}</div>}
                        <span className={styles.authorName}>{ans.author} {ans.role === 'ai' && <span className={styles.aiBadge}>AI Generated</span>}</span>
                        <span className={styles.time}>{ans.timestamp}</span>
                      </div>
                      <p className={styles.answerContent}>{ans.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className={styles.replyForm}>
                  <input 
                    type="text" 
                    placeholder="Write a reply..." 
                    value={replyContent[q.id] || ''}
                    onChange={e => setReplyContent({...replyContent, [q.id]: e.target.value})}
                    className={styles.replyInput}
                  />
                  <button onClick={() => handleReply(q.id)} className={styles.replyBtn} disabled={!(replyContent[q.id] || '').trim()}>
                    <IconSend size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { IconMicrophone, IconSend, IconBrain, IconBook, IconChevronDown, IconX, IconRefresh } from '@/components/Icons';
import styles from './ai.module.css';

// Simulated AI responses based on syllabus context
function generateAIResponse(query, courseId, syllabus) {
  const q = query.toLowerCase();
  const course = syllabus[courseId];
  if (!course) return "Please select a course to start asking questions.";

  const allTopics = course.units.flatMap(u => u.topics);

  // Detect intent
  if (q.includes('summarize') || q.includes('summary') || q.includes('explain') || q.includes('what is') || q.includes('tell me about')) {
    const matchedTopic = allTopics.find(t => q.includes(t.toLowerCase()));
    if (matchedTopic) {
      return `## ${matchedTopic}\n\n**${matchedTopic}** is a key concept in ${course.title}. Here's a comprehensive breakdown:\n\n### Key Points\n- ${matchedTopic} is fundamental to understanding modern ${course.title.toLowerCase()}\n- It builds upon basic principles and extends into practical applications\n- Understanding this concept is crucial for exam preparation\n\n### How It Connects\nThis topic connects to several other areas in your syllabus, including related concepts in the same unit.\n\n> 💡 *Tip: Try asking me to generate a quiz on this topic to test your understanding!*`;
    }
    return `## ${course.title} — Overview\n\nThis course covers ${course.units.length} major units:\n\n${course.units.map((u, i) => `**${i + 1}. ${u.name}**\n   Topics: ${u.topics.join(', ')}`).join('\n\n')}\n\n> Ask me about any specific topic for a detailed explanation!`;
  }

  if (q.includes('quiz') || q.includes('test') || q.includes('practice') || q.includes('mcq')) {
    const unit = course.units[Math.floor(Math.random() * course.units.length)];
    return `## 📝 Quick Quiz — ${unit.name}\n\n**Q1.** Which of the following is NOT a concept covered in ${unit.name}?\n- a) ${unit.topics[0]}\n- b) ${unit.topics[1] || 'None'}\n- c) Quantum Computing\n- d) ${unit.topics[2] || 'All of the above'}\n\n**Q2.** True or False: ${unit.topics[0]} is considered a fundamental concept in ${course.title}.\n\n**Q3.** Briefly explain the relationship between ${unit.topics[0]} and ${unit.topics[1] || unit.topics[0]}.\n\n---\n*Answers: Q1: c, Q2: True*\n\n> Want more questions? Just ask for another quiz!`;
  }

  if (q.includes('topic') || q.includes('syllabus') || q.includes('unit') || q.includes('cover')) {
    return `## 📚 ${course.title} — Syllabus Breakdown\n\n${course.units.map((u, i) => `### ${u.name}\n${u.topics.map(t => `- ${t}`).join('\n')}`).join('\n\n')}\n\n> Ask me to explain any topic or generate a quiz for any unit!`;
  }

  if (q.includes('help') || q.includes('what can you do') || q.includes('how') || q === '') {
    return `## 🤖 How I Can Help\n\nI'm your AI study companion for **${course.title}**. Here's what I can do:\n\n- 📖 **Explain concepts** — "Explain Binary Trees" or "What is TCP?"\n- 📝 **Generate quizzes** — "Give me a quiz on Unit 2"\n- 📚 **Syllabus overview** — "Show me the syllabus"\n- 🔗 **Topic connections** — "How does X relate to Y?"\n- 📊 **Summaries** — "Summarize Unit 3"\n\n> I work within your course syllabus to ensure academic relevance!`;
  }

  // Default contextual response
  const randomUnit = course.units[Math.floor(Math.random() * course.units.length)];
  return `Based on the **${course.title}** syllabus, here's what I found:\n\n### Related Concepts\nYour query touches on topics covered in **${randomUnit.name}**:\n\n${randomUnit.topics.map(t => `- **${t}** — A core concept you should review`).join('\n')}\n\n### Study Tips\n1. Start with the fundamentals of this unit\n2. Practice with examples and problems\n3. Try to connect concepts across different units\n\n> Would you like me to generate a quiz or provide a detailed explanation?`;
}

export default function AICompanion() {
  const { courses, syllabus, user } = useApp();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const enrolledCourses = courses.filter(c => user?.enrolledCourses?.includes(c.id));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (selectedCourse && messages.length === 0) {
      const course = syllabus[selectedCourse];
      setMessages([{
        id: Date.now(),
        role: 'ai',
        content: `## 👋 Hello ${user?.name?.split(' ')[0]}!\n\nI'm your AI study companion for **${course?.title}**. I'm grounded in your course syllabus to provide relevant, accurate assistance.\n\n### Try asking me:\n- "Summarize the syllabus"\n- "Explain [any topic]"\n- "Generate a quiz"\n- "What topics are in Unit 2?"\n\nYou can type or use the 🎤 microphone button to speak naturally!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  }, [selectedCourse]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !selectedCourse) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const response = generateAIResponse(text, selectedCourse, syllabus);
    const aiMsg = {
      id: Date.now() + 1,
      role: 'ai',
      content: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }, [selectedCourse, syllabus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      setInput(transcript);
    };
    recognition.onend = () => {
      setIsListening(false);
      if (inputRef.current?.value) {
        sendMessage(inputRef.current.value);
      }
    };
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Simple markdown-ish renderer
  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className={styles.mdH2}>{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className={styles.mdH3}>{line.slice(4)}</h3>;
      if (line.startsWith('> ')) return <blockquote key={i} className={styles.mdQuote}>{line.slice(2)}</blockquote>;
      if (line.startsWith('- ')) {
        const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <li key={i} className={styles.mdLi} dangerouslySetInnerHTML={{ __html: content }} />;
      }
      if (line.startsWith('---')) return <hr key={i} className={styles.mdHr} />;
      if (line.trim() === '') return <br key={i} />;
      const content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <p key={i} className={styles.mdP} dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.aiIcon}>
                <IconBrain size={24} />
              </div>
              <div>
                <h1>AI Study Companion</h1>
                <p>Grounded in your course syllabus</p>
              </div>
            </div>

            {/* Course Selector */}
            <div className={styles.courseSelector}>
              <button
                className={styles.courseSelectorBtn}
                onClick={() => setShowCourseSelect(!showCourseSelect)}
              >
                <IconBook size={16} />
                <span>{selectedCourse ? courses.find(c => c.id === selectedCourse)?.name : 'Select Course'}</span>
                <IconChevronDown size={16} />
              </button>
              {showCourseSelect && (
                <div className={styles.courseDropdown}>
                  {enrolledCourses.map(c => (
                    <button
                      key={c.id}
                      className={`${styles.courseOption} ${selectedCourse === c.id ? styles.selected : ''}`}
                      onClick={() => {
                        setSelectedCourse(c.id);
                        setShowCourseSelect(false);
                        setMessages([]);
                      }}
                    >
                      <span className={styles.courseCode}>{c.code}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!selectedCourse ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <IconBrain size={48} />
              </div>
              <h2>Select a course to begin</h2>
              <p>Choose from your enrolled courses to start a contextual AI conversation grounded in your syllabus.</p>
              <div className={styles.courseCards}>
                {enrolledCourses.map(c => (
                  <button
                    key={c.id}
                    className={`glass-card ${styles.courseCard}`}
                    onClick={() => { setSelectedCourse(c.id); setMessages([]); }}
                  >
                    <IconBook size={20} />
                    <strong>{c.code}</strong>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Chat Area */}
              <div className={styles.chatArea}>
                <div className={styles.messages}>
                  {messages.map(msg => (
                    <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
                      {msg.role === 'ai' && (
                        <div className={styles.msgAvatar}>
                          <IconBrain size={16} />
                        </div>
                      )}
                      <div className={styles.msgBubble}>
                        <div className={styles.msgContent}>
                          {msg.role === 'ai' ? renderContent(msg.content) : msg.content}
                        </div>
                        <span className={styles.msgTime}>{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className={`${styles.message} ${styles.ai}`}>
                      <div className={styles.msgAvatar}>
                        <IconBrain size={16} />
                      </div>
                      <div className={styles.msgBubble}>
                        <div className={styles.typingDots}>
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className={styles.suggestions}>
                {['Summarize the syllabus', 'Generate a quiz', 'Explain key concepts', 'What topics are covered?'].map(s => (
                  <button key={s} className={styles.chip} onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form className={styles.inputArea} onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your course..."
                    className={styles.chatInput}
                    disabled={isTyping}
                  />
                  <div className={styles.inputActions}>
                    <button
                      type="button"
                      className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
                      onClick={isListening ? stopVoice : startVoice}
                      title="Voice input"
                    >
                      <IconMicrophone size={18} />
                      {isListening && <span className={styles.voicePulse} />}
                    </button>
                    <button
                      type="submit"
                      className={styles.sendBtn}
                      disabled={!input.trim() || isTyping}
                    >
                      <IconSend size={18} />
                    </button>
                  </div>
                </div>
                <p className={styles.disclaimer}>AI responses are grounded in your course syllabus for academic relevance.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

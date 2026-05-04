'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { IconMicrophone, IconSend, IconBrain, IconBook, IconChevronDown, IconX, IconRefresh } from '@/components/Icons';
import styles from './ai.module.css';

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

    try {
      const course = syllabus[selectedCourse];
      const systemPrompt = `You are a personalized AI study companion for a student taking the course "${course?.title || 'Unknown Course'}". 
      Here is the course syllabus: ${JSON.stringify(course?.units || [])}.
      The student will ask questions, request quizzes, or ask for summaries. Provide highly educational, accurate, and encouraging answers formatted beautifully in Markdown (use ## headings, bolding, and lists). Stay relevant to the syllabus.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, systemPrompt })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch AI response");

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: `⚠️ **Error:** ${err.message}. Make sure your GROQ_API_KEY is configured correctly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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

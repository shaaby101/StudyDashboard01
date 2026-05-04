'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight, IconSettings, IconBrain, IconRefresh } from '@/components/Icons';
import styles from './study-corner.module.css';

export default function StudyCorner() {
  const { user, logStudyTime } = useApp();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/');
    }
  }, [user, router]);

  // Pomodoro State
  const [mode, setMode] = useState('study'); // study, shortBreak, longBreak
  const [settings, setSettings] = useState({ study: 25, shortBreak: 5, longBreak: 15 });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Flashcards State
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Pomodoro Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (mode === 'study') {
        logStudyTime(user.id, user.name, settings.study);
      }
      alert(mode === 'study' ? 'Study session complete! Take a break.' : 'Break over! Back to studying.');
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, logStudyTime, user, settings.study]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(settings[newMode] * 60);
  };

  const updateSettings = (e) => {
    e.preventDefault();
    setShowSettings(false);
    setTimeLeft(settings[mode] * 60);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Flashcard Generation
  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.studyCorner}>
      {/* Discrete Back Button */}
      <button className={styles.backBtn} onClick={() => router.push('/student')}>
        <IconChevronLeft size={16} /> Back to Dashboard
      </button>

      <div className={styles.container}>
        {/* Left Column: Pomodoro */}
        <div className={styles.pomodoroSection}>
          <div className={`glass-card-static ${styles.pomodoroCard}`}>
            <div className={styles.pomodoroHeader}>
              <div className={styles.modeTabs}>
                <button className={`${styles.modeBtn} ${mode === 'study' ? styles.activeMode : ''}`} onClick={() => switchMode('study')}>Focus</button>
                <button className={`${styles.modeBtn} ${mode === 'shortBreak' ? styles.activeMode : ''}`} onClick={() => switchMode('shortBreak')}>Short Break</button>
                <button className={`${styles.modeBtn} ${mode === 'longBreak' ? styles.activeMode : ''}`} onClick={() => switchMode('longBreak')}>Long Break</button>
              </div>
              <button className={styles.iconBtn} onClick={() => setShowSettings(!showSettings)}><IconSettings size={20} /></button>
            </div>

            {showSettings ? (
              <form className={styles.settingsForm} onSubmit={updateSettings}>
                <label>Study (min): <input type="number" min="1" value={settings.study} onChange={e => setSettings({...settings, study: parseInt(e.target.value)})}/></label>
                <label>Short Break: <input type="number" min="1" value={settings.shortBreak} onChange={e => setSettings({...settings, shortBreak: parseInt(e.target.value)})}/></label>
                <label>Long Break: <input type="number" min="1" value={settings.longBreak} onChange={e => setSettings({...settings, longBreak: parseInt(e.target.value)})}/></label>
                <button type="submit" className={styles.saveBtn}>Save</button>
              </form>
            ) : (
              <>
                <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
                <div className={styles.timerControls}>
                  <button className={styles.playBtn} onClick={() => setIsActive(!isActive)}>
                    {isActive ? 'Pause' : 'Start'}
                  </button>
                  <button className={styles.resetBtn} onClick={() => { setIsActive(false); setTimeLeft(settings[mode] * 60); }}>
                    <IconRefresh size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Flashcards */}
        <div className={styles.flashcardSection}>
          <div className={`glass-card-static ${styles.flashcardCard}`}>
            {flashcards.length === 0 ? (
              <div className={styles.generatorState}>
                <h2><IconBrain size={24} /> AI Flashcards</h2>
                <p>Paste your notes or a textbook paragraph below to generate highly specific study cards.</p>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Paste your study material here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isGenerating}
                />
                {error && <div className={styles.error}>{error}</div>}
                <button 
                  className={styles.generateBtn} 
                  onClick={handleGenerate}
                  disabled={isGenerating || !inputText.trim()}
                >
                  {isGenerating ? 'Generating...' : 'Generate Flashcards'}
                </button>
              </div>
            ) : (
              <div className={styles.viewerState}>
                <div className={styles.viewerHeader}>
                  <span>Card {currentIndex + 1} of {flashcards.length}</span>
                  <button className={styles.textBtn} onClick={() => setFlashcards([])}>Create New</button>
                </div>
                
                <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardFront}>
                      <span className={styles.cardBadge}>Question</span>
                      <h3>{flashcards[currentIndex].q}</h3>
                      <span className={styles.flipHint}>Click to flip</span>
                    </div>
                    <div className={styles.cardBack}>
                      <span className={styles.cardBadge}>Answer</span>
                      <p>{flashcards[currentIndex].a}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.cardControls}>
                  <button 
                    className={styles.navBtn} 
                    disabled={currentIndex === 0}
                    onClick={() => { setCurrentIndex(c => c - 1); setIsFlipped(false); }}
                  >
                    <IconChevronLeft size={24} />
                  </button>
                  <button 
                    className={styles.navBtn} 
                    disabled={currentIndex === flashcards.length - 1}
                    onClick={() => { setCurrentIndex(c => c + 1); setIsFlipped(false); }}
                  >
                    <IconChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

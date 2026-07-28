import React, { useState, useEffect, useCallback } from 'react';
import { useKeynoteAudio } from './hooks/useKeynoteAudio';
import { KeynoteNav } from './components/navigation/KeynoteNav';
import { Chapter01Opening } from './components/chapters/Chapter01Opening';
import { Chapter02Hero } from './components/chapters/Chapter02Hero';
import { Chapter03Problem } from './components/chapters/Chapter03Problem';
import { Chapter04Transformation } from './components/chapters/Chapter04Transformation';
import { Chapter05Platform } from './components/chapters/Chapter05Platform';
import { Chapter06Tour } from './components/chapters/Chapter06Tour';
import { Chapter07AI } from './components/chapters/Chapter07AI';
import { Chapter08Technology } from './components/chapters/Chapter08Technology';
import { Chapter09Vision } from './components/chapters/Chapter09Vision';
import { Chapter10Ending } from './components/chapters/Chapter10Ending';

const CHAPTER_TITLES = [
  '01 Opening',
  '02 Hero Statement',
  '03 The Problem',
  '04 Transformation',
  '05 Living Platform',
  '06 Module Tour',
  '07 Ambient AI',
  '08 Architecture',
  '09 Future Vision',
  '10 Conclusion',
];

export default function App() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { isMuted, toggleMute, playClickSound, playMorphSound, playSapphirePulse } = useKeynoteAudio();

  const handleSelectChapter = useCallback((index: number) => {
    playClickSound();
    setCurrentChapter(Math.max(0, Math.min(CHAPTER_TITLES.length - 1, index)));
  }, [playClickSound]);

  const handleNextChapter = useCallback(() => {
    handleSelectChapter(currentChapter + 1);
  }, [currentChapter, handleSelectChapter]);

  // Slideshow auto-advance mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentChapter((prev) => {
          if (prev >= CHAPTER_TITLES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          playClickSound();
          return prev + 1;
        });
      }, 12000); // 12 seconds per chapter slide
    }
    return () => clearInterval(interval);
  }, [isPlaying, playClickSound]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentChapter((prev) => Math.min(CHAPTER_TITLES.length - 1, prev + 1));
        playClickSound();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentChapter((prev) => Math.max(0, prev - 1));
        playClickSound();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playClickSound, toggleMute]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FAFAFA] font-sans antialiased overflow-x-hidden select-none">
      {/* Keynote Navigation Floating Bar */}
      <KeynoteNav
        currentChapterIndex={currentChapter}
        totalChapters={CHAPTER_TITLES.length}
        chapterTitles={CHAPTER_TITLES}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onSelectChapter={handleSelectChapter}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onToggleMute={toggleMute}
      />

      {/* Main Chapter Content Container */}
      <main className="relative z-10 w-full transition-opacity duration-700">
        {currentChapter === 0 && (
          <Chapter01Opening onProceed={handleNextChapter} onAudioMorph={playMorphSound} />
        )}
        {currentChapter === 1 && (
          <Chapter02Hero onProceed={handleNextChapter} onPlayClick={playClickSound} />
        )}
        {currentChapter === 2 && (
          <Chapter03Problem onProceed={handleNextChapter} />
        )}
        {currentChapter === 3 && (
          <Chapter04Transformation onProceed={handleNextChapter} onAudioMorph={playMorphSound} />
        )}
        {currentChapter === 4 && (
          <Chapter05Platform onProceed={handleNextChapter} onAudioClick={playClickSound} />
        )}
        {currentChapter === 5 && (
          <Chapter06Tour onProceed={handleNextChapter} onAudioClick={playClickSound} />
        )}
        {currentChapter === 6 && (
          <Chapter07AI onProceed={handleNextChapter} onAudioPulse={playSapphirePulse} />
        )}
        {currentChapter === 7 && (
          <Chapter08Technology onProceed={handleNextChapter} onAudioClick={playClickSound} />
        )}
        {currentChapter === 8 && (
          <Chapter09Vision onProceed={handleNextChapter} />
        )}
        {currentChapter === 9 && (
          <Chapter10Ending onRestartKeynote={() => handleSelectChapter(0)} />
        )}
      </main>
    </div>
  );
}

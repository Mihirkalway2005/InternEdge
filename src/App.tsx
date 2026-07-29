'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useKeynoteAudio } from './hooks/useKeynoteAudio';
import { HeaderNav } from './components/navigation/HeaderNav';
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

const SECTION_TITLES = [
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
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { isMuted, toggleMute, playClickSound, playMorphSound, playSapphirePulse } = useKeynoteAudio();

  const handleScrollToSection = (index: number) => {
    playClickSound();
    const targetRef = sectionRefs.current[index];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Observe active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      sectionRefs.current.forEach((ref, idx) => {
        if (ref) {
          const top = ref.offsetTop;
          const height = ref.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(idx);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Mute Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMute]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#FAFAFA] font-sans antialiased overflow-x-hidden">
      {/* Floating Header Navbar */}
      <HeaderNav
        activeSectionIndex={activeSection}
        sectionTitles={SECTION_TITLES}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onScrollToSection={handleScrollToSection}
      />

      {/* Single Continuous Main Container */}
      <main className="relative z-10 w-full flex flex-col">
        <div ref={(el) => (sectionRefs.current[0] = el)} id="opening">
          <Chapter01Opening onProceed={() => handleScrollToSection(1)} onAudioMorph={playMorphSound} />
        </div>

        <div ref={(el) => (sectionRefs.current[1] = el)} id="hero">
          <Chapter02Hero onProceed={() => handleScrollToSection(2)} onPlayClick={playClickSound} />
        </div>

        <div ref={(el) => (sectionRefs.current[2] = el)} id="problem">
          <Chapter03Problem onProceed={() => handleScrollToSection(3)} />
        </div>

        <div ref={(el) => (sectionRefs.current[3] = el)} id="transformation">
          <Chapter04Transformation onProceed={() => handleScrollToSection(4)} onAudioMorph={playMorphSound} />
        </div>

        <div ref={(el) => (sectionRefs.current[4] = el)} id="platform">
          <Chapter05Platform onProceed={() => handleScrollToSection(5)} onAudioClick={playClickSound} />
        </div>

        <div ref={(el) => (sectionRefs.current[5] = el)} id="tour">
          <Chapter06Tour onProceed={() => handleScrollToSection(6)} onAudioClick={playClickSound} />
        </div>

        <div ref={(el) => (sectionRefs.current[6] = el)} id="ai">
          <Chapter07AI onProceed={() => handleScrollToSection(7)} onAudioPulse={playSapphirePulse} />
        </div>

        <div ref={(el) => (sectionRefs.current[7] = el)} id="technology">
          <Chapter08Technology onProceed={() => handleScrollToSection(8)} onAudioClick={playClickSound} />
        </div>

        <div ref={(el) => (sectionRefs.current[8] = el)} id="vision">
          <Chapter09Vision onProceed={() => handleScrollToSection(9)} />
        </div>

        <div ref={(el) => (sectionRefs.current[9] = el)} id="ending">
          <Chapter10Ending onRestartKeynote={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>
      </main>
    </div>
  );
}

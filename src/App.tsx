/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { SubjectId } from './types';
import { ThreeCanvas, SceneControlsRef } from './components/ThreeCanvas';
import { HeaderNav } from './components/HeaderNav';
import { BottomControlDock } from './components/BottomControlDock';
import { FormulaPanel } from './components/FormulaPanel';
import { QuizModal } from './components/QuizModal';
import { MicroscopeModal } from './components/MicroscopeModal';
import { LabNotebookModal } from './components/LabNotebookModal';
import { soundFx } from './utils/audio';

export default function App() {
  const [currentSubject, setCurrentSubject] = useState<SubjectId>('khtn_bio');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string | null>(null);

  // Modals state
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMicroscopeOpen, setIsMicroscopeOpen] = useState(false);
  const [isLabNotebookOpen, setIsLabNotebookOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Controls Ref for imperatively controlling active 3D scenes
  const controlsRef = useRef<SceneControlsRef | null>(null);

  // When subject changes, reset selected organelle
  const handleSelectSubject = (id: SubjectId) => {
    setCurrentSubject(id);
    setSelectedOrganelleId(null);
  };

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard shortcuts for convenience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'r' || e.key === 'R') {
        controlsRef.current?.resetCamera();
        soundFx.playClick();
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFormulaOpen((prev) => !prev);
        soundFx.playClick();
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQuizOpen((prev) => !prev);
        soundFx.playClick();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMicroscopeOpen((prev) => !prev);
        soundFx.playClick();
      } else if (e.key === 'n' || e.key === 'N') {
        setIsLabNotebookOpen((prev) => !prev);
        soundFx.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 3D WebGL Canvas Layer (Full viewport) */}
      <ThreeCanvas
        currentSubject={currentSubject}
        controlsRef={controlsRef}
        onSelectOrganelle={(id) => setSelectedOrganelleId(id)}
      />

      {/* Top Header Navigation Overlay */}
      <HeaderNav
        currentSubject={currentSubject}
        onSelectSubject={handleSelectSubject}
        onOpenFormula={() => setIsFormulaOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenMicroscope={() => setIsMicroscopeOpen(true)}
        onOpenLabNotebook={() => setIsLabNotebookOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Collapsible Bottom Control Dock */}
      <BottomControlDock
        currentSubject={currentSubject}
        controlsRef={controlsRef}
        selectedOrganelleId={selectedOrganelleId}
        onSelectOrganelle={(id) => setSelectedOrganelleId(id)}
        onOpenMicroscope={() => setIsMicroscopeOpen(true)}
        onOpenLabNotebook={() => setIsLabNotebookOpen(true)}
      />

      {/* Interactive Formula & Calculator Modal */}
      <FormulaPanel
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
        currentSubject={currentSubject}
        onSelectSubject={handleSelectSubject}
      />

      {/* Interactive Quiz & Knowledge Test Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        currentSubject={currentSubject}
      />

      {/* Virtual Optical Microscope Modal */}
      <MicroscopeModal
        isOpen={isMicroscopeOpen}
        onClose={() => setIsMicroscopeOpen(false)}
      />

      {/* Laboratory Notebook & Chart Modal */}
      <LabNotebookModal
        isOpen={isLabNotebookOpen}
        onClose={() => setIsLabNotebookOpen(false)}
      />
    </div>
  );
}

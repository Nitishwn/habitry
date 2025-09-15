import React, { useState, useCallback, useEffect } from 'react';
import { Challenge, DayNote } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { createChallenge, calculateStreaks } from './utils/challengeUtils';
import { ChallengeSelector } from './components/ChallengeSelector';
import { ChallengeHeader } from './components/ChallengeHeader';
import { PuzzleGrid } from './components/PuzzleGrid';
import { DayNoteModal } from './components/DayNoteModal';
import { JourneyReview } from './components/JourneyReview';
import { DarkModeToggle } from './components/DarkModeToggle';
import { Sparkles } from 'lucide-react';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  const challengeDeserializer = (data: any[]): Challenge[] => {
    return data.map(challenge => ({
      ...challenge,
      completedDays: new Set(Array.from(challenge.completedDays || []))
    }));
  };

  const [challenges, setChallenges] = useLocalStorage<Challenge[]>('consistency-challenges', [], challengeDeserializer);
  const [activeChallengeId, setActiveChallengeId] = useLocalStorage<string | null>('active-challenge-id', null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showJourneyReview, setShowJourneyReview] = useState(false);

  const activeChallenge = challenges.find(c => c.id === activeChallengeId) || null;

  const handleCreateChallenge = useCallback((name: string, duration: number) => {
    const newChallenge = createChallenge(name, duration);
    setChallenges(prev => [...prev, newChallenge]);
    setActiveChallengeId(newChallenge.id);
  }, [setChallenges, setActiveChallengeId]);

  const handleSelectChallenge = useCallback((challenge: Challenge) => {
    setActiveChallengeId(challenge.id);
  }, [setActiveChallengeId]);

  const handleDeleteChallenge = useCallback((id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    if (activeChallengeId === id) {
      const remaining = challenges.filter(c => c.id !== id);
      setActiveChallengeId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [setChallenges, setActiveChallengeId, challenges, activeChallengeId]);

  const handleUpdateChallengeImage = useCallback((id: string, image: string) => {
    setChallenges(prev => prev.map(challenge =>
      challenge.id === id
        ? { ...challenge, image }
        : challenge
    ));
  }, [setChallenges]);

  const handleCellClick = useCallback((day: number) => {
    if (!activeChallenge) return;

    const isCompleted = activeChallenge.completedDays.has(day);
    
    // Always set the selected day first
    setSelectedDay(day);
    
    if (!isCompleted) {
      // Mark as completed and show note modal
      // Update challenge completion
      const newCompletedDays = new Set(activeChallenge.completedDays);
      newCompletedDays.add(day);
      const { current, longest } = calculateStreaks(newCompletedDays);
      
      setChallenges(prev => prev.map(challenge =>
        challenge.id === activeChallenge.id
          ? {
              ...challenge,
              completedDays: newCompletedDays,
              currentStreak: current,
              longestStreak: Math.max(challenge.longestStreak, longest)
            }
          : challenge
      ));
    }
    
    // Always show the modal after setting the day
    setShowNoteModal(true);
  }, [activeChallenge, setChallenges]);

  const handleSaveNote = useCallback((note: DayNote) => {
    if (!activeChallenge || !selectedDay) return;

    setChallenges(prev => prev.map(challenge =>
      challenge.id === activeChallenge.id
        ? {
            ...challenge,
            notes: {
              ...challenge.notes,
              [selectedDay]: note
            }
          }
        : challenge
    ));

    setShowNoteModal(false);
    setSelectedDay(null);
  }, [activeChallenge, selectedDay, setChallenges]);

  
  useEffect(() => {
    if (challenges.length === 0) {
      handleCreateChallenge('My First Challenge', 100);
    }
  }, [challenges.length, handleCreateChallenge]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden transition-colors duration-300">
      {}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800/30 dark:to-purple-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800/30 dark:to-pink-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-200 to-blue-200 dark:from-indigo-800/30 dark:to-blue-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {}
        <div className="fixed top-6 right-6 z-40">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        </div>
        
        {}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Consistency Tracker
            </h1>
            <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
            Turn your daily progress into a beautiful puzzle reveal
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Your journey starts here</span>
          </div>
        </div>

        {}
        <ChallengeSelector
          challenges={challenges}
          activeChallenge={activeChallenge}
          onSelectChallenge={handleSelectChallenge}
          onCreateChallenge={handleCreateChallenge}
          onDeleteChallenge={handleDeleteChallenge}
          onUpdateChallengeImage={handleUpdateChallengeImage}
        />

        {}
        {activeChallenge && (
          <>
            <ChallengeHeader 
              challenge={activeChallenge} 
              onOpenJourney={() => setShowJourneyReview(true)}
            />
            <PuzzleGrid
              challenge={activeChallenge}
              onCellClick={handleCellClick}
            />
          </>
        )}

        {}
        <DayNoteModal
          isOpen={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setSelectedDay(null);
          }}
          onSave={handleSaveNote}
          day={selectedDay || 1}
          key={selectedDay}
          existingNote={selectedDay ? activeChallenge?.notes[selectedDay] : undefined}
        />

        {}
        {activeChallenge && (
          <JourneyReview
            challenge={activeChallenge}
            isOpen={showJourneyReview}
            onClose={() => setShowJourneyReview(false)}
          />
        )}

        {}
        <div className="text-center mt-16 relative">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Your progress is stored locally on your device for complete privacy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
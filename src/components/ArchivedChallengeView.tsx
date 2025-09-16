import React, { useRef, useMemo } from 'react';
import { Challenge, DayNote } from '../types';
import { getGridDimensions } from '../utils/challengeUtils';
import {
  X, Award, Star, Trophy, Calendar, FileText, Camera, Link, Heart, Clock
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface ArchivedChallengeViewProps {
  challenge: Challenge;
}

export const ArchivedChallengeView: React.FC<ArchivedChallengeViewProps> = ({ challenge }) => {
  const shareContentRef = useRef<HTMLDivElement>(null);

  const { rows, cols } = getGridDimensions(challenge.duration);
  const totalDays = challenge.duration;

  const completedDaysWithNotes = useMemo(() => {
    return Array.from(challenge.completedDays)
      .filter(day => challenge.notes[day])
      .sort((a, b) => a - b);
  }, [challenge.completedDays, challenge.notes]);

  const formatDate = (day: number) => {
    const startDate = new Date(challenge.createdAt);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + day - 1);
    return targetDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleShare = async () => {
    try {
      if (!shareContentRef.current) return;
      
      const dataUrl = await htmlToImage.toPng(shareContentRef.current, {
        quality: 0.98,
        backgroundColor: '#f1f5f9', // Light background for the capture
        pixelRatio: 2, // Higher resolution
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "habitry-achievement.png", { type: "image/png" });

      const shareData: ShareData = {
        files: [file],
        title: `Challenge Completed: ${challenge.name}`,
        text: `I just completed my ${challenge.duration} ${challenge.unit} challenge on Habitry! Here's my achievement puzzle:`,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("Sharing is not supported on this browser. Your achievement image will be downloaded automatically.");
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `habitry-challenge-${challenge.name.replace(/\s/g, '-')}-achievement.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to share:', err);
      alert('Failed to share achievement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100 via-purple-50 to-transparent rounded-full -translate-y-20 translate-x-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-100 to-transparent rounded-full translate-y-16 -translate-x-16 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {challenge.name}
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Completed on {new Date(challenge.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Shareable Content Wrapper */}
      <div ref={shareContentRef} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16 text-yellow-500 animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Challenge Completed!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Your final summary of this journey.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
          {/* Puzzle Grid Preview */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <div
              className="grid gap-1 border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {[...Array(totalDays)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square relative"
                  style={{
                    backgroundColor: 'green',
                    backgroundImage: challenge.image ? `url(${challenge.image})` : undefined,
                    backgroundSize: `${cols * 100}% ${rows * 100}%`,
                    backgroundPosition: `${((i) % cols) * (100 / (cols - 1))}% ${Math.floor((i) / cols) * (100 / (rows - 1))}%`,
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="flex-1 space-y-6 w-full md:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center space-x-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {challenge.longestStreak}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Best Streak</div>
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {challenge.completedDays.size}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {challenge.unit} Completed
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center space-x-4">
                <Star className="w-8 h-8 text-purple-500" />
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {Array.from(challenge.completedDays).filter(d => challenge.notes[d]).length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Memories Logged</div>
                </div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-white">🎉</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    100%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completion</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button 
                onClick={handleShare}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Share My Achievement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Your Journey Timeline ({completedDaysWithNotes.length} entries)
        </h3>
        
        {completedDaysWithNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Memories Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">This challenge didn't have any logged memories.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {completedDaysWithNotes.map((day, index) => {
              const note = challenge.notes[day];
              const isLast = index === completedDaysWithNotes.length - 1;
              
              return (
                <div key={day} className="relative">
                  {!isLast && (
                    <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800" />
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {day}
                    </div>
                    
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Day {day}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">• {formatDate(day)}</span>
                          {note.mood && (
                            <span className="text-lg ml-2">{note.mood}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {note.text && (<div className="w-2 h-2 bg-blue-400 rounded-full" title="Has note" />)}
                          {note.photo && (<div className="w-2 h-2 bg-purple-400 rounded-full" title="Has photo" />)}
                          {note.link && (<div className="w-2 h-2 bg-orange-400 rounded-full" title="Has link" />)}
                          {note.mood && (<div className="w-2 h-2 bg-yellow-400 rounded-full" title="Has mood" />)}
                        </div>
                      </div>
                      
                      {note.text && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reflection</span>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm leading-relaxed">
                            {note.text}
                          </p>
                        </div>
                      )}
                      
                      {note.photo && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo Memory</span>
                          </div>
                          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                            <img
                              src={note.photo}
                              alt={`Day ${day} memory`}
                              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}
                      
                      {note.link && (
                        <div className="mb-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reference</span>
                          </div>
                          <a
                            href={note.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <span className="truncate max-w-xs">{note.link}</span>
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        Added on {new Date(note.timestamp).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Challenge } from '../types';
import { X, Award, Star, Trophy, Calendar } from 'lucide-react';
import { getGridDimensions } from '../utils/challengeUtils';

interface ChallengeCompletionModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

export const ChallengeCompletionModal: React.FC<ChallengeCompletionModalProps> = ({
  challenge,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const { rows, cols } = getGridDimensions(challenge.duration);
  const totalDays = challenge.duration;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform animate-slideUp border border-gray-100 dark:border-gray-700">
        <div className="p-8 text-center bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30">
          <div className="flex justify-center mb-4">
            <Award className="w-16 h-16 text-yellow-500 animate-pulse-slow" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Challenge Completed!
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Congratulations on completing your **{challenge.name}** journey!
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-8 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 overflow-y-auto">
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
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                Share My Achievement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
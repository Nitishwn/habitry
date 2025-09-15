import React from 'react';
import { Challenge } from '../types';
import { Calendar, Target, Flame, Trophy, BookOpen } from 'lucide-react';

interface ChallengeHeaderProps {
  challenge: Challenge;
  onOpenJourney: () => void;
}

export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({ challenge, onOpenJourney }) => {
  const progress = (challenge.completedDays.size / challenge.duration) * 100;
  const daysRemaining = challenge.duration - challenge.completedDays.size;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100 via-purple-50 to-transparent rounded-full -translate-y-20 translate-x-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-100 to-transparent rounded-full translate-y-16 -translate-x-16 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {challenge.name}
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Started {new Date(challenge.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenJourney}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Journey Review</span>
          </button>
          <div className="text-right relative">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {challenge.completedDays.size}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">of {challenge.duration} days</div>
          {challenge.completedDays.size > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xs text-white font-bold">🔥</span>
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span>Progress</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {challenge.completedDays.size}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Completed</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {daysRemaining}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Remaining</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {challenge.currentStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Current Streak</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {challenge.longestStreak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Best Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
};
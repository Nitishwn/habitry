import React, { useState } from 'react';
import { Calendar, Camera, Link, Heart, Target, Trophy, Zap } from 'lucide-react';
import { Challenge } from '../types';
import { getGridDimensions } from '../utils/challengeUtils';

interface PuzzleGridProps {
  challenge: Challenge;
  onCellClick: (day: number) => void;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ challenge, onCellClick }) => {
  const { rows, cols } = getGridDimensions(challenge.duration);
  const completedCount = challenge.completedDays.size;
  const progressPercentage = (completedCount / challenge.duration) * 100;

  const renderGrid = () => {
    const cells = [];
    
    for (let i = 1; i <= challenge.duration; i++) {
      const isCompleted = challenge.completedDays.has(i);
      const hasNote = challenge.notes[i];
      
      cells.push(
        <div
          key={i}
          className={`
            aspect-square rounded-lg cursor-pointer transition-all duration-300 
            hover:scale-110 hover:shadow-lg relative group border-2
            ${isCompleted 
              ? 'bg-gradient-to-br from-green-400/60 to-emerald-500/60 shadow-md hover:shadow-green-200 border-green-300/50 backdrop-blur-sm' 
              : 'bg-gradient-to-br from-gray-200 to-gray-300 hover:from-blue-200 hover:to-blue-300 border-gray-300 hover:border-blue-400'
            }
          `}
          onClick={() => onCellClick(i)}
        >
          {/* Day number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
              {i}
            </span>
          </div>
          
          {/* Completion indicator */}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Trophy className="w-2 h-2 text-yellow-800" />
            </div>
          )}
          
          {/* Memory indicators */}
          {hasNote && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 p-1">
              {hasNote.text && (
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              )}
              {hasNote.photo && (
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              )}
              {hasNote.link && (
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              )}
              {hasNote.mood && (
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          )}
          
          {/* Hover tooltip */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            Day {i}
            {isCompleted && ' ✓'}
          </div>

          {/* Image reveal effect */}
          {challenge.image && isCompleted && (
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden opacity-30"
              style={{
                backgroundImage: `url(${challenge.image})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${((i - 1) % cols) * (100 / (cols - 1))}% ${Math.floor((i - 1) / cols) * (100 / (rows - 1))}%`
              }}
            />
          )}
        </div>
      );
    }
    
    return cells;
  };

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Grid Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-transparent rounded-full translate-y-12 -translate-x-12 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Challenge Grid</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click any day to add your memory</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Note</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Photo</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Link</span>
            </div>
          </div>
        </div>
        
        <div 
          className="grid gap-3 justify-center mx-auto p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-gray-200 dark:border-gray-600"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: '600px'
          }}
        >
          {renderGrid()}
        </div>

        {challenge.image && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200 dark:border-blue-700">
              <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Puzzle image will reveal as you complete days!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -translate-y-10 translate-x-10 opacity-30" />
          <div className="flex items-center space-x-4 relative">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Current Streak</p>
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                {challenge.currentStreak}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">days in a row</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -translate-y-10 translate-x-10 opacity-30" />
          <div className="flex items-center space-x-4 relative">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide">Best Streak</p>
              <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                {challenge.longestStreak}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">personal record</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -translate-y-10 translate-x-10 opacity-30" />
          <div className="flex items-center space-x-4 relative">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide">Days Left</p>
              <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                {challenge.duration - completedCount}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">to completion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
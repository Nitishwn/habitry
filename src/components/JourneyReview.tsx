import React from 'react';
import { Challenge } from '../types';
import { Calendar, FileText, Camera, Link, Heart, Clock, Star } from 'lucide-react';

interface JourneyReviewProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

export const JourneyReview: React.FC<JourneyReviewProps> = ({ challenge, isOpen, onClose }) => {
  if (!isOpen) return null;

  const completedDaysWithNotes = Array.from(challenge.completedDays)
    .filter(day => challenge.notes[day])
    .sort((a, b) => a - b);

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform animate-slideUp border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Journey Review</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{challenge.name} - Your memories and reflections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110"
          >
            <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{challenge.completedDays.size}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Days Completed</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedDaysWithNotes.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">With Memories</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{challenge.currentStreak}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{challenge.longestStreak}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Best Streak</div>
            </div>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="flex-1 overflow-y-auto p-6 max-h-96">
          {completedDaysWithNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Memories Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Start adding notes, photos, and links to your completed days to build your journey timeline!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Your Journey Timeline ({completedDaysWithNotes.length} entries)
              </h3>
              
              {completedDaysWithNotes.map((day, index) => {
                const note = challenge.notes[day];
                const isLast = index === completedDaysWithNotes.length - 1;
                
                return (
                  <div key={day} className="relative">
                    {/* Timeline line */}
                    {!isLast && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800" />
                    )}
                    
                    {/* Timeline node */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {day}
                      </div>
                      
                      {/* Content card */}
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
                            {note.text && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full" title="Has note" />
                            )}
                            {note.photo && (
                              <div className="w-2 h-2 bg-purple-400 rounded-full" title="Has photo" />
                            )}
                            {note.link && (
                              <div className="w-2 h-2 bg-orange-400 rounded-full" title="Has link" />
                            )}
                            {note.mood && (
                              <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Has mood" />
                            )}
                          </div>
                        </div>
                        
                        {/* Note text */}
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
                        
                        {/* Photo */}
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
                        
                        {/* Link */}
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
                        
                        {/* Timestamp */}
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Keep building your journey, one day at a time!</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Close Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
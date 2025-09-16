import React, { useState, useEffect } from 'react';
import { Challenge } from '../types';
import { Plus, Settings, Trash2, Upload, Clock, CalendarDays, Save, X } from 'lucide-react';

interface ChallengeSelectorProps {
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  onSelectChallenge: (challenge: Challenge) => void;
  onCreateChallenge: (name: string, duration: number, unit: 'days' | 'hours') => void;
  onDeleteChallenge: (id: string) => void;
  onUpdateChallengeImage: (id: string, image: string) => void;
  onUpdateChallengeDuration: (id: string, newDuration: number) => void;
}

export const ChallengeSelector: React.FC<ChallengeSelectorProps> = ({
  challenges,
  activeChallenge,
  onSelectChallenge,
  onCreateChallenge,
  onDeleteChallenge,
  onUpdateChallengeImage,
  onUpdateChallengeDuration,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState('');
  const [newChallengeDuration, setNewChallengeDuration] = useState(100);
  const [newChallengeUnit, setNewChallengeUnit] = useState<'days' | 'hours'>('days');
  const [showSettings, setShowSettings] = useState(false);
  const [durationInput, setDurationInput] = useState(activeChallenge?.duration || 100);

  useEffect(() => {
    if (activeChallenge) {
      setDurationInput(activeChallenge.duration);
    }
  }, [activeChallenge]);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure duration is at least 1 before creating
    const finalDuration = Math.max(1, newChallengeDuration || 1);
    if (newChallengeName.trim()) {
      onCreateChallenge(newChallengeName.trim(), finalDuration, newChallengeUnit);
      setNewChallengeName('');
      setNewChallengeDuration(100);
      setNewChallengeUnit('days');
      setShowCreateForm(false);
    }
  };

  const handleUpdateDuration = () => {
    const finalDuration = Math.max(1, durationInput || 1);
    if (activeChallenge && finalDuration >= activeChallenge.completedDays.size) {
      onUpdateChallengeDuration(activeChallenge.id, finalDuration);
      setShowSettings(false);
    } else {
      alert(`The new duration must be at least ${activeChallenge?.completedDays.size}.`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChallenge) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdateChallengeImage(activeChallenge.id, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-10 -translate-x-10" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Challenges</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Challenge</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => onSelectChallenge(challenge)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeChallenge?.id === challenge.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{challenge.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeChallenge?.id === challenge.id
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {challenge.completedDays.size}/{challenge.duration} {challenge.unit}
              </span>
            </div>
          </button>
        ))}
      </div>

      {showSettings && activeChallenge && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Challenge Image (Puzzle Reveal)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="challenge-image"
              />
              <label
                htmlFor="challenge-image"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </label>
              {activeChallenge.image && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img
                    src={activeChallenge.image}
                    alt="Challenge preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* New Duration Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Change Duration ({activeChallenge.unit})
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={durationInput}
                onChange={(e) => setDurationInput(parseInt(e.target.value) || 0)}
                min={activeChallenge.completedDays.size}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
              <button
                type="button"
                onClick={handleUpdateDuration}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Delete Challenge</span>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this challenge?')) {
                  onDeleteChallenge(activeChallenge.id);
                  setShowSettings(false);
                }
              }}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full transform animate-slideUp">
            <form onSubmit={handleCreateChallenge} className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Challenge</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Challenge Name
                  </label>
                  <input
                    type="text"
                    value={newChallengeName}
                    onChange={(e) => setNewChallengeName(e.target.value)}
                    placeholder="e.g., Daily Coding, Fitness Journey"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Tracking Unit
                  </label>
                  <div className="flex space-x-4">
                    <label className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer transition-colors ${newChallengeUnit === 'days' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      <input
                        type="radio"
                        name="unit"
                        value="days"
                        checked={newChallengeUnit === 'days'}
                        onChange={() => setNewChallengeUnit('days')}
                        className="form-radio"
                      />
                      <CalendarDays className="w-4 h-4" />
                      <span>Days</span>
                    </label>
                    <label className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer transition-colors ${newChallengeUnit === 'hours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      <input
                        type="radio"
                        name="unit"
                        value="hours"
                        checked={newChallengeUnit === 'hours'}
                        onChange={() => setNewChallengeUnit('hours')}
                        className="form-radio"
                      />
                      <Clock className="w-4 h-4" />
                      <span>Hours</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Duration ({newChallengeUnit})
                  </label>
                  <input
                    type="number"
                    value={newChallengeDuration}
                    onChange={(e) => setNewChallengeDuration(parseInt(e.target.value) || 0)}
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewChallengeName('');
                    setNewChallengeDuration(100);
                    setNewChallengeUnit('days');
                  }}
                  className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
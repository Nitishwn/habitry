import React, { useState, useEffect } from 'react';
import { X, Camera, Link, FileText, Heart, Star, Zap, Trash2 } from 'lucide-react';
import { DayNote } from '../types';

interface DayNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: DayNote) => void;
  onRevoke?: () => void; // New prop for revoking the day
  day: number;
  existingNote?: DayNote;
}

export const DayNoteModal: React.FC<DayNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onRevoke,
  day,
  existingNote,
}) => {
  const [note, setNote] = useState({
    text: existingNote?.text || '',
    photo: existingNote?.photo || '',
    link: existingNote?.link || '',
    mood: existingNote?.mood || '',
  });

  useEffect(() => {
    if (isOpen) {
      setNote({
        text: existingNote?.text || '',
        photo: existingNote?.photo || '',
        link: existingNote?.link || '',
        mood: existingNote?.mood || '',
      });
    }
  }, [existingNote, isOpen, day]);

  const handleSave = () => {
    const dayNote: DayNote = {
      ...note,
      timestamp: new Date().toISOString(),
    };
    onSave(dayNote);
    onClose();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNote(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{day}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Day {day} Memory</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Capture your journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Text Note */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span>Reflection Note</span>
            </label>
            <textarea
              value={note.text}
              onChange={(e) => setNote(prev => ({ ...prev, text: e.target.value }))}
              placeholder="How did today go? What did you learn or accomplish?"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 hover:border-gray-400"
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-green-600" />
              </div>
              <span>Photo Memory</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-100 file:to-emerald-100 dark:file:from-green-600 dark:file:to-emerald-600 file:text-green-800 dark:file:text-white hover:file:from-green-200 hover:file:to-emerald-200 dark:hover:file:from-green-700 dark:hover:file:to-emerald-700 transition-all duration-200"
            />
            {note.photo && (
              <div className="mt-3 relative group">
                <img
                  src={note.photo}
                  alt="Day memory"
                  className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-all duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200" />
              </div>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                <Link className="w-4 h-4 text-purple-600" />
              </div>
              <span>Reference Link</span>
            </label>
            <input
              type="url"
              value={note.link}
              onChange={(e) => setNote(prev => ({ ...prev, link: e.target.value }))}
              placeholder="Link to document, article, or resource"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Quick Mood Selector */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <span>How was your day?</span>
            </label>
            <div className="flex space-x-2">
              {['😊', '😐', '😔', '🔥', '💪', '🎉'].map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setNote(prev => ({ ...prev, mood: emoji }));
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 ${
                    note.mood === emoji 
                      ? 'bg-blue-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {note.mood && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected mood: <span className="text-lg">{note.mood}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-3xl">
          {existingNote && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to un-complete this day? All memories will be lost.')) {
                  onRevoke?.();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Revoke Day</span>
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 ${!existingNote ? 'flex-1' : ''}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl ${!existingNote ? 'flex-1' : ''}`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Save Memory
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useRef } from 'react';
import { Challenge } from '../types';
import { X, Award, Star, Trophy, Calendar } from 'lucide-react';
import { getGridDimensions } from '../utils/challengeUtils';
import * as htmlToImage from 'html-to-image';

interface ChallengeSummaryModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
}

export const ChallengeSummaryModal: React.FC<ChallengeSummaryModalProps> = ({
  challenge,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const { rows, cols } = getGridDimensions(challenge.duration);
  const totalDays = challenge.duration;

  const handleShare = async () => {
    try {
      if (modalRef.current) {
        const closeButton = modalRef.current.querySelector('.js-close-button') as HTMLElement;
        const shareButton = modalRef.current.querySelector('.js-share-button') as HTMLElement;
        if (closeButton) closeButton.style.display = 'none';
        if (shareButton) shareButton.style.display = 'none';
        
        const dataUrl = await htmlToImage.toPng(modalRef.current, {
          quality: 0.98,
          backgroundColor: '#f1f5f9',
          pixelRatio: 2,
        });
        
        if (closeButton) closeButton.style.display = '';
        if (shareButton) shareButton.style.display = '';

        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "habitry-achievement.png", { type: "image/png" });

        const shareData: ShareData = {
          files: [file],
          title: `Challenge Completed: ${challenge.name}`,
          text: `I completed my ${challenge.duration} ${challenge.unit} challenge on Habitry! Check out my achievement:`,
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
      }
    } catch (err) {
      console.error('Failed to share:', err);
      alert('Failed to share achievement. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform animate-slideUp border border-gray-100 dark:border-gray-700 relative z-[60]">
        <div className="p-8 text-center bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 relative">
          <button
            onClick={onClose}
            className="js-close-button absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex justify-center mb-4 animate-bounce-in">
            <Award className="w-20 h-20 text-yellow-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Challenge Summary
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
            Your final stats for **{challenge.name}**
          </p>
        </div>

        <div className="p-8 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 overflow-y-auto">
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
                className="js-share-button w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Share My Achievement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
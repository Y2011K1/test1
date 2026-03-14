"use client";
import { useState } from "react";
import { Star, X, CheckCircle } from "lucide-react";
import { submitRating } from "@/lib/ratingTracker";

interface RatingPopupProps {
  courseSlug: string;
  courseTitle: string;
  onClose: () => void;
}

export default function RatingPopup({ courseSlug, courseTitle, onClose }: RatingPopupProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    submitRating(courseSlug, rating);
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glassmorphism w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-cyberPurple" />
        
        {!submitted ? (
          <>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary fill-current" />
              </div>
              <h3 className="text-2xl font-bold mb-2">How was the course?</h3>
              <p className="text-gray-400 text-sm">
                Congratulations on finishing <span className="text-white font-bold">{courseTitle}</span>! 
                Please take a moment to rate your experience.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1 transition-transform active:scale-90"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      (hover || rating) >= star 
                        ? "text-yellow-500 fill-current" 
                        : "text-gray-700"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <button
              disabled={rating === 0}
              onClick={handleSubmit}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                rating > 0 
                  ? "bg-primary text-white shadow-neon-blue hover:bg-blue-600" 
                  : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
              }`}
            >
              Submit Rating
            </button>
          </>
        ) : (
          <div className="text-center py-12 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-400">Your rating has been submitted successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
}

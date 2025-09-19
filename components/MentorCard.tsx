
import React from 'react';
import type { Mentor } from '../types.ts';
import StarRating from './StarRating.tsx';

interface MentorCardProps {
  mentor: Mentor;
  onRequestSession: (mentorId: string) => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onRequestSession }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <img className="w-16 h-16 rounded-full mr-4 object-cover" src={mentor.avatarUrl} alt={mentor.name} />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
            <div className="flex items-center mt-1">
              <StarRating rating={mentor.avg_rating} />
              <span className="text-gray-600 text-sm ml-2">
                {mentor.avg_rating.toFixed(1)} ({mentor.rating_count} ratings)
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{mentor.bio}</p>
      </div>
      <div className="p-6 bg-gray-50">
        <button
          onClick={() => onRequestSession(mentor.id)}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Request Session
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
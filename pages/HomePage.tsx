
import React, { useState, useEffect, useCallback } from 'react';
import type { Mentor } from '../types';
import { getMentors, createSession } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import MentorCard from '../components/MentorCard';
import BookingModal from '../components/BookingModal';
import Spinner from '../components/Spinner';

const HomePage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waLink, setWaLink] = useState('');
  
  const { isAuthenticated, user, login } = useAuth();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        const data = await getMentors();
        setMentors(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch mentors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const handleRequestSession = useCallback(async (mentorId: string) => {
    if (!isAuthenticated || !user) {
      alert("Please log in to request a session.");
      login(); // Prompt login
      return;
    }
    
    try {
      const { waLink: newWaLink } = await createSession(mentorId, user.id, user.name);
      setWaLink(newWaLink);
      setIsModalOpen(true);
    } catch (err) {
      alert('Failed to create a session. Please try again.');
    }
  }, [isAuthenticated, user, login]);

  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (error) {
      return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
    }
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} onRequestSession={handleRequestSession} />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Find Your Expert Mentor</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with industry professionals for one-on-one guidance and accelerate your career growth.
        </p>
      </div>
      {renderContent()}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        waLink={waLink} 
      />
    </div>
  );
};

export default HomePage;


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, rateSession } from '../services/api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import type { Session } from '../types.ts';
import { SessionStatus } from '../types.ts';
import StarRating from '../components/StarRating.tsx';
import Spinner from '../components/Spinner.tsx';

const RateSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [session, setSession] = useState<Session | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
        navigate('/');
        return;
    }
    if (!sessionId || !user) return;

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const data = await getSessionById(sessionId, user.id);
        if (data) {
          setSession(data);
          if (data.rating) {
            setRating(data.rating.rating);
            setFeedback(data.rating.feedback || '');
          }
        } else {
          setError('Session not found or access denied.');
        }
      } catch (err) {
        setError('Failed to load session details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, user, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    if (!sessionId || !user) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await rateSession(sessionId, user.id, rating, feedback);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to submit rating.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spinner />;
  
  if (error && !session) {
    return <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">{error}</div>;
  }
  
  if (!session) {
    return <div className="text-center text-gray-500">Session not found.</div>;
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
        <p className="text-gray-700 mb-6">Your feedback has been submitted successfully.</p>
        <button onClick={() => navigate('/sessions')} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
          Back to My Sessions
        </button>
      </div>
    );
  }

  const isRateable = session.status === SessionStatus.COMPLETED && !session.rating;

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Session</h1>
      <p className="text-gray-600 mb-6">With <span className="font-semibold">{session.mentorName}</span> on {new Date(session.createdAt).toLocaleDateString()}</p>

      {isRateable ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Your Rating</label>
            <div className="flex justify-center sm:justify-start">
                 <StarRating rating={rating} setRating={setRating} size="lg" />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="feedback" className="block text-gray-700 font-semibold mb-2">Feedback (Optional)</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Tell us about your experience..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      ) : (
        <div className="text-center p-6 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rating Submitted</h3>
            <p className="text-gray-600 mb-4">You have already rated this session.</p>
            <div className="flex justify-center">
                 <StarRating rating={rating} size="lg" />
            </div>
             {feedback && <blockquote className="mt-4 text-gray-700 italic border-l-4 border-gray-300 pl-4">"{feedback}"</blockquote>}
        </div>
      )}
    </div>
  );
};

export default RateSessionPage;
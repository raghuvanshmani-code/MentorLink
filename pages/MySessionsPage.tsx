
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '../types.ts';
import { getMySessions } from '../services/api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import SessionListItem from '../components/SessionListItem.tsx';
import Spinner from '../components/Spinner.tsx';

const MySessionsPage: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const fetchSessions = async () => {
            if (!user) return;
            try {
                setIsLoading(true);
                const data = await getMySessions(user.id);
                setSessions(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch your sessions.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [user, isAuthenticated, navigate]);

    const renderContent = () => {
        if (isLoading) {
            return <Spinner />;
        }
        if (error) {
            return <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">{error}</div>;
        }
        if (sessions.length === 0) {
            return <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow">You have no sessions yet.</div>;
        }
        return (
            <div className="space-y-4">
                {sessions.map(session => (
                    <SessionListItem key={session.id} session={session} />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Sessions</h1>
            {renderContent()}
        </div>
    );
};

export default MySessionsPage;
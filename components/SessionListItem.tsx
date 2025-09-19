
import React from 'react';
import { Link } from 'react-router-dom';
import type { Session } from '../types';
import { SessionStatus } from '../types';
import StarRating from './StarRating';

interface SessionListItemProps {
    session: Session;
}

const statusStyles: { [key in SessionStatus]: string } = {
    [SessionStatus.REQUESTED]: 'bg-yellow-100 text-yellow-800',
    [SessionStatus.PAID]: 'bg-blue-100 text-blue-800',
    [SessionStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [SessionStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

const SessionListItem: React.FC<SessionListItemProps> = ({ session }) => {
    const canRate = session.status === SessionStatus.COMPLETED && !session.rating;
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-grow">
                <p className="text-lg font-semibold text-gray-800">
                    Session with {session.mentorName}
                </p>
                <p className="text-sm text-gray-500">
                    Requested on: {new Date(session.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[session.status]}`}>
                        {session.status}
                    </span>
                    {session.rating && (
                        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                            <span className="text-sm text-gray-700">Your Rating:</span>
                            <StarRating rating={session.rating.rating} size="sm" />
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full sm:w-auto">
                {canRate && (
                    <Link
                        to={`/rate/${session.id}`}
                        className="w-full sm:w-auto block text-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Rate Now
                    </Link>
                )}
            </div>
        </div>
    );
}

export default SessionListItem;

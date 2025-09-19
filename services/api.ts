
import type { Mentor, Session, Rating } from '../types';
import { SessionStatus } from '../types';

// --- MOCK DATABASE ---

const MOCK_MENTORS: Mentor[] = [
  { id: 'mentor-1', name: 'Alice Johnson', bio: 'Expert in Frontend technologies with 10+ years of experience building scalable web applications at tech giants. Passionate about React, TypeScript, and modern CSS.', phone: '15551112222', avg_rating: 4.9, rating_count: 87, avatarUrl: 'https://picsum.photos/seed/alice/200' },
  { id: 'mentor-2', name: 'Bob Williams', bio: 'Cloud architect specializing in Google Cloud and Kubernetes. Helps startups design and implement secure, cost-effective infrastructure. Certified GCP Professional.', phone: '15553334444', avg_rating: 4.8, rating_count: 102, avatarUrl: 'https://picsum.photos/seed/bob/200' },
  { id: 'mentor-3', name: 'Charlie Brown', bio: 'Product Management leader with a track record of launching successful B2B SaaS products. Mentors on product strategy, user research, and go-to-market.', phone: '15555556666', avg_rating: 5.0, rating_count: 55, avatarUrl: 'https://picsum.photos/seed/charlie/200' },
  { id: 'mentor-4', name: 'Diana Prince', bio: 'UX/UI design guru focused on creating intuitive and beautiful user experiences. Proficient in Figma, user testing, and design systems.', phone: '15557778888', avg_rating: 4.9, rating_count: 76, avatarUrl: 'https://picsum.photos/seed/diana/200' },
];

const MOCK_SESSIONS: Session[] = [
    { id: 'session-1', mentorId: 'mentor-1', mentorName: 'Alice Johnson', userId: 'user-123', userName: 'John Doe', status: SessionStatus.COMPLETED, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), rating: { id: 'rating-1', sessionId: 'session-1', rating: 5, feedback: 'Alice was amazing! So helpful.'} },
    { id: 'session-2', mentorId: 'mentor-2', mentorName: 'Bob Williams', userId: 'user-123', userName: 'John Doe', status: SessionStatus.COMPLETED, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'session-3', mentorId: 'mentor-3', mentorName: 'Charlie Brown', userId: 'user-123', userName: 'John Doe', status: SessionStatus.PAID, createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
];

// --- MOCK API FUNCTIONS ---

const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
}

export const getMentors = async (): Promise<Mentor[]> => {
    console.log('API: Fetching mentors...');
    return simulateDelay(MOCK_MENTORS, 300);
}

export const createSession = async (mentorId: string, userId: string, userName: string): Promise<{ sessionId: string, waLink: string }> => {
    console.log(`API: Creating session for mentor ${mentorId} and user ${userId}`);
    const mentor = MOCK_MENTORS.find(m => m.id === mentorId);
    if (!mentor) {
        throw new Error('Mentor not found');
    }

    const newSession: Session = {
        id: `session-${Date.now()}`,
        mentorId,
        mentorName: mentor.name,
        userId,
        userName,
        status: SessionStatus.REQUESTED,
        createdAt: new Date().toISOString(),
    };
    MOCK_SESSIONS.unshift(newSession);

    const prefillText = `Hello ${mentor.name}, I'm ${userName} and I'd like to request a mentorship session. My session ID is ${newSession.id}.`;
    const waLink = `https://wa.me/${mentor.phone}?text=${encodeURIComponent(prefillText)}`;
    
    return simulateDelay({ sessionId: newSession.id, waLink });
}

export const getMySessions = async (userId: string): Promise<Session[]> => {
    console.log(`API: Fetching sessions for user ${userId}`);
    const userSessions = MOCK_SESSIONS.filter(s => s.userId === userId);
    return simulateDelay(userSessions);
}

export const getSessionById = async (sessionId: string, userId: string): Promise<Session | null> => {
    console.log(`API: Fetching session ${sessionId} for user ${userId}`);
    const session = MOCK_SESSIONS.find(s => s.id === sessionId && s.userId === userId);
    return simulateDelay(session || null);
}

export const rateSession = async (sessionId: string, userId: string, rating: number, feedback: string): Promise<Rating> => {
    console.log(`API: Rating session ${sessionId} for user ${userId}`);
    const sessionIndex = MOCK_SESSIONS.findIndex(s => s.id === sessionId && s.userId === userId);
    
    if (sessionIndex === -1) {
        throw new Error('Session not found or you do not own this session.');
    }
    if (MOCK_SESSIONS[sessionIndex].rating) {
        throw new Error('This session has already been rated.');
    }
     if (MOCK_SESSIONS[sessionIndex].status !== SessionStatus.COMPLETED) {
        throw new Error('Only completed sessions can be rated.');
    }

    const newRating: Rating = {
        id: `rating-${Date.now()}`,
        sessionId,
        rating,
        feedback
    };

    MOCK_SESSIONS[sessionIndex].rating = newRating;

    // Simulate updating mentor's average rating
    const mentor = MOCK_MENTORS.find(m => m.id === MOCK_SESSIONS[sessionIndex].mentorId);
    if(mentor) {
        const totalRating = mentor.avg_rating * mentor.rating_count + rating;
        mentor.rating_count += 1;
        mentor.avg_rating = parseFloat((totalRating / mentor.rating_count).toFixed(2));
    }

    return simulateDelay(newRating);
}

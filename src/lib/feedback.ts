import { getDb } from './db';

export interface Feedback {
    feedbackId: number;
    author: string | null;
    feedbackText: string;
    location: string;
    createdAt: string;
}

export async function saveFeedback(author: string | null,feedbackText: string, location: string): Promise<number | null> {
    const db = getDb();

    const insertFeedback = db.prepare('INSERT INTO Feedback (author, feedbackText, location) VALUES (?, ?, ?) RETURNING feedbackId');

    const feedbackId = await insertFeedback.bind(author, feedbackText, location).first<number>('feedbackId');

    return feedbackId;
}
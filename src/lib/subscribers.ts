import { getDb } from './db';

export interface Subscriber {
    subscriberId: number;
    email: string;
    devUpdates: boolean;
}

export interface Subscription {
    subscriberId: number;
    tag: string;
}

export async function saveSubscriber(email: string, devUpdates: number, tagsByAuthor: Record<string, string[]>) {
    const db = getDb();

    const insertSubscriber = db.prepare('INSERT INTO Subscribers (email, devUpdates) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET devUpdates = excluded.devUpdates RETURNING subscriberId');
    const insertSubscription = db.prepare('INSERT INTO Subscriptions (subscriberId, author, tag) VALUES (?, ?, ?)')

    const subscriberId = await insertSubscriber.bind(email, devUpdates).first('subscriberId');

    await db.batch([
        db.prepare('DELETE FROM Subscriptions WHERE subscriberId = ?').bind(subscriberId),
        ...Object.entries(tagsByAuthor).flatMap(([author, tags]) => tags.map(tag => insertSubscription.bind(subscriberId, author, tag))),
    ])
}
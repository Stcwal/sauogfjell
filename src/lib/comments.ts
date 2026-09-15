import { getDb } from './db';

export interface Comment {
    commentId: number;
    postId: number;
    author: string;
    commentText: string;
    createdAt: string;
    parentCommentId: number | null;
}


export async function getCommentsForPost(postId: number) {
    const db = getDb(); 

    const comments = await db
        .prepare('SELECT * FROM Comments WHERE postId = ? ORDER BY createdAt DESC, commentId')
        .bind(postId)
        .all<Comment>();

    return comments.results

}

// Henter ALLE kommentarer i én spørring og grupperer dem på postId. Bloggsidene
// rendrer alle innlegg på én side, så getCommentsForPost per innlegg ville blitt
// N+1 (én D1-rundtur per innlegg, og Workers har grense på antall subrequests).
// Hele tabellen er liten på en personblogg; bytt til WHERE postId IN (...) her
// hvis den noen gang vokser.
export async function getAllComments(): Promise<Map<number, Comment[]>> {
    const db = getDb();

    const comments = await db
        .prepare('SELECT * FROM Comments ORDER BY createdAt DESC, commentId')
        .all<Comment>();

    const byPost = new Map<number, Comment[]>();
    for (const comment of comments.results) {
        const list = byPost.get(comment.postId);
        if (list) {
            list.push(comment);
        } else {
            byPost.set(comment.postId, [comment]);
        }
    }

    return byPost;
}

export async function saveComment(postId: number, author: string, commentText: string): Promise<number | null> {
    const db = getDb();

    const insertComment = db.prepare('INSERT INTO Comments (postId, author, commentText) VALUES (?, ?, ?) returning commentId');

    const commentId = await insertComment.bind(postId, author, commentText).first<number>('commentId');

    return commentId
    
}
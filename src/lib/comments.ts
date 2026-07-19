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

export async function saveComment(postId: number, author: string, commentText: string): Promise<number | null> {
    const db = getDb();

    const insertComment = db.prepare('INSERT INTO Comments (postId, author, commentText) VALUES (?, ?, ?) returning commentId');

    const commentId = await insertComment.bind(postId, author, commentText).first<number>('commentId');

    return commentId
    
}
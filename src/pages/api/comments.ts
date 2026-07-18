import type { APIRoute } from 'astro';
import { getCommentsForPost, saveComment } from '../../lib/comments';

const bad = (msg: string) => new Response(JSON.stringify({ error: msg }), { status: 400 });


export const GET: APIRoute = async ({ request }) => {
    const postId = new URL(request.url).searchParams.get('postId');


    const id = Number(postId);

    // Valider postId (positivt heltall)
    if (!Number.isInteger(id) || id < 1) return bad('postId is not a positive integer');


    const comments = await getCommentsForPost(id);

    return new Response(JSON.stringify({ comments }), { headers: { 'Content-Type': 'application/json' } });


}   // list comments for a post



const MAX_COMMENT_LENGTH = 2000;

export const POST: APIRoute = async ({ request }) => {
    const { postId, author, commentText } = await request.json<{ postId: number; author?: string; commentText: string }>();

    // Validate postId (positivt heltall)
    if (typeof postId !== 'number' || !Number.isInteger(postId) || postId < 1) {
        return bad('postId is not a positive integer');
    }

    // Validate commentText (ikke tom, ikke for lang)
    if (typeof commentText !== 'string' || commentText.trim().length === 0) {
        return bad('commentText is required');
    }
    if (commentText.length > MAX_COMMENT_LENGTH) {
        return bad(`commentText exceeds ${MAX_COMMENT_LENGTH} characters`);
    }

    // Tomt/manglende navn blir en anonym kommentar
    const name = author?.trim() || 'Anonym';

    let commentId;
    try {
        commentId = await saveComment(postId, name, commentText.trim());
    } catch (err) {
        // Posts-tabellen er tom, så en ukjent postId bryter foreign key-constrainten.
        if (err instanceof Error && /FOREIGN KEY/i.test(err.message)) return bad('post not found');
        throw err;
    }

    return new Response(JSON.stringify({ commentId }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}   // create a comment

import type { APIRoute } from 'astro';
import { getCommentsForPost, saveComment } from '../../lib/comments';


export const GET: APIRoute = async ({ request }) => {
    const postId = new URL(request.url).searchParams.get('postId');

    const bad = (msg: string) => new Response(JSON.stringify({ error: msg }), { status: 400 });

    const id = Number(postId);

    // Valider postId (positivt heltall)
    if (!Number.isInteger(id) || id < 1) return bad('postId is not a positive integer');


    const comments = getCommentsForPost(id);

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });


}   // list comments for a post



export const POST: APIRoute = async ({ request }) => {
    const { postId, author, commentText } = await request.json<{ postId: number; author: string; commentText: string; parentCommentId: number}>();

    // Validate postId, author, commentText


    await saveComment(postId, author, commentText)

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });

}   // create a comment

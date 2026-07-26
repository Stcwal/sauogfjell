import type { APIRoute } from 'astro';
import { saveFeedback } from '../../lib/feedback';

const bad = (msg: string) => new Response(JSON.stringify({ error: msg }), { status: 400 });

const MAX_FEEDBACK_LENGTH = 3000; 

export const POST: APIRoute = async ({ request }) => {
    const { author, feedbackText, location } = await request.json<{ author?: string; feedbackText: string; location: string }>();

    // Validate feedbackText (påkrevd, ikke tom, ikke for lang)
    if (typeof feedbackText !== 'string' || feedbackText.trim().length === 0) {
        return bad('feedbackText is required');
    }
    if (feedbackText.length > MAX_FEEDBACK_LENGTH) {
        return bad(`feedbackText exceeds ${MAX_FEEDBACK_LENGTH} characters`);
    }


    // Manglende location lagres som null (om det skjer en feil)
    const path = location?.trim() || null; 

    // Tomt/manglende navn lagres som null (anonym tilbakemelding)
    const name = author?.trim() || null;

    const feedbackId = await saveFeedback(name, feedbackText.trim(), location);

    return new Response(JSON.stringify({ feedbackId }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
};
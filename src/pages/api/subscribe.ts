import type { APIRoute } from 'astro';
import { saveSubscriber } from '../../lib/subscribers';

export const POST: APIRoute = async ({ request }) => {
    const { email, devUpdates, tagsByAuthor } = await request.json<{ email: string; devUpdates: number; tagsByAuthor: Record<string, string[]> }>()

    const bad = (msg: string) => new Response(JSON.stringify({ error: msg }), { status: 400 })

    // Valider email
    if (typeof email !== 'string') return bad('email is not string')
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return bad('invalid email');

    // Valider devUpdates
    if (![0, 1].includes(devUpdates)) return bad('devUpdates must be 0 or 1');

    // Valider tagsByAuthor
    if (typeof tagsByAuthor !== 'object' || tagsByAuthor === null) return bad('tagsByAuthor must be an object');
    const legalAuthors = ['anders', 'stian'];
    const keys = Object.keys(tagsByAuthor);
    if (!keys.every(a => legalAuthors.includes(a))) return bad('unknown author');

    await saveSubscriber(email, devUpdates, tagsByAuthor)

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });

};
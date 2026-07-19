import type { APIRoute } from 'astro';
import { recordVote } from '../../lib/songs';

const bad = (msg: string) => new Response(JSON.stringify({ error: msg }), { status: 400 });

function validId(x: unknown): boolean {
  return (typeof x === 'number' && Number.isInteger(x) && x >= 1)
}


export const POST: APIRoute = async ({ request }) => {
  const { winnerId, loserId } = await request.json<{ winnerId: number, loserId: number }>();

  if (!validId(winnerId)) return bad('winnerId is not positive integer');
  if (!validId(loserId)) return bad('loserId is not positive integer');
  if (winnerId === loserId) return bad('winnerId and loserId are equal');

  try {
    await recordVote(winnerId, loserId);
  } catch (error) {
    if (error instanceof Error && error.message === 'Song not found') {
      return new Response(JSON.stringify({ error: 'Song not found' }), { status: 404 });
    }
    throw error;
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

import type { APIRoute } from 'astro';
import { recordVote } from '../../lib/songs';

export const POST: APIRoute = async ({ request }) => {
  const { winnerId, loserId } = await request.json();

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

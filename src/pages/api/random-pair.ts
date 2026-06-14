import type { APIRoute } from 'astro';
import { getRandomLowMatchSong } from '../../lib/songs';

export const GET: APIRoute = async () => {
  const song1 = await getRandomLowMatchSong(2);
  const song2 = song1 ? await getRandomLowMatchSong(2, song1.songID) : null;

  if (!song1 || !song2) {
    return new Response(JSON.stringify({ error: 'Not enough songs' }), { status: 500 });
  }

  return new Response(JSON.stringify({ song1, song2 }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

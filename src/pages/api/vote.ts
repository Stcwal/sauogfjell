import type { APIRoute } from 'astro';
import { db, Songs, Matches, eq } from 'astro:db';

const K = 32;

function expectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

export const POST: APIRoute = async ({ request }) => {
  const { winnerId, loserId } = await request.json();

  const [winner] = await db.select().from(Songs).where(eq(Songs.songID, winnerId));
  const [loser] = await db.select().from(Songs).where(eq(Songs.songID, loserId));

  if (!winner || !loser) {
    return new Response(JSON.stringify({ error: 'Song not found' }), { status: 404 });
  }

  const newWinnerElo = Math.round(winner.elo + K * (1 - expectedScore(winner.elo, loser.elo)));
  const newLoserElo = Math.round(loser.elo + K * (0 - expectedScore(loser.elo, winner.elo)));

  await db.update(Songs)
    .set({ elo: newWinnerElo, numMatches: winner.numMatches + 1 })
    .where(eq(Songs.songID, winnerId));

  await db.update(Songs)
    .set({ elo: newLoserElo, numMatches: loser.numMatches + 1 })
    .where(eq(Songs.songID, loserId));

  await db.insert(Matches).values({
    songID1: winnerId,
    songID2: loserId,
    songIDwinner: winnerId,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

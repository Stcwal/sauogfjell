import type { APIRoute } from 'astro';
import { db, Songs, Matches, eq } from 'astro:db';

const K = 64;
const f = 400;

function calcNewElos(winnerElo: number, loserElo: number): { newWinnerElo: number; newLoserElo: number } {
  const dr = Math.min(winnerElo - loserElo, f); // Forskjell i Elo-rating

  const E1 = 1 / (1 + Math.pow(10, -dr / f));
  const E2 = 1 / (1 + Math.pow(10, dr / f));

  return {
    newWinnerElo: winnerElo + Math.round(K * (1 - E1)),
    newLoserElo: loserElo + Math.round(K * (0 - E2)),
  };
}

export const POST: APIRoute = async ({ request }) => {
  const { winnerId, loserId } = await request.json();

  const [winner] = await db.select().from(Songs).where(eq(Songs.songID, winnerId));
  const [loser] = await db.select().from(Songs).where(eq(Songs.songID, loserId));

  if (!winner || !loser) {
    return new Response(JSON.stringify({ error: 'Song not found' }), { status: 404 });
  }

  const { newWinnerElo, newLoserElo } = calcNewElos(winner.elo, loser.elo);

  await db.update(Songs)
    .set({ elo: newWinnerElo, numMatches: winner.numMatches + 1, eloHistory: winner.eloHistory + ',' + newWinnerElo })
    .where(eq(Songs.songID, winnerId));

  await db.update(Songs)
    .set({ elo: newLoserElo, numMatches: loser.numMatches + 1, eloHistory: loser.eloHistory + ',' + newLoserElo })
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

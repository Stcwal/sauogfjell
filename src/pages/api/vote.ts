import type { APIRoute } from "astro";
import { db, Songs, Matches } from "astro:db";
import { eq } from "drizzle-orm";
import { getNewSongs } from "../../lib/songs";

export const POST: APIRoute = async ({ request }) => {
  // Input er to sangID-er. Første ID er vinner, andre ID er taper
  const { winnerID, loserID } = await request.json();

  const [winner] = await db.select().from(Songs).where(eq(Songs.songID, winnerID));
  const [loser] = await db.select().from(Songs).where(eq(Songs.songID, loserID));

  if (!winner || !loser) {
    return new Response(JSON.stringify({ error: "Song not found" }), { status: 404 });
  }

  // Regner ut ny elo-rating for begge spillere
  const K = 32; // Maks endring i elo for en kamp
  const f = 400; // Vet ikke hva denne gjør helt konkret
  const winnerElo = winner.elo;
  const loserElo = loser.elo;

  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / f));
  const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / f));
  const scoreWinner = 1;
  const scoreLoser = 0;

  const newWinnerElo = Math.round(winnerElo + K * (scoreWinner - expectedScoreWinner))
  const newLoserElo = Math.round(loserElo + K * (scoreLoser - expectedScoreLoser))

  await db.insert(Matches).values({
    songID1: winnerID,
    songID2: loserID,
    songIDwinner: winnerID,
  });

  await db.update(Songs)
    .set({ elo: newWinnerElo, numMatches: winner.numMatches + 1 })
    .where(eq(Songs.songID, winnerID));

  await db.update(Songs)
    .set({ elo: newLoserElo, numMatches: loser.numMatches + 1 })
    .where(eq(Songs.songID, loserID));

  const [song1, song2] = await getNewSongs();

  return new Response(JSON.stringify({ song1, song2 }), {
    headers: { "Content-Type": "application/json" },
  });
};

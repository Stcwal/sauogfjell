import type { APIRoute } from "astro";
import { db, Songs, Matches } from "astro:db";
import { eq } from "drizzle-orm";
import { getNewSongs } from "../../lib/songs";

export const POST: APIRoute = async ({ request }) => {
  const { winnerID, loserID } = await request.json();

  const [winner] = await db.select().from(Songs).where(eq(Songs.songID, winnerID));
  const [loser] = await db.select().from(Songs).where(eq(Songs.songID, loserID));

  if (!winner || !loser) {
    return new Response(JSON.stringify({ error: "Song not found" }), { status: 404 });
  }

  // Dette er claude. vil helst skrive det selv
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
  const newWinnerElo = Math.round(winner.elo + K * (1 - expectedWinner));
  const newLoserElo = Math.round(loser.elo + K * (0 - (1 - expectedWinner)));

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

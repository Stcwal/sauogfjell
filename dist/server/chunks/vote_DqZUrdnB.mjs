import { asDrizzleTable, normalizeDatabaseUrl } from '@astrojs/db/runtime';
import { createClient } from '@astrojs/db/db-client/libsql-local.js';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

const dbUrl = normalizeDatabaseUrl(".astro/content.db", "file:///Users/stian/documents/data/github/private/sauogfjell/.astro/content.db");
const db = createClient({ url: dbUrl });

asDrizzleTable("Comment", {"columns":{"author":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"author","collection":"Comment","primaryKey":false,"optional":false}},"body":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"body","collection":"Comment","primaryKey":false,"optional":false}}},"deprecated":false,"indexes":{}}, false);
const Songs = asDrizzleTable("Songs", {"columns":{"songID":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}},"artistName":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"artistName","collection":"Songs","primaryKey":false,"optional":false}},"songName":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"songName","collection":"Songs","primaryKey":false,"optional":false}},"elo":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"elo","collection":"Songs","primaryKey":false,"optional":false}},"numMatches":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"numMatches","collection":"Songs","primaryKey":false,"optional":false}},"qualified":{"type":"boolean","schema":{"optional":false,"unique":false,"deprecated":false,"name":"qualified","collection":"Songs"}},"albumCoverLink":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"albumCoverLink","collection":"Songs","primaryKey":false,"optional":false}},"eloHistory":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"eloHistory","collection":"Songs","primaryKey":false,"optional":false}}},"deprecated":false,"indexes":{}}, false);
const Matches = asDrizzleTable("Matches", {"columns":{"matchID":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"matchID","collection":"Matches","primaryKey":true}},"songID1":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID1","collection":"Matches","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}}}},"songID2":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID2","collection":"Matches","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}}}},"songIDwinner":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songIDwinner","collection":"Matches","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}}}}},"deprecated":false,"indexes":{}}, false);

const K = 64;
const f = 400;
function calcNewElos(winnerElo, loserElo) {
  const dr = Math.min(winnerElo - loserElo, f);
  const E1 = 1 / (1 + Math.pow(10, -dr / f));
  const E2 = 1 / (1 + Math.pow(10, dr / f));
  return {
    newWinnerElo: winnerElo + Math.round(K * (1 - E1)),
    newLoserElo: loserElo + Math.round(K * (0 - E2))
  };
}
const POST = async ({ request }) => {
  const { winnerId, loserId } = await request.json();
  const [winner] = await db.select().from(Songs).where(eq(Songs.songID, winnerId));
  const [loser] = await db.select().from(Songs).where(eq(Songs.songID, loserId));
  if (!winner || !loser) {
    return new Response(JSON.stringify({ error: "Song not found" }), { status: 404 });
  }
  const { newWinnerElo, newLoserElo } = calcNewElos(winner.elo, loser.elo);
  await db.update(Songs).set({ elo: newWinnerElo, numMatches: winner.numMatches + 1, eloHistory: winner.eloHistory + "," + newWinnerElo }).where(eq(Songs.songID, winnerId));
  await db.update(Songs).set({ elo: newLoserElo, numMatches: loser.numMatches + 1, eloHistory: loser.eloHistory + "," + newLoserElo }).where(eq(Songs.songID, loserId));
  await db.insert(Matches).values({
    songID1: winnerId,
    songID2: loserId,
    songIDwinner: winnerId
  });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

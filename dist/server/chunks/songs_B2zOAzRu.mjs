import { asDrizzleTable, normalizeDatabaseUrl } from '@astrojs/db/runtime';
import { createClient } from '@astrojs/db/db-client/libsql-local.js';
import '@astrojs/db/dist/runtime/virtual.js';

const dbUrl = normalizeDatabaseUrl(".astro/content.db", "file:///Users/stian/documents/data/github/private/sauogfjell/.astro/content.db");
const db = createClient({ url: dbUrl });

asDrizzleTable("Comment", {"columns":{"author":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"author","collection":"Comment","primaryKey":false,"optional":false}},"body":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"body","collection":"Comment","primaryKey":false,"optional":false}}},"deprecated":false,"indexes":{}}, false);
const Songs = asDrizzleTable("Songs", {"columns":{"songID":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}},"artistName":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"artistName","collection":"Songs","primaryKey":false,"optional":false}},"songName":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"songName","collection":"Songs","primaryKey":false,"optional":false}},"elo":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"elo","collection":"Songs","primaryKey":false,"optional":false}},"numMatches":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"numMatches","collection":"Songs","primaryKey":false,"optional":false}},"qualified":{"type":"boolean","schema":{"optional":false,"unique":false,"deprecated":false,"name":"qualified","collection":"Songs"}},"albumCoverLink":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"albumCoverLink","collection":"Songs","primaryKey":false,"optional":false}},"eloHistory":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"eloHistory","collection":"Songs","primaryKey":false,"optional":false}}},"deprecated":false,"indexes":{}}, false);
asDrizzleTable("Matches", {"columns":{"matchID":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"matchID","collection":"Matches","primaryKey":true}},"songID1":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID1","collection":"Matches","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}}}},"songID2":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID2","collection":"Matches","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}}}},"songIDwinner":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songIDwinner","collection":"Matches","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"songID","collection":"Songs","primaryKey":true}}}}},"deprecated":false,"indexes":{}}, false);

async function getRandomLowMatchSong(numDistinctValues, excludeSongID) {
  const allSongs = await db.select().from(Songs);
  if (allSongs.length === 0) throw new Error("allSongs is empty");
  const distinctCounts = [...new Set(allSongs.map((s) => s.numMatches))].sort((a, b) => a - b);
  const threshold = distinctCounts[Math.min(numDistinctValues - 1, distinctCounts.length - 1)];
  const candidates = allSongs.filter((s) => s.numMatches <= threshold && s.songID !== excludeSongID);
  if (candidates.length === 0) {
    const fallback = allSongs.filter((s) => s.songID !== excludeSongID);
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export { getRandomLowMatchSong as g };

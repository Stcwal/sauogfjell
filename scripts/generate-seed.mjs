import { readFileSync, writeFileSync } from 'node:fs';

// Recover the song array from the old astro:db seed file by evaluating just the
// array literal in a sandbox where `init_elo` and `String` are available.
const src = readFileSync('scripts/_old_seed.ts', 'utf8');
const start = src.indexOf('.values([');
const open = src.indexOf('[', start);
const close = src.indexOf('])', open);
const arrayLiteral = src.slice(open, close + 1);

const init_elo = 1000;
// eslint-disable-next-line no-new-func
const songs = Function('init_elo', 'String', `return ${arrayLiteral};`)(init_elo, String);

const q = (v) => `'${String(v).replace(/'/g, "''")}'`;

const lines = songs.map(
  (s) =>
    `INSERT INTO Songs (songID, artistName, songName, elo, numMatches, qualified, albumCoverLink, eloHistory) VALUES (` +
    `${s.songID}, ${q(s.artistName)}, ${q(s.songName)}, ${s.elo}, ${s.numMatches}, ${s.qualified ? 1 : 0}, ${q(s.albumCoverLink)}, ${q(s.eloHistory)});`,
);

const out = ['-- Seed: 80s/90s songs at starting elo. Generated from the old astro:db seed.', ...lines, ''].join('\n');
writeFileSync('migrations/0002_seed_songs.sql', out);
console.log(`Wrote ${songs.length} songs -> migrations/0002_seed_songs.sql`);

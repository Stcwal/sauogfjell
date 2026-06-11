import { db, Songs } from 'astro:db';

export async function getRandomLowMatchSong(excludeSongID: number, numDistinctValues: number) {
  // Returnerer en tilfeldig sang blant sangene med de numDistinctValues lavest antallet kamper
  // Ekskluderer sangen med ID excludeSongID
  // Claudet funksjon
  const allSongs = await db.select().from(Songs);

  if (numDistinctValues <= 0) throw new Error('numDistinctValues must be a positive integer larger than 0');
  if (allSongs.length === 0) throw new Error('allSongs is empty');

  const distinctCounts = [...new Set(allSongs.map(s => s.numMatches))].sort((a, b) => a - b);
  const threshold = distinctCounts[Math.min(numDistinctValues - 1, distinctCounts.length - 1)];

  const candidates = allSongs.filter(s => s.numMatches <= threshold && s.songID !== excludeSongID);

  if (candidates.length === 0) {
    const fallback = allSongs.filter(s => s.songID !== excludeSongID);
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
import type { Client, ResultSet, Transaction } from '@libsql/client';
import { getDatabaseClient, rowsAsObjects } from './libsql';

export interface Song {
  songID: number;
  artistName: string;
  songName: string;
  elo: number;
  numMatches: number;
  qualified: boolean;
  albumCoverLink: string;
  eloHistory: string;
}

export interface Match {
  matchID: number;
  songID1: number;
  songID2: number;
  songIDwinner: number;
}

const SONG_COLUMNS = 'songID, artistName, songName, elo, numMatches, qualified, albumCoverLink, eloHistory';

function parseSong(row: Record<string, unknown>): Song {
  return {
    songID: Number(row.songID),
    artistName: String(row.artistName),
    songName: String(row.songName),
    elo: Number(row.elo),
    numMatches: Number(row.numMatches),
    qualified: Boolean(row.qualified),
    albumCoverLink: String(row.albumCoverLink),
    eloHistory: String(row.eloHistory),
  };
}

async function selectSongs(sql: string, args: unknown[] = []) {
  const result = await getDatabaseClient().execute(sql, args);
  return rowsAsObjects<Record<string, unknown>>(result).map(parseSong);
}

async function selectSongById(executor: Pick<Client | Transaction, 'execute'>, songID: number) {
  const result = await executor.execute(`SELECT ${SONG_COLUMNS} FROM Songs WHERE songID = ?`, [songID]);
  const [song] = rowsAsObjects<Record<string, unknown>>(result).map(parseSong);
  return song ?? null;
}

export async function getAllSongs() {
  return selectSongs(`SELECT ${SONG_COLUMNS} FROM Songs`);
}

export async function getRandomLowMatchSong(numDistinctValues: number, excludeSongID?: number) {
  if (numDistinctValues <= 0) throw new Error('numDistinctValues must be a positive integer larger than 0');

  const allSongs = await getAllSongs();

  if (allSongs.length === 0) throw new Error('allSongs is empty');

  const distinctCounts = [...new Set(allSongs.map((song) => song.numMatches))].sort((a, b) => a - b);
  const threshold = distinctCounts[Math.min(numDistinctValues - 1, distinctCounts.length - 1)];

  const candidates = allSongs.filter((song) => song.numMatches <= threshold && song.songID !== excludeSongID);

  if (candidates.length === 0) {
    const fallback = allSongs.filter((song) => song.songID !== excludeSongID);
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function calcNewElos(winnerElo: number, loserElo: number): { newWinnerElo: number; newLoserElo: number } {
  const K = 64;
  const f = 400;
  const dr = Math.min(winnerElo - loserElo, f);

  const E1 = 1 / (1 + Math.pow(10, -dr / f));
  const E2 = 1 / (1 + Math.pow(10, dr / f));

  return {
    newWinnerElo: winnerElo + Math.round(K * (1 - E1)),
    newLoserElo: loserElo + Math.round(K * (0 - E2)),
  };
}

async function updateSongInTransaction(tx: Transaction, song: Song) {
  await tx.execute('UPDATE Songs SET elo = ?, numMatches = ?, eloHistory = ? WHERE songID = ?', [song.elo, song.numMatches, song.eloHistory, song.songID]);
}

export async function recordVote(winnerId: number, loserId: number) {
  const tx = await getDatabaseClient().transaction('write');

  try {
    const winner = await selectSongById(tx, winnerId);
    const loser = await selectSongById(tx, loserId);

    if (!winner || !loser) {
      throw new Error('Song not found');
    }

    const { newWinnerElo, newLoserElo } = calcNewElos(winner.elo, loser.elo);

    await updateSongInTransaction(tx, {
      ...winner,
      elo: newWinnerElo,
      numMatches: winner.numMatches + 1,
      eloHistory: `${winner.eloHistory},${newWinnerElo}`,
    });

    await updateSongInTransaction(tx, {
      ...loser,
      elo: newLoserElo,
      numMatches: loser.numMatches + 1,
      eloHistory: `${loser.eloHistory},${newLoserElo}`,
    });

    await tx.execute('INSERT INTO Matches (songID1, songID2, songIDwinner) VALUES (?, ?, ?)', [winnerId, loserId, winnerId]);

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}
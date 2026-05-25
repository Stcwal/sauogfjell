// import { db } from 'astro:db';
import { db, Songs, Matches } from 'astro:db';
// import {Songs, Matches} from './config';

// https://astro.build/db/seed
export default async function () {
	//// Populerer sang-tabellene
	await db.insert(Songs).values([
		{ songID: 1, artistName: "Earth, Wind & Fire", songName: "September", elo: 1000, numMatches: 0 },
		{ songID: 2, artistName: "Depeche Mode", songName: "Personal Jesus", elo: 1000, numMatches: 0 },
		{ songID: 3, artistName: "Van Halen", songName: "Jump", elo: 1000, numMatches: 0 },
		{ songID: 4, artistName: "Johnny Nash", songName: "I Can See Clearly Now", elo: 1000, numMatches: 0 },
		{ songID: 5, artistName: "Bon Jovi", songName: "You Give Love A Bad Name", elo: 1000, numMatches: 0 },
	])
}


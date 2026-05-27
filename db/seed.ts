// import { db } from 'astro:db';
import { db, Songs, Matches } from 'astro:db';

// https://astro.build/db/seed
export default async function () {
	//// Populerer sang-tabellene
	// Hvis det er feilmelding kan det hende du må kjøre npx astro sync
	await db.insert(Songs).values([
		{ songID: 1, artistName: "Earth, Wind & Fire", songName: "September", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851af0d466d16c97b6385219d90" },
		{ songID: 2, artistName: "Depeche Mode", songName: "Personal Jesus", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851000bd74f7b17a4f5de3a8807" },
		{ songID: 3, artistName: "Van Halen", songName: "Jump - 2015 Remaster", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851b414c63fb435b622238c15ed" },
		{ songID: 4, artistName: "Johnny Nash", songName: "I Can See Clearly Now", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d000048515278202d9c719159cda7808a" },
		{ songID: 5, artistName: "Bon Jovi", songName: "You Give Love A Bad Name", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851a82359c9fefa599be35017b1" },
		{ songID: 6, artistName: "Bryan Adams", songName: "Summer Of '69", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851d0b17cab0d1a584d55ded42f" },
		{ songID: 7, artistName: "Simple Minds", songName: "Don't You (Forget About Me)", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851ad781f94a6609f3098a61f33" },
		{ songID: 8, artistName: "Kenny Loggins", songName: "Footloose", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d0000485119db9ac54c80a898a179f0f1" },
		{ songID: 9, artistName: "Wham!", songName: "Wake Me Up Before You Go-Go", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851a2fc41b0dd6ce4f0d16a4c46" },
		{ songID: 10, artistName: "Mike Oldfield", songName: "Moonlight Shadow", elo: 1000, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851794fcf2ac5afebd044d27608" },
	])
}

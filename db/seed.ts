// https://astro.build/db/seed

// import { db } from 'astro:db';
import { db, Songs, Matches } from 'astro:db';



//// ELO for sanger
const init_elo = 1000;

export default async function () {
	//// Populerer sang-tabellene
	// Hvis det er feilmelding kan det hende du må kjøre npx astro sync
	await db.insert(Songs).values([
		{ songID: 1, artistName: "Earth, Wind & Fire", songName: "September", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851af0d466d16c97b6385219d90", eloHistory: String(init_elo) },
		{ songID: 2, artistName: "Depeche Mode", songName: "Personal Jesus", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d0000485init_elobd74f7b17a4f5de3a8807", eloHistory: String(init_elo) },
		{ songID: 3, artistName: "Van Halen", songName: "Jump - 2015 Remaster", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851b414c63fb435b622238c15ed", eloHistory: String(init_elo) },
		{ songID: 4, artistName: "Johnny Nash", songName: "I Can See Clearly Now", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d000048515278202d9c719159cda7808a", eloHistory: String(init_elo) },
		{ songID: 5, artistName: "Bon Jovi", songName: "You Give Love A Bad Name", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851a82359c9fefa599be35017b1", eloHistory: String(init_elo) },
		{ songID: 6, artistName: "Bryan Adams", songName: "Summer Of '69", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851d0b17cab0d1a584d55ded42f", eloHistory: String(init_elo) },
		{ songID: 7, artistName: "Simple Minds", songName: "Don't You (Forget About Me)", elo: init_elo, qualified: true, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851ad781f94a6609f3098a61f33", eloHistory: String(init_elo) },
		{ songID: 8, artistName: "Kenny Loggins", songName: "Footloose", elo: init_elo, numMatches: 0, qualified: true, albumCoverLink: "https://i.scdn.co/image/ab67616d0000485119db9ac54c80a898a179f0f1", eloHistory: String(init_elo) },
		{ songID: 9, artistName: "Wham!", songName: "Wake Me Up Before You Go-Go", elo: init_elo, qualified: true, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851a2fc41b0dd6ce4f0d16a4c46", eloHistory: String(init_elo) },
		{ songID: 10, artistName: "Mike Oldfield", songName: "Moonlight Shadow", elo: init_elo, qualified: true, numMatches: 0, albumCoverLink: "https://i.scdn.co/image/ab67616d00004851794fcf2ac5afebd044d27608", eloHistory: String(init_elo) },
	])
}
//// ELO slutt

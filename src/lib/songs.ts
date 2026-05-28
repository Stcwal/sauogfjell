import { getDataEntryById } from "astro:content";
import { db, Songs } from "astro:db";
import { eq } from "drizzle-orm";

export async function getNewSongs() {
    // Returnerer 2 ulike sanger
    const songID1 = 1;
    const songID2 = 2;
    const [song1] = await db
        .select({
            songID: Songs.songID,
            songName: Songs.songName,
            artistName: Songs.artistName,
            albumCoverLink: Songs.albumCoverLink,
        })
        .from(Songs)
        .where(eq(Songs.songID, songID1));

    const [song2] = await db
        .select({
            songID: Songs.songID,
            songName: Songs.songName,
            artistName: Songs.artistName,
            albumCoverLink: Songs.albumCoverLink,
        })
        .from(Songs)
        .where(eq(Songs.songID, songID2));

    return [song1, song2];
}

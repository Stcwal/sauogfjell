import { db, Songs } from "astro:db";
import { lte, sql } from "drizzle-orm";

export async function getNewSongs() {
    // Velger to tilfeldeige sanger fra mengden sanger der numMatches er en av de fem lavest verdien
    // Dersom det er færre enn fem distinkte verdier, finner den to tilfeldige sanger fra alle sangene
    // (Ja, det var Claude som skrev spørringen)
    const songs = await db
        .select()
        .from(Songs)
        .where(
            lte(
                Songs.numMatches,
                sql<number>`COALESCE(
                    (SELECT DISTINCT numMatches FROM Songs ORDER BY numMatches ASC LIMIT 1 OFFSET 4),
                    (SELECT MAX(numMatches) FROM Songs)
                )`
            )
        )
        .orderBy(sql`RANDOM()`)
        .limit(2);

    const song1 = songs[0]
    const song2 = songs[1]
    return [song1, song2];
}

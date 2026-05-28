import type { APIRoute } from "astro";
import { db, Songs } from "astro:db";
import { eq } from "drizzle-orm";

export const GET: APIRoute = async ({ url }) => {
  const songID = Number(url.searchParams.get("songID"));
  const [song] = await db
    .select({ songName: Songs.songName, artistName: Songs.artistName })
    .from(Songs)
    .where(eq(Songs.songID, songID));

  if (!song) {
    return new Response(JSON.stringify({ error: "Song not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(song), {
    headers: { "Content-Type": "application/json" },
  });
};
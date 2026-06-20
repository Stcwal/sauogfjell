import { g as getRandomLowMatchSong } from './songs_B2zOAzRu.mjs';

const GET = async () => {
  const song1 = await getRandomLowMatchSong(2);
  const song2 = song1 ? await getRandomLowMatchSong(2, song1.songID) : null;
  if (!song1 || !song2) {
    return new Response(JSON.stringify({ error: "Not enough songs" }), { status: 500 });
  }
  return new Response(JSON.stringify({ song1, song2 }), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

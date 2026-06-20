import { c as createComponent } from './astro-component_RdJN0NyS.mjs';
import 'piccolore';
import { t as renderComponent, d as Fragment, x as renderTemplate, r as maybeRenderHead, m as addAttribute } from './server_C-z70Qdt.mjs';
import { r as renderScript } from './script_Cpb0lOzO.mjs';

const $$EloVoting = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EloVoting;
  const { song1, song2 } = Astro2.props;
  return renderTemplate`${song1 && song2 ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-vxcc2iqw": true }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<h1 data-astro-cid-vxcc2iqw>Hvilken sang er best?</h1><div class="voting-container" data-astro-cid-vxcc2iqw><div class="voting-column" data-index="1" data-astro-cid-vxcc2iqw><img class="album-cover"${addAttribute(song1.albumCoverLink, "src")}${addAttribute(`Album cover for ${song1.songName}`, "alt")} data-astro-cid-vxcc2iqw><p class="song-name" data-astro-cid-vxcc2iqw>${song1.songName}</p><p class="artist-name" data-astro-cid-vxcc2iqw>${song1.artistName}</p><button class="vote-btn"${addAttribute(song1.songID, "data-song-id")} data-astro-cid-vxcc2iqw>Stem</button></div><div class="voting-column" data-index="2" data-astro-cid-vxcc2iqw><img class="album-cover"${addAttribute(song2.albumCoverLink, "src")}${addAttribute(`Album cover for ${song2.songName}`, "alt")} data-astro-cid-vxcc2iqw><p class="song-name" data-astro-cid-vxcc2iqw>${song2.songName}</p><p class="artist-name" data-astro-cid-vxcc2iqw>${song2.artistName}</p><button class="vote-btn"${addAttribute(song2.songID, "data-song-id")} data-astro-cid-vxcc2iqw>Stem</button></div></div><p class="vote-error" role="alert" data-astro-cid-vxcc2iqw></p>` })}` : renderTemplate`<p data-astro-cid-vxcc2iqw>Ingen sanger tilgjengelig.</p>`}${renderScript($$result, "/Users/stian/documents/data/github/private/sauogfjell/src/pages/elo/components/EloVoting.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/pages/elo/components/EloVoting.astro", void 0);

const $$file = "/Users/stian/documents/data/github/private/sauogfjell/src/pages/elo/components/EloVoting.astro";
const $$url = "/elo/components/EloVoting";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$EloVoting,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$EloVoting as $, _page as _ };

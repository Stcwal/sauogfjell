import { c as createComponent } from './astro-component_RdJN0NyS.mjs';
import 'piccolore';
import { t as renderComponent, x as renderTemplate, r as maybeRenderHead, w as renderSlot } from './server_C-z70Qdt.mjs';
import { b as $$Layout, a as $$Header, $ as $$Footer } from './Layout_VOuZa_yt.mjs';
import { $ as $$EloVoting } from './EloVoting_C5JbMDN4.mjs';
import { g as getRandomLowMatchSong } from './songs_B2zOAzRu.mjs';

const $$EloLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Claude har skrevet deler av layouten -->${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-wsihlzy5": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="outer" data-astro-cid-wsihlzy5> <div id="header" data-astro-cid-wsihlzy5> ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-wsihlzy5": true })} </div> <div id="elo-content" data-astro-cid-wsihlzy5> ${renderSlot($$result2, $$slots["default"])} </div> <div id="footer" data-astro-cid-wsihlzy5> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-wsihlzy5": true })} </div> </div> ` })}`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/layouts/EloLayout.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const song1 = await getRandomLowMatchSong(2);
  const song2 = song1 ? await getRandomLowMatchSong(2, song1.songID) : null;
  return renderTemplate`${renderComponent($$result, "EloLayout", $$EloLayout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "EloVoting", $$EloVoting, { "song1": song1, "song2": song2 })} ` })}`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/pages/elo/index.astro", void 0);

const $$file = "/Users/stian/documents/data/github/private/sauogfjell/src/pages/elo/index.astro";
const $$url = "/elo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

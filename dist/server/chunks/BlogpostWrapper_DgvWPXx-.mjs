import { c as createComponent } from './astro-component_RdJN0NyS.mjs';
import 'piccolore';
import { r as maybeRenderHead, w as renderSlot, x as renderTemplate } from './server_C-z70Qdt.mjs';
import 'clsx';

const $$BlogpostWrapper = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="post-wrapper"> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/pages/blog/components/BlogpostWrapper.astro", void 0);

const $$file = "/Users/stian/documents/data/github/private/sauogfjell/src/pages/blog/components/BlogpostWrapper.astro";
const $$url = "/blog/components/BlogpostWrapper";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BlogpostWrapper,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$BlogpostWrapper as $, _page as _ };

import { c as createComponent } from './astro-component_RdJN0NyS.mjs';
import 'piccolore';
import { t as renderComponent, x as renderTemplate, r as maybeRenderHead, w as renderSlot } from './server_C-z70Qdt.mjs';
import { b as $$Layout, a as $$Header, $ as $$Footer } from './Layout_VOuZa_yt.mjs';
import { $ as $$BlogpostRenderer } from './BlogpostRenderer_Cxiu9OZC.mjs';

const $$BlogLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="outer"> <div id="header"> ${renderComponent($$result2, "Header", $$Header, {})} </div> <div id="blog-content"> ${renderSlot($$result2, $$slots["default"])} </div> <div id="footer"> ${renderComponent($$result2, "Footer", $$Footer, {})} </div> </div> ` })}`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/layouts/BlogLayout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const blog = "dev";
  return renderTemplate`${renderComponent($$result, "BlogLayout", $$BlogLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogpostRenderer", $$BlogpostRenderer, { "collection": blog })} ` })}`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/pages/blog/index.astro", void 0);

const $$file = "/Users/stian/documents/data/github/private/sauogfjell/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

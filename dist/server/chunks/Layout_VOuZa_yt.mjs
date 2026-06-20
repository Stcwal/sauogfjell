import { c as createComponent } from './astro-component_RdJN0NyS.mjs';
import 'piccolore';
import { r as maybeRenderHead, x as renderTemplate, m as addAttribute, w as renderSlot, v as renderHead, t as renderComponent } from './server_C-z70Qdt.mjs';
import 'clsx';
import { r as renderScript } from './script_Cpb0lOzO.mjs';

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="footer-outer"> <div id="footer-inner"> <div> <b>links:</b> <div> <a href="https://github.com/Stcwal/sauogfjell/">sauogfjell på github</a> </div> <div> <a href="https://www.linkedin.com/in/stian-closs-walmann/">Stian på linkedIn</a> </div> </div> <div> <b>Sosiale medium:</b> <div>nei</div> </div> <div> <b>Takk til:</b> <div>
Ingen, all <a style="text-decoration: line-through;">me</a> us baby
</div> </div> </div> </div>`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/layouts/components/Footer.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div> <a href="/">Home</a> <a href="/blog/">Blog</a> <a href="/elo/">Elo</a> <button id="theme-toggle">Toggle theme</button> </div>`;
}, "/Users/stian/documents/data/github/private/sauogfjell/src/layouts/components/Header.astro", void 0);

const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/Users/stian/documents/data/github/private/sauogfjell/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/stian/documents/data/github/private/sauogfjell/node_modules/astro/components/ClientRouter.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template([`<html lang="no" data-theme="auto"> <head><meta charset="UTF-8"><link rel="icon" href="/favicon.svg"><script>
      const saved = localStorage.getItem('theme-preference');
      if (saved) document.documentElement.setAttribute('data-theme', saved);
    <\/script>`, "", "</head> <body> ", " ", " </body> </html>"])), renderComponent($$result, "ClientRouter", $$ClientRouter, {}), renderHead(), renderSlot($$result, $$slots["default"]), renderScript($$result, "/Users/stian/documents/data/github/private/sauogfjell/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/stian/documents/data/github/private/sauogfjell/src/layouts/Layout.astro", void 0);

export { $$Footer as $, $$Header as a, $$Layout as b };

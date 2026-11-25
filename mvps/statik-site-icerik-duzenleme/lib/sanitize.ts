/**
 * Cleans the inner HTML of an edited mixed (text + inline tag) element before
 * it is written back to the user's site.
 *
 * Kept:   tags that existed in the original element with exactly the same
 *         attributes, and a few attribute-less formatting tags (b, i, em, …).
 * Dropped with content: script/style/embedded media/form controls/images.
 * Anything else (span with style, font, div, p, links with new hrefs, …) is
 * unwrapped: its text stays, the tag goes.
 */
import { parse, type HtmlNode } from "./html";

const BARE_OK = new Set("b strong i em u s small sub sup mark br".split(" "));
const DROP = new Set(
  "script style img picture source iframe frame frameset object embed svg math video audio track canvas input button select option textarea form template noscript link meta base head title xmp plaintext noembed noframes".split(
    " ",
  ),
);
const VOID = new Set("area base br col embed hr img input keygen link meta param source track wbr".split(" "));

function decode(v: string) {
  return v
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function signature(src: string, node: HtmlNode) {
  const attrs = node.attrs
    .map((a) => `${a.name}=${a.valueEnd > a.valueStart ? decode(src.slice(a.valueStart, a.valueEnd)) : ""}`)
    .sort();
  return [node.tag, ...attrs].join("\u0000");
}

function collect(src: string, nodes: HtmlNode[], into: Set<string>) {
  for (const n of nodes) {
    into.add(signature(src, n));
    collect(src, n.children, into);
  }
}

/** Text between tags; the browser already escapes <, > and & here. Strip any stray tag-like leftovers. */
const cleanText = (s: string) => s.replace(/<\/?[A-Za-z][^>]*>?/g, "");

function closeEnd(src: string, node: HtmlNode) {
  if (VOID.has(node.tag) || node.innerEnd === null) return node.openEnd;
  const rest = src.slice(node.innerEnd, node.innerEnd + node.tag.length + 2).toLowerCase();
  if (rest === `</${node.tag}`) {
    const gt = src.indexOf(">", node.innerEnd);
    return gt === -1 ? src.length : gt + 1;
  }
  return node.innerEnd;
}

export function sanitizeInline(edited: string, original: string): string {
  const allowed = new Set<string>();
  collect(original, parse(original).root.children, allowed);
  const src = edited;

  const renderRange = (from: number, to: number, children: HtmlNode[]): string => {
    let out = "";
    let pos = from;
    for (const child of children) {
      if (child.start < pos) continue;
      out += cleanText(src.slice(pos, child.start));
      out += renderNode(child);
      pos = Math.max(pos, closeEnd(src, child));
    }
    if (to > pos) out += cleanText(src.slice(pos, to));
    return out;
  };

  const renderNode = (node: HtmlNode): string => {
    if (DROP.has(node.tag) || node.raw) return "";
    const inner = VOID.has(node.tag) ? "" : renderRange(node.openEnd, node.innerEnd ?? node.openEnd, node.children);
    const keep = allowed.has(signature(src, node)) || (BARE_OK.has(node.tag) && node.attrs.length === 0);
    if (!keep) return inner;
    const open = src.slice(node.start, node.openEnd);
    return VOID.has(node.tag) ? open : `${open}${inner}</${node.tag}>`;
  };

  return renderRange(0, src.length, parse(src).root.children);
}

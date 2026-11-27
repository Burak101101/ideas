/**
 * Source-preserving HTML scanner.
 *
 * We never re-serialize the whole document. Instead we find byte offsets of the
 * parts a site owner may change (text inside text elements, `src` of images)
 * and splice new values into the original string. Everything else — doctype,
 * whitespace, comments, <style>, <link>, attribute quoting — stays identical.
 */

type Attr = { name: string; wsStart: number; end: number; valueStart: number; valueEnd: number; quoted: boolean };

export type HtmlNode = Node;
type Node = {
  tag: string;
  start: number;
  nameEnd: number;
  openEnd: number;
  innerEnd: number | null;
  attrs: Attr[];
  children: Node[];
  hasText: boolean;
  hasComment: boolean;
  raw: boolean;
};

export type TextRegion = {
  id: number;
  kind: "text";
  tag: string;
  nameEnd: number;
  innerStart: number;
  innerEnd: number;
  /** true when the element contains only text (no child tags, no comments) */
  pure: boolean;
};

export type ImageRegion = {
  id: number;
  kind: "image";
  tag: "img";
  nameEnd: number;
  srcStart: number;
  srcEnd: number;
  srcQuoted: boolean;
  /** range of the whole ` srcset="…"` attribute, removed when the image is replaced */
  srcset?: [number, number];
  /** value range of an existing alt attribute */
  altRange?: [number, number, boolean];
  /** decoded original alt text; null when the image has no alt attribute */
  alt: string | null;
};

export type Region = TextRegion | ImageRegion;

export type Edit = { id: number; kind: "text"; newRaw: string } | { id: number; kind: "image"; newSrc: string; newAlt?: string };

const VOID = new Set("area base br col embed hr img input keygen link meta param source track wbr".split(" "));
const RAW = new Set("script style textarea title xmp iframe noembed noframes plaintext".split(" "));
const P_CLOSERS = new Set(
  "address article aside blockquote details dialog div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul".split(
    " ",
  ),
);
const INLINE = new Set("a abbr b bdi bdo br cite code del dfn em i ins kbd mark q s samp small span strong sub sup time u var wbr".split(" "));
const CANDIDATE = new Set(
  "h1 h2 h3 h4 h5 h6 p a li span div button label figcaption blockquote td th dt dd caption summary legend address small strong em b i cite q time mark".split(
    " ",
  ),
);
const SKIP_SUBTREE = new Set("head svg math template noscript select textarea script style title iframe object canvas video audio pre code".split(" "));

function newNode(tag: string, start: number, nameEnd: number, openEnd: number, attrs: Attr[] = []): Node {
  return { tag, start, nameEnd, openEnd, innerEnd: null, attrs, children: [], hasText: false, hasComment: false, raw: false };
}

const isWs = (c: string) => c === " " || c === "\n" || c === "\t" || c === "\r" || c === "\f";

function trimmedEnd(src: string, from: number, to: number) {
  let e = to;
  while (e > from && isWs(src[e - 1])) e--;
  return e;
}

export type Parsed = { root: Node; doctypeEnd: number };

export function parse(src: string): Parsed {
  const root = newNode("#root", 0, 0, 0);
  const stack: Node[] = [root];
  let doctypeEnd = 0;
  let i = 0;
  const n = src.length;

  const top = () => stack[stack.length - 1];
  const closeTo = (k: number, pos: number, explicit: boolean) => {
    // close stack[k..top]; stack[k] explicitly (if explicit) at pos, the rest implicitly
    for (let j = stack.length - 1; j >= k; j--) {
      const node = stack[j];
      node.innerEnd = explicit && j === k ? pos : trimmedEnd(src, node.openEnd, pos);
    }
    stack.length = k;
  };

  while (i < n) {
    const lt = src.indexOf("<", i);
    const textEnd = lt === -1 ? n : lt;
    if (textEnd > i && /\S/.test(src.slice(i, textEnd))) top().hasText = true;
    if (lt === -1) break;
    i = lt;

    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      top().hasComment = true;
      i = end === -1 ? n : end + 3;
      continue;
    }
    if (src[i + 1] === "!" || src[i + 1] === "?") {
      const end = src.indexOf(">", i);
      i = end === -1 ? n : end + 1;
      if (/^<!doctype/i.test(src.slice(lt, lt + 9))) doctypeEnd = i;
      continue;
    }
    if (src[i + 1] === "/" && /[A-Za-z]/.test(src[i + 2] ?? "")) {
      const m = /^<\/([A-Za-z][^\s/>]*)/.exec(src.slice(i, i + 64));
      const tag = m![1].toLowerCase();
      const end = src.indexOf(">", i);
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === tag) {
          closeTo(k, lt, true);
          break;
        }
      }
      i = end === -1 ? n : end + 1;
      continue;
    }
    if (!/[A-Za-z]/.test(src[i + 1] ?? "")) {
      top().hasText = true;
      i++;
      continue;
    }

    // start tag
    const m = /^<([A-Za-z][^\s/>]*)/.exec(src.slice(i, i + 64))!;
    const tag = m[1].toLowerCase();
    const nameEnd = i + m[0].length;
    let p = nameEnd;
    const attrs: Attr[] = [];
    while (p < n) {
      const wsStart = p;
      while (p < n && isWs(src[p])) p++;
      if (p >= n) break;
      if (src[p] === ">") break;
      if (src[p] === "/") {
        p++;
        continue;
      }
      const nameStart = p;
      while (p < n && !isWs(src[p]) && src[p] !== "/" && src[p] !== ">" && src[p] !== "=") p++;
      if (p === nameStart) p++; // stray char like '=' at the start
      const name = src.slice(nameStart, p).toLowerCase();
      let q = p;
      while (q < n && isWs(src[q])) q++;
      let valueStart = p;
      let valueEnd = p;
      let quoted = false;
      if (src[q] === "=") {
        q++;
        while (q < n && isWs(src[q])) q++;
        if (src[q] === '"' || src[q] === "'") {
          const close = src.indexOf(src[q], q + 1);
          valueStart = q + 1;
          valueEnd = close === -1 ? n : close;
          quoted = true;
          p = close === -1 ? n : close + 1;
        } else {
          valueStart = q;
          while (q < n && !isWs(src[q]) && src[q] !== ">") q++;
          valueEnd = q;
          p = q;
        }
      }
      attrs.push({ name, wsStart, end: p, valueStart, valueEnd, quoted });
    }
    const openEnd = Math.min(p + 1, n);

    // implicit closes
    if (P_CLOSERS.has(tag)) {
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === "p") {
          closeTo(k, lt, false);
          break;
        }
        if (!INLINE.has(stack[k].tag)) break;
      }
    }
    const siblingClose: Record<string, string[]> = { li: ["li"], dt: ["dt", "dd"], dd: ["dt", "dd"], option: ["option"], tr: ["tr"], td: ["td", "th"], th: ["td", "th"] };
    if (siblingClose[tag]) {
      const stops = tag === "li" ? ["ul", "ol", "menu"] : tag === "td" || tag === "th" ? ["tr", "table"] : tag === "tr" ? ["table", "tbody", "thead", "tfoot"] : ["dl", "select", "datalist"];
      for (let k = stack.length - 1; k > 0; k--) {
        if (siblingClose[tag].includes(stack[k].tag)) {
          closeTo(k, lt, false);
          break;
        }
        if (stops.includes(stack[k].tag)) break;
      }
    }

    const node = newNode(tag, lt, nameEnd, openEnd, attrs);
    top().children.push(node);
    i = openEnd;
    if (VOID.has(tag)) continue;
    if (RAW.has(tag)) {
      const re = new RegExp(`</${tag}[\\s/>]`, "ig");
      re.lastIndex = openEnd;
      const mm = re.exec(src);
      node.raw = true;
      node.innerEnd = mm ? mm.index : n;
      if (mm) {
        const end = src.indexOf(">", mm.index);
        i = end === -1 ? n : end + 1;
      } else i = n;
      continue;
    }
    stack.push(node);
  }
  if (stack.length > 1) closeTo(1, n, false);
  return { root, doctypeEnd };
}

function inlineOnly(node: Node): boolean {
  return node.children.every((c) => INLINE.has(c.tag) && !c.raw && inlineOnly(c));
}
function hasText(node: Node): boolean {
  return node.hasText || node.children.some(hasText);
}

export function scanEditable(src: string): Region[] {
  const { root } = parse(src);
  const out: Region[] = [];
  const visit = (node: Node) => {
    if (SKIP_SUBTREE.has(node.tag)) return;
    if (node.tag === "img") {
      const srcAttr = node.attrs.find((a) => a.name === "src");
      if (!srcAttr) return;
      const srcset = node.attrs.find((a) => a.name === "srcset");
      const altAttr = node.attrs.find((a) => a.name === "alt");
      out.push({
        id: out.length,
        kind: "image",
        tag: "img",
        nameEnd: node.nameEnd,
        srcStart: srcAttr.valueStart,
        srcEnd: srcAttr.valueEnd,
        srcQuoted: srcAttr.quoted,
        ...(srcset ? { srcset: [srcset.wsStart, srcset.end] as [number, number] } : {}),
        ...(altAttr ? { altRange: [altAttr.valueStart, altAttr.valueEnd, altAttr.quoted] as [number, number, boolean] } : {}),
        alt: altAttr ? decodeEntities(src.slice(altAttr.valueStart, altAttr.valueEnd)) : null,
      });
      return;
    }
    if (CANDIDATE.has(node.tag) && node.innerEnd !== null && inlineOnly(node) && hasText(node)) {
      out.push({
        id: out.length,
        kind: "text",
        tag: node.tag,
        nameEnd: node.nameEnd,
        innerStart: node.openEnd,
        innerEnd: node.innerEnd,
        pure: node.children.length === 0 && !node.hasComment,
      });
      return;
    }
    node.children.forEach(visit);
  };
  root.children.forEach(visit);
  return out;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
/** Minimal entity decoder for attribute values (named basics + numeric). */
export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function escapeText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
}
export function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

type Splice = { start: number; end: number; text: string };

function splice(src: string, parts: Splice[]) {
  const sorted = parts.map((p, k) => ({ ...p, k })).sort((a, b) => a.start - b.start || a.k - b.k);
  let out = "";
  let pos = 0;
  for (const p of sorted) {
    out += src.slice(pos, p.start) + p.text;
    pos = p.end;
  }
  return out + src.slice(pos);
}

export function applyEdits(src: string, regions: Region[], edits: Edit[]): string {
  const byId = new Map(regions.map((r) => [r.id, r]));
  const parts: Splice[] = [];
  for (const e of edits) {
    const r = byId.get(e.id);
    if (!r || r.kind !== e.kind) continue;
    if (r.kind === "text" && e.kind === "text") parts.push({ start: r.innerStart, end: r.innerEnd, text: e.newRaw });
    if (r.kind === "image" && e.kind === "image") {
      const v = escapeAttr(e.newSrc);
      parts.push({ start: r.srcStart, end: r.srcEnd, text: r.srcQuoted ? v : `"${v}"` });
      if (r.srcset) parts.push({ start: r.srcset[0], end: r.srcset[1], text: "" });
      if (e.newAlt !== undefined) {
        const a = escapeAttr(e.newAlt);
        if (r.altRange) parts.push({ start: r.altRange[0], end: r.altRange[1], text: r.altRange[2] ? a : `"${a}"` });
        else parts.push({ start: r.nameEnd, end: r.nameEnd, text: ` alt="${a}"` });
      }
    }
  }
  return splice(src, parts);
}

export const PREVIEW_STYLE =
  "[data-se-id]:hover{outline:2px dashed #c2410c !important;outline-offset:2px;cursor:text}" +
  "img[data-se-id]:hover{cursor:pointer}" +
  "[data-se-editing]{outline:2px solid #c2410c !important;outline-offset:2px;background-color:rgba(253,230,138,.35)}";

/** Copy of the page for the preview iframe: editable elements get data-se-id, plus a highlight style. */
export function buildPreview(src: string, regions: Region[], opts: { baseHref?: string } = {}): string {
  const { root, doctypeEnd } = parse(src);
  const find = (node: Node, tag: string): Node | undefined => {
    for (const c of node.children) {
      if (c.tag === tag) return c;
      const f = find(c, tag);
      if (f) return f;
    }
  };
  const head = find(root, "head");
  const html = find(root, "html");
  const hasBase = !!find(root, "base");
  const headStart = head ? head.openEnd : html ? html.openEnd : doctypeEnd;
  const headEnd = head ? (head.innerEnd ?? head.openEnd) : headStart;

  const parts: Splice[] = [];
  if (opts.baseHref && !hasBase) parts.push({ start: headStart, end: headStart, text: `<base href="${escapeAttr(opts.baseHref)}" data-se-preview>` });
  parts.push({ start: headEnd, end: headEnd, text: `<style data-se-preview>${PREVIEW_STYLE}</style>` });
  for (const r of regions) parts.push({ start: r.nameEnd, end: r.nameEnd, text: ` data-se-id="${r.id}"` });
  return splice(src, parts);
}

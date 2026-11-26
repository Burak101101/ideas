"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applyEdits, buildPreview, escapeText, scanEditable, type Region } from "@/lib/html";
import { changesKey, fileLabel, imageCheck, rawGithubBase, removeChange, toEdits, upsertChange, type Change } from "@/lib/changes";
import { sanitizeInline } from "@/lib/sanitize";
import { commitFile, getFile, GitHubError, missingFields } from "@/lib/github";
import { formatBytes, shrinkNotice } from "@/lib/image";
import { pickImage } from "@/lib/shrink";

type Initial = { html: string; text: string; src: string | null; srcset: string | null; alt: string | null; resolvedSrc: string };
type Doc = { source: string; fileName: string; baseHref: string };
type Notice = { tone: "error" | "ok"; text: string; link?: string } | null;

const LEAVE_PROMPT = "Kaydedilmemiş değişiklikleriniz var (indirilmedi ya da commit edilmedi). Yine de devam edilsin mi? Değişiklikler kaybolur.";

const TAG_NAMES: Record<string, string> = {
  h1: "Başlık",
  h2: "Başlık",
  h3: "Başlık",
  h4: "Başlık",
  h5: "Başlık",
  h6: "Başlık",
  p: "Paragraf",
  a: "Bağlantı",
  li: "Liste öğesi",
  img: "Görsel",
  button: "Düğme",
};

export default function Editor() {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [baseInput, setBaseInput] = useState("");
  const [changes, setChanges] = useState<Change[]>([]);
  const [loadError, setLoadError] = useState("");
  const [imageNotice, setImageNotice] = useState<Notice>(null);
  const [shrink, setShrink] = useState(true);
  // Fingerprint of the edits at the last download/commit; "" = fresh document.
  const [savedKey, setSavedKey] = useState("");
  // Bumped on every open so the iframe remounts even if the same file is opened twice.
  const [openCount, setOpenCount] = useState(0);

  const [gh, setGh] = useState({ token: "", repo: "", branch: "main", path: "", message: "Site metinleri güncellendi" });
  const [ghBusy, setGhBusy] = useState(false);
  const [ghNotice, setGhNotice] = useState<Notice>(null);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const pendingImage = useRef<number | null>(null);
  const initial = useRef<Map<number, Initial>>(new Map());
  const changesRef = useRef<Change[]>([]);
  changesRef.current = changes;
  const dirty = changesKey(changes) !== savedKey;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  /** Ask before throwing away unsaved edits. */
  const okToDiscard = () => !dirtyRef.current || window.confirm(LEAVE_PROMPT);

  const regions = useMemo<Region[]>(() => (doc ? scanEditable(doc.source) : []), [doc?.source]); // eslint-disable-line react-hooks/exhaustive-deps
  const regionById = useMemo(() => new Map(regions.map((r) => [r.id, r])), [regions]);
  const preview = useMemo(() => (doc ? buildPreview(doc.source, regions, { baseHref: doc.baseHref || undefined }) : ""), [doc, regions]);

  const open = useCallback((source: string, fileName: string, baseHref: string) => {
    initial.current = new Map();
    setChanges([]);
    setSavedKey("");
    setImageNotice(null);
    setGhNotice(null);
    setLoadError("");
    setBaseInput(baseHref);
    setDoc({ source, fileName, baseHref });
    setOpenCount((n) => n + 1);
  }, []);

  const frameDoc = () => frameRef.current?.contentDocument ?? null;
  const elementFor = (id: number) => frameDoc()?.querySelector<HTMLElement>(`[data-se-id="${id}"]`) ?? null;

  const recordText = useCallback(
    (el: HTMLElement) => {
      const id = Number(el.dataset.seId);
      const region = regionById.get(id);
      const init = initial.current.get(id);
      if (!region || region.kind !== "text" || !init) return;
      const text = el.textContent ?? "";
      // Mixed elements: only the original inline tags (and bare b/i/em…) survive; pasted markup never reaches the site.
      const html = region.pure ? "" : sanitizeInline(el.innerHTML, init.html);
      const unchanged = region.pure ? text === init.text : html === init.html;
      if (unchanged) {
        setChanges((list) => removeChange(list, id));
        return;
      }
      const newRaw = region.pure ? escapeText(text) : html;
      setChanges((list) =>
        upsertChange(list, { id, kind: "text", tag: region.tag, oldLabel: init.text.trim(), newLabel: text.trim(), newRaw }),
      );
    },
    [regionById],
  );

  // Wire up the preview each time the iframe (re)loads.
  const onFrameLoad = useCallback(() => {
    const d = frameDoc();
    if (!d) return;
    const firstLoad = initial.current.size === 0;
    d.querySelectorAll<HTMLElement>("[data-se-id]").forEach((el) => {
      const id = Number(el.dataset.seId);
      if (firstLoad || !initial.current.has(id)) {
        initial.current.set(id, {
          html: el.innerHTML,
          text: el.textContent ?? "",
          src: el.getAttribute("src"),
          srcset: el.getAttribute("srcset"),
          alt: el.getAttribute("alt"),
          resolvedSrc: (el as HTMLImageElement).src ?? "",
        });
      }
    });
    // Re-apply pending changes after a reload (e.g. the base address changed).
    for (const c of changesRef.current) {
      const el = d.querySelector<HTMLElement>(`[data-se-id="${c.id}"]`);
      if (!el) continue;
      if (c.kind === "text") el.innerHTML = c.newRaw;
      else {
        el.setAttribute("src", c.newSrc);
        el.removeAttribute("srcset");
        if (c.newAlt !== undefined) el.setAttribute("alt", c.newAlt);
      }
    }

    const stopEditing = (el: HTMLElement) => {
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-se-editing");
    };

    d.addEventListener(
      "click",
      (e) => {
        const target = e.target as Element | null;
        if (target?.closest("a, button, input[type=submit], label")) e.preventDefault();
        const el = target?.closest<HTMLElement>("[data-se-id]");
        if (!el) return;
        e.preventDefault();
        const id = Number(el.dataset.seId);
        const region = regionById.get(id);
        if (!region) return;
        if (region.kind === "image") {
          pendingImage.current = id;
          imageInput.current?.click();
          return;
        }
        if (el.isContentEditable) return;
        el.setAttribute("contenteditable", region.pure ? "plaintext-only" : "true");
        el.setAttribute("data-se-editing", "");
        el.focus();
        const sel = d.getSelection();
        if (sel) {
          sel.selectAllChildren(el);
          sel.collapseToEnd();
        }
        const before = el.innerHTML;
        const onInput = () => recordText(el);
        const onKey = (ev: KeyboardEvent) => {
          if (ev.key === "Escape") {
            // Esc = cancel this editing session
            ev.preventDefault();
            el.innerHTML = before;
            el.blur();
          } else if (ev.key === "Enter") {
            ev.preventDefault();
            el.blur();
          }
        };
        // Paste and drop insert plain text only, whatever the clipboard holds.
        const insertPlain = (text: string) => {
          const clean = text.replace(/\r\n?|\n/g, " ");
          if (clean) d.execCommand("insertText", false, clean);
        };
        const onPaste = (ev: ClipboardEvent) => {
          ev.preventDefault();
          insertPlain(ev.clipboardData?.getData("text/plain") ?? "");
        };
        const onDrop = (ev: DragEvent) => {
          ev.preventDefault();
          const text = ev.dataTransfer?.getData("text/plain") ?? "";
          const range = d.caretRangeFromPoint?.(ev.clientX, ev.clientY);
          if (range && el.contains(range.startContainer)) {
            const sel = d.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
          insertPlain(text);
        };
        const onBlur = () => {
          if (!region.pure) {
            const init = initial.current.get(id);
            const clean = init ? sanitizeInline(el.innerHTML, init.html) : el.innerHTML;
            if (clean !== el.innerHTML) el.innerHTML = clean;
          }
          recordText(el);
          stopEditing(el);
          el.removeEventListener("input", onInput);
          el.removeEventListener("keydown", onKey);
          el.removeEventListener("paste", onPaste);
          el.removeEventListener("drop", onDrop);
          el.removeEventListener("blur", onBlur);
        };
        el.addEventListener("input", onInput);
        el.addEventListener("keydown", onKey);
        el.addEventListener("paste", onPaste);
        el.addEventListener("drop", onDrop);
        el.addEventListener("blur", onBlur);
      },
      true,
    );
    d.addEventListener("submit", (e) => e.preventDefault(), true);
  }, [regionById, recordText]);

  const onImagePicked = async (file: File | undefined) => {
    const id = pendingImage.current;
    pendingImage.current = null;
    if (imageInput.current) imageInput.current.value = "";
    if (id === null || !file) return;
    const check = imageCheck(file);
    if (!check.ok) return setImageNotice({ tone: "error", text: check.message ?? "" });
    setImageNotice(null);
    let picked;
    try {
      picked = await pickImage(file, shrink);
    } catch {
      return setImageNotice({ tone: "error", text: `"${file.name}" okunamadı.` });
    }
    if (picked.resized) setImageNotice({ tone: "ok", text: shrinkNotice(file.name, file.size, picked.bytes, picked.width, picked.height) });
    else if (check.message)
      setImageNotice({
        tone: "ok",
        text: shrink ? `"${file.name}" ${formatBytes(file.size)}; bu görsel küçültülemedi (SVG/GIF ya da okunamayan biçim) ve olduğu gibi gömüldü.` : check.message,
      });
    const el = elementFor(id);
    const init = initial.current.get(id);
    if (!el || !init) return;
    el.setAttribute("src", picked.dataUrl);
    el.removeAttribute("srcset");
    setChanges((list) => {
      const prev = list.find((c) => c.id === id);
      return upsertChange(list, {
        id,
        kind: "image",
        tag: "img",
        oldLabel: fileLabel(init.src ?? ""),
        newLabel: `${file.name} (${formatBytes(picked.bytes)})`,
        newSrc: picked.dataUrl,
        oldThumb: init.resolvedSrc,
        ...(prev?.kind === "image" && prev.newAlt !== undefined ? { newAlt: prev.newAlt } : {}),
      });
    });
  };

  /** Alt text of a replaced image; the original value means "leave the attribute alone". */
  const originalAlt = (id: number) => {
    const region = regionById.get(id);
    return region?.kind === "image" ? region.alt : null;
  };
  const setAlt = (id: number, value: string) => {
    const original = originalAlt(id);
    const el = elementFor(id);
    if (el) {
      if (original === null && value === "") el.removeAttribute("alt");
      else el.setAttribute("alt", value);
    }
    setChanges((list) =>
      list.map((c) => {
        if (c.id !== id || c.kind !== "image") return c;
        const { newAlt: _drop, ...rest } = c; // eslint-disable-line @typescript-eslint/no-unused-vars
        return value === (original ?? "") ? rest : { ...rest, newAlt: value };
      }),
    );
  };

  const undo = (id: number) => {
    const el = elementFor(id);
    const init = initial.current.get(id);
    const c = changes.find((x) => x.id === id);
    if (el && init && c) {
      if (c.kind === "text") {
        el.innerHTML = init.html;
        el.removeAttribute("contenteditable");
        el.removeAttribute("data-se-editing");
      } else {
        if (init.src !== null) el.setAttribute("src", init.src);
        if (init.srcset !== null) el.setAttribute("srcset", init.srcset);
        if (init.alt !== null) el.setAttribute("alt", init.alt);
        else el.removeAttribute("alt");
      }
    }
    setChanges((list) => removeChange(list, id));
  };

  const output = () => (doc ? applyEdits(doc.source, regions, toEdits(changes)) : "");

  const download = () => {
    if (!doc) return;
    const blob = new Blob([output()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName || "index.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSavedKey(changesKey(changes));
  };

  const openSample = async () => {
    if (!okToDiscard()) return;
    try {
      const r = await fetch("/ornek/index.html");
      if (!r.ok) throw new Error();
      open(await r.text(), "index.html", "/ornek/");
    } catch {
      setLoadError("Örnek site yüklenemedi.");
    }
  };

  const openUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.html?$/i.test(file.name) && file.type !== "text/html") {
      setLoadError("Lütfen bir .html dosyası seçin.");
      return;
    }
    if (!okToDiscard()) return;
    open(await file.text(), file.name, "");
  };

  const target = { token: gh.token, repo: gh.repo, branch: gh.branch, path: gh.path };

  const openFromGitHub = async () => {
    const missing = missingFields(target);
    if (missing.length) return setGhNotice({ tone: "error", text: `Eksik alanlar: ${missing.join(", ")}.` });
    if (!okToDiscard()) return;
    setGhBusy(true);
    setGhNotice(null);
    try {
      const f = await getFile(target);
      if (!f) setGhNotice({ tone: "error", text: "Repo, dal ya da dosya bulunamadı (404). Adları kontrol edin." });
      else {
        open(f.content, fileLabel(gh.path) || "index.html", rawGithubBase(gh.repo, gh.branch, gh.path));
        setGhNotice({ tone: "ok", text: "Dosya GitHub'dan açıldı." });
      }
    } catch (e) {
      setGhNotice({ tone: "error", text: e instanceof GitHubError ? e.message : "Beklenmeyen bir hata oluştu." });
    } finally {
      setGhBusy(false);
    }
  };

  const commit = async () => {
    const missing = missingFields(target);
    if (!gh.message.trim()) missing.push("Commit mesajı");
    if (missing.length) return setGhNotice({ tone: "error", text: `Eksik alanlar: ${missing.join(", ")}.` });
    if (!doc) return setGhNotice({ tone: "error", text: "Önce bir sayfa açın." });
    setGhBusy(true);
    setGhNotice(null);
    try {
      const key = changesKey(changes);
      const r = await commitFile(target, output(), gh.message.trim());
      setSavedKey(key);
      setGhNotice({ tone: "ok", text: "Commit oluşturuldu.", link: r.url || undefined });
    } catch (e) {
      setGhNotice({ tone: "error", text: e instanceof GitHubError ? e.message : "Beklenmeyen bir hata oluştu." });
    } finally {
      setGhBusy(false);
    }
  };

  const textCount = regions.filter((r) => r.kind === "text").length;
  const imageCount = regions.length - textCount;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-5">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Rötuş <span className="text-rust">·</span> <span className="font-normal text-stone-600">statik sitede tıkla, düzenle</span>
          </h1>
          <p className="text-sm text-stone-600">
            Düz HTML sayfanızdaki yazı ve görselleri yapılandırma olmadan değiştirin. Sayfanın geri kalanı bayt bayt aynı kalır.
          </p>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-white p-3">
        <label className="cursor-pointer rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-stone-700">
          HTML dosyası yükle
          <input type="file" accept=".html,.htm,text/html" className="sr-only" data-testid="html-upload" onChange={(e) => openUpload(e.target.files?.[0])} />
        </label>
        <button type="button" onClick={openSample} className="rounded-md border border-line px-3 py-2 text-sm font-medium hover:bg-stone-100">
          Örnek siteyi aç
        </button>
        <form
          className="flex min-w-[260px] flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (doc) setDoc({ ...doc, baseHref: baseInput.trim() });
          }}
        >
          <label htmlFor="base" className="whitespace-nowrap text-sm text-stone-600">
            Site adresi
          </label>
          <input
            id="base"
            value={baseInput}
            onChange={(e) => setBaseInput(e.target.value)}
            placeholder="https://ornek.com/ (görseller ve CSS önizlemede görünsün diye, isteğe bağlı)"
            className="w-full rounded-md border border-line px-2 py-1.5 text-sm"
          />
          <button type="submit" disabled={!doc} className="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-stone-100 disabled:opacity-40">
            Uygula
          </button>
        </form>
        <label className="flex items-center gap-1.5 text-sm text-stone-700" title="Uzun kenarı 1600 px'i aşan ya da 300 KB'tan ağır fotoğraflar sayfaya gömülmeden önce tarayıcıda küçültülür.">
          <input type="checkbox" checked={shrink} onChange={(e) => setShrink(e.target.checked)} className="accent-moss" />
          Büyük görselleri küçült
        </label>
        <button
          type="button"
          onClick={download}
          disabled={!doc}
          className="rounded-md bg-moss px-3 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-40"
        >
          İndir
        </button>
      </div>

      {loadError && (
        <p role="alert" className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {loadError}
        </p>
      )}

      {imageNotice && (
        <p
          role={imageNotice.tone === "error" ? "alert" : "status"}
          className={`mb-3 rounded-md px-3 py-2 text-sm ${imageNotice.tone === "error" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900"}`}
        >
          {imageNotice.text}
        </p>
      )}

      <input ref={imageInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden data-testid="image-input" onChange={(e) => onImagePicked(e.target.files?.[0])} />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <main className="min-w-0">
          {doc ? (
            <>
              <p className="mb-2 text-sm text-stone-600">
                <strong className="text-ink">{doc.fileName}</strong> · {textCount} metin, {imageCount} görsel düzenlenebilir. Metne tıklayıp yazın (Enter bitirir, Esc vazgeçer); görsele
                tıklayıp yenisini seçin.
              </p>
              <iframe
                key={openCount}
                ref={frameRef}
                title="Önizleme"
                srcDoc={preview}
                onLoad={onFrameLoad}
                sandbox="allow-same-origin"
                className="h-[75vh] w-full rounded-lg border border-line bg-white shadow-sm"
              />
            </>
          ) : (
            <div className="flex h-[60vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-line bg-white p-8 text-center">
              <p className="max-w-md text-stone-700">
                Bir <code>.html</code> dosyası yükleyin, GitHub&apos;dan açın ya da örnek siteyle deneyin. Başlıklar, paragraflar, bağlantı metinleri ve görseller otomatik
                olarak düzenlenebilir hale gelir.
              </p>
            </div>
          )}
        </main>

        <aside className="space-y-4">
          <section className="rounded-lg border border-line bg-white p-4">
            <h2 className="mb-2 font-semibold">
              Değişiklikler <span className="text-stone-500">({changes.length})</span>
            </h2>
            {changes.length > 0 && (
              <p className={`mb-2 text-xs ${dirty ? "text-amber-800" : "text-moss"}`} data-testid="save-state">
                {dirty ? "Kaydedilmemiş değişiklikler var — indirin ya da commit edin." : "Tüm değişiklikler kaydedildi (indirildi/commit edildi)."}
              </p>
            )}
            {changes.length === 0 ? (
              <p className="text-sm text-stone-500">Henüz değişiklik yok.</p>
            ) : (
              <ul aria-label="Değişiklikler" className="space-y-2">
                {changes.map((c) => (
                  <li key={c.id} className="rounded-md border border-line p-2 text-sm">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{TAG_NAMES[c.tag] ?? `<${c.tag}>`}</span>
                      <button type="button" onClick={() => undo(c.id)} className="rounded border border-line px-2 py-0.5 text-xs hover:bg-stone-100">
                        Geri al
                      </button>
                    </div>
                    {c.kind === "image" ? (
                      <>
                      <div className="flex items-center gap-2">
                        {c.oldThumb && <img src={c.oldThumb} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-line" />}
                        <span className="text-stone-500 line-through">{c.oldLabel}</span>
                        <span aria-hidden>→</span>
                        <img src={c.newSrc} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-line" />
                        <span className="break-all">{c.newLabel}</span>
                      </div>
                      <label className="mt-2 block">
                        <span className="mb-0.5 block text-xs text-stone-600">Görsel açıklaması (alt metni — ekran okuyucular ve arama motorları için)</span>
                        <input
                          type="text"
                          value={c.newAlt ?? originalAlt(c.id) ?? ""}
                          onChange={(e) => setAlt(c.id, e.target.value)}
                          placeholder="ör. Vitrinde sıcak simitler"
                          className="w-full rounded-md border border-line px-2 py-1 text-sm"
                        />
                      </label>
                      </>
                    ) : (
                      <p className="break-words">
                        <span className="text-stone-500 line-through">{c.oldLabel}</span> <span aria-hidden>→</span> <span>{c.newLabel || "(boş)"}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-line bg-white p-4">
            <h2 className="mb-1 font-semibold">GitHub&apos;a commit&apos;le</h2>
            <p className="mb-3 text-xs text-stone-500">
              Token yalnızca bu sekmenin belleğinde tutulur, doğrudan api.github.com&apos;a gider; kaydedilmez ve sunucumuza gönderilmez. İnce ayarlı (fine-grained) bir
              token kullanın: yalnızca ilgili repo, &quot;Contents: Read and write&quot;.
            </p>
            <div className="space-y-2 text-sm">
              {(
                [
                  ["token", "Token", "github_pat_…", "password"],
                  ["repo", "Repo", "kullanıcı/repo", "text"],
                  ["branch", "Dal", "main", "text"],
                  ["path", "Dosya yolu", "index.html", "text"],
                  ["message", "Commit mesajı", "", "text"],
                ] as const
              ).map(([key, label, ph, type]) => (
                <label key={key} className="block">
                  <span className="mb-0.5 block text-stone-600">{label}</span>
                  <input
                    type={type}
                    autoComplete="off"
                    spellCheck={false}
                    value={gh[key]}
                    placeholder={ph}
                    onChange={(e) => setGh({ ...gh, [key]: e.target.value })}
                    className="w-full rounded-md border border-line px-2 py-1.5"
                  />
                </label>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={commit}
                  disabled={ghBusy}
                  className="flex-1 rounded-md bg-ink px-3 py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-50"
                >
                  Commit et
                </button>
                <button type="button" onClick={openFromGitHub} disabled={ghBusy} className="rounded-md border border-line px-3 py-2 hover:bg-stone-100 disabled:opacity-50">
                  GitHub&apos;dan aç
                </button>
              </div>
              {ghBusy && <p className="text-stone-500">GitHub&apos;a bağlanılıyor…</p>}
              {ghNotice && (
                <p data-testid="gh-notice" role={ghNotice.tone === "error" ? "alert" : "status"} className={`rounded-md px-3 py-2 ${ghNotice.tone === "error" ? "bg-red-50 text-red-800" : "bg-lime-50 text-lime-900"}`}>
                  {ghNotice.text}{" "}
                  {ghNotice.link && (
                    <a href={ghNotice.link} target="_blank" rel="noreferrer" className="underline">
                      Commit&apos;i gör
                    </a>
                  )}
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

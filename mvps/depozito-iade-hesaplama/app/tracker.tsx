"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  computeDeadline,
  computeTotals,
  daysBetween,
  deadlineStatus,
  formatDate,
  formatMoney,
  localToday,
  parseAmount,
  recordDeadline,
  sortByDeadline,
  type DeadlineStatus,
  type Deduction,
  type DeductionCategory,
  type MoveOut,
} from "@/lib/deposit";
import { findState, STATES } from "@/lib/states";
import { loadLandlord, loadRecords, saveLandlord, saveRecords, type Landlord } from "@/lib/storage";

type Form = {
  id: string | null;
  tenantName: string;
  propertyAddress: string;
  deposit: string;
  moveOutDate: string;
  stateCode: string;
  interest: string;
  forwardingAddress: string;
  deductions: Deduction[];
};

const emptyForm = (): Form => ({
  id: null,
  tenantName: "",
  propertyAddress: "",
  deposit: "",
  moveOutDate: "",
  stateCode: "",
  interest: "",
  forwardingAddress: "",
  deductions: [],
});

const num = (s: string) => parseAmount(s).value;

const DISCARD_MSG = "You have unsaved changes to this move-out. Discard them?";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function toRecord(f: Form, id: string): MoveOut {
  return {
    id,
    tenantName: f.tenantName.trim(),
    propertyAddress: f.propertyAddress.trim(),
    deposit: num(f.deposit),
    moveOutDate: f.moveOutDate,
    stateCode: f.stateCode,
    interest: num(f.interest),
    deductions: f.deductions,
    forwardingAddress: f.forwardingAddress.trim(),
  };
}

function toForm(r: MoveOut): Form {
  return {
    id: r.id,
    tenantName: r.tenantName,
    propertyAddress: r.propertyAddress ?? "",
    deposit: String(r.deposit),
    moveOutDate: r.moveOutDate,
    stateCode: r.stateCode,
    interest: r.interest ? String(r.interest) : "",
    forwardingAddress: r.forwardingAddress ?? "",
    deductions: r.deductions,
  };
}

const STATUS_LABEL: Record<DeadlineStatus, string> = {
  overdue: "Overdue",
  soon: "Due soon",
  ok: "On track",
};

const STATUS_STYLE: Record<DeadlineStatus, string> = {
  overdue: "bg-brick text-white",
  soon: "bg-amber text-white",
  ok: "bg-teal/10 text-teal",
};

function daysLeftText(left: number) {
  if (left < 0) return `${-left} day${left === -1 ? "" : "s"} past the deadline`;
  if (left === 0) return "Due today";
  return `${left} day${left === 1 ? "" : "s"} left`;
}

const inputCls =
  "mt-1 w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30";
const labelCls = "block text-sm font-medium";
const btnPrimary =
  "rounded-md bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost = "rounded-md border border-ink/20 bg-white px-3 py-2 text-sm hover:bg-ink/5";

export default function Tracker() {
  const [records, setRecords] = useState<MoveOut[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [baseline, setBaseline] = useState(() => JSON.stringify(emptyForm()));
  const [newDed, setNewDed] = useState({ description: "", category: "cleaning" as DeductionCategory, amount: "" });
  const [showLetter, setShowLetter] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [landlord, setLandlord] = useState<Landlord>({ name: "", address: "" });
  const statementBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setRecords(loadRecords(window.localStorage));
    setLandlord(loadLandlord(window.localStorage));
    setToday(localToday());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) setSaveError(!saveRecords(window.localStorage, records));
  }, [records, loaded]);

  useEffect(() => {
    if (loaded) saveLandlord(window.localStorage, landlord);
  }, [landlord, loaded]);

  const dirty =
    JSON.stringify(form) !== baseline || newDed.description.trim() !== "" || newDed.amount.trim() !== "";

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function loadForm(f: Form) {
    setForm(f);
    setBaseline(JSON.stringify(f));
    setNewDed((d) => ({ description: "", category: d.category, amount: "" }));
  }

  /** Switches the editor to another form, asking first if there are unsaved edits. */
  function switchTo(f: Form) {
    if (dirty && !window.confirm(DISCARD_MSG)) return;
    loadForm(f);
  }

  function closeLetter() {
    setShowLetter(false);
    requestAnimationFrame(() => statementBtn.current?.focus());
  }

  const state = findState(form.stateCode);
  const hasDeductions = form.deductions.length > 0;
  const deadline = computeDeadline(form.stateCode, form.moveOutDate, hasDeductions);
  const depositP = parseAmount(form.deposit);
  const interestP = parseAmount(form.interest);
  const newDedP = parseAmount(newDed.amount);
  const totals = computeTotals(depositP.value, form.deductions, interestP.value);
  const left = deadline && today ? daysBetween(today, deadline) : null;

  const sorted = useMemo(() => sortByDeadline(records), [records]);

  const canSave =
    form.tenantName.trim() !== "" &&
    !depositP.empty &&
    !depositP.error &&
    !interestP.error &&
    form.moveOutDate !== "" &&
    form.stateCode !== "";
  const canAddDed = newDed.description.trim() !== "" && !newDedP.error && newDedP.value > 0;

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addDeduction(e: React.FormEvent) {
    e.preventDefault();
    if (!canAddDed) return;
    update("deductions", [
      ...form.deductions,
      { id: newId(), description: newDed.description.trim(), category: newDed.category, amount: newDedP.value },
    ]);
    setNewDed({ description: "", category: newDed.category, amount: "" });
  }

  function save() {
    if (!canSave) return;
    const id = form.id ?? newId();
    const rec = toRecord(form, id);
    setRecords((rs) => (rs.some((r) => r.id === id) ? rs.map((r) => (r.id === id ? rec : r)) : [...rs, rec]));
    const saved = { ...form, id };
    setForm(saved);
    setBaseline(JSON.stringify(saved));
  }

  function remove(id: string) {
    setRecords((rs) => rs.filter((r) => r.id !== id));
    if (form.id === id) loadForm(emptyForm());
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-28 lg:pb-8">
      <div className={showLetter ? "no-print" : ""}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Move-Out Ledger</h1>
          <p className="mt-1 text-ink/70">
            Know your deposit deadline, itemize deductions, and hand your tenant a clean statement.
          </p>
          <p role="note" className="mt-3 rounded-md border border-amber/40 bg-amber/10 px-3 py-2 text-sm">
            Not legal advice. Deadlines come from the linked state sources and can change; city rules may be stricter.
            Verify your state&apos;s law before you send anything.
          </p>
        </header>

        <section
          aria-labelledby="landlord-h"
          className="mb-6 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
        >
          <h2 id="landlord-h" className="text-base font-semibold">
            Your details <span className="font-normal text-ink/60">(printed as the sender on every letter)</span>
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              Your name or company
              <input
                className={inputCls}
                value={landlord.name}
                onChange={(e) => setLandlord({ ...landlord, name: e.target.value })}
              />
            </label>
            <label className={labelCls}>
              Your mailing address
              <textarea
                rows={2}
                className={inputCls}
                value={landlord.address}
                onChange={(e) => setLandlord({ ...landlord, address: e.target.value })}
              />
            </label>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <section aria-labelledby="editor-h" className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 id="editor-h" className="text-lg font-semibold">
                {form.id ? "Edit move-out" : "New move-out"}
                {dirty && (
                  <span className="ml-2 rounded-full bg-amber/15 px-2 py-0.5 align-middle text-xs font-semibold text-amber">
                    Unsaved changes
                  </span>
                )}
              </h2>
              {form.id && (
                <button type="button" className={btnGhost} onClick={() => switchTo(emptyForm())}>
                  Start a new one
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={labelCls}>
                Tenant name
                <input className={inputCls} value={form.tenantName} onChange={(e) => update("tenantName", e.target.value)} />
              </label>
              <label className={labelCls}>
                Property address
                <input
                  className={inputCls}
                  value={form.propertyAddress}
                  onChange={(e) => update("propertyAddress", e.target.value)}
                />
              </label>
              <div>
              <label className={labelCls}>
                Deposit amount ($)
                <input
                  className={inputCls}
                  inputMode="decimal"
                  autoComplete="off"
                  required
                  aria-invalid={depositP.error ? true : undefined}
                  aria-describedby={depositP.error ? "deposit-err" : undefined}
                  value={form.deposit}
                  onChange={(e) => update("deposit", e.target.value)}
                />
              </label>
              <FieldError id="deposit-err" error={depositP.error} />
              </div>
              <label className={labelCls}>
                Move-out date
                <input
                  className={inputCls}
                  type="date"
                  value={form.moveOutDate}
                  onChange={(e) => update("moveOutDate", e.target.value)}
                />
              </label>
              <label className={labelCls}>
                State
                <select className={inputCls} value={form.stateCode} onChange={(e) => update("stateCode", e.target.value)}>
                  <option value="">Choose a state…</option>
                  {STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <div>
              <label className={labelCls}>
                Interest owed to tenant ($)
                <input
                  className={inputCls}
                  inputMode="decimal"
                  autoComplete="off"
                  aria-invalid={interestP.error ? true : undefined}
                  aria-describedby={interestP.error ? "interest-err" : undefined}
                  value={form.interest}
                  onChange={(e) => update("interest", e.target.value)}
                />
              </label>
              <FieldError id="interest-err" error={interestP.error} />
              </div>
              <label className={`${labelCls} sm:col-span-2`}>
                Tenant forwarding address
                <textarea
                  rows={2}
                  className={inputCls}
                  placeholder="Where the statement and refund should be mailed"
                  value={form.forwardingAddress}
                  onChange={(e) => update("forwardingAddress", e.target.value)}
                />
              </label>
            </div>

            <h3 className="mt-6 text-base font-semibold">Deductions</h3>
            {form.deductions.length === 0 ? (
              <p className="mt-2 text-sm text-ink/60">No deductions yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-ink/10 rounded-md border border-ink/10" aria-label="Deductions">
                {form.deductions.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                      {d.description} <span className="text-ink/50">· {d.category}</span>
                    </span>
                    <span className="tabular-nums">{formatMoney(d.amount)}</span>
                    <button
                      type="button"
                      className="text-brick hover:underline"
                      aria-label={`Remove ${d.description}`}
                      onClick={() => update("deductions", form.deductions.filter((x) => x.id !== d.id))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={addDeduction} className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
              <label className={labelCls}>
                Description
                <input
                  className={inputCls}
                  value={newDed.description}
                  onChange={(e) => setNewDed({ ...newDed, description: e.target.value })}
                  placeholder="e.g. Carpet cleaning"
                />
              </label>
              <label className={labelCls}>
                Category
                <select
                  className={inputCls}
                  value={newDed.category}
                  onChange={(e) => setNewDed({ ...newDed, category: e.target.value as DeductionCategory })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div>
              <label className={labelCls}>
                Amount ($)
                <input
                  className={inputCls}
                  inputMode="decimal"
                  autoComplete="off"
                  aria-invalid={newDedP.error ? true : undefined}
                  aria-describedby={newDedP.error ? "ded-err" : undefined}
                  value={newDed.amount}
                  onChange={(e) => setNewDed({ ...newDed, amount: e.target.value })}
                />
              </label>
              <FieldError id="ded-err" error={newDedP.error} />
              </div>
              <button type="submit" className={btnGhost} disabled={!canAddDed}>
                Add deduction
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className={btnPrimary} disabled={!canSave} onClick={save}>
                {form.id ? "Update move-out" : "Save move-out"}
              </button>
              <button
                type="button"
                ref={statementBtn}
                className={btnGhost}
                disabled={!canSave}
                onClick={() => setShowLetter(true)}
              >
                Create statement
              </button>
            </div>
            {!canSave && (
              <p className="mt-2 text-xs text-ink/60">
                Tenant name, deposit amount, move-out date and state are required; amounts can&apos;t be negative.
              </p>
            )}
          </section>

          <aside className="space-y-6">
            <section aria-labelledby="deadline-h" className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
              <h2 id="deadline-h" className="text-lg font-semibold">
                Return deadline
              </h2>
              {state && deadline ? (
                <div className="mt-3">
                  <p className="text-2xl font-bold" data-testid="deadline">
                    {formatDate(deadline)}
                  </p>
                  {left !== null && (
                    <p className="mt-1 text-sm" data-testid="days-left">
                      {daysLeftText(left)}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-ink/70">
                    {state.name}: {state.daysNoDeductions !== undefined && !hasDeductions ? state.daysNoDeductions : state.days}{" "}
                    days {state.trigger}.
                    {state.daysNoDeductions !== undefined &&
                      ` (${state.daysNoDeductions} days if nothing is deducted, ${state.days} days to send notice of deductions.)`}
                  </p>
                  <a
                    href={state.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-teal underline"
                  >
                    Source: {state.citation}
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink/60">Pick a state and move-out date to see the deadline.</p>
              )}
            </section>

            <section aria-labelledby="totals-h" className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
              <h2 id="totals-h" className="text-lg font-semibold">
                Totals
              </h2>
              <dl className="mt-3 space-y-1 text-sm">
                <Row label="Deposit" value={formatMoney(depositP.value)} testId="totals-deposit" />
                <Row label="Total deductions" value={`− ${formatMoney(totals.totalDeductions)}`} testId="total-deductions" />
                <Row label="Interest" value={`+ ${formatMoney(interestP.value)}`} />
                <div className="my-2 border-t border-ink/10" />
                <Row label="Refund to tenant" value={formatMoney(totals.refund)} testId="refund" strong />
                {totals.owedByTenant > 0 && (
                  <Row label="Owed by tenant" value={formatMoney(totals.owedByTenant)} testId="owed" strong warn />
                )}
              </dl>
            </section>
          </aside>
        </div>

        <section aria-labelledby="list-h" className="mt-8">
          <h2 id="list-h" className="text-lg font-semibold">
            Move-outs by deadline
          </h2>
          {saveError && (
            <p role="alert" className="mt-2 text-sm text-brick">
              Your browser blocked saving. Changes will be lost when you close this page.
            </p>
          )}
          {sorted.length === 0 ? (
            <p className="mt-2 text-sm text-ink/60">Saved move-outs will show up here, soonest deadline first.</p>
          ) : (
            <ol className="mt-3 space-y-2" aria-label="Saved move-outs">
              {sorted.map((r) => {
                const dl = recordDeadline(r);
                const st = dl && today ? deadlineStatus(dl, today) : null;
                const t = computeTotals(r.deposit, r.deductions, r.interest);
                return (
                  <li
                    key={r.id}
                    data-testid="record"
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-ink/10 bg-white px-4 py-3"
                  >
                    <div className="min-w-40 flex-1 basis-40">
                      <p className="font-medium [overflow-wrap:anywhere]">{r.tenantName}</p>
                      <p className="text-xs text-ink/60">
                        {findState(r.stateCode)?.name ?? r.stateCode} · moved out {r.moveOutDate && formatDate(r.moveOutDate)}
                      </p>
                    </div>
                    <div className="text-sm">
                      Due <span className="font-medium">{dl ? formatDate(dl) : "—"}</span>
                    </div>
                    {st && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[st]}`}>
                        {STATUS_LABEL[st]}
                      </span>
                    )}
                    <div className="w-28 text-right text-sm tabular-nums">
                      {t.owedByTenant > 0 ? `owes ${formatMoney(t.owedByTenant)}` : `refund ${formatMoney(t.refund)}`}
                    </div>
                    <button
                      type="button"
                      className={btnGhost}
                      aria-label={`Edit ${r.tenantName}`}
                      onClick={() => {
                        if (form.id !== r.id || dirty) switchTo(toForm(r));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm text-brick hover:underline"
                      aria-label={`Delete ${r.tenantName}`}
                      onClick={() => remove(r.id)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <div
          data-testid="summary-bar"
          className="fixed inset-x-0 bottom-0 z-[5] flex items-center justify-between gap-3 border-t border-ink/10 bg-white/95 px-4 py-3 text-sm shadow-[0_-2px_8px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden"
        >
          <div className="min-w-0">
            <p className="text-xs text-ink/60">Deadline</p>
            <p className="font-semibold">
              {deadline ? formatShortDate(deadline) : "—"}
              {left !== null && <span className="ml-1 font-normal text-ink/70">· {daysLeftText(left)}</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink/60">{totals.owedByTenant > 0 ? "Owed by tenant" : "Refund"}</p>
            <p className={`font-semibold tabular-nums ${totals.owedByTenant > 0 ? "text-brick" : ""}`}>
              {formatMoney(totals.owedByTenant > 0 ? totals.owedByTenant : totals.refund)}
            </p>
          </div>
        </div>
      </div>

      {showLetter && (
        <Letter
          form={form}
          landlord={landlord}
          deadline={deadline}
          totals={totals}
          today={today ?? localToday()}
          onClose={closeLetter}
        />
      )}
    </div>
  );
}

function formatShortDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function FieldError({ id, error }: { id: string; error: string | null }) {
  if (!error) return null;
  return (
    <span id={id} className="mt-1 block text-xs font-normal text-brick">
      {error}
    </span>
  );
}

function Row(props: { label: string; value: string; testId?: string; strong?: boolean; warn?: boolean }) {
  return (
    <div className={`flex justify-between ${props.strong ? "text-base font-semibold" : ""} ${props.warn ? "text-brick" : ""}`}>
      <dt>{props.label}</dt>
      <dd className="tabular-nums" data-testid={props.testId}>
        {props.value}
      </dd>
    </div>
  );
}

function Letter(props: {
  form: Form;
  landlord: Landlord;
  deadline: string | null;
  totals: ReturnType<typeof computeTotals>;
  today: string;
  onClose: () => void;
}) {
  const { form, totals, landlord, onClose } = props;
  const state = findState(form.stateCode);
  const dialogRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLButtonElement>(null);
  const hasLandlord = landlord.name.trim() !== "" && landlord.address.trim() !== "";
  const hasForwarding = form.forwardingAddress.trim() !== "";

  useEffect(() => {
    printRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], input, textarea, select, [tabindex]"),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialogRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Statement preview"
      className="fixed inset-0 z-10 overflow-auto bg-ink/40 p-4 print:static print:bg-white print:p-0"
    >
      <div className="no-print mx-auto mb-3 flex max-w-3xl flex-wrap items-start justify-end gap-2">
        {(!hasLandlord || !hasForwarding) && (
          <ul className="mr-auto space-y-1 rounded-md bg-amber/90 px-3 py-2 text-xs font-medium text-white">
            {!hasLandlord && <li>Add your name and mailing address under “Your details” so the tenant knows who sent this.</li>}
            {!hasForwarding && <li>Add the tenant&apos;s forwarding address so you can mail this statement.</li>}
          </ul>
        )}
        <button ref={printRef} type="button" className={btnPrimary} onClick={() => window.print()}>
          Print
        </button>
        <button type="button" className={btnGhost} onClick={onClose}>
          Close
        </button>
      </div>
      <article
        aria-label="Itemized security deposit statement"
        className="letter mx-auto max-w-3xl rounded-lg bg-white p-10 text-sm leading-relaxed shadow-xl"
      >
        <div className="flex flex-wrap justify-between gap-4">
          <p className="whitespace-pre-line [overflow-wrap:anywhere]" data-testid="letter-from">
            {landlord.name.trim() && <strong>{landlord.name.trim()}</strong>}
            {landlord.name.trim() && landlord.address.trim() && "\n"}
            {landlord.address.trim()}
          </p>
          <p className="ml-auto text-right">{formatDate(props.today)}</p>
        </div>
        <p className="mt-6 whitespace-pre-line [overflow-wrap:anywhere]">
          {form.tenantName}
          {form.forwardingAddress.trim() && "\n" + form.forwardingAddress.trim()}
        </p>
        {form.propertyAddress && <p className="mt-3 [overflow-wrap:anywhere]">Re: {form.propertyAddress}</p>}
        <h2 className="mt-6 text-xl font-bold">Itemized Security Deposit Statement</h2>
        <p className="mt-3">
          This statement accounts for the security deposit you paid. You moved out on{" "}
          <strong>{form.moveOutDate ? formatDate(form.moveOutDate) : "—"}</strong>.
          {state && props.deadline && (
            <>
              {" "}
              Under {state.citation}, this accounting is due by <strong>{formatDate(props.deadline)}</strong>.
            </>
          )}
        </p>

        <table className="mt-5 w-full border-collapse">
          <thead>
            <tr className="border-b border-ink/30 text-left">
              <th className="py-1">Item</th>
              <th className="py-1">Category</th>
              <th className="py-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-ink/10">
              <td className="py-1">Security deposit received</td>
              <td />
              <td className="py-1 text-right tabular-nums">{formatMoney(num(form.deposit))}</td>
            </tr>
            {form.deductions.map((d) => (
              <tr key={d.id} className="border-b border-ink/10">
                <td className="py-1">{d.description}</td>
                <td className="py-1">{d.category}</td>
                <td className="py-1 text-right tabular-nums">− {formatMoney(d.amount)}</td>
              </tr>
            ))}
            {num(form.interest) > 0 && (
              <tr className="border-b border-ink/10">
                <td className="py-1">Interest on deposit</td>
                <td />
                <td className="py-1 text-right tabular-nums">+ {formatMoney(num(form.interest))}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-3 font-semibold" colSpan={2}>
                Total deductions
              </td>
              <td className="pt-3 text-right font-semibold tabular-nums">{formatMoney(totals.totalDeductions)}</td>
            </tr>
            <tr>
              <td className="font-semibold" colSpan={2}>
                Amount refunded to you
              </td>
              <td className="text-right font-semibold tabular-nums">{formatMoney(totals.refund)}</td>
            </tr>
            {totals.owedByTenant > 0 && (
              <tr>
                <td className="font-semibold" colSpan={2}>
                  Balance you owe
                </td>
                <td className="text-right font-semibold tabular-nums">{formatMoney(totals.owedByTenant)}</td>
              </tr>
            )}
          </tfoot>
        </table>

        <p className="mt-6">Receipts or estimates for the items above are available on request or attached.</p>
        <p className="mt-10">Signed: ______________________________</p>
        {landlord.name.trim() && <p className="mt-1">{landlord.name.trim()}</p>}
      </article>
    </div>
  );
}

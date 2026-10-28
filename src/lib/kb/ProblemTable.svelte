<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, type Problem } from '#lib/kb/problems';

  type Ticket = { url: string; state: string };
  // tickets: the ticket each problem has now, and where it stands.
  let { ticket, tickets = {} }: { ticket: number; tickets?: Partial<Record<Problem, Ticket>> } = $props();

  // The desk's own view (causes.ts), so these counts match CauseTable on #4471.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const oneDay = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)));
  const filedUnder = $derived(groups.find((g) => readAs(g, notes.oneDayMove) > 0)?.cause);
  const rows = $derived([
    ...groups.map((g) => ({ problem: g.cause as Problem, count: g.reports.length, tenants: g.tenants, note: '' })),
    {
      problem: 'one-day' as Problem,
      count: oneDay.length,
      tenants: new Set(oneDay.map((r) => r.tenant)).size,
      note: filedUnder ? `also counted under ${filedUnder}, where the desk files them` : '',
    },
  ]);
  const issueNo = (url: string) => url.replace(/.*\/issues\//, '#');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} · <strong>{rows.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>what goes wrong</th><th>reports</th><th>tenants</th><th>ticket</th><th>now</th></tr>
  </thead>
  <tbody>
    {#each rows as r (r.problem)}
      {@const t = tickets[r.problem]}
      <tr class:open={t?.state.startsWith('open')}>
        <td><code>{r.problem}</code></td>
        <td>{PROBLEMS[r.problem]}{#if r.note}<br /><span class="note">{r.note}</span>{/if}</td>
        <td>{r.count}</td>
        <td>{r.tenants}</td>
        <td>{#if t}<a href={t.url}>{issueNo(t.url)}</a>{:else}<span class="none">none</span>{/if}</td>
        <td>{t?.state ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>

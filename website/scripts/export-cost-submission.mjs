// Export interpolated cost copy and its evidence for Word and integration packages.
import { createServer } from 'vite';
import fs from 'node:fs';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const section = (await server.ssrLoadModule('/src/content/sections/08-cost-analysis.ts')).default;
  const references = (await server.ssrLoadModule('/src/content/references.ts')).references;
  const appendices = (await server.ssrLoadModule('/src/content/appendices.ts')).default.topics.filter(t => t.id.startsWith('cost-'));
  const words = value => (value.match(/\S+/g) || []).length;
  const prose = section.topics.reduce((n, t) => n + (t.paragraphs || []).reduce((sum, p) => sum + words(p.text), 0), 0);
  const tables = section.topics.reduce((n, t) => n + (t.table ? words([t.table.caption, ...t.table.columns, ...t.table.rows.flat()].join(' ')) : 0), 0);
  const headings = words([section.title, section.summary, ...section.topics.map(t => t.title)].join(' '));
  const citationIds = [...new Set([...section.topics, ...appendices].flatMap(t => (t.paragraphs || []).flatMap(p => (p.citations || []).map(r => r.id))))];
  const result = { section, references, appendices, counts: { prose, tables, headings, total: prose + tables + headings }, citationIds };
  fs.writeFileSync('content/team-review/submission-closeout-2026-11-28/report-source.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ counts: result.counts, citationIds: citationIds.length }));
} finally {
  await server.close();
}

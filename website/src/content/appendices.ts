import type { ReportSection } from './types';
import { references } from './references';
import { planningDetailRows } from './planning-budget';
import { currentCostComparisonRows } from './current-cost-comparison';
import { referenceAdditionRows } from './reference-cost-scenario';

export default {
  title: "Supporting documents",
  label: "Supporting documents",
  summary: "Find the project records, supporting evidence, AI documentation, and group declaration that accompany the report.",
  topics: [
    {
      id: "brief-and-evidence",
      title: "Reverse brief and evidence records",
      pending: "Add the agreed reverse brief and approved supporting material, including criteria rationale, options scoring, test evidence, and dated price records. Remove personal details that are not approved for release.",
    },
    {
      id: "ai-declaration",
      title: "AI use or non-use declaration",
      pending: "Add the team’s actual declaration. Record what was used, where, why, and how the team checked the output.",
    },
    {
      id: "prompt-log",
      title: "Prompts, outputs, and screenshots",
      documents: [
        { title: "Bá Nguyên: actual saved prompts and final outputs (text export)", url: "/documents/ba-nguyen-ai-log-2026-11-28.html" },
      ],
      table: {
        id: "ai-prompt-log",
        caption: "Table 5. AI prompt and output register",
        columns: ["Date", "Tool / model", "Purpose and section", "Prompt", "Output or screenshot", "Verification / edits"],
        rows: [["19–28 November 2026", "OpenAI Codex / ChatGPT; model not independently recorded", "Bá Nguyên — cost research, arithmetic, drafting and verification", "Actual saved user messages in linked text export", "58 saved final responses; current budget, Word and patch artifacts", "Sources, arithmetic, build, links and Chrome viewport checks; no field performance claimed"]],
        pending: "This row covers Bá Nguyên only. Original interface screenshots and other members’ records remain separate.",
      },
    },
    {
      id: "group-declaration",
      title: "Group contribution declaration",
      table: {
        id: "contributions",
        caption: "Table 6. Group contribution declaration",
        columns: ["Team member", "Actual contribution", "Supporting evidence", "Confirmation"],
        rows: [["Lê Nguyễn Bá Nguyên", "AI-assisted cost research, explicit allowances, budget arithmetic, affordability proposal, APA checks, concise cost copy, integration and QA records", "Own branch history; cost model, price captures, actual AI text export and dated handoff", "Recorded for Bá Nguyên; team-wide approval not claimed"]],
        pending: "Other contributions and the final team declaration still require their own evidence and confirmation.",
      },
    },
    {
      id: "cost-budget-detail",
      title: "Appendix E — cost ledger and assumptions",
      paragraphs: [{
        text: "This cost-only appendix separates listings from analyst allowances, not supplier quotations or field results. The independent 32-task strict-90-day illustration is historical; this model uses 48 early two-monthly DO/turbidity tasks within 36 monthly field routes. Six testing rounds and 16 station checks are included in those visits. Hardware renewal figures are funding reserves, not failure predictions.",
        citations: references.filter(r => ["fdi-labour-benchmark","tiasang-labour-benchmark","dfrobot-do-maintenance","dfrobot-ph-calibration","dfrobot-turbidity","render-storage-benchmark","lalamove-freight-benchmark","recycling-scope-benchmark"].includes(r.id)),
      }],
      table: {
        id: "cost-budget-ledger",
        caption: "Appendix E1. Base planning-budget ledger; unit prices and allowances in VND",
        columns: ["Item", "Evidence class", "Quantity", "Unit VND", "Amount VND", "Assumptions and scope"],
        rows: planningDetailRows, wide: true,
        scrollHint: "Scroll horizontally for quantities, evidence class and exclusions.",
      },
      documents: [
        {title:"Budget workbook and funding proposal",url:"/documents/ba-nguyen-cost-appendix-2026-11-28.html"},
        {title:"Cost section and appendices (Word)",url:"/documents/ba-nguyen-cost-submission-2026-11-28.docx"},
        {title:"Group Word compilation draft — URL and team evidence still required",url:"/documents/hanoi-waterwatch-group-compilation-draft-2026-11-28.docx"},
      ],
    },
    {
      id: "cost-configuration-comparison",
      title: "Appendix E2 — controller comparison",
      table: {
        id: "controller-comparison",
        caption: "Historical native-currency controller comparison; same reference sensors, Q190 chosen for costing",
        columns: ["Configuration","One-station VND portion","One-station USD portion","Three-station VND portion","Three-station USD portion","Limits"],
        rows: currentCostComparisonRows,wide:true,
      },
    },
    {
      id: "cost-reference-components",
      title: "Appendix E3 — listed reference additions",
      paragraphs: [{text:"The last two partial totals below belong to the earlier listing-only scenario. They reconcile prices and are not additional amounts to add to the newer planning budget. The 25,940 VND/USD rate remains a historical assumption.", citations: references.filter(r => ["giva-panel","solar-controller","vac-battery","e360-buck","haidang-enclosure","phongvu-card","dongbac-ph4","dongbac-ph7","mlab-storage"].includes(r.id))}],
      table:{
        id:"reference-additions-table",caption:"Earlier reference component scenario; not a validated kit or quotation",
        columns:["Component","Quantity basis","Unit VND","Project VND","Limits"],
        rows:referenceAdditionRows,wide:true,
      },
    },
  ],
} satisfies ReportSection;

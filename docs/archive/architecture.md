# CITP website architecture

`website/` is the isolated Vite project. `src/main.tsx` mounts React Router in the single HTML shell. `src/reportRoutes.ts` is the ordered route manifest for routing, the contents menu, and previous and next links. Components under `src/components/` render the report layout and evidence elements. Each section owns its typed copy and evidence slots in `src/content/`. Keep related authoring evidence in the CSV registers under `website/content/`.

## Reading order

1. **Overview** (`/`) introduces the project and its audience, team and client.
2. **Background** (`/pages/background`) connects sourced Hanoi context and stakeholder priorities.
3. **Problem and criteria** (`/pages/problem-criteria`) turns the agreed scope and needs into measurable criteria.
4. **Design options and selection** (`/pages/design-options`) compares Hanoi Water Watch, citizen reports, and an AI-driven digital twin using the criteria.
5. **Detailed design** (`/pages/detailed-design`) explains the proposed system and traces decisions to the criteria.
6. **Prototyping** (`/pages/prototyping`) records the demonstration and evaluation, with explicit evidence types for simulation and measurement.
7. **Implementation** (`/pages/implementation`) covers the proposed pilot, operations and owners.
8. **Cost analysis** (`/pages/cost-analysis`) records sourced lifecycle costs and funding responsibilities.
9. **Other considerations** (`/pages/considerations`) addresses community, environmental and governance impacts.
10. **Recommendations** (`/pages/recommendations`) ties proposed next steps to findings and gaps.
11. **References** (`/pages/references`) provides the APA bibliography and source credits.
12. **Supporting documents** (`/pages/appendices`) houses the reverse brief, evidence, AI records and contribution declaration.

Sections 1–10 scaffold the content and stakeholder criterion. Consistent navigation, captions and plain English apply to all sections. Sections 11–12 and the citation links across the report support the referencing criterion.

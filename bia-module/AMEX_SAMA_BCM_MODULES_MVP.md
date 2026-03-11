# AMEX SAMA BCM Compliance - MVP Module Requirements

## Reference Codebase

**Reference Repository Path:** `/Users/parthc/Documents/Ascent/bse-demo-instance`
**Frontend Module:** `/Users/parthc/Documents/Ascent/bse-demo-instance/bia-module`

If you need BCM context, patterns, or existing implementations, refer to these key files:

| Reference | Path | What It Contains |
|-----------|------|------------------|
| Crisis Plans Wizard | `bia-module/src/app/crisis-plans/new/page.tsx` | Multi-step wizard pattern, form handling, NWC mock data |
| Crisis Plan Detail | `bia-module/src/app/crisis-plans/[id]/page.tsx` | Detail page with tabs, modal dialogs, status badges |
| Dependency Analysis | `bia-module/src/app/crisis-plans/dependency-analysis/page.tsx` | React Flow graph, BETH3V framework |
| Testing Module | `bia-module/src/app/testing/` | Test records, plan builder, report wizard |
| BIA Records | `bia-module/src/app/bia-records/` | CRUD patterns, approval workflows |
| Risk Assessment | `bia-module/src/app/risk-assessment/` | Multi-step wizard, dashboard components |
| Layout Component | `bia-module/src/components/BCMLayout.tsx` | Standard page layout wrapper |
| Navigation | `bia-module/src/components/Navigation.tsx` | Sidebar navigation structure |
| Types | `bia-module/src/types/` | TypeScript type definitions |

**Tech Stack:**
- Next.js 14.2.5 (App Router)
- TypeScript
- Tailwind CSS
- Heroicons (`@heroicons/react/24/outline`)
- React Flow (for graphs)

**Design Patterns:**
- Text sizes: `text-xs` body, `text-[10px]` labels, `text-sm` headings
- Cards: `bg-white border border-gray-200 rounded-sm`
- Primary color: Red (`bg-red-600`, `text-red-600`)
- Page wrapper: `h-full overflow-auto bg-gray-50`

---

## Project Context

**Client:** American Express (AMEX) Saudi Arabia
**Regulatory Framework:** SAMA Business Continuity Management Framework
**Objective:** Build minimal modules to make AMEX BCM program SAMA-compliant and audit-ready
**Constraint:** NO full compliance module - focus on BCM governance and program management only

---

## Existing AutoBCM Platform (Already Built)

The following modules already exist in `bia-module/src/app/`:

| Module | Path | SAMA Coverage |
|--------|------|---------------|
| BIA Records | `/bia-records` | 2.4 BIA & Risk Assessment ✅ |
| Risk Assessment | `/risk-assessment` | 2.4 BIA & Risk Assessment ✅ |
| Crisis Management Plans | `/crisis-plans` | 2.8 Crisis Management Plan ✅ |
| IT DR Plans | `/it-dr-plans` | 2.6 IT Disaster Recovery ✅ |
| Testing Module | `/testing` | 2.9 Testing ✅ |
| Call Trees | `/call-trees` | 2.11 Communication (Partial) |
| Libraries | `/libraries` | Assets, People, Vendors, Vital Records |
| Issues & Actions | `/issues` | Gap tracking |
| Cyber Crisis Dashboard | `/crisis-management` | 2.7 Cyber Resilience (Partial) |
| Reporting | `/reporting` | Executive dashboards |

---

## AMEX Requirements (From Client Email)

```
1. BCM Governance Charter Document with pre-defined template
2. BCMC Committee - members, roles, quorum, meeting frequency
3. Budget proposition and approval tracking
4. BCM Organizational Chart with approvals, qualifications, validity
5. Cross-functional BCM teams establishment
6. BCM Maturity Objectives tracking
7. BCM Strategic Objectives alignment with organizational objectives
8. Periodic BCM Tracker
9. Scope definition with exclusions and periodic approvals
10. Policy/Plan/CMP compliance and effectiveness checking
11. Key Risk Indicators (KRIs) with thresholds and trend reporting
12. Pre-defined KPIs for program implementation
13. Vendor reviews, dependency and agreement reviews
14. SAMA Annual Test Plan communications
15. Incident Report Management
```

---

## SAMA BCM Framework Gaps (What's Missing)

| SAMA Domain | Status | Gap |
|-------------|--------|-----|
| 2.1 BCM Governance | ❌ GAP | No governance, committee, charter management |
| 2.2 BCM Strategy | ❌ GAP | No maturity/strategic objectives tracking |
| 2.3 BC Policy | ❌ GAP | No scope/exclusions management |
| 2.11 Communication | ⚠️ PARTIAL | No SAMA reporting workflow |
| 2.12 Periodic Review | ❌ GAP | No review calendar/tracking |
| 2.13 Assurance | ❌ GAP | No KPI/KRI effectiveness measurement |

---

## MVP Modules to Build (4 Modules Only)

### Module 1: BCM Governance (`/bcm-governance`)

**Purpose:** Manage BCM program governance per SAMA 2.1

**MVP Scope - BUILD:**
- [ ] Governance Charter page with SAMA-compliant template
- [ ] Committee member registry (name, role, contact, qualifications)
- [ ] Meeting tracker (date, attendees, quorum status, minutes link)
- [ ] BCM Org Chart display with team assignments
- [ ] Simple approval workflow for charter

**DO NOT BUILD:**
- Complex workflow engine
- Document versioning system
- Budget management/financial tracking
- Training/certification management
- Integration with HR systems

**Pages to Create:**
```
/bcm-governance/page.tsx (Dashboard)
/bcm-governance/charter/page.tsx (Charter Builder)
/bcm-governance/committee/page.tsx (Committee Management)
/bcm-governance/org-chart/page.tsx (BCM Org Structure)
```

---

### Module 2: BCM Program Tracker (`/bcm-program`)

**Purpose:** Track maturity, strategy alignment, scope per SAMA 2.2, 2.3, 2.12

**MVP Scope - BUILD:**
- [ ] Maturity assessment (simple 1-5 scale per SAMA domain)
- [ ] Strategic objectives list with status tracking
- [ ] Scope definition with exclusions table
- [ ] Review calendar with due dates and status
- [ ] Basic approval for scope changes

**DO NOT BUILD:**
- Complex maturity models (ISO 22301 full assessment)
- Automated gap analysis
- AI-powered recommendations
- Integration with project management tools
- Detailed roadmap/Gantt charts

**Pages to Create:**
```
/bcm-program/page.tsx (Dashboard)
/bcm-program/maturity/page.tsx (Maturity Assessment)
/bcm-program/scope/page.tsx (Scope & Exclusions)
/bcm-program/reviews/page.tsx (Review Calendar)
```

---

### Module 3: KPI/KRI Dashboard (`/bcm-metrics`)

**Purpose:** Measure program effectiveness per SAMA 2.13

**MVP Scope - BUILD:**
- [ ] Pre-defined KPI cards (8-10 metrics max)
- [ ] KRI table with thresholds (Red/Amber/Green)
- [ ] Simple trend chart (last 6 months)
- [ ] Status indicators for each metric
- [ ] Export to PDF for audit

**Pre-defined KPIs (Hard-coded):**
1. BIA Completion Rate (%)
2. Risk Assessment Completion Rate (%)
3. BCP Coverage - Critical Processes (%)
4. Annual Test Completion (%)
5. Test Success Rate (%)
6. Document Review Compliance (%)
7. Vendor BCM Assessment Rate (%)
8. Training Completion Rate (%)

**DO NOT BUILD:**
- Custom KPI builder
- Complex analytics engine
- Benchmarking against peers
- Predictive analytics
- Real-time data integration
- Drill-down reports

**Pages to Create:**
```
/bcm-metrics/page.tsx (KPI/KRI Dashboard)
```

---

### Module 4: Incident Management (`/incidents`)

**Purpose:** Log and report incidents per SAMA 2.8, 2.11

**MVP Scope - BUILD:**
- [ ] Incident list with filters (status, severity, date)
- [ ] Create incident form (type, severity, description, impact)
- [ ] Incident detail view with timeline
- [ ] SAMA notification flag for Medium/High incidents
- [ ] Simple status workflow (Open → In Progress → Resolved → Closed)
- [ ] Post-incident report template

**DO NOT BUILD:**
- Real-time alerting/notifications
- Integration with monitoring tools
- Automated escalation rules
- SLA tracking
- Root cause analysis workflows
- Complex incident taxonomy

**Pages to Create:**
```
/incidents/page.tsx (Incident List)
/incidents/new/page.tsx (Create Incident)
/incidents/[id]/page.tsx (Incident Detail)
```

---


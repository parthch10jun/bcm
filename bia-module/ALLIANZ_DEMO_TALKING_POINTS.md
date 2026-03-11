# Allianz Demo - Key Talking Points & Differentiators

## 🎯 Opening Statement (30 seconds)

"Good morning, Allianz team. Today we're going to show you something fundamentally different from traditional BCM tools. What you're about to see is a platform where **Business Continuity and IT Service Continuity are not separate modules—they're two sides of the same coin**. When you complete a Business Impact Analysis, the IT recovery requirements automatically flow into your IT Disaster Recovery plans. When your IT infrastructure changes, your business impact analysis automatically updates. This is true integration, not just data sharing."

---

## 🔑 Core Differentiators (Memorize These)

### **1. Single Source of Truth Architecture**
**Traditional Tools:** "In most BCM tools, you define your IT applications in the BIA module, then re-enter them in the IT DR module, then again in the testing module. Three copies of the same data, three opportunities for inconsistency."

**AutoBCM:** "We have a **Libraries module** where you define each IT service, application, database, and infrastructure component **once**. Then you simply link to it from BIA, IT DR Plans, Crisis Plans, and Testing. Update once, propagate everywhere."

**Demo Moment:** Show how changing an RTO in the IT Service Catalog automatically updates the linked BIA and DR Plan.

---

### **2. Automated Business-to-IT Linkage**
**Traditional Tools:** "Most tools require manual mapping between business processes and IT systems. You fill out a form saying 'Payment Processing depends on SAP ERP,' but there's no intelligence behind it."

**AutoBCM:** "Our **Application Mapping** module automatically visualizes the entire dependency chain: Business Process → IT Application → Database → Infrastructure → DR Site. Click on any node, and we show you the upstream and downstream impact in real-time."

**Demo Moment:** Show the Application Mapping graph, click on "Primary Data Center," and watch the cascade effect highlight all dependent applications and business processes.

---

### **3. Real-Time Threat Intelligence Integration**
**Traditional Tools:** "Risk assessments are static documents updated quarterly. By the time you update your risk register, the threat landscape has already changed."

**AutoBCM:** "We integrate **MITKAT** (Multi-hazard Impact and Threat Knowledge Assessment Tool) which monitors global disasters, cyber threats, and geopolitical risks 24/7. When a threat is detected near your facilities, it automatically creates or updates risk assessments for both BCM and ITSCM."

**Demo Moment:** Show MITKAT 3D globe with live threat pins, then show how a cyber threat in Mumbai automatically updated the risk score for "Data Center Failure" risk.

---

### **4. Integrated Testing Across BCM + ITSCM**
**Traditional Tools:** "Business continuity teams test BCPs separately from IT teams testing DR plans. Results are stored in different systems, lessons learned are siloed."

**AutoBCM:** "Our **Testing Module** supports integrated tests—tabletop exercises that include both business stakeholders and IT teams, DR simulations that test both application failover and business process resumption. All results feed into a single dashboard."

**Demo Moment:** Show a tabletop exercise that tested both "Claims Processing BCP" and "Claims Management System DR Plan" together, with combined lessons learned.

---

### **5. ISO 22301 + ISO 27001 Dual Compliance**
**Traditional Tools:** "Most BCM tools focus on ISO 22301 (Business Continuity). IT teams need separate tools for ISO 27001 Annex A.17 (IT Service Continuity)."

**AutoBCM:** "We're built for **dual compliance**. Our ITSCM module directly maps to ISO 27001 Annex A.17 requirements, while our BCM modules cover ISO 22301. One platform, two certifications."

**Demo Moment:** Show compliance tracking dashboard with both ISO 22301 and ISO 27001 status side-by-side.

---

## 📊 Specific Metrics to Highlight

### **Coverage Metrics:**
- "You have **45 IT services** supporting your critical business processes. Our platform shows that **38 of them (84%)** have published IT DR plans. The 7 gaps are automatically highlighted with recommended actions."

### **RTO Compliance:**
- "For Tier 1 services requiring 4-hour RTO, you're achieving **95% compliance**. For Tier 2 services (8-hour RTO), you're at **88%**. The platform automatically flags the 3 services that are non-compliant and shows you exactly what needs to be improved."

### **Testing Frequency:**
- "In the last 12 months, you've tested **71% of your IT DR plans**. Industry benchmark is 60%. The platform tracks which plans are overdue for testing and auto-generates test schedules."

### **BCM-ITSCM Alignment:**
- "**92% of your critical business processes** have linked IT recovery plans. This means when a business process owner updates their RTO requirement, the IT team is automatically notified to review the DR plan."

---

## 🎬 Demo Flow - Key Moments

### **Act 1: BCM Lifecycle (Show the Foundation)**

**BIA Module:**
- "Here's a completed BIA for 'Claims Processing'—a Tier 1 process requiring 4-hour RTO and 1-hour RPO."
- "Notice the dependencies: Claims Management System, Oracle Database, Document Management System—all linked from our Libraries, not manually typed."
- "The system automatically calculated that this process supports €50M in daily revenue and affects 1,200 customers per day."

**Risk Assessment:**
- "Here's a risk assessment for 'IT System Failure' with inherent risk score of 16 (High)."
- "After applying controls—redundant data center, automated failover, 24/7 monitoring—residual risk drops to 6 (Medium)."
- "This risk is automatically linked to 3 business processes and 5 IT services."

**BCP Creation:**
- "When we create a BCP for Claims Processing, watch what happens: the system auto-populates the recovery team from People Library, the alternate workspace from Locations Library, and the IT dependencies from the BIA."
- "Zero manual data entry. Just validate and approve."

---

### **Act 2: ITSCM Lifecycle (Show the Integration)**

**ITSCM Dashboard:**
- "This is your IT Service Continuity command center. At a glance: 84% coverage, 24 application recovery plans, 12 infrastructure recovery plans."
- "RTO compliance by tier is color-coded: green for compliant, amber for at-risk, red for non-compliant."
- "Last DR test was 15 days ago with 95% success rate."

**IT Service Catalog:**
- "Here's your complete IT service inventory with continuity attributes."
- "See 'SAP ERP System'? Tier 1, 4-hour RTO, Hot Site recovery strategy, linked to BIA-001 and DR-001."
- "The 'Gap' column shows No—meaning current recovery capability meets the business requirement."
- "Now look at 'Legacy Reporting System': Gap shows Yes—business needs 8-hour RTO, but current capability is 24 hours. Action required."

**Application Mapping:**
- "This is where the magic happens. Visual dependency mapping from business to infrastructure."
- "Let me click on 'Primary Data Center Mumbai'... watch the cascade: 3 buildings, 12 equipment items, 8 applications, 15 business processes—all highlighted in red."
- "Now I click 'Create Crisis Plan from Analysis' and all these affected resources auto-populate into a new crisis plan. No spreadsheets, no manual mapping."

**IT DR Plans:**
- "Here's the Application Recovery Plan for SAP ERP."
- "Recovery procedures are phase-based: Detection (10 min) → Failover (30 min) → Validation (1 hour) → Notification (5 min)."
- "Each phase has detailed runbooks with step-by-step instructions, responsible teams, and success criteria."
- "This plan is linked to the BIA, so when the business changes their RTO requirement, we get an automatic alert to review this plan."

**DR Simulation:**
- "Let me run a live simulation of 'Data Center Failure.'"
- "Watch the automated steps: Monitoring detects outage → NOC confirms → Failover initiated → DR site activated → Applications restored → Users notified."
- "Real-time RTO tracking: we're at 45 minutes, target is 4 hours—well within compliance."
- "All actions are timestamped for audit trail."

---

### **Act 3: Integrated Reporting & Testing (Show the Value)**

**Integrated Reporting:**
- "This dashboard combines BCM and ITSCM metrics in one view."
- "BCM side: 87% BIA completion, 12 high-priority risks, 95% critical processes covered."
- "ITSCM side: 84% IT service coverage, 95% RTO compliance, 71% tested in last 12 months."
- "BCM-ITSCM Alignment: 92% of business processes have linked IT recovery plans—this is the integration metric that matters."

**Testing Module:**
- "Last tabletop exercise: 'Ransomware Attack Scenario'—tested both business response (Crisis Management Plan) and IT response (Cyber Incident Response Plan) together."
- "Results: 8 action items identified, 6 already resolved, 2 in progress."
- "Next test scheduled: Full DR site activation in 30 days."

**Dependency Graph:**
- "This is our BETH3V framework: Buildings → Equipment → Technology → Human Resources → Third-party Vendors → Vital Records."
- "Let me simulate a failure... click 'Data Center A'... watch the impact propagate through the entire organization."
- "Total impact: 15 critical processes, 1,200 employees affected, €50M daily revenue at risk."
- "This intelligence feeds directly into crisis planning and executive dashboards."

---

## 🎤 Closing Statement (1 minute)

"Allianz, what you've seen today is not just a BCM tool with an IT module added on. This is a **unified platform** where business continuity and IT service continuity are deeply integrated. 

When your business needs change, your IT recovery plans automatically adapt. When your IT infrastructure changes, your business impact analysis automatically updates. When a threat emerges, both BCM and ITSCM risk assessments are updated in real-time.

This is the platform that eliminates silos, reduces manual work, and ensures that your business continuity program and IT disaster recovery program are always in sync—which is exactly what ISO 22301 and ISO 27001 require.

We're ready to support Allianz globally, with scalable architecture, role-based access for both business and IT stakeholders, and a licensing model that grows with your needs.

What questions can we answer for you?"

---

## ❓ Anticipated Questions & Answers

### **Q: "How does this integrate with our existing ITSM tools like ServiceNow?"**
**A:** "Great question. We have REST APIs that can integrate with ServiceNow, Jira, and other ITSM platforms. For example, when an incident is created in ServiceNow, it can automatically trigger a crisis plan activation in our platform. Similarly, our IT DR plans can push recovery tasks to ServiceNow for tracking. We can discuss specific integration requirements in a technical deep-dive."

### **Q: "What about data residency for global deployment?"**
**A:** "The platform can be deployed in multiple ways: cloud (AWS/Azure with region selection), on-premise, or hybrid. For Allianz's global operations, we typically recommend a regional deployment model—EU instance for European operations, APAC instance for Asia-Pacific, etc.—with centralized reporting. All data stays within your specified regions to meet GDPR and local data protection requirements."

### **Q: "How long does implementation typically take?"**
**A:** "For an organization of Allianz's size, we typically see: 2-4 weeks for platform setup and configuration, 4-6 weeks for data migration from existing tools, 2-3 weeks for user training, and 2 weeks for parallel run. Total: 10-15 weeks to full production. We can accelerate this with dedicated resources."

### **Q: "What's the licensing model?"**
**A:** "We offer flexible licensing: per-user (for smaller deployments), per-business-unit (for large enterprises), or enterprise-wide (unlimited users). Pricing includes platform license, support, updates, and MITKAT threat intelligence feed. We can provide a detailed quote based on your user count and deployment model."

### **Q: "Can we customize workflows and templates?"**
**A:** "Absolutely. The platform has a no-code workflow builder—you can customize BIA workflows, BCP templates, DR plan structures, and testing procedures without touching code. For more complex customizations, we offer professional services. Most customers achieve 80% of their customization needs through the no-code tools."

---

**Document Owner:** Parth  
**Last Updated:** 2026-03-11  
**Status:** Ready for Demo


# Allianz ITSCM Demo Walkthrough Guide

## 🎯 Demo Objective
Demonstrate a **high-maturity ITSCM platform** that integrates Business Continuity Management (BCM), IT Service Continuity Management (ITSCM), and operational IT management—mirroring the ServiceNow ecosystem while addressing Allianz's regulatory requirements (DORA, BaFin BAIT, ISO 27031:2025).

---

## 📋 Pre-Demo Setup Checklist

- [ ] Application running on http://localhost:3004
- [ ] Browser window ready (recommend full screen)
- [ ] This walkthrough guide open on second screen
- [ ] Terminology reference section bookmarked
- [ ] Sample incident INC-2024-001 ready to demonstrate

---

## 🗺️ Demo Flow (45-60 minutes)

### **PHASE 1: Strategic Context (5 min)**
**Goal**: Establish why ITSCM matters to Allianz

#### Page: **Home Dashboard** (`/`)

**Speaking Notes**:
> "Welcome to AutoResilience, our ITSCM platform designed specifically for financial institutions like Allianz. Before we dive into the technical capabilities, let me frame why this matters:
>
> Under DORA and BaFin BAIT, Allianz must demonstrate that IT failures won't cascade into business disruptions. Traditional BCM treats IT as a 'black box'—we know the business needs the policy administration system, but we don't know *how* to recover it if the database fails.
>
> This platform bridges that gap. It connects three worlds:
> 1. **Business requirements** (what the business needs to survive)
> 2. **IT capabilities** (what IT systems deliver those needs)
> 3. **Operational reality** (what's actually happening right now)
>
> Let me show you how this works in practice."

**Key Metrics to Highlight**:
- Total BIA Records: Shows enterprise-wide coverage
- IT Services Cataloged: Demonstrates IT inventory maturity
- Active DR Plans: Proves preparedness
- Recent Incidents: Shows operational integration

---

### **PHASE 2: Business Impact Analysis (10 min)**
**Goal**: Show how business requirements drive IT strategy

#### Page: **BIA Records** (`/bia-records`)

**Speaking Notes**:
> "Everything starts with understanding business impact. Let's look at our BIA module—this is where business units tell us what they need to survive a disruption."

**Demo Actions**:
1. **Filter by Business Unit**: Select "Retail Banking"
2. **Point out RTO/RPO columns**: "These aren't IT preferences—these are business requirements"
3. **Click on BIA-2024-001** (Policy Administration)

#### Page: **BIA Detail** (`/bia-records/BIA-2024-001`)

**Speaking Notes**:
> "This BIA tells us that Policy Administration must be recovered within 4 hours (RTO) with no more than 15 minutes of data loss (RPO). Why? Because after 4 hours, we can't issue new policies, and that costs Allianz €50,000 per hour.
>
> Now, here's the critical link—scroll down to 'Supporting IT Services'."

**Key Point**:
> "See how this business process depends on three IT services: Core Insurance Platform, Customer Database, and Payment Gateway. This is the **dependency mapping** that ISO 27031 requires. If any of these IT services fail, this business process fails."

**Click**: "Core Insurance Platform" link

---

### **PHASE 3: IT Service Catalog (8 min)**
**Goal**: Show the technical layer that supports business processes

#### Page: **IT Service Detail** (`/libraries/it-services/SVC-001`)

**Speaking Notes**:
> "Now we're in the IT Service Catalog—this is the CMDB (Configuration Management Database) that tracks every IT service Allianz runs.
>
> Notice the 'Tier 1 - Mission Critical' classification. This isn't arbitrary—it's derived from the BIA. Because Policy Administration needs 4-hour RTO, and this service supports it, we automatically classify it as Tier 1.
>
> Look at the 'Technical Components' section—this service runs on 12 servers, 3 databases, and depends on the network infrastructure. If any of these fail, we have an incident."

**Navigate to**: Dependencies tab

**Speaking Notes**:
> "This is the 5-layer dependency model—BETH3V:
> - **Business Process**: Policy Administration
> - **IT Service**: Core Insurance Platform
> - **Application**: SAP Insurance Suite
> - **Technology**: Oracle Database, Linux servers
> - **Vendor**: SAP, Oracle
>
> This is how we do **cascading impact analysis**. If Oracle has an outage, we can instantly see which business processes are affected."

---

### **PHASE 4: Application Impact Analysis (AIA) (7 min)**
**Goal**: Demonstrate the technical BIA workflow

#### Page: **New AIA Workflow** (`/bia-records/new-aia`)

**Speaking Notes**:
> "Now let me show you something unique—the Application Impact Analysis, or AIA. This is the 'technical BIA' that ISO 27031:2025 requires.
>
> Traditional BIA asks: 'What does the business need?' AIA asks: 'What does IT need to deliver that?'
>
> Let's walk through the 7-step workflow:"

**Demo Actions** (click through tabs):
1. **Preparation & Scoping**: "We're analyzing the Core Insurance Platform"
2. **Asset Inventory**: Click "Load Sample Data"
   - "See—5 applications, 3 databases, 12 servers, all inventoried"
3. **Dependency Mapping**:
   > "This is the magic. If the Oracle Production DB fails, it impacts Policy Issuance, Claims Processing, and Customer Portal. Three business processes, one technical failure. This is what regulators want to see."
4. **Recovery Requirements**:
   > "Based on the business BIA, we inherit the 4-hour RTO. But now we break it down technically: Database restore = 2 hours, Application restart = 1 hour, Testing = 1 hour. Total = 4 hours. This is our recovery blueprint."

---

### **PHASE 5: IT DR Plans (10 min)**
**Goal**: Show how requirements translate into executable plans

#### Page: **IT DR Plans** (`/it-dr-plans`)

**Speaking Notes**:
> "Now we have the requirements—let's see the plans. These are the IT Disaster Recovery Plans that operationalize everything we've discussed."

**Filter**: Select "ARP - Application Recovery Plan"

**Click**: BCP-004 (Core Insurance Platform ARP)

#### Page: **DR Plan Detail** (`/it-dr-plans/BCP-004`)

**Speaking Notes**:
> "This is an Application Recovery Plan—one of four types we maintain:
> - **ARP**: Recover a specific application (like this one)
> - **IRP**: Recover infrastructure (data center, network)
> - **DRP**: Recover data (database restore, backup)
> - **CIRP**: Respond to cyber incidents (ransomware, breach)
>
> Notice the 'Recovery Strategy': Active-Active. Why? Because this is Tier 1, and Tier 1 gets the most expensive, most resilient strategy—two data centers running simultaneously.
>
> Scroll to 'Recovery Procedures'—these are the actual runbooks. Step-by-step instructions for the IT team."

**Navigate to**: Approvals tab

**Speaking Notes**:
> "Here's something critical for governance—the approval workflow. This plan was approved by:
> 1. IT Manager (technical feasibility)

## 📚 Terminology Reference Guide

### **Core ITSCM Terms**

| Term | Definition | When to Use |
|------|------------|-------------|
| **ITSCM** | IT Service Continuity Management - ensuring IT services can be recovered after disruption | "ITSCM is the bridge between business continuity and IT operations" |
| **BCM** | Business Continuity Management - ensuring business processes survive disruptions | "BCM focuses on business processes; ITSCM focuses on the IT that supports them" |
| **BIA** | Business Impact Analysis - assessment of business process criticality and recovery requirements | "The BIA tells us what the business needs; the AIA tells us how IT delivers it" |
| **AIA** | Application Impact Analysis - technical BIA for IT systems (ISO 27031 term) | "AIA is the 'technical BIA'—it maps IT dependencies to business requirements" |
| **RTO** | Recovery Time Objective - maximum acceptable downtime | "4-hour RTO means we must restore service within 4 hours of failure" |
| **RPO** | Recovery Point Objective - maximum acceptable data loss | "15-minute RPO means we can lose at most 15 minutes of transactions" |
| **CMDB** | Configuration Management Database - inventory of all IT assets and their relationships | "The CMDB is our 'single source of truth' for what IT owns and how it connects" |
| **DR** | Disaster Recovery - process of restoring IT systems after catastrophic failure | "DR is the technical execution; BC is the business coordination" |

### **Plan Types (ISO 27031 Framework)**

| Plan Type | Acronym | Purpose | Example |
|-----------|---------|---------|---------|
| **Application Recovery Plan** | ARP | Restore a specific application | "If SAP goes down, follow ARP-SAP-001" |
| **Infrastructure Recovery Plan** | IRP | Restore infrastructure (network, data center) | "If Frankfurt DC fails, follow IRP-DC-FRA" |
| **Data Recovery Plan** | DRP | Restore databases and data | "If Oracle DB corrupts, follow DRP-ORA-PROD" |
| **Cyber Incident Response Plan** | CIRP | Respond to cyber attacks | "If ransomware detected, follow CIRP-RANSOMWARE" |

### **Service Tiers (Recovery Strategy)**

| Tier | Criticality | RTO Target | Strategy | Cost |
|------|-------------|------------|----------|------|
| **Tier 1** | Mission Critical | < 4 hours | Active-Active (dual data centers) | €€€€ |
| **Tier 2** | Business Critical | 4-24 hours | Warm Site (standby ready) | €€€ |
| **Tier 3** | Important | 1-3 days | Cold Site (restore from backup) | €€ |
| **Tier 4** | Non-Critical | > 3 days | Deferred (restore when possible) | € |

**Speaking Tip**: "Tier 1 is like having two cars running—if one breaks, you're already in the other. Tier 3 is like having a spare tire—you need time to change it."

### **Dependency Model (BETH3V)**

| Layer | Stands For | Example | Why It Matters |
|-------|------------|---------|----------------|
| **B** | Business Process | Policy Administration | "What the business does" |
| **E** | Enterprise Service | Core Insurance Platform | "What IT service delivers it" |
| **T** | Technology/Application | SAP Insurance Suite | "What software runs it" |
| **H** | Hardware/Infrastructure | Oracle DB, Linux servers | "What hardware hosts it" |
| **3** | Third-Party/Vendor | SAP, Oracle, AWS | "Who we depend on" |
| **V** | Vital Records/Data | Policy database, customer records | "What data we can't lose" |

**Speaking Tip**: "BETH3V is how we answer: 'If this server fails, which business processes stop?' We trace up the stack."

### **Regulatory Frameworks**

| Regulation | Scope | Key Requirement | How We Address It |
|------------|-------|-----------------|-------------------|
| **DORA** | EU financial services | ICT risk management, incident reporting, testing | BIA module, Incident Management, Testing module |
| **BaFin BAIT** | German banks/insurers | IT risk management, emergency plans, outsourcing | IT DR Plans, Vendor tracking, Approval workflows |
| **ISO 27031** | Global standard | IT-specific BIA, dependency mapping, IT internal ops | AIA workflow, BETH3V model, IT Internal Operations BIA |
| **ISO 22301** | Global BCM standard | BIA, BC plans, testing, continuous improvement | BIA Records, DR Plans, Testing, Action tracking |

### **Incident Management Terms**

| Term | Definition | Example |
|------|------------|---------|
| **SLA** | Service Level Agreement - promised response/resolution time | "Critical incidents: 1-hour response, 4-hour resolution" |
| **Priority** | Urgency + Impact = Priority (how fast we respond) | "Database down + 1000 users affected = Critical priority" |
| **Escalation** | Moving incident to higher authority/expertise | "After 2 hours unresolved, escalate to IT DR Team" |
| **Workaround** | Temporary fix while root cause is addressed | "Restart server every hour until memory leak is patched" |
| **Root Cause** | Underlying reason for incident | "Memory leak in application code caused connection pool exhaustion" |

### **Approval Workflow Roles**

| Role | Responsibility | What They Approve |
|------|----------------|-------------------|
| **IT Manager** | Technical feasibility | "Can we actually execute this plan with our resources?" |
| **CISO** | Security review | "Does this plan introduce security risks?" |
| **CIO** | Budget & strategy | "Is this investment aligned with IT strategy?" |
| **Board** | Strategic alignment | "Is this risk acceptable at enterprise level?" |

---

## 🎬 Demo Scenarios (Alternative Flows)

### **Scenario A: "Show me how you handle a ransomware attack"**

**Path**: Home → Incident Management → INC-2024-003 (Ransomware Detected) → Linked CIRP → Crisis Management

**Speaking Notes**:
> "Great question. Let me show you a cyber incident. [Navigate to INC-2024-003]
>
> This incident was detected by our SOC at 3 AM—ransomware on a file server. Notice:
> - **Priority**: Critical (because it could spread)
> - **Triggered DR Plan**: CIRP-RANSOMWARE-001 (Cyber Incident Response Plan)
> - **Linked BIA**: Multiple (because we don't know spread yet)
>
> The CIRP has a specific playbook:
> 1. Isolate affected systems (network segmentation)
> 2. Activate Cyber Crisis Team (CISO, Legal, Comms, IT)
> 3. Assess spread (forensics)
> 4. Restore from clean backups (DRP)
> 5. Notify regulators (DORA requires 24-hour reporting)
>
> This is the integration—operational incident triggers strategic response."

### **Scenario B: "How do you prioritize which systems to recover first?"**

**Path**: BIA Records → Sort by RTO → Show tiering logic

**Speaking Notes**:
> "Excellent question—this is where the BIA drives everything. [Navigate to BIA Records, sort by RTO ascending]
>
> See this list? It's sorted by RTO—shortest first. This is our recovery priority:
> 1. **Core Insurance Platform** (4-hour RTO) - Tier 1
> 2. **Customer Portal** (8-hour RTO) - Tier 2
> 3. **Reporting System** (24-hour RTO) - Tier 3
>
> In a disaster, we don't guess—we follow this list. The business has already told us what matters most via the BIA.
>
> And notice the 'Financial Impact' column—Policy Administration costs €50K/hour, Reporting costs €5K/hour. We recover the expensive stuff first."

### **Scenario C: "What if a vendor fails?"**

**Path**: Libraries → Vendors → SAP → Dependencies → Show cascading impact

**Speaking Notes**:
> "Let me show you third-party risk. [Navigate to Vendors → SAP]
>
> SAP is a critical vendor—we run our core insurance platform on their software. Look at the 'Dependencies' tab:
> - **Supported IT Services**: 5 services depend on SAP
> - **Affected Business Processes**: 12 processes would fail
> - **Estimated Impact**: €200K/hour if SAP is unavailable
>
> This is why we have:
> 1. **Vendor SLAs**: SAP must respond within 2 hours
> 2. **Escrow Agreements**: We have source code in escrow
> 3. **Alternative Vendors**: We've pre-qualified a backup (though migration would take months)
>
> DORA requires this level of third-party risk management."

---

## 🚨 Common Pitfalls to Avoid

### **1. Don't Oversell**
❌ "This replaces ServiceNow"
✅ "This complements ServiceNow by adding ITSCM-specific workflows"

### **2. Don't Get Lost in Technical Details**
❌ "The React frontend uses Next.js 14 with TypeScript and Tailwind..."
✅ "The interface is designed for high-density information—you can see more data with less scrolling"

### **3. Don't Skip the 'Why'**
❌ [Just clicking through screens]
✅ "Let me show you why this matters: If this database fails, Allianz loses €50K/hour. That's why we invest in Tier 1 recovery."

### **4. Don't Ignore Questions**
❌ "Let me finish the demo first, then we'll do Q&A"
✅ "Great question—let me show you that right now" [navigate to relevant page]

### **5. Don't Assume Knowledge**
❌ "As you know, BETH3V dependency mapping is critical for..."
✅ "BETH3V is our dependency model—it stands for Business, Enterprise service, Technology, Hardware, Third-party, Vital records. Let me show you how it works..."



---

## 📊 Success Metrics (What "Good" Looks Like)

### **During Demo**
- ✅ Stakeholders ask clarifying questions (engagement)
- ✅ Someone says "Can we see that again?" (interest)
- ✅ Discussion shifts to "How would this work for us?" (buying signal)
- ✅ Technical and business stakeholders both engaged (cross-functional appeal)

### **After Demo**
- ✅ Request for follow-up meeting (next step)
- ✅ Questions about implementation timeline (serious interest)
- ✅ Request to involve additional stakeholders (expanding scope)
- ✅ Discussion of pilot/POC (commitment signal)

---

## 🎯 Closing Statement

**Speaking Notes**:
> "To summarize: This platform gives Allianz three things:
>
> 1. **Regulatory Compliance**: DORA, BaFin BAIT, ISO 27031—all requirements mapped and tracked
> 2. **Operational Integration**: Your incidents, your BIAs, your DR plans—all connected in real-time
> 3. **Executive Visibility**: The Board can see IT resilience posture without reading 500-page documents
>
> The question isn't 'Do we need ITSCM?'—regulations answer that. The question is: 'Do we build it ourselves, buy ServiceNow, or use a purpose-built platform like this?'
>
> I'd love to discuss next steps. What questions do you have?"

---

## 📞 Next Steps (Call to Action)

1. **Immediate**: Share demo recording and this walkthrough guide
2. **Week 1**: Schedule technical deep-dive with IT team
3. **Week 2**: Schedule compliance review with Risk/Audit team
4. **Week 3**: Proposal for pilot (one business unit, 3 months)
5. **Month 2**: Pilot kickoff

---

## 🎓 Quick Reference Card (Print This!)

### **Demo Navigation Cheat Sheet**

| What to Show | URL | Key Talking Point |
|--------------|-----|-------------------|
| **Overview** | `/` | "This is your ITSCM command center" |
| **BIA List** | `/bia-records` | "Business requirements drive everything" |
| **BIA Detail** | `/bia-records/BIA-2024-001` | "€50K/hour—that's why we care" |
| **IT Service** | `/libraries/it-services/SVC-001` | "This is the CMDB—what IT owns" |
| **AIA Workflow** | `/bia-records/new-aia` | "Technical BIA—ISO 27031 requirement" |
| **DR Plans** | `/it-dr-plans` | "Plans that actually work" |
| **DR Plan Detail** | `/it-dr-plans/BCP-004` | "Active-Active for Tier 1" |
| **Approvals** | `/it-dr-plans/BCP-001/approvals` | "Board-level oversight" |
| **Incidents** | `/itsm/incidents` | "Operational reality" |
| **Incident Detail** | `/itsm/incidents/INC-2024-001` | "€100K impact—linked to BIA" |
| **IT Internal Ops** | `/libraries/it-internal-operations` | "IT needs its own BIA" |
| **Testing** | `/testing` | "Plans are tested, not theoretical" |

### **Key Numbers to Remember**

- **23** total incidents (shows operational volume)
- **€50,000/hour** revenue loss (Policy Administration)
- **4-hour RTO** (Tier 1 requirement)
- **15-minute RPO** (data loss tolerance)
- **€2.5M** investment (Active-Active infrastructure)
- **12-18 months** to full maturity
- **3 months** pilot duration

### **Regulatory Soundbites**

- **DORA**: "We track ICT incidents, test quarterly, and manage third-party risk"
- **BaFin BAIT**: "We have BIAs, approved DR plans, and annual testing"
- **ISO 27031**: "We do technical BIAs (AIA), map dependencies (BETH3V), and track IT's own resilience"
- **ISO 22301**: "We have the full BCM lifecycle—BIA, plans, testing, improvement"

---

**Good luck with your demo! 🚀**

*Remember: You're not selling software—you're solving a regulatory and operational problem. Focus on the "why" before the "how."*



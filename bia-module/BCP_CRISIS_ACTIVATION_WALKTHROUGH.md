# Crisis Response Platform - Customer Walkthrough

## Overview

This guide shows you how the platform manages a crisis from detection through resolution, focusing on the practical features: notifications, call tree activation, and continuity plan execution.

---

## The Crisis Response Flow

When a crisis occurs, the platform provides three core capabilities:

1. **Automated Notifications** - The right people are alerted immediately
2. **Call Tree Activation** - Communication cascades through your organization
3. **Continuity Plan Execution** - Pre-defined response steps guide your team

Let me walk you through how this works.

---

## Step 1: A Crisis is Declared

**Where**: Crisis Management Dashboard (`/crisis-management`)

When a crisis occurs (e.g., data center outage, cyber attack, natural disaster), someone with authority declares it in the system.

**What you see on screen:**

- Crisis severity level (Critical/High/Medium/Low)
- Crisis type (IT Disruption, Cyber Attack, Natural Disaster, etc.)
- Brief description of what happened
- Timestamp of when it was declared

**Example:**
```
Crisis Type: IT Service Disruption
Severity: Critical
Description: Primary data center power failure affecting core systems
Declared: 2024-11-15 14:30
Status: Active
```

Once declared, the system automatically triggers the next steps.

---

## Step 2: Automatic Notifications Go Out

**Where**: Happens automatically in the background

The moment the crisis is declared, the platform sends notifications to everyone who needs to know:

**Who gets notified:**
- Crisis management team members
- Department heads affected by the crisis
- IT team leads
- Executive leadership
- Anyone designated in the crisis plan

**How they're notified:**
- In-platform notification (shows up in their bell icon)
- Email notification
- SMS (if configured)

**What the notification says:**
```
CRISIS ALERT: IT Service Disruption

A Critical crisis has been declared:
Primary data center power failure affecting core systems

Your role: Crisis Team Member
Action required: Review crisis details and standby for call tree activation

View Crisis → [Link]
```

The notifications include direct links to the crisis page so people can immediately see what's happening and what they need to do.

---

## Step 3: Call Tree is Activated

**Where**: Call Trees page (`/call-trees`) or from Crisis Plan

This is where the communication cascade begins. The call tree ensures everyone is contacted in the right order.

**What is a call tree?**

It's a pre-defined contact sequence:
- Person A calls Person B and Person C
- Person B calls Person D and Person E
- Person C calls Person F and Person G
- And so on...

**What you see in the platform:**

The call tree shows:
- Who needs to call whom
- What to say (talking points)
- How long to wait before escalating
- Status: Not Started / In Progress / Completed

**Example call tree for "IT Crisis Response":**
```
Level 1: Crisis Commander
  ↓ Calls (within 5 min):

Level 2: IT Director, Business Continuity Manager
  ↓ Each calls (within 10 min):

Level 3: Infrastructure Lead, Security Lead, Application Lead, Facilities Manager
  ↓ Each calls (within 15 min):

Level 4: On-call engineers, backup coordinators, vendor contacts
```

**What happens:**
- Each person checks off their calls as they complete them
- If someone doesn't respond within the timeout, the system escalates
- The platform tracks progress in real-time
- Crisis commander can see who's been reached and who hasn't

**Practical benefit:** Instead of the crisis manager calling 20 people manually, the communication spreads quickly through your organization with everyone knowing their role.

---

## Step 4: Continuity Plan is Opened

**Where**: Crisis Plans page (`/crisis-plans/[id]`)

Now that everyone is notified and gathered, the team opens the relevant continuity plan.

**What is the continuity plan?**

It's your pre-written playbook for this specific crisis scenario. It contains:
- **Activation criteria** - How do we know we need this plan?
- **Response team** - Who does what?
- **Response phases** - Step-by-step actions to take
- **Dependencies** - What resources we need (BETH3V)
- **Communication templates** - What to tell customers, regulators, media

**What you see on screen:**

### **Plan Header:**
```
Plan: Data Center Failover Continuity Plan
Scenario: Primary data center loss
Severity: Critical
Owner: IT Continuity Manager
Status: ACTIVATED
Activated: 2024-11-15 14:35
```

### **Response Team Section:**
Shows who's responsible for what:
```
Crisis Commander: John Smith (Primary) | Jane Doe (Alternate)
IT Recovery Lead: Mike Johnson
Communications Lead: Sarah Williams
Business Liaison: Tom Brown
```

Everyone can see their role and contact information for the rest of the team.

### **Response Phases:**

The plan is broken into phases with specific actions:

**Phase 1: Detection & Assessment (0-15 min)**
- ☑ Confirm scope of outage
- ☑ Notify crisis team (done via call tree)
- ☐ Assess affected systems
- ☐ Establish incident command center

**Phase 2: Initial Response (15-60 min)**
- ☐ Activate backup data center
- ☐ Reroute network traffic
- ☐ Notify affected business units
- ☐ Begin customer communication

**Phase 3: Recovery Operations (1-4 hours)**
- ☐ Restore critical services
- ☐ Verify data integrity
- ☐ Resume business operations
- ☐ Update stakeholders hourly

**Phase 4: Stabilization (4-8 hours)**
- ☐ Confirm all services operational
- ☐ Debrief crisis team
- ☐ Document timeline and actions taken
- ☐ Prepare after-action review

Each checkbox can be marked complete as the team progresses. Everyone looking at the plan sees the same status in real-time.

---

## Step 5: Team Executes the Plan

**Where**: Same crisis plan page

The crisis team works through the action items. The platform helps by:

**Tracking progress:**
- Team members check off items as they complete them
- Everyone sees what's done and what's pending
- No confusion about "did someone already call the vendor?"

**Showing dependencies:**
- If an action requires equipment, the system shows what's needed
- If it requires a vendor, their contact info is right there
- If it requires access to a building, that's documented

**Timing guidance:**
- Each phase has a time window (e.g., "15-60 min")
- The platform shows elapsed time since activation
- Team can see if they're on track or falling behind

**Example of what you see:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 2: Initial Response
Started: 14:45 | Target Duration: 45 minutes
Progress: 2 of 4 actions complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Activate backup data center
   Completed by: Mike Johnson at 14:52

✅ Reroute network traffic
   Completed by: Infrastructure Team at 14:58

⏳ Notify affected business units (IN PROGRESS)
   Assigned to: Sarah Williams
   Started: 15:00

⏹ Begin customer communication (PENDING)
   Assigned to: Communications Team
   Dependencies: Executive approval required
```

---

## Step 6: Communication is Managed

**Where**: Crisis plan - Communication section

The plan includes pre-written communication templates so your team doesn't have to write messages from scratch during a crisis.

**Internal communication template:**
```
Subject: URGENT: Data Center Incident Update

All Staff,

We are currently experiencing a data center outage affecting [systems].
Our crisis team is actively working on restoration.

Expected impact:
- [List affected services]

Expected restoration: [Time]

What you should do:
- [Specific instructions]

Next update: [Time]

Crisis Management Team
```

**Customer communication template:**
```
We are currently experiencing technical difficulties affecting some of our services.
Our team is working to resolve the issue as quickly as possible.

Affected services: [List]
Expected resolution: [Time]

We apologize for any inconvenience.
```

**Regulator notification template:**
```
Incident Type: [Type]
Severity: [Level]
Start Time: [Time]
Systems Affected: [List]
Customer Impact: [Number] customers
Recovery Status: [Status]
Estimated Resolution: [Time]
Next Update: [Time]
```

These templates can be customized with the actual details and sent out quickly without starting from a blank page.

---

## Step 7: Crisis Resolution

**Where**: Crisis management dashboard

Once the situation is under control:

**Mark crisis as resolved:**
- Team confirms all critical services restored
- Crisis commander marks the crisis as "Resolved"
- System records the total duration
- All participants are notified

**What gets captured:**
```
Crisis: Data Center Power Failure
Duration: 3 hours 25 minutes
Services Restored: 100%
Team Members Involved: 12
Actions Completed: 18 of 18

Status: RESOLVED
Resolved By: John Smith
Resolved At: 2024-11-15 17:55
```

**After-action items created:**
- "Review backup power system reliability"
- "Update vendor SLA for faster response"
- "Improve failover automation"
- "Schedule crisis team debrief meeting"

These action items are tracked separately to ensure lessons learned are implemented.

---

## Summary: What the Platform Does for You

When a crisis hits, you don't want to be scrambling to find phone numbers or figuring out what to do. The platform gives you:

**1. Instant Notifications**
- Everyone who needs to know is alerted immediately
- No one is left out of the loop

**2. Organized Communication**
- Call tree ensures systematic contact cascade
- No duplicate calls, no missed people
- Real-time tracking of who's been reached

**3. Clear Action Plan**
- Step-by-step procedures already documented
- Everyone knows what to do and who's doing it
- Progress tracked in real-time

**4. Ready-to-Use Templates**
- Communication messages pre-written
- Just fill in the specific details and send
- Regulatory notifications prepared

**5. Complete Documentation**
- Everything is automatically logged
- Timeline of actions captured
- Basis for post-crisis review and improvement

---

## Demo Navigation Guide

To show this to a customer:

1. **Start here**: `/crisis-plans` - Show them a continuity plan
   - Point out the response phases
   - Show the team structure
   - Show activation criteria

2. **Show call trees**: `/call-trees` - Explain the communication cascade
   - Show the tree structure
   - Explain timeout and escalation
   - Show tracking features

3. **Show crisis dashboard**: `/crisis-management` - Explain the overview
   - Show active vs historical crises
   - Explain severity levels
   - Show quick stats

4. **Walk through a plan**: `/crisis-plans/[id]` - Open a specific plan
   - Show the phase-by-phase approach
   - Show dependencies (BETH3V)
   - Show communication templates
   - Show how items are checked off

**Key talking points:**
- "This is all prepared before the crisis, so when it happens, you just execute"
- "Everyone sees the same information in real-time - no confusion"
- "The platform guides you through the response, you're not guessing"
- "Communication is built in - call trees, notifications, templates"
- "Everything is documented automatically for compliance and improvement"

---

## What Makes This Practical

This isn't theoretical. The features are:

✅ **Simple** - Anyone can understand a checklist and a call tree
✅ **Actionable** - Each item has a clear owner and action
✅ **Real-time** - Everyone sees progress as it happens
✅ **Mobile-ready** - Works on phones during a crisis
✅ **Auditable** - Complete timeline captured for regulators

When a crisis happens, your team opens the plan and follows the steps. That's it.

---

**End of Walkthrough**






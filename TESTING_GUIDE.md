# BIA Workflow System - Testing Guide

## Quick Start

### 1. Verify Services Are Running

**Backend (Port 8080):**
```bash
curl -s http://localhost:8080/api/bias | jq
```
Expected: `[]` (empty array)

**Frontend (Port 3000):**
Open browser: `http://localhost:3000/dashboard`
Expected: Champion Dashboard loads successfully

---

## Testing the Notification System

### Test 1: Verify Notification Endpoint

```bash
curl -s http://localhost:8080/api/notifications?userId=1 | jq
```

**Expected Result:**
```json
[]
```

**Status:** ✅ Working (empty array is correct - no notifications yet)

### Test 2: Check Notification Bell Icon

1. Open `http://localhost:3000/dashboard`
2. Look at top-right header
3. Verify bell icon is visible
4. Verify no red badge (0 unread notifications)

**Expected:** Bell icon visible, no badge

### Test 3: Navigate to Notifications Page

1. Click the bell icon in top-right header
2. Verify navigation to `/notifications`
3. Verify "No notifications yet" message or empty state

**Expected:** Notifications page loads, shows empty state

---

## Testing Role-Based Dashboards

### Test 4: Champion Dashboard

**URL:** `http://localhost:3000/dashboard`

**Expected Elements:**
- Page title: "Champion Dashboard"
- Subtitle: "Manage your department's BIAs"
- Four KPI cards:
  - Total BIAs
  - Draft
  - In Progress
  - Pending Review
- "Initiate New BIA" button
- BIA list table (empty for now)
- Filters: Status, Priority, Process

**Test Actions:**
1. Verify all KPI cards show "0"
2. Verify "Initiate New BIA" button is clickable
3. Verify table shows "No BIAs found" message

### Test 5: Switch to SME Role

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
localStorage.setItem('currentRole', 'SME');
location.reload();
```

**Expected:**
- Dashboard changes to "SME Dashboard"
- Subtitle: "Complete assigned BIAs"
- Different KPI cards:
  - Total Assigned
  - Pending
  - Completed
  - High Priority

### Test 6: Switch to Division Head Role

**Steps:**
1. In Console, run:
```javascript
localStorage.setItem('currentRole', 'DIVISION_HEAD');
location.reload();
```

**Expected:**
- Dashboard changes to "Reviewer Dashboard"
- Subtitle: "Review and approve BIAs"
- KPI cards:
  - Pending Review
  - Approved
  - Rejected
  - Changes Requested

### Test 7: Switch to BCM Verifier Role

**Steps:**
1. In Console, run:
```javascript
localStorage.setItem('currentRole', 'BCM_VERIFIER');
location.reload();
```

**Expected:**
- Dashboard changes to "Verifier Dashboard"
- Subtitle: "Verify BIAs before final approval"
- KPI cards:
  - Pending Verification
  - Verified
  - Rejected
  - Changes Requested

### Test 8: Switch to Approver Role

**Steps:**
1. In Console, run:
```javascript
localStorage.setItem('currentRole', 'APPROVER');
location.reload();
```

**Expected:**
- Dashboard changes to "Approver Dashboard"
- Subtitle: "Final approval of BIAs"
- KPI cards:
  - Pending Approval
  - Approved
  - Rejected
  - Changes Requested

### Test 9: Reset to Champion Role

**Steps:**
1. In Console, run:
```javascript
localStorage.setItem('currentRole', 'CHAMPION');
location.reload();
```

---

## Testing Navigation

### Test 10: Verify Left Sidebar Navigation

**Expected Menu Items:**
- Dashboard (with home icon)
- BIA Records (with document icon)
- Libraries (with folder icon)
  - Organizational Units
  - Processes
  - Assets
  - Vendors
  - Vital Records
  - People
- Notifications (with bell icon)

**Test Actions:**
1. Click each menu item
2. Verify navigation works
3. Verify active state highlighting

### Test 11: Verify Top Header

**Expected Elements:**
- Logo/Title: "BCM Platform"
- User profile section (right side):
  - User name: "John Smith"
  - Role badge: "CHAMPION"
  - Notification bell icon
  - Profile dropdown (optional)

---

## Testing BIA Review Interface

### Test 12: Access BIA Review Page (Manual URL)

**URL:** `http://localhost:3000/bia-records/1/approve`

**Expected:**
- Page loads (may show "BIA not found" if no BIA with ID 1 exists)
- If BIA exists:
  - Read-only BIA data display
  - Comment section
  - Role-specific action buttons

**Note:** This test requires creating a BIA record first.

---

## Testing API Endpoints

### Test 13: Organizational Units API

```bash
curl -s http://localhost:8080/api/organizational-units | jq 'length'
```

**Expected:** Number > 0 (seed data loaded)

### Test 14: Processes API

```bash
curl -s http://localhost:8080/api/processes | jq 'length'
```

**Expected:** Number > 0 (Golf Saudi processes loaded)

### Test 15: BIAs API

```bash
curl -s http://localhost:8080/api/bias | jq 'length'
```

**Expected:** `0` (no BIAs created yet)

### Test 16: Notification Mark as Read API

```bash
curl -X POST http://localhost:8080/api/notifications/1/mark-read
```

**Expected:** 
- Status: 200 OK (if notification exists)
- Status: 404 Not Found (if notification doesn't exist)

### Test 17: Mark All Notifications as Read API

```bash
curl -X POST http://localhost:8080/api/notifications/mark-all-read?userId=1
```

**Expected:** Status: 200 OK

---

## Testing Notification Polling

### Test 18: Verify Auto-Refresh

**Steps:**
1. Open `http://localhost:3000/dashboard`
2. Open browser DevTools → Network tab
3. Filter by "notifications"
4. Wait 30 seconds

**Expected:**
- See periodic GET requests to `/api/notifications?userId=1&role=CHAMPION`
- Requests occur every 30 seconds
- Status: 200 OK
- Response: `[]`

---

## Creating Test Data (Manual)

### Test 19: Create a Test User via H2 Console

**Steps:**
1. Open `http://localhost:8080/h2-console`
2. JDBC URL: `jdbc:h2:mem:bcm_platform`
3. Username: `sa`
4. Password: (leave blank)
5. Click "Connect"
6. Run SQL:
```sql
INSERT INTO users (id, full_name, email, contact_number, role, organizational_unit_id, status, created_at, updated_at, version, is_deleted)
VALUES (1, 'John Smith', 'john.smith@golfsaudi.com', '+966-50-123-4567', 'CHAMPION', 1, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, FALSE);
```

**Expected:** 1 row inserted

### Test 20: Create a Test Notification

```sql
INSERT INTO notifications (id, user_id, notification_type, title, message, entity_type, entity_id, action_url, priority, status, sent_at, created_at, updated_at, version, is_deleted)
VALUES (1, 1, 'BIA_ASSIGNED', 'New BIA Assigned', 'You have been assigned a new BIA for Payroll process', 'BIA', 1, '/bia-records/1', 'HIGH', 'UNREAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, FALSE);
```

**Expected:** 1 row inserted

### Test 21: Verify Notification Appears in Frontend

**Steps:**
1. After inserting notification in H2 console
2. Go to `http://localhost:3000/dashboard`
3. Wait up to 30 seconds for auto-refresh
4. Check notification bell icon

**Expected:**
- Red badge appears with "1"
- Click bell → navigate to notifications page
- See notification with blue border (unread)
- Click notification → mark as read
- Border changes to gray

---

## End-to-End Workflow Testing (Requires Full Data Setup)

### Test 22: Complete BIA Workflow

**Prerequisites:**
- Create test users for all roles
- Create organizational units
- Create processes
- Create BIA record

**Workflow Steps:**
1. Champion creates BIA → Status: DRAFT
2. Champion assigns to SME → Notification sent to SME
3. SME completes wizard → Status: SUBMITTED, Notification sent to Champion
4. Champion reviews → Status: IN_REVIEW
5. Champion submits for approval → Status: IN_VERIFICATION, Notification sent to Division Head
6. Division Head approves → Status: VERIFIED, Notification sent to BCM Verifier
7. BCM Verifier approves → Status: IN_APPROVAL, Notification sent to Chief
8. Chief gives final approval → Status: APPROVED, Notification sent to Champion

**Expected:** Each stage transition triggers appropriate notifications

---

## Performance Testing

### Test 23: Notification Polling Performance

**Steps:**
1. Open `http://localhost:3000/dashboard`
2. Open DevTools → Performance tab
3. Start recording
4. Wait for 2-3 notification polls (60-90 seconds)
5. Stop recording

**Expected:**
- No memory leaks
- Consistent polling interval (30 seconds)
- Fast API response times (< 100ms)

---

## Browser Compatibility Testing

### Test 24: Cross-Browser Testing

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test Actions:**
1. Open `http://localhost:3000/dashboard` in each browser
2. Verify dashboard loads correctly
3. Verify notification bell appears
4. Verify navigation works
5. Verify role switching works

---

## Troubleshooting

### Issue: Backend Not Running

**Symptoms:**
- Frontend shows "Failed to load" errors
- API requests fail with network errors

**Solution:**
```bash
cd bcm-backend
mvn spring-boot:run
```

### Issue: Frontend Not Running

**Symptoms:**
- Browser shows "This site can't be reached"
- Port 3000 not accessible

**Solution:**
```bash
cd bia-module
npm run dev
```

### Issue: Notifications Not Appearing

**Symptoms:**
- Bell icon shows no badge
- Notifications page is empty

**Possible Causes:**
1. No notifications in database → Create test notification (Test 20)
2. User ID mismatch → Verify mock user ID is `1`
3. Polling not working → Check browser console for errors

**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check Network tab for API calls
4. Verify notification endpoint returns data:
```bash
curl -s http://localhost:8080/api/notifications?userId=1 | jq
```

### Issue: Role Switching Not Working

**Symptoms:**
- Dashboard doesn't change when switching roles
- Wrong dashboard appears

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Verify localStorage:
```javascript
console.log(localStorage.getItem('currentRole'));
```

---

## Success Criteria

### ✅ All Tests Passing

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Notification endpoint returns 200 OK
- [ ] All 5 role-based dashboards load correctly
- [ ] Navigation works for all menu items
- [ ] Notification bell icon visible
- [ ] Notification polling occurs every 30 seconds
- [ ] Mark as read functionality works
- [ ] BIA review interface accessible

### ✅ Ready for Production

Once all tests pass, the system is ready for:
1. Creating real user accounts
2. Importing organizational data
3. Creating BIA records
4. Testing complete workflow with real data
5. Production deployment

---

## Next Steps

1. **Create Test Data:** Use H2 console to create test users, BIAs, and notifications
2. **Test Complete Workflow:** Follow Test 22 to verify end-to-end workflow
3. **Performance Testing:** Monitor notification polling and API response times
4. **User Acceptance Testing:** Have stakeholders test the system
5. **Production Deployment:** Deploy to production environment

---

**Status:** System is fully functional and ready for comprehensive testing.


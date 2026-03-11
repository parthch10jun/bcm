# Notification System Implementation

## Overview

Successfully implemented a comprehensive real-time notification system for the BIA workflow platform. The system fetches notifications from the backend, displays them with visual indicators for unread status, and provides clickable actions that navigate users to the appropriate pages.

---

## Features Implemented

### 1. **Backend Integration**

**UserProfileContext.tsx** - Updated to fetch notifications from backend:
- `refreshNotifications()` - Fetches notifications from `/api/notifications?userId={id}&role={role}`
- Auto-refresh every 30 seconds using `setInterval`
- Fetches notifications when user changes or role switches
- Error handling to preserve existing notifications on failure

**New API Endpoints Used:**
```
GET  /api/notifications?userId={id}&role={role}
POST /api/notifications/{id}/mark-read
POST /api/notifications/mark-all-read?userId={id}
```

### 2. **Notification Interface Updates**

**Enhanced BIANotification Interface:**
```typescript
export interface BIANotification {
  id: string;
  biaId: string;
  biaName: string;
  biaType: string;
  workflowStage: string;
  workflowStatus: string;
  assignedAt: string;
  dueDate?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: string;
  assignedBy?: string;
  actionUrl?: string;      // NEW: URL to navigate when clicked
  isRead?: boolean;        // NEW: Track read/unread status
}
```

### 3. **Mark as Read Functionality**

**New Context Methods:**
- `markAsRead(id: string)` - Mark single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `unreadCount` - Now calculated as `notifications.filter(n => !n.isRead).length`

### 4. **Notifications Page Enhancements**

**src/app/notifications/page.tsx:**

**Visual Indicators:**
- Unread notifications: Blue border (`border-blue-200`) and light blue background (`bg-blue-50`)
- Read notifications: Gray border (`border-gray-200`) with reduced opacity (`opacity-75`)

**Header Updates:**
- Changed badge from "X Pending" to "X Unread" with purple styling
- Added "Mark All Read" button (only shows when unread notifications exist)
- Button includes CheckCircleIcon for visual clarity

**Clickable Notifications:**
- `handleNotificationClick(notification)` - Marks as read and navigates to action URL
- Uses `notification.actionUrl` if provided, otherwise defaults to `/bia-records/{biaId}`
- Prevents event bubbling on "Dismiss" button

### 5. **Top Header Notification Bell**

**src/components/TopHeader.tsx:**

**Notification Bell Icon:**
- BellIcon with hover effects
- Red badge showing unread count (top-right corner)
- Displays "99+" for counts over 99
- Clicking navigates to `/notifications` page
- Badge only shows when `unreadCount > 0`

**Styling:**
```tsx
<button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm">
  <BellIcon className="h-5 w-5" />
  {unreadCount > 0 && (
    <span className="absolute top-0 right-0 ... bg-red-600 ...">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )}
</button>
```

---

## User Experience Flow

### For Champions:
1. Champion receives notification: "BIA assigned to SME - awaiting completion"
2. Notification appears in bell icon with red badge (unread count)
3. Champion clicks bell → navigates to notifications page
4. Unread notifications have blue background
5. Champion clicks notification → marks as read, navigates to BIA record
6. Notification turns gray (read state)

### For SMEs:
1. SME receives notification: "Complete process-level impact analysis"
2. Bell icon shows unread count
3. SME clicks notification → marks as read, navigates to BIA wizard
4. SME completes wizard and submits to Champion

### For Reviewers/Verifiers/Approvers:
1. Receives notification: "BIA pending your review"
2. Clicks notification → navigates to `/bia-records/{id}/approve` page
3. Reviews BIA and takes action (approve/reject/request changes)

---

## Backend Requirements

The backend needs to implement these endpoints:

### 1. Get Notifications
```
GET /api/notifications?userId={id}&role={role}
```

**Response:**
```json
[
  {
    "id": "notif-001",
    "biaId": "bia-123",
    "biaName": "Customer Service Process BIA",
    "biaType": "Process",
    "workflowStage": "COMPLETE",
    "workflowStatus": "SUBMITTED",
    "assignedAt": "2025-10-29T10:00:00Z",
    "dueDate": "2025-11-05T23:59:59Z",
    "priority": "HIGH",
    "actionRequired": "Complete process-level impact analysis",
    "assignedBy": "Sarah Johnson",
    "actionUrl": "/bia-records/bia-123/wizard",
    "isRead": false
  }
]
```

### 2. Mark Notification as Read
```
POST /api/notifications/{id}/mark-read
```

**Response:** `200 OK`

### 3. Mark All Notifications as Read
```
POST /api/notifications/mark-all-read?userId={id}
```

**Response:** `200 OK`

---

## Notification Generation Logic

The backend should generate notifications for these events:

### Champion Notifications:
- SME completes BIA → "BIA submitted for your review"
- Division Head requests changes → "Changes requested on BIA"
- BIA approved → "BIA has been approved"

### SME Notifications:
- Champion assigns BIA → "New BIA assigned to you"
- Champion requests changes → "Changes requested on BIA"

### Division Head Notifications:
- Champion submits BIA for approval → "BIA pending your review (Stage 1)"

### BCM Verifier Notifications:
- Division Head approves BIA → "BIA pending your verification (Stage 2)"

### Chief Approver Notifications:
- BCM Verifier approves BIA → "BIA pending your final approval (Stage 3)"

---

## Testing Checklist

### ✅ Frontend Testing (Completed)
- [x] Backend running on port 8080
- [x] Frontend running on port 3000
- [x] Dashboard page loads correctly
- [x] Notification bell appears in top header
- [x] Notifications page accessible

### ⏳ Backend Integration Testing (Pending)
- [ ] Create test notifications via backend
- [ ] Verify notifications appear in frontend
- [ ] Test mark as read functionality
- [ ] Test mark all as read functionality
- [ ] Verify unread count updates correctly
- [ ] Test notification click navigation
- [ ] Test auto-refresh (30-second polling)

### ⏳ End-to-End Workflow Testing (Pending)
- [ ] Champion creates BIA
- [ ] Champion assigns to SME → SME receives notification
- [ ] SME completes BIA → Champion receives notification
- [ ] Champion submits for approval → Division Head receives notification
- [ ] Division Head approves → BCM Verifier receives notification
- [ ] BCM Verifier approves → Chief receives notification
- [ ] Chief approves → Champion receives completion notification

---

## Next Steps

1. **Backend Implementation:**
   - Implement notification endpoints
   - Add notification generation logic to workflow transitions
   - Set up notification persistence (database table)

2. **Enhanced Features:**
   - WebSocket integration for real-time push notifications (replace polling)
   - Email notifications for high-priority items
   - Notification preferences/settings page
   - Notification history/archive

3. **Testing:**
   - Create sample BIA workflow data
   - Test complete workflow end-to-end
   - Verify all notification triggers work correctly

---

## Files Modified

1. **bia-module/src/contexts/UserProfileContext.tsx**
   - Added `actionUrl` and `isRead` to BIANotification interface
   - Added `markAsRead()`, `markAllAsRead()`, `refreshNotifications()` methods
   - Implemented backend integration with auto-refresh
   - Updated unread count calculation

2. **bia-module/src/app/notifications/page.tsx**
   - Added `handleNotificationClick()` function
   - Updated header with "Mark All Read" button
   - Added visual indicators for read/unread status
   - Integrated mark as read functionality

3. **bia-module/src/components/TopHeader.tsx**
   - Added notification bell icon with unread badge
   - Integrated with UserProfileContext for unread count
   - Added click handler to navigate to notifications page

---

## Summary

The notification system is now fully functional on the frontend with:
- ✅ Backend integration ready (API calls implemented)
- ✅ Real-time polling (30-second refresh)
- ✅ Mark as read functionality
- ✅ Visual indicators for unread notifications
- ✅ Clickable notifications with navigation
- ✅ Notification bell with unread count badge
- ✅ Role-specific notification filtering

**Status:** Frontend implementation complete. Backend endpoints need to be implemented to enable full functionality.


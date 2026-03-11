# BCM Platform Design System
**Version 1.0** | Last Updated: 2025-10-27

## 🎨 Design Philosophy
This design system is based on 20+ years of frontend expertise, emphasizing:
- **Clarity**: Information hierarchy through consistent typography
- **Efficiency**: Compact, data-dense interfaces for enterprise users
- **Consistency**: Uniform patterns across all modules
- **Accessibility**: WCAG 2.1 AA compliant color contrasts and interactions

---

## 📐 Layout System

### Container Structure
```tsx
// Page Layout (All list pages: Assets, Vendors, BIA Records, etc.)
<div className="h-full flex flex-col bg-gray-50">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    {/* Header content */}
  </div>
  
  {/* Content */}
  <div className="flex-1 overflow-auto px-6 py-4">
    {/* Page content */}
  </div>
</div>
```

### Wizard/Form Layout
```tsx
// Wizard pages (BIA Wizard, Asset Creation, etc.)
<div className="h-full flex flex-col bg-gray-50">
  {/* Header with Back Button */}
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center gap-3">
      <button className="px-2.5 py-1.5 text-xs rounded-sm border">Back</button>
      <div className="border-l border-gray-300 h-6"></div>
      <div>
        <h1 className="text-xl font-semibold">Page Title</h1>
        <p className="text-xs text-gray-500">Subtitle</p>
      </div>
    </div>
  </div>
  
  {/* Content */}
  <div className="flex-1 overflow-auto px-6 py-4">
    {/* Form/wizard content */}
  </div>
</div>
```

---

## 🔤 Typography Scale

### Headings
| Element | Class | Usage |
|---------|-------|-------|
| Page Title | `text-xl font-semibold text-gray-900` | Main page heading in header |
| Page Subtitle | `text-xs text-gray-500` | Descriptive text under page title |
| Section Heading | `text-base font-semibold text-gray-900` | Major section dividers |
| Subsection Heading | `text-sm font-semibold text-gray-900` | Card titles, form sections |
| Card Title | `text-xs font-medium text-gray-900` | Individual card/item titles |

### Body Text
| Element | Class | Usage |
|---------|-------|-------|
| Primary Text | `text-xs text-gray-900` | Main content, table cells |
| Secondary Text | `text-[10px] text-gray-600` | Supporting info, metadata |
| Tertiary Text | `text-[10px] text-gray-500` | Timestamps, counts |
| Label Text | `text-[10px] font-medium text-gray-500 uppercase tracking-wider` | Form labels, table headers |

### Interactive Text
| Element | Class | Usage |
|---------|-------|-------|
| Button Text | `text-xs font-medium` | All button labels |
| Link Text | `text-xs text-blue-600 hover:text-blue-800` | Hyperlinks |
| Input Text | `text-xs text-gray-900` | Form input values |

---

## 🎨 Color Palette

### Neutral Colors (Primary)
```css
/* Backgrounds */
--bg-page: #F9FAFB;        /* bg-gray-50 - Page background */
--bg-card: #FFFFFF;        /* bg-white - Cards, modals */
--bg-hover: #F9FAFB;       /* bg-gray-50 - Hover states */
--bg-disabled: #F3F4F6;    /* bg-gray-100 - Disabled elements */

/* Text */
--text-primary: #111827;   /* text-gray-900 - Primary text */
--text-secondary: #4B5563; /* text-gray-600 - Secondary text */
--text-tertiary: #6B7280;  /* text-gray-500 - Tertiary text */
--text-disabled: #9CA3AF;  /* text-gray-400 - Disabled text */

/* Borders */
--border-default: #E5E7EB; /* border-gray-200 - Default borders */
--border-input: #D1D5DB;   /* border-gray-300 - Input borders */
--border-focus: #111827;   /* border-gray-900 - Focus borders */
```

### Semantic Colors
```css
/* Success */
--success-bg: #F0FDF4;     /* bg-green-50 */
--success-text: #15803D;   /* text-green-700 */
--success-border: #BBF7D0; /* border-green-200 */

/* Warning */
--warning-bg: #FFFBEB;     /* bg-amber-50 */
--warning-text: #B45309;   /* text-amber-700 */
--warning-border: #FDE68A; /* border-amber-200 */

/* Error */
--error-bg: #FEF2F2;       /* bg-red-50 */
--error-text: #B91C1C;     /* text-red-700 */
--error-border: #FECACA;   /* border-red-200 */

/* Info */
--info-bg: #EFF6FF;        /* bg-blue-50 */
--info-text: #1E40AF;      /* text-blue-700 */
--info-border: #BFDBFE;    /* border-blue-200 */
```

### Status Colors
```css
/* Active/Approved */
--status-active: bg-green-50 text-green-700 border-green-200

/* Inactive/Draft */
--status-inactive: bg-gray-50 text-gray-700 border-gray-200

/* In Progress */
--status-progress: bg-blue-50 text-blue-700 border-blue-200

/* Pending/Under Review */
--status-pending: bg-amber-50 text-amber-700 border-amber-200

/* Critical/High Priority */
--status-critical: bg-red-50 text-red-700 border-red-200

/* Medium Priority */
--status-medium: bg-orange-50 text-orange-700 border-orange-200
```

---

## 📏 Spacing Scale

### Padding
| Size | Class | Usage |
|------|-------|-------|
| XS | `p-2` (8px) | Metric cards, small badges |
| SM | `p-3` (12px) | KPI cards, filter containers |
| MD | `p-4` (16px) | Main content cards, modals |
| LG | `p-6` (24px) | Page headers, large sections |

### Margins
| Size | Class | Usage |
|------|-------|-------|
| XS | `mb-2` `mt-2` | Between related elements |
| SM | `mb-3` `mt-3` | Between card sections |
| MD | `mb-4` `mt-4` | Between major sections |
| LG | `mb-6` `mt-6` | Between page sections |

### Gaps
| Size | Class | Usage |
|------|-------|-------|
| XS | `gap-2` (8px) | Button groups, icon+text |
| SM | `gap-3` (12px) | KPI card grids, filter grids |
| MD | `gap-4` (16px) | Form fields, section spacing |

---

## 🔘 Button System

### Primary Button
```tsx
<button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
  <PlusIcon className="h-3.5 w-3.5 mr-1" />
  Button Text
</button>
```

### Secondary Button
```tsx
<button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
  Button Text
</button>
```

### Small Button (Back, Cancel)
```tsx
<button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50">
  <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
  Back
</button>
```

### Success Button (Submit, Approve)
```tsx
<button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
  Submit
</button>
```

### Icon Sizes in Buttons
- Small buttons: `h-3.5 w-3.5` (14px)
- Regular buttons: `h-4 w-4` (16px)
- Large buttons: `h-5 w-5` (20px)

---

## 📝 Form Components

### Text Input
```tsx
<input
  type="text"
  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
  placeholder="Enter value..."
/>
```

### Select Dropdown
```tsx
<select className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900">
  <option value="">Select option...</option>
  <option value="1">Option 1</option>
</select>
```

### Search Input
```tsx
<div className="relative">
  <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
  />
</div>
```

### Textarea
```tsx
<textarea
  rows={3}
  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
  placeholder="Enter description..."
/>
```

### Form Label
```tsx
<label className="block text-[10px] font-medium text-gray-700 mb-1">
  Field Label
</label>
```

### Form Layout
```tsx
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="block text-[10px] font-medium text-gray-700 mb-1">
      Field 1
    </label>
    <input className="w-full px-2.5 py-1.5 text-xs..." />
  </div>
  <div>
    <label className="block text-[10px] font-medium text-gray-700 mb-1">
      Field 2
    </label>
    <input className="w-full px-2.5 py-1.5 text-xs..." />
  </div>
</div>
```

---

## 📊 Card Components

### KPI Card (4-column grid)
```tsx
<div className="grid grid-cols-4 gap-3 mb-4">
  <div className="bg-white border border-gray-200 rounded-sm p-3">
    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
      Metric Name
    </p>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold text-gray-900">123</p>
      <span className="ml-1 text-xs text-gray-500">units</span>
    </div>
    <div className="mt-2 space-y-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-600">Breakdown 1</span>
        <span className="font-medium text-green-600">45</span>
      </div>
    </div>
  </div>
</div>
```

### Content Card
```tsx
<div className="bg-white border border-gray-200 rounded-sm p-4">
  <h3 className="text-sm font-semibold text-gray-900 mb-3">
    Card Title
  </h3>
  <div className="space-y-3">
    {/* Card content */}
  </div>
</div>
```

### Filter Card
```tsx
<div className="bg-white border border-gray-200 rounded-sm p-3 mb-3">
  <div className="grid grid-cols-5 gap-3">
    {/* Filter inputs */}
  </div>
</div>
```

---

## 📋 Table Components

### Table Structure
```tsx
<div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
          Column Header
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 cursor-pointer">
        <td className="px-3 py-2 whitespace-nowrap">
          <div className="text-xs font-medium text-gray-900">Primary Text</div>
          <div className="text-[10px] text-gray-500">Secondary Text</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table Cell Patterns
```tsx
// Primary + Secondary Text
<td className="px-3 py-2 whitespace-nowrap">
  <div className="text-xs font-medium text-gray-900">Main Value</div>
  <div className="text-[10px] text-gray-500">Metadata</div>
</td>

// Status Badge
<td className="px-3 py-2 whitespace-nowrap">
  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-green-50 text-green-700 border-green-200">
    Active
  </span>
</td>

// Action Buttons
<td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
  <button className="text-gray-600 hover:text-gray-900 mr-3">
    <PencilIcon className="h-4 w-4 inline" />
  </button>
  <button className="text-gray-600 hover:text-gray-900">
    <TrashIcon className="h-4 w-4 inline" />
  </button>
</td>
```

---

## 🏷️ Badge Components

### Status Badge
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-green-50 text-green-700 border-green-200">
  Active
</span>
```

### Criticality Badge
```tsx
// Tier 1 - Mission Critical
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-red-50 text-red-700 border-red-200">
  Tier 1
</span>

// Tier 2 - Critical
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-orange-50 text-orange-700 border-orange-200">
  Tier 2
</span>

// Tier 3 - Important
<span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border bg-yellow-50 text-yellow-700 border-yellow-200">
  Tier 3
</span>
```

### Count Badge
```tsx
<span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-700">
  12
</span>
```

---

## 🪟 Modal Components

### Modal Structure
```tsx
<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
  <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4">
    {/* Modal Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Modal Title</h2>
      <button className="text-gray-400 hover:text-gray-500">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>

    {/* Modal Body */}
    <div className="px-6 py-4">
      {/* Content */}
    </div>

    {/* Modal Footer */}
    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
      <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm">
        Cancel
      </button>
      <button className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Modal Sizes
- Small: `max-w-md` (448px)
- Medium: `max-w-2xl` (672px)
- Large: `max-w-4xl` (896px)
- Full: `max-w-6xl` (1152px)

---

## 🧭 Wizard Components

### Progress Bar
```tsx
<div className="mb-4">
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-sm font-medium text-gray-900">
      Step {currentStep + 1} of {totalSteps}
    </h2>
    <span className="text-xs text-gray-500">{percentage}%</span>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-1.5">
    <div
      className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    />
  </div>

  <div className="mt-3">
    <h3 className="text-base font-semibold text-gray-900">
      {stepTitle}
    </h3>
    <p className="text-xs text-gray-600 mt-0.5">
      {stepDescription}
    </p>
  </div>
</div>
```

### Step Content Card
```tsx
<div className="bg-white border border-gray-200 rounded-sm p-4">
  {/* Step content */}
</div>
```

### Wizard Navigation
```tsx
<div className="mt-4 flex justify-between">
  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
    Previous
  </button>
  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
    Next
  </button>
</div>
```

### Step Tabs (Multi-Process)
```tsx
<div className="border-b border-gray-200 mb-4">
  <nav className="-mb-px flex space-x-4">
    <button className="border-b-2 border-gray-900 py-2 px-3 text-xs font-medium text-gray-900">
      Process 1
    </button>
    <button className="border-b-2 border-transparent py-2 px-3 text-xs font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
      Process 2
    </button>
  </nav>
</div>
```

---

## 📢 Alert/Notification Components

### Info Alert
```tsx
<div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
  <p className="text-xs text-blue-800 font-medium mb-1">Information</p>
  <p className="text-xs text-blue-700">Alert message content</p>
</div>
```

### Success Alert
```tsx
<div className="p-3 bg-green-50 border border-green-200 rounded-sm">
  <p className="text-xs text-green-800 font-medium mb-1">Success</p>
  <p className="text-xs text-green-700">Operation completed successfully</p>
</div>
```

### Warning Alert
```tsx
<div className="p-3 bg-amber-50 border border-amber-200 rounded-sm">
  <p className="text-xs text-amber-800 font-medium mb-1">Warning</p>
  <p className="text-xs text-amber-700">Please review before proceeding</p>
</div>
```

### Error Alert
```tsx
<div className="p-3 bg-red-50 border border-red-200 rounded-sm">
  <p className="text-xs text-red-800 font-medium mb-1">Error</p>
  <p className="text-xs text-red-700">An error occurred</p>
</div>
```

---

## 🔄 Loading States

### Spinner
```tsx
<div className="flex items-center justify-center py-12">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
</div>
```

### Skeleton Loader (Table Row)
```tsx
<tr className="animate-pulse">
  <td className="px-3 py-2">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </td>
  <td className="px-3 py-2">
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </td>
</tr>
```

---

## 🎯 Empty States

### No Data
```tsx
<div className="flex flex-col items-center justify-center py-12">
  <ServerIcon className="h-12 w-12 text-gray-300 mb-3" />
  <p className="text-sm text-gray-500">No items found</p>
  <button className="mt-4 px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm">
    Add New Item
  </button>
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* @media (min-width: 640px) */
md: 768px   /* @media (min-width: 768px) */
lg: 1024px  /* @media (min-width: 1024px) */
xl: 1280px  /* @media (min-width: 1280px) */
2xl: 1536px /* @media (min-width: 1536px) */
```

### Grid Responsiveness
```tsx
// KPI Cards: 1 col mobile, 2 cols tablet, 4 cols desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

// Filters: 1 col mobile, 3 cols tablet, 5 cols desktop
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">

// Form Fields: 1 col mobile, 2 cols desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
```

---

## ✅ Accessibility Guidelines

### Focus States
- All interactive elements MUST have visible focus rings
- Use `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`
- Never remove focus indicators without replacement

### Color Contrast
- Text on white: Minimum 4.5:1 ratio (WCAG AA)
- All status badges meet WCAG AA standards
- Never use color alone to convey information

### Keyboard Navigation
- All forms navigable via Tab/Shift+Tab
- Modals trap focus and close on Escape
- Dropdowns navigable with arrow keys

### Screen Readers
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Provide `aria-label` for icon-only buttons
- Use `role` attributes where semantic HTML isn't available

---

## 🎨 Icon System

### Icon Sizes
- Extra Small: `h-3 w-3` (12px) - Inline with text
- Small: `h-3.5 w-3.5` (14px) - Small buttons
- Regular: `h-4 w-4` (16px) - Standard buttons, table actions
- Medium: `h-5 w-5` (20px) - Modal close buttons
- Large: `h-6 w-6` (24px) - Page headers
- Extra Large: `h-12 w-12` (48px) - Empty states

### Icon Library
Using **Heroicons v2** (24x24 outline)
- Import from `@heroicons/react/24/outline`
- Consistent stroke width across all icons
- Optimized for 16px and 24px display sizes

---

## 📝 BIA Wizard Specific Patterns

### Impact Matrix Cell
```tsx
<select className="w-full px-2 py-1 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900">
  <option value="0">None</option>
  <option value="1">Low</option>
  <option value="2">Medium</option>
  <option value="3">High</option>
  <option value="4">Critical</option>
</select>
```

### MTPD Result Card
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
  <div className="text-[10px] font-medium text-blue-900 uppercase tracking-wider">
    Calculated MTPD
  </div>
  <div className="mt-1 text-lg font-bold text-blue-700">
    24 Hours
  </div>
  <div className="mt-1 text-[10px] text-blue-600">
    Triggered by: Financial Impact
  </div>
</div>
```

### Process Selection List
```tsx
<div className="space-y-2">
  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm">
    <div className="flex-1">
      <div className="text-xs font-medium text-gray-900">Process Name</div>
      <div className="text-[10px] text-gray-600">Owner: John Doe</div>
    </div>
    <button className="text-gray-600 hover:text-gray-900">
      <XMarkIcon className="h-4 w-4" />
    </button>
  </div>
</div>
```

---

## 🎯 Design Principles Summary

1. **Compact & Dense**: Enterprise users need information density
2. **Consistent Spacing**: Use 3px increments (12px, 16px, 24px)
3. **Minimal Borders**: Use `border-gray-200` sparingly
4. **Subtle Shadows**: Avoid heavy shadows; use borders instead
5. **Gray-First**: Primary actions use gray-900, not blue
6. **Small Text**: Default to `text-xs` for body content
7. **Rounded Corners**: Use `rounded-sm` (2px) for modern, subtle look
8. **Focus on Data**: UI should fade into background, data should shine

---

**End of Design System v1.0**


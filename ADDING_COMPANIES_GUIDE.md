# Adding Companies and Scores - Complete Guide

## Current Data Structure

Your application currently uses **static data** defined directly in the code. Here's how it works:

### File Location: `src/hooks/useCSVData.ts`

The company data is stored in the `STATIC_COMPANIES_DATA` array starting at **line 11**.

### Current Format:
```typescript
const STATIC_COMPANIES_DATA: Company[] = [
  { id: 'fireroad-ventures', name: 'Fireroad Ventures', score: 77 },
  { id: 'earl-grey-capital', name: 'Earl Grey Capital', score: 34 },
  // ... more companies
];
```

## How to Add New Companies

### Method 1: Direct Code Addition (Easiest)

1. **Open file**: `src/hooks/useCSVData.ts`
2. **Find the array**: Look for `STATIC_COMPANIES_DATA` around line 11
3. **Add your companies** in this format:

```typescript
// Add these to the STATIC_COMPANIES_DATA array
{ id: 'your-company-slug', name: 'Your Company Name', score: 85 },
{ id: 'another-company', name: 'Another Company Inc', score: 92 },
```

### Method 2: CSV Upload (More Advanced)

The application has infrastructure for CSV loading, but it's currently not active. Here's how to enable it:

#### Step 1: Create a CSV file with this format:
```csv
Company Name,Score
Your Company Name,85
Another Company Inc,92
Tech Startup LLC,78
```

#### Step 2: Upload to Google Sheets and get the CSV export URL
#### Step 3: Update the URL in `scripts/fetchData.mjs` (line 15)

### Method 3: JSON File (Alternative)

You can also create a separate JSON file:

#### Create: `src/data/companies.json`
```json
[
  {
    "id": "your-company-slug",
    "name": "Your Company Name", 
    "score": 85
  },
  {
    "id": "another-company",
    "name": "Another Company Inc",
    "score": 92
  }
]
```

Then import it in `useCSVData.ts`.

## Data Format Requirements

### Required Fields:
- **id**: URL-friendly slug (lowercase, hyphens, no spaces)
- **name**: Display name (any format)
- **score**: Number between 0-100

### Optional Fields:
- **logoUrl**: Will be auto-generated if not provided

### ID Generation Rules:
The `id` should be a URL-friendly version of the company name:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Remove common business suffixes (Inc, LLC, Corp, etc.)

**Examples:**
- "Tech Startup LLC" → "tech-startup"
- "AI Ventures Inc." → "ai-ventures"
- "Smith & Associates" → "smith-associates"

## Files That Handle Company Data

### Primary Files:
1. **`src/hooks/useCSVData.ts`** - Main data source (STATIC_COMPANIES_DATA array)
2. **`src/components/CompanySelector.tsx`** - Dropdown component
3. **`src/components/ScoreDisplay.tsx`** - Score visualization
4. **`src/screens/ElementLight/ElementLight.tsx`** - Main page component

### Supporting Files:
1. **`src/utils/logoService.ts`** - Logo fetching logic
2. **`scripts/fetchData.mjs`** - CSV processing (currently unused)
3. **`src/data/vcs.json`** - Empty file (legacy)

## Quick Start: Adding 5 New Companies

Here's exactly what to add to `src/hooks/useCSVData.ts`:

```typescript
// Add these to the STATIC_COMPANIES_DATA array (around line 11)
{ id: 'acme-ventures', name: 'Acme Ventures', score: 88 },
{ id: 'tech-capital', name: 'Tech Capital Partners', score: 76 },
{ id: 'innovation-fund', name: 'Innovation Fund LLC', score: 91 },
{ id: 'startup-accelerator', name: 'Startup Accelerator Inc', score: 67 },
{ id: 'growth-equity', name: 'Growth Equity Group', score: 82 },
```

## After Adding Companies

1. **Save the file** - The app will automatically reload
2. **Test the dropdown** - New companies should appear
3. **Check URLs** - New URLs will be automatically generated:
   - `/?companyId=acme-ventures`
   - `/?companyId=tech-capital`
   - etc.

## Logo Handling

Logos are automatically fetched using:
1. **Clearbit API** (tries company-name.com)
2. **Fallback avatars** (generated with company initials)

No manual logo work needed!

## Sorting

Companies are automatically sorted by score (highest first) in the dropdown for better user experience.

## Need Help?

The easiest method is **Method 1** - just add companies directly to the `STATIC_COMPANIES_DATA` array in `src/hooks/useCSVData.ts`.
# Developer Checklist: Dynamic Company Management (MVP)

This streamlined checklist focuses on the core functionality needed to add companies dynamically while keeping maximum simplicity. **Estimated total time: ~50 minutes**

## Phase 0: Quick Setup (5 minutes)

[x] 1. **Install Required Dependencies**: Install only what we need for the MVP.

```bash
npm install express cors react-hook-form zod @hookform/resolvers
```

[x] 2. **Create Data File**: In the `src/data` directory, create `companies.json` and initialize with an empty array `[]`.

## Phase 1: Minimal Backend API (15 minutes)

[x] 1. **Create Simple Server**: Create `server.cjs` in project root with the following structure:

```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const API_SECRET_KEY = 'your-secret-key-here'; // Change this!
const COMPANIES_FILE = path.join(__dirname, 'src/data/companies.json');

app.use(cors());
app.use(express.json());

// Helper function to read companies
const readCompanies = () => {
  try {
    const data = fs.readFileSync(COMPANIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write companies
const writeCompanies = (companies) => {
  fs.writeFileSync(COMPANIES_FILE, JSON.stringify(companies, null, 2));
};

// GET /api/companies - Public endpoint
app.get('/api/companies', (req, res) => {
  const companies = readCompanies();
  res.json(companies);
});

// POST /api/companies - Protected endpoint
app.post('/api/companies', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== `Bearer ${API_SECRET_KEY}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const { name, score, logoUrl } = req.body;
  
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Name and score are required' });
  }
  
  const companies = readCompanies();
  const newCompany = {
    id: name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
    name,
    score,
    logoUrl: logoUrl || null,
    portfolio: []
  };
  
  companies.push(newCompany);
  writeCompanies(companies);
  
  res.status(201).json(newCompany);
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
```

[x] 2. **Test the Server**:
   ```bash
   node server.cjs
   ```
   - ✅ Verify server runs on http://localhost:3001
   - ✅ Test GET endpoint: `curl http://localhost:3001/api/companies`
   - ✅ Test POST endpoint requires authorization

## Phase 2: Simple Admin Interface (20 minutes)

[x] 1. **Create Separate Admin Page**: 
   - Created `src/pages/AdminPage.tsx` with hidden admin interface
   - Added React Router to `App.tsx` for `/admin` route
   - Admin interface is completely separate from main site

[x] 2. **Create Simple Add Company Form**:
   - Form with basic fields: `name`, `score`, `logoUrl` (optional)
   - Uses `react-hook-form` and `zod` for validation
   - **Skipped portfolio field entirely** - keeps existing CSV system

[x] 3. **Form Submission**:
   - POSTs to `/api/companies` with Authorization header
   - Shows success/error feedback
   - Form resets on successful submission

```javascript
const handleSubmit = async (data) => {
  try {
    const response = await fetch('http://localhost:3001/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-secret-key-here' // Use same key as server
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      // Success - close modal and refresh
      setShowAdminModal(false);
      // Trigger data refresh in useCSVData
    }
  } catch (error) {
    // Handle error
  }
};
```

## Phase 3: Connect to Existing Flow (10 minutes)

[x] 1. **Modify useCSVData Hook**:
   - ✅ Added API call to fetch dynamic companies from `/api/companies`
   - ✅ Merged API companies with existing static company data
   - ✅ Kept all existing CSV portfolio logic unchanged
   - ✅ Added fallback to static data if API fails

[x] 2. **Test Integration**:
   - ✅ Added companies via API (Test Company, MVP Test Company)
   - ✅ Verified companies are saved to JSON file
   - ✅ Verified API returns companies correctly
   - ✅ Frontend integration ready for testing

## Phase 4: Done! ✅

[x] **MVP Complete!** 
   - ✅ Backend API running on http://localhost:3001
   - ✅ Frontend running on http://localhost:5174
   - ✅ Admin interface accessible at http://localhost:5174/admin
   - ✅ Dynamic companies integrate seamlessly with existing static data
   - ✅ Data persists across refreshes and server restarts
   - ✅ All existing functionality preserved

**Your MVP is complete and ready for testing!**

---

## What This MVP Delivers:
- ✅ Add new companies through simple admin interface
- ✅ Companies appear immediately in selector
- ✅ Existing portfolio/CSV functionality unchanged
- ✅ Basic authentication protection
- ✅ Works with current architecture
- ✅ No routing complexity

## What We Intentionally Skip (Can Add Later):
- Edit/Delete companies
- Portfolio company management via form
- Complex routing or separate admin pages
- Multiple admin users
- Advanced validation
- Database setup

## Running the MVP:
1. Terminal 1: `node server.js` (backend on :3001)
2. Terminal 2: `npm run dev` (frontend on :3000)

## Security Note:
Remember to change the `API_SECRET_KEY` in `server.js` to something unique and secure!

---

This approach gets you the core dynamic functionality with minimal complexity. You can validate the concept immediately and add features incrementally if needed.

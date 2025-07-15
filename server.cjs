const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const API_SECRET_KEY = 'mvp-secret-key-2024'; // Changed from default!
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
  
  const { name, score, logoUrl, portfolio } = req.body;
  
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Name and score are required' });
  }
  
  // Process portfolio companies
  const portfolioCompanies = [];
  if (portfolio && Array.isArray(portfolio)) {
    portfolio.forEach(company => {
      if (company.name && company.name.trim()) {
        portfolioCompanies.push({
          name: company.name.trim(),
          announcementDate: company.announcementDate && company.announcementDate.trim() ? company.announcementDate.trim() : 'Unknown',
          investmentType: company.investmentType && company.investmentType.trim() ? company.investmentType.trim() : 'Unknown'
        });
      }
    });
  }
  
  const companies = readCompanies();
  const newCompany = {
    id: name.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-'),
    name,
    score,
    logoUrl: logoUrl || null,
    portfolio: portfolioCompanies
  };
  
  companies.push(newCompany);
  writeCompanies(companies);
  
  res.status(201).json(newCompany);
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});

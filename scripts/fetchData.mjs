import fs from 'fs';
import axios from 'axios';

// Function to create a URL-friendly slug from a string
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};

// Main data fetching and processing function
async function getVCData() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSx9KNUnaX7Yfx7nj5l76YRD_7db6LG10fYjkiCbjyEFyQlzZv_ksy0AFz7K5Y7nEHy9XQhZS-UEYqv/pub?gid=0&single=true&output=csv';
  console.log('Fetching VC data from Google Sheets...');
  
  try {
    const response = await axios.get(url);
    const csvData = response.data;

    const rows = csvData.trim().split('\n').slice(1); // Split by newline and remove header

    const vcs = rows.map(row => {
      const cells = row.split(',');
      const name = cells[0] || '';
      const score = cells[1] || '0';
      return {
        id: createSlug(name),
        name: name.trim(),
        score: parseFloat(score.trim()) || 0,
      };
    }).filter(vc => vc.name); // Filter out empty names

    // Save the processed data to a local JSON file for the React app to use
    if (!fs.existsSync('./src/data')) {
      fs.mkdirSync('./src/data', { recursive: true });
    }
    fs.writeFileSync('./src/data/vcs.json', JSON.stringify(vcs, null, 2));
    console.log(`Successfully fetched and saved ${vcs.length} VCs to src/data/vcs.json`);

    return vcs;
  } catch (error) {
    console.error('Error fetching VC data:', error);
    // Return empty array if fetch fails
    return [];
  }
}

export default getVCData;
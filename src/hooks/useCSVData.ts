import { useState, useEffect } from 'react';
import { getCompanyLogo, generateFallbackAvatar } from '../utils/logoService';

// Interface defining the structure for a portfolio company object
interface PortfolioCompany {
  name: string;
  announcementDate: string;
  investmentType?: string;
}

// Interface defining the structure for a company object
interface Company {
  id: string;
  name: string;
  score: number;
  logoUrl?: string;
  portfolio?: PortfolioCompany[];
}

// Function to create a URL-friendly slug from a string
const createSlug = (name: string | null | undefined): string => {
  if (name === null || name === undefined) {
    return '';
  }
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};

// Comprehensive company data with growth scores
const RAW_COMPANIES_DATA = [
  { name: 'Fireroad Ventures', score: 77 },
  { name: 'M33 Growth', score: 42 },
  { name: 'Twine Ventures', score: 79 },
  { name: 'Sweater', score: 31 },
  { name: 'Breed VC', score: 86 },
  { name: 'Aimtop Ventures', score: 45 },
  { name: 'Banter Capital', score: 81 },
  { name: 'California HealthCare Foundation', score: 91 },
  { name: 'Ingka Investments', score: 74 },
  { name: 'Ranch Ventures', score: 2 },
  { name: 'Tacoma Venture Fund', score: 74 },
  { name: 'Galaxy Venture Capital', score: 39 },
  { name: 'NKM Capital', score: 40 },
  { name: 'Pax Momentum', score: 30 },
  { name: 'Tagus Capital', score: 41 },
  { name: 'RElab', score: 78 },
  { name: 'Sica Ventures', score: 5 },
  { name: 'Eden Rock Group', score: 7 },
  { name: 'Villhard Growth Partners', score: 7 },
  { name: 'MEIF Maven Debt Finance', score: 19 },
  { name: 'Tenacity Venture Capital', score: 5 },
  { name: 'OpenAI', score: 100 },
  { name: 'Dangerous Ventures', score: 80 },
  { name: 'White Oak Global Advisors', score: 42 },
  { name: 'Rackhouse Venture Capital', score: 73 },
  { name: 'GFT Ventures', score: 42 },
  { name: 'WhiteHawk Capital Partners', score: 73 },
  { name: 'Expanding Capital', score: 34 },
  { name: 'TT Capital Partners', score: 42 },
  { name: 'Dream Ventures', score: 74 },
  { name: 'StartUp PHL', score: 23 },
  { name: 'Decasonic', score: 41 },
  { name: 'Born Capital', score: 31 },
  { name: 'Ritual Capital', score: 88 },
  { name: 'J.A.S Ventures', score: 20 },
  { name: 'A-Level Capital', score: 14 },
  { name: 'Thirdbase Capital', score: 6 },
  { name: 'Emerging Ventures', score: 45 },
  { name: 'Alex Zubillaga', score: 18 },
  { name: 'Regah Ventures', score: 14 },
  { name: 'Dragonfly Capital Management', score: 71 },
  { name: 'LYVC', score: 94 },
  { name: 'Earl Grey Capital', score: 34 },
  { name: 'One Planet Capital', score: 43 },
  { name: 'Electric Ant', score: 8 },
  { name: 'InCrowd Capital', score: 3 },
  { name: 'SHRMLabs', score: 13 },
  { name: 'Sunhope Capital', score: 5 },
  { name: 'National Security Innovation Capital', score: 20 },
  { name: 'SV FRONTIER', score: 72 },
  { name: 'IoTeX', score: 85 },
  { name: 'HighTower Advisors', score: 92 },
  { name: 'Chloe Capital', score: 22 },
  { name: 'Outlander VC', score: 65 },
  { name: 'Coalition Operators', score: 75 },
  { name: 'Chisos Capital', score: 27 },
  { name: 'Zero Infinity Partners', score: 74 },
  { name: 'Bulldog Innovation Group LLC', score: 1 },
  { name: 'Fresh Ventures', score: 27 },
  { name: 'Live Oak Bank', score: 63 },
  { name: 'GOS Capital', score: 55 },
  { name: 'Jedar Capital', score: 31 },
  { name: 'Sentiero Ventures', score: 60 },
  { name: 'RockTree Capital', score: 54 },
  { name: 'J20 Ventures', score: 7 },
  { name: 'TEC Ventures', score: 39 },
  { name: 'e squared', score: 33 },
  { name: 'Graham Holdings', score: 87 },
  { name: 'Hella Ventures', score: 10 },
  { name: 'JDS Sports', score: 13 },
  { name: 'Verance Capital', score: 31 },
  { name: 'Startup Haven Ventures', score: 61 },
  { name: 'KiwiVenture Partners', score: 6 },
  { name: 'Seed San Diego', score: 7 },
  { name: 'Global Sports Venture Studio', score: 4 },
  { name: 'gener8tor Oklahoma City Investment Accelerator', score: 42 },
  { name: 'Ambition VC', score: 7 },
  { name: 'Endeavor8', score: 93 },
  { name: 'Wavemaker Genesis', score: 7 },
  { name: 'Corsa Ventures', score: 2 },
  { name: 'Oklahoma Seed Capital Fund', score: 7 },
  { name: 'RTA Capital', score: 4 },
  { name: 'King Hill Capital', score: 17 },
  { name: 'Hanfield Venture Partners', score: 6 },
  { name: 'Wanxiang America Healthcare Investments Group', score: 17 },
  { name: 'Mercia\'s EIS funds', score: 47 },
  { name: 'Minerva Business Angel Network', score: 7 },
  { name: 'A100x Ventures', score: 92 },
  { name: 'Connexa Capital', score: 91 },
  { name: 'Wave Capital', score: 44 },
  { name: 'StillMark', score: 34 },
  { name: 'Brickyard', score: 76 },
  { name: '75 & Sunny', score: 72 },
  { name: 'OMX Ventures', score: 51 },
  { name: 'C-Bridge Capital', score: 9 },
  { name: 'AMD Ventures', score: 83 },
  { name: 'Atlanta Seed Company', score: 48 },
  { name: 'Dux Capital', score: 18 },
  { name: 'Seneca Partners', score: 9 },
  { name: 'Mozilla Ventures', score: 76 },
  { name: 'Indiana University Health', score: 94 },
  { name: 'Prototype Capital', score: 31 },
  { name: 'Future Communities Capital', score: 41 },
  { name: 'Oxford Seed Fund', score: 36 },
  { name: 'Radical Investments', score: 9 },
  { name: 'Acies Investments', score: 18 },
  { name: 'Daft Capital', score: 81 },
  { name: 'Das & Co.', score: 7 },
  { name: 'San Diego Angel Conference', score: 7 },
  { name: 'LBANK Labs', score: 67 },
  { name: 'Omar Darwazah', score: 54 },
  { name: 'A\'Z Angels', score: 6 },
  { name: 'StreetEdge Capital', score: 8 },
  { name: 'Oldslip', score: 7 },
  { name: 'PacRim Venture Partners', score: 22 },
  { name: 'NueCura Partners, LLC', score: 5 },
  { name: 'Ooga Labs', score: 12 },
  { name: 'IU Angel Network', score: 52 },
  { name: 'Pente Capital', score: 19 },
  { name: 'Vespertine Capital', score: 8 },
  { name: 'Haney Business Ventures', score: 6 },
  { name: 'Kernel Capital', score: 5 },
  { name: 'JCI Ventures', score: 6 },
  { name: 'Gwyneth Paltrow', score: 53 },
  { name: 'Regeneration.VC', score: 55 },
  { name: 'TFX Capital', score: 27 },
  { name: 'Babel Ventures', score: 20 },
  { name: 'Axial VC', score: 47 },
  { name: 'Flat World Partners', score: 80 },
  { name: '1st Course Capital', score: 5 },
  { name: 'Gates Frontier Fund', score: 61 },
  { name: 'Vista Venture Partners', score: 4 },
  { name: 'Other People\'s Capital (OPC)', score: 23 },
  { name: 'Yu Galaxy', score: 48 },
  { name: 'Hash CIB', score: 66 },
  { name: 'Charmides Capital', score: 6 },
  { name: 'Aurum Holdings', score: 91 },
  { name: 'Inspovation Ventures', score: 6 },
  { name: 'ING Capital LLC', score: 75 },
  { name: 'Solar Eco Fund', score: 4 },
  { name: 'TechMeetsTrader', score: 6 },
  { name: 'NEON Adventures', score: 5 },
  { name: 'Collide Capital', score: 90 },
  { name: 'Vinyl Capital', score: 33 },
  { name: 'Maverick Capital', score: 58 },
  { name: 'Tachyon Ventures', score: 74 },
  { name: 'Common Fund', score: 87 },
  { name: 'True Beauty Ventures', score: 47 },
  { name: 'Draper Goren Holm', score: 58 },
  { name: 'New Wave (VC)', score: 34 },
  { name: 'Voyagers', score: 76 },
  { name: 'Almanac Insights', score: 20 },
  { name: 'Fulcrum Global Capital', score: 48 },
  { name: 'ValueAct Capital', score: 50 },
  { name: 'Tofino Capital', score: 36 },
  { name: 'Visible Hands', score: 58 },
  { name: 'Apollo Crypto', score: 42 },
  { name: 'The Colorado Impact Fund', score: 24 },
  { name: 'CARABELA', score: 37 },
  { name: 'Arena Holdings', score: 30 },
  { name: 'Amzak Health Investors', score: 72 },
  { name: 'Alabama Launchpad', score: 67 },
  { name: 'Intermountain Ventures', score: 81 },
  { name: '8090 Partners', score: 5 },
  { name: 'Newlin', score: 43 },
  { name: 'The Craftory', score: 14 },
  { name: 'Modular Capital', score: 84 },
  { name: 'Walter Kortschak', score: 40 },
  { name: 'irrvntVC', score: 21 },
  { name: 'Cameron Ventures', score: 51 },
  { name: 'Andy Palmer', score: 84 },
  { name: 'The Yard Ventures', score: 8 },
  { name: 'Boro Capital', score: 42 },
  { name: 'KGC Capital', score: 6 },
  { name: 'Legal & General Capital', score: 33 },
  { name: 'Plassa Capital', score: 70 },
  { name: 'Blank Slate Ventures', score: 11 },
  { name: 'Voqal', score: 86 },
  { name: '300 DAO', score: 13 },
  { name: 'Ecoast Angel Network', score: 10 },
  { name: 'Milliways Ventures', score: 6 },
  { name: 'Perkins Cove Partner', score: 15 },
  { name: 'Noveus Capital', score: 8 },
  { name: 'WEPOWER', score: 7 },
  { name: 'On Grid Ventures', score: 5 },
  { name: 'Fueled', score: 89 },
  { name: 'Stanford Angels of the United Kingdom', score: 6 },
  { name: 'Gordon Brothers', score: 81 },
  { name: 'Mysten Labs', score: 88 },
  { name: 'LEAP Global Partners', score: 32 },
  { name: 'US Innovative Technology Fund', score: 70 },
  { name: 'Decisive Point', score: 90 },
  { name: 'Behind Genius', score: 51 },
  { name: 'PsyMed Ventures', score: 49 },
  { name: 'Apposite Capital', score: 77 },
  { name: 'Crescent Cove Advisors', score: 54 },
  { name: 'Empirical Ventures', score: 87 },
  { name: 'The Longevity Fund', score: 17 },
  { name: 'Quilam Capital', score: 62 },
  { name: 'Not Boring', score: 65 },
  { name: 'Novalis LifeSciences', score: 26 },
  { name: 'Blueprint Equity', score: 52 },
  { name: 'Sacramento Angels', score: 69 },
  { name: 'Richmond Global Ventures', score: 22 },
  { name: 'Blueberry Ventures', score: 1 },
  { name: 'Bronze Valley', score: 63 },
  { name: 'Operate', score: 63 },
  { name: 'SWIG Finance', score: 72 },
  { name: 'Impatient Ventures', score: 76 },
  { name: 'Love Ventures', score: 42 },
  { name: 'Chalfen Ventures', score: 70 },
  { name: 'Plug & Play Topeka', score: 82 },
  { name: 'Alex Rodriguez', score: 19 },
  { name: 'Archangel', score: 1 },
  { name: 'Ignite Group', score: 14 },
  { name: 'Suffolk Equity Partners', score: 6 },
  { name: 'SWAT Equity Partners', score: 27 },
  { name: 'Zebra Ventures', score: 7 },
  { name: 'Founders.ai', score: 5 },
  { name: 'Round Hill Ventures', score: 6 },
  { name: 'Elsewhere Partners', score: 66 },
  { name: 'SYSTEMIQ', score: 90 },
  { name: 'Refinery Ventures', score: 46 },
  { name: 'Drive by DraftKings', score: 41 },
  { name: 'PruVen Capital', score: 82 },
  { name: 'Industrious Ventures', score: 90 },
  { name: 'Union Labs Ventures', score: 47 },
  { name: 'PHX Ventures', score: 87 },
  { name: 'Cosmic Venture Partners', score: 58 },
  { name: 'Range Ventures', score: 43 },
  { name: 'Concord Health Partners', score: 74 },
  { name: 'Counteract', score: 92 },
  { name: 'Bose Ventures', score: 41 },
  { name: 'InCube Ventures', score: 24 },
  { name: 'Visionary Venture Fund', score: 40 },
  { name: 'Sound Media Ventures', score: 26 },
  { name: 'Abstraction Capital', score: 65 },
  { name: 'The Halo Fund', score: 17 },
  { name: 'Twin Ventures', score: 38 },
  { name: 'Prehype', score: 7 },
  { name: '1/0 Capital', score: 7 },
  { name: 'KHP Ventures', score: 62 },
  { name: 'Spice Capital', score: 24 },
  { name: 'Morrison Seger Venture Capital Partners', score: 57 },
  { name: 'Start Capital', score: 6 },
  { name: 'Emerging Technology Partners', score: 37 },
  { name: 'RTX Ventures', score: 91 },
  { name: 'Militello Capital', score: 11 },
  { name: '99 Tartans', score: 6 },
  { name: 'Vine St. Ventures', score: 5 },
  { name: 'Redwood Venture Partners', score: 7 },
  { name: 'reinmkr capital', score: 5 },
  { name: 'RWI Group', score: 47 },
  { name: 'General Global Capital', score: 34 },
  { name: 'VanEck', score: 97 },
  { name: 'Paper Ventures', score: 93 },
  { name: 'Tamarind Hill', score: 36 },
  { name: 'First Spark Ventures', score: 44 },
  { name: 'Signet Healthcare Partners', score: 10 },
  { name: 'Working Capital', score: 41 },
  { name: '8090 Industries', score: 51 },
  { name: '4BIO Capital', score: 49 },
  { name: 'The CU Healthcare Innovation Fund', score: 70 },
  { name: 'Allianz Life Ventures', score: 82 },
  { name: 'Difference Partners', score: 17 },
  { name: 'TEL Venture Capital', score: 58 },
  { name: 'Blue Haven Initiative', score: 7 },
  { name: 'FullCircle', score: 36 },
  { name: 'Tokyo Black', score: 85 },
  { name: 'Excelestar Ventures', score: 33 },
  { name: 'SeaAhead', score: 55 },
  { name: 'Hawktail Management', score: 55 },
  { name: 'Eagle Venture Fund', score: 38 },
  { name: 'Jemison Investment Company', score: 15 },
  { name: 'Maccabee Ventures', score: 38 },
  { name: 'Intersect VC', score: 19 },
  { name: 'Cipholio Ventures', score: 26 },
  { name: 'Sky Ventures Group', score: 40 },
  { name: 'Cygni Capital', score: 17 },
  { name: 'Koch Strategic Platforms', score: 6 },
  { name: 'Simple.capital', score: 23 },
  { name: 'Gambit Ventures', score: 5 },
  { name: 'Charlotte Angel Fund', score: 24 },
  { name: 'The Garage Soho', score: 8 },
  { name: 'Firstrock Capital', score: 4 },
  { name: 'Omidyar Technology Ventures', score: 6 },
  { name: 'Two River', score: 33 },
  { name: 'Big Red Ventures', score: 21 },
  { name: 'Beta Fund', score: 63 },
  { name: 'Finance Birmingham', score: 6 },
  { name: 'FinRebel', score: 7 },
  { name: 'Venture Management', score: 6 },
  { name: 'Key Venture Partners', score: 43 },
  { name: 'Sebastian Mejia', score: 60 },
  { name: 'Block Ventures', score: 5 },
  { name: 'Powerhouse Capital', score: 40 },
  { name: 'Begin Capital', score: 38 },
  { name: 'Floating Point', score: 71 },
  { name: 'SustainVC', score: 41 },
  { name: 'Boulder Food Group (\'BFG\')', score: 41 },
  { name: 'Gigafund', score: 39 },
  { name: 'Ardent Venture Partners', score: 84 },
  { name: 'BioCrossroads', score: 50 },
  { name: 'B. Riley Financial', score: 76 },
  { name: 'Brookstone Venture Capital', score: 39 },
  { name: 'MUUS', score: 89 },
  { name: 'Socially Financed', score: 71 },
  { name: 'Ag Startup Engine', score: 32 },
  { name: 'PS27 Ventures', score: 56 },
  { name: 'Room40 Ventures', score: 62 },
  { name: 'Interlock Partners', score: 38 },
  { name: 'UL Ventures', score: 5 },
  { name: 'Underdog Labs', score: 73 },
  { name: 'Pipeline Capital', score: 11 },
  { name: 'CrowdStrike Falcon Fund', score: 94 },
  { name: 'PULSAR', score: 24 },
  { name: 'Caruso Ventures', score: 19 },
  { name: 'BANA Angels', score: 15 },
  { name: 'GAN Ventures', score: 7 },
  { name: 'OneLiberty Ventures', score: 56 },
  { name: 'Goldcrest Investments', score: 45 },
  { name: 'Charter Life Sciences', score: 0 },
  { name: 'Wand Partners', score: 60 },
  { name: 'Leo Capital Holdings', score: 0 },
  { name: 'Berkeley International Capital Corporation', score: 42 },
  { name: 'Oxford Investment Consultants LLP', score: 24 },
  { name: 'Solana', score: 7 },
  { name: 'Silent Ventures', score: 91 },
  { name: 'Metrodora Ventures', score: 44 },
  { name: 'Character', score: 52 },
  { name: 'Northern Gritstone', score: 93 },
  { name: 'Plural Platform', score: 94 },
  { name: 'Palm Tree Crew', score: 97 },
  { name: 'Walden Catalyst', score: 41 },
  { name: 'Vector Capital', score: 12 },
  { name: 'Piva Capital', score: 46 },
  { name: 'Sum Ventures', score: 73 },
  { name: 'Future Positive', score: 48 },
  { name: 'REFASHIOND Ventures', score: 33 },
  { name: 'Adit Ventures', score: 30 },
  { name: 'Literacy Capital', score: 86 },
  { name: 'William Blair', score: 86 },
  { name: 'Starbridge Venture Capital', score: 38 },
  { name: 'Sure Ventures', score: 77 },
  { name: 'Wheelhouse 360 Partners', score: 44 },
  { name: 'Callais Capital', score: 41 },
  { name: 'Leawood Venture Capital', score: 20 },
  { name: 'Cigna Ventures', score: 34 },
  { name: 'Align Ventures', score: 41 },
  { name: 'Legal & General', score: 77 },
  { name: 'Foresight Williams', score: 7 },
  { name: 'Outliers Venture Capital', score: 48 },
  { name: 'Shell Foundation', score: 87 },
  { name: 'Creative England', score: 31 },
  { name: 'Family Angel Management Fund', score: 18 },
  { name: 'SteelSky Ventures', score: 36 },
  { name: 'Singularity Capital', score: 84 },
  { name: 'NOEMIS Ventures', score: 37 },
  { name: 'Baron Capital', score: 33 },
  { name: 'XLR8UH', score: 12 },
  { name: 'NextEquity Partners', score: 20 },
  { name: 'Boom Capital Ventures', score: 31 },
  { name: 'Lupa Systems', score: 13 },
  { name: 'AMED Ventures', score: 60 },
  { name: 'Zinal Growth', score: 16 },
  { name: 'Heartland Ventures', score: 74 },
  { name: 'Volta Circle', score: 31 },
  { name: 'Darling Ventures', score: 6 },
  { name: 'New Climate Ventures', score: 69 },
  { name: 'Big Rock', score: 90 },
  { name: 'Sherbrooke Capital', score: 20 },
  { name: 'DFJ Portage Ventures', score: 20 },
  { name: 'Taureon', score: 28 },
  { name: 'Silvertech Ventures', score: 37 },
  { name: 'BioMed Ventures', score: 5 },
  { name: 'GD10 Ventures', score: 29 },
  { name: 'Simpleweb', score: 77 },
  { name: 'Rcapital', score: 39 },
  { name: 'Earlsfield Capital', score: 5 },
  { name: 'Crimson Seed Capital', score: 4 },
  { name: 'Herald Ventures', score: 91 },
  { name: 'Steadfast Capital Management', score: 5 },
  { name: 'KM Capital', score: 5 },
  { name: 'CoVenture', score: 93 },
  { name: 'Oxx', score: 53 },
  { name: 'SHAKTI', score: 84 },
  { name: 'Derive Ventures', score: 93 },
  { name: 'Gratitude Railroad', score: 55 },
  { name: 'EMVC', score: 84 },
  { name: 'Yellow Rocks!', score: 91 },
  { name: 'Evolve Ventures', score: 26 },
  { name: 'Cypher Capital', score: 83 },
  { name: 'Phyto Partners', score: 30 },
  { name: 'Lynett Capital', score: 5 },
  { name: 'Loup Ventures', score: 25 },
  { name: 'Grit Capital Partners', score: 58 },
  { name: 'BrightEdge Fund', score: 52 },
  { name: 'Transpose Platform Management', score: 85 },
  { name: 'Healthworx', score: 33 },
  { name: 'Massive', score: 74 },
  { name: 'CME Ventures', score: 92 },
  { name: 'Flywheel Fund', score: 32 },
  { name: 'Radicle Growth', score: 61 },
  { name: 'GoldenArc Capital', score: 6 },
  { name: 'Cambridge Companies', score: 89 },
  { name: 'Taver Capital Partners', score: 5 },
  { name: 'Winton Ventures', score: 2 },
  { name: 'SWAN Venture Fund', score: 17 },
  { name: 'Start Co.', score: 7 },
  { name: 'Ecosystem Ventures', score: 10 },
  { name: 'H.I.G. BioHealth Partners', score: 3 },
  { name: 'Windcrest Partners', score: 14 },
  { name: 'Meltwind Advisory', score: 65 },
  { name: 'ORIX Ventures', score: 6 },
  { name: 'Staenberg Venture Partners', score: 15 },
  { name: 'i-Hatch Ventures', score: 63 },
  { name: 'Swordfish Investments', score: 11 },
  { name: 'Abundance Partners', score: 6 },
  { name: '316VC', score: 3 },
  { name: 'Starship Ventures', score: 58 },
  { name: 'Ridgeline', score: 87 },
  { name: 'Nomad Ventures', score: 88 },
  { name: 'Delin Ventures', score: 65 },
  { name: 'EnCap Flatrock Midstream', score: 80 },
  { name: 'Edge VC', score: 37 },
  { name: 'Transform Capital', score: 41 },
  { name: 'Micron Ventures', score: 89 },
  { name: 'Novaquest Capital Management', score: 26 },
  { name: 'FootPrint Coalition', score: 33 },
  { name: 'Biomatics Capital Partners', score: 28 },
  { name: 'Motus Ventures', score: 41 },
  { name: '4490 Ventures', score: 21 },
  { name: 'e2vc', score: 54 },
  { name: 'Ride Home Fund', score: 71 },
  { name: 'Rise Capital', score: 22 },
  { name: 'Boundary Capital Partners LLP', score: 41 },
  { name: 'DOT Capital', score: 24 },
  { name: 'Jennison Associates', score: 57 },
  { name: 'Far Out Ventures', score: 49 },
  { name: 'SuperAngel.Fund', score: 40 },
  { name: 'Next Wave Impact', score: 2 },
  { name: 'Broad Street Angels', score: 16 },
  { name: 'Rivet Ventures', score: 2 },
  { name: 'Wildcat Capital Management', score: 12 },
  { name: 'South East Angels', score: 65 },
  { name: 'BroadOak Capital Partners', score: 11 },
  { name: 'MOHARA', score: 89 },
  { name: 'Convoi Ventures', score: 26 },
  { name: 'Parade Ventures', score: 11 },
  { name: 'Xploration Capital', score: 4 },
  { name: 'GC Angels', score: 63 },
  { name: '280 Capital', score: 80 },
  { name: 'Evergy Ventures', score: 32 },
  { name: 'Walking Ventures', score: 4 },
  { name: 'North South Ventures', score: 42 },
  { name: 'Fort Ventures', score: 6 },
  { name: 'MRTNZ Ventures', score: 5 },
  { name: 'Prelude Fund', score: 5 },
  { name: 'CV Catalyst Fund', score: 6 },
  { name: 'Silicon Valley Syndicate Club', score: 5 },
  { name: 'INSEAD Business Angels Alumni France', score: 85 },
  { name: 'Struck Crypto', score: 4 },
  { name: 'Cobre Capital', score: 2 },
  { name: 'Kormeli', score: 6 },
  { name: 'Silicon Alley Venture Partners', score: 11 },
  { name: 'Baltimore Angels', score: 4 },
  { name: 'Eugene M. Lang Entrepreneurial Initiative Fund', score: 8 },
  { name: 'Benaroya Capital', score: 20 },
  { name: 'North East Development Capital Fund', score: 28 },
  { name: 'The Games Fund', score: 49 },
  { name: 'SmartGateVC', score: 45 },
  { name: 'Oui Capital', score: 85 },
  { name: 'Naples Technology Ventures', score: 31 },
  { name: 'Quantum Energy Partners', score: 56 },
  { name: 'Outsiders Fund', score: 88 },
  { name: 'Wisdom Ventures', score: 43 },
  { name: 'Dispersion Capital', score: 92 },
  { name: 'R42 Group', score: 47 },
  { name: 'Predictive', score: 71 },
  { name: 'NewBound Venture Capital', score: 63 },
  { name: 'Cleo Capital', score: 33 },
  { name: 'Interlace Ventures', score: 30 },
  { name: '40 North Ventures', score: 17 },
  { name: 'Trifecta Capital', score: 72 },
  { name: 'Braidwell', score: 90 },
  { name: 'Space.VC', score: 54 },
  { name: 'MiLA Capital (Make in LA)', score: 6 },
  { name: 'B37 Ventures', score: 71 },
  { name: 'Krillion Ventures', score: 11 },
  { name: 'SALT Fund', score: 86 },
  { name: 'Republic Crypto', score: 86 },
  { name: 'GRA Venture Fund', score: 2 },
  { name: 'Crush Ventures', score: 50 },
  { name: 'Phenomen', score: 4 },
  { name: 'Subversive Capital', score: 80 },
  { name: 'Leonis Capital', score: 22 },
  { name: 'The New Normal Fund', score: 45 },
  { name: 'Enhanced Capital Partners', score: 87 },
  { name: 'All Blue Capital', score: 5 },
  { name: 'Brainstorm Ventures', score: 64 },
  { name: 'Velos Partners', score: 2 },
  { name: 'PNC Mezzanine Capital', score: 7 },
  { name: 'Hewlett Packard Pathfinder', score: 58 },
  { name: 'North West Quadrant Ventures ( NWQ Ventures)', score: 7 },
  { name: 'Saban Ventures', score: 38 },
  { name: 'Montauk Ventures', score: 12 },
  { name: 'Research Corporation Technologies', score: 29 },
  { name: 'Triblock', score: 6 },
  { name: 'Nexus Investment Ventures', score: 4 },
  { name: 'Gold Hill Capital', score: 4 },
  { name: 'Stage One Capital', score: 6 },
  { name: 'Angels 5K', score: 6 },
  { name: 'Kickstarter', score: 68 },
  { name: 'Exceptional Ventures', score: 82 },
  { name: 'Twelve Below', score: 92 },
  { name: 'Gilgamesh Ventures', score: 91 },
  { name: 'NewRoad Capital Partners', score: 48 },
  { name: 'Isomer Capital', score: 80 },
  { name: 'Highbridge Capital Management', score: 45 },
  { name: 'New Mexico Vintage Fund', score: 71 },
  { name: 'Health Velocity Capital', score: 42 },
  { name: 'Shadow Ventures', score: 87 },
  { name: 'Navigate Ventures', score: 37 },
  { name: 'Avanta Ventures', score: 74 },
  { name: 'IBM Ventures', score: 34 },
  { name: 'Taurus Ventures', score: 37 },
  { name: 'Fine Structure Venture', score: 64 },
  { name: 'Fellows Fund', score: 70 },
  { name: 'SNR.vc', score: 89 },
  { name: 'SIS Ventures', score: 48 },
  { name: 'Recurring Capital Partners', score: 28 },
  { name: 'C² Ventures', score: 60 },
  { name: 'Stella Capital', score: 71 },
  { name: 'Sparkland Capital', score: 5 },
  { name: 'Companion Fund', score: 33 },
  { name: 'First Rays Venture Partners', score: 18 },
  { name: 'Fortified Ventures', score: 27 },
  { name: 'SeaPoint Ventures', score: 44 },
  { name: 'AGO Partners', score: 9 },
  { name: 'Rockpool Investments', score: 33 },
  { name: 'Blue Slide Ventures', score: 4 },
  { name: 'Trellis Partners', score: 29 },
  { name: 'Nimes Capital', score: 25 },
  { name: 'Voyager Ventures', score: 48 },
  { name: 'Haun Ventures', score: 89 },
  { name: 'Leadout Capital', score: 44 },
  { name: 'VamosVentures', score: 52 },
  { name: 'Intermediate Capital Group', score: 90 },
  { name: 'Hivemind Capital Partners', score: 84 },
  { name: 'LightShed Ventures', score: 46 },
  { name: 'Libertus Capital', score: 43 },
  { name: 'St. Cloud Capital', score: 89 },
  { name: 'Maple VC', score: 45 },
  { name: 'Excelerate Health Ventures', score: 34 },
  { name: 'Eudemian Ventures', score: 82 },
  { name: 'Early Light Ventures', score: 73 },
  { name: 'MassMutual Impact Investing', score: 29 },
  { name: 'Elm Street Ventures', score: 42 },
  { name: 'SeaChange', score: 28 },
  { name: 'Torrey Pines Investment', score: 16 },
  { name: 'Cherry Tree Investments', score: 2 },
  { name: 'Brewer Lane Ventures', score: 68 },
  { name: 'DivInc', score: 81 },
  { name: 'Imagination Capital', score: 33 },
  { name: 'Mindrock Capital', score: 6 },
  { name: 'Eden Block', score: 85 },
  { name: 'Foreword Ventures', score: 56 },
  { name: 'eLab Ventures', score: 35 },
  { name: 'E8 Angels', score: 31 },
  { name: 'Network Ventures', score: 57 },
  { name: 'Vala Capital', score: 31 },
  { name: 'Locus Ventures', score: 4 },
  { name: 'Dace Ventures', score: 3 },
  { name: 'Quixotic Ventures', score: 5 },
  { name: 'Pacific Venture Group', score: 12 },
  { name: 'Information Technology Ventures', score: 14 },
  { name: 'Schroders Capital', score: 96 },
  { name: 'The Helm', score: 43 },
  { name: 'Figment Capital', score: 37 },
  { name: 'Upward', score: 30 },
  { name: 'Red & Blue Ventures', score: 54 },
  { name: 'Next Level Ventures', score: 28 },
  { name: 'DEFTA Partners', score: 32 },
  { name: 'The Accelerator Group', score: 36 },
  { name: 'Ventures Together', score: 87 },
  { name: 'Automotive Ventures', score: 70 },
  { name: 'Stanley Ventures', score: 5 },
  { name: 'Guild Capital', score: 7 },
  { name: 'Wealth Club', score: 88 },
  { name: 'Fidelity International Strategic Ventures', score: 27 },
  { name: 'Factor E', score: 19 },
  { name: 'EMV Capital', score: 20 },
  { name: 'Western Digital Capital', score: 7 },
  { name: 'Hudson Structured Capital Management', score: 30 },
  { name: 'Coinvestor Ventures', score: 85 },
  { name: 'Basement Fund', score: 5 },
  { name: 'Beacon Angels', score: 42 },
  { name: 'Cycad Group', score: 7 },
  { name: 'InnoCal Venture Capital', score: 26 },
  { name: 'Node Kapital', score: 16 },
  { name: 'American River Ventures', score: 44 },
  { name: 'Vesbridge Partners', score: 32 },
  { name: 'Zeal Capital Partners', score: 79 },
  { name: 'L\'ATTITUDE Ventures', score: 74 },
  { name: 'Renegade Partners', score: 45 },
  { name: 'Ironspring Ventures', score: 63 },
  { name: 'Hawke Ventures', score: 49 },
  { name: 'Fifth Down Capital', score: 71 },
  { name: 'Cayuga Venture Fund', score: 24 },
  { name: 'TIAA', score: 78 },
  { name: 'Columbia Lake Partners', score: 43 },
  { name: 'Empire Angels', score: 22 },
  { name: 'Eastlink Capital', score: 41 },
  { name: 'Lattice Fund', score: 30 },
  { name: 'u.ventures', score: 80 },
  { name: 'Red Bear Angels', score: 4 },
  { name: 'CoFound Partners', score: 46 },
  { name: 'Nomad Capital', score: 86 },
  { name: 'Cold Start Ventures', score: 9 },
  { name: 'Atacama Ventures', score: 29 },
  { name: 'Gate Labs', score: 27 },
  { name: 'Allied Minds', score: 6 },
  { name: 'Flywheel Ventures', score: 3 },
  { name: 'Infinity Capital', score: 2 },
  { name: 'Sierra Angels', score: 5 },
  { name: 'Ohio TechAngels Fund', score: 2 },
  { name: 'Bootstrapped Debt Financing', score: 71 },
  { name: 'Avalanche', score: 93 },
  { name: 'AIX Ventures', score: 93 },
  { name: 'The General Partnership', score: 93 },
  { name: 'basecase capital', score: 54 },
  { name: 'DivcoWest', score: 53 },
  { name: 'Avid Ventures', score: 70 },
  { name: 'Arrowroot Capital Management', score: 23 },
  { name: 'Redbud VC', score: 70 },
  { name: 'Omega Venture Partners', score: 47 },
  { name: 'The PenFed Foundation', score: 68 },
  { name: 'Mesa Verde Venture Partners', score: 26 },
  { name: 'University System of Maryland Momentum Fund', score: 7 },
  { name: 'MemorialCare Innovation Fund', score: 10 },
  { name: 'Edenred Capital Partners', score: 33 },
  { name: 'Battle Born Venture', score: 85 },
  { name: 'Generation Ventures', score: 5 },
  { name: 'Scotia Capital', score: 33 },
  { name: 'EC1 Capital', score: 2 },
  { name: 'Buffalo Innovation Seed Fund', score: 39 },
  { name: 'Argo Global Capital', score: 34 },
  { name: 'Solasta Ventures', score: 32 },
  { name: 'NightDragon', score: 59 },
  { name: 'Equal Ventures', score: 39 },
  { name: 'Garuda Ventures', score: 92 },
  { name: 'Pappas Capital', score: 52 },
  { name: 'devlabs', score: 44 },
  { name: 'Liberty Mutual Strategic Ventures', score: 44 },
  { name: 'Eos Venture Partners', score: 50 },
  { name: 'Conductive Ventures', score: 77 },
  { name: 'Katalyst Ventures', score: 51 },
  { name: 'Lloyds Banking Group', score: 88 },
  { name: 'SeaX Ventures', score: 79 },
  { name: 'Broom Ventures', score: 80 },
  { name: '500 Startups', score: 91 },
  { name: 'U.S. Department of the Treasury', score: 26 },
  { name: 'Claritas Capital', score: 9 },
  { name: 'PTV Healthcare Capital', score: 1 },
  { name: 'Four Acres Capital', score: 75 },
  { name: 'Eberg Capital', score: 57 },
  { name: 'G9 Ventures', score: 67 },
  { name: 'British Business Investments', score: 67 },
  { name: 'Battelle Ventures', score: 34 },
  { name: 'ID8 Investments', score: 5 },
  { name: 'Mistral Equity Partners', score: 16 },
  { name: 'CSA Partners LLC', score: 4 },
  { name: 'Care Capital', score: 25 },
  { name: 'Juno Capital Partners', score: 6 },
  { name: 'Capital Resource Partners', score: 13 },
  { name: 'iD Ventures America', score: 7 },
  { name: 'Experian Ventures', score: 54 },
  { name: 'Accelerate Venture Partners', score: 7 },
  { name: 'High Country Venture', score: 2 },
  { name: 'Sustainable Food Ventures', score: 67 },
  { name: 'Tudor Growth Equity', score: 42 },
  { name: 'Kite Ventures', score: 8 },
  { name: 'Luma Launch', score: 5 },
  { name: 'Ahren Innovation Capital', score: 67 },
  { name: 'Qiming Venture Partners USA', score: 83 },
  { name: 'ARK Investment Management', score: 89 },
  { name: 'CIVC Partners', score: 93 },
  { name: 'FYRFLY Venture Partners', score: 36 },
  { name: 'Morgan Creek Capital Management', score: 39 },
  { name: 'The Artemis Fund', score: 67 },
  { name: 'Genoa Ventures', score: 69 },
  { name: 'Slauson & Co.', score: 86 },
  { name: 'Vision Ridge Capital Partners', score: 74 },
  { name: 'VoLo Earth Ventures', score: 43 },
  { name: 'Brightstone Venture Capital', score: 19 },
  { name: 'Earth Foundry', score: 32 },
  { name: 'AP Ventures', score: 67 },
  { name: 'JAM FINTOP', score: 92 },
  { name: 'Shawbrook Bank', score: 94 },
  { name: 'Atypical Ventures', score: 55 },
  { name: 'Launchpad Capital', score: 14 },
  { name: 'UP2398', score: 12 },
  { name: 'SWaN & Legend Venture Partners', score: 3 },
  { name: 'American Family Insurance Institute for Corporate and Social Impact', score: 18 },
  { name: 'North East Growth Capital Fund', score: 46 },
  { name: 'Keshif Ventures', score: 37 },
  { name: 'Pond Ventures', score: 17 },
  { name: 'SenaHill Partners', score: 5 },
  { name: 'Finance Yorkshire', score: 39 },
  { name: 'Pivotal bioVenture Partners', score: 12 },
  { name: 'Advance Venture Partners', score: 67 },
  { name: 'Conviction VC', score: 50 },
  { name: 'P1 Ventures', score: 87 },
  { name: 'Taiho Ventures', score: 52 },
  { name: 'Studio VC', score: 34 },
  { name: 'TechSquare Labs', score: 2 },
  { name: 'Media Development Investment Fund', score: 38 },
  { name: 'Harbinger Ventures', score: 34 },
  { name: 'Overture VC', score: 88 },
  { name: 'Peak 6', score: 17 },
  { name: 'Invest Northern Ireland', score: 85 },
  { name: 'Knight Foundation', score: 88 },
  { name: 'East West Bank', score: 67 },
  { name: 'American Capital', score: 73 },
  { name: 'Blue Heron Capital', score: 11 },
  { name: 'Hanover Technology Investment Management', score: 63 },
  { name: 'HighSage Ventures', score: 71 },
  { name: 'Sente Ventures', score: 34 },
  { name: 'Octave', score: 91 },
  { name: 'Ten31', score: 22 },
  { name: 'Fourth Revolution Capital', score: 46 },
  { name: 'Astraecho Capital', score: 73 },
  { name: 'Softline Venture Partners', score: 7 },
  { name: 'Greenhouse Capital Partners', score: 10 },
  { name: 'BEV Capital', score: 62 },
  { name: 'Appian Ventures', score: 30 },
  { name: 'Viventures', score: 83 },
  { name: 'Needham Capital Partners', score: 54 },
  { name: 'Kal Vepuri', score: 5 },
  { name: 'Companyon Ventures', score: 67 },
  { name: 'Harpoon', score: 87 },
  { name: 'Tectonic Ventures', score: 35 },
  { name: 'J2 Ventures', score: 94 },
  { name: 'Silicon Road Ventures', score: 82 },
  { name: 'CAVU Consumer Partners', score: 29 },
  { name: 'McCarthy Capital', score: 62 },
  { name: 'Class 5 Global', score: 31 },
  { name: 'To Kenz Capital', score: 33 },
  { name: 'Cyber Mentor Fund', score: 39 },
  { name: 'UTXO Management', score: 89 },
  { name: 'SpringTide Ventures', score: 73 },
  { name: 'Unbound', score: 67 },
  { name: 'Necessary Ventures', score: 41 },
  { name: 'Inventages Venture Capital Investment Inc.', score: 15 },
  { name: 'One Planet Group', score: 14 },
  { name: 'Waterline Ventures', score: 39 },
  { name: 'PAR Capital Management', score: 67 },
  { name: 'Psilos Group', score: 4 },
  { name: 'Ericsson Ventures', score: 39 },
  { name: 'NOMO Ventures', score: 63 },
  { name: 'AXM Venture Capital', score: 7 },
  { name: 'ATW Partners', score: 93 },
  { name: 'Argon Ventures', score: 42 },
  { name: 'Oxonian Ventures', score: 61 },
  { name: 'Aliment Capital', score: 67 },
  { name: 'Bull City Venture Partners', score: 67 },
  { name: 'Scottish National Investment Bank', score: 88 },
  { name: 'Lavrock Ventures', score: 57 },
  { name: 'Inflection.xyz', score: 46 },
  { name: 'SpringRock Ventures', score: 84 },
  { name: 'Embark Ventures', score: 6 },
  { name: 'Adjacent', score: 62 },
  { name: 'ConSensys Ventures', score: 21 },
  { name: 'Pura Vida Investments', score: 9 },
  { name: 'Type One Ventures', score: 59 },
  { name: 'NVentures', score: 88 },
  { name: 'UCL Technology Fund', score: 52 },
  { name: 'UPMC Enterprises', score: 77 },
  { name: 'Elizabeth Street Ventures', score: 41 },
  { name: 'Amplifyher Ventures', score: 34 },
  { name: 'EBRD Venture Capital', score: 76 },
  { name: 'Breed Reply', score: 4 },
  { name: 'Aurum Partners', score: 17 },
  { name: 'Scale-Up', score: 2 },
  { name: 'Hudson Ventures', score: 43 },
  { name: 'Boeing HorizonX Ventures', score: 29 },
  { name: 'NGN Capital', score: 3 },
  { name: 'Wormhole Capital', score: 9 },
  { name: 'Meritage Funds', score: 6 },
  { name: 'Aol Ventures', score: 3 },
  { name: '3M New Ventures', score: 57 },
  { name: 'Lakewest Venture Partners', score: 5 },
  { name: 'Cordova Ventures', score: 43 },
  { name: 'Braveheart Investment Group', score: 67 },
  { name: 'Gold House Ventures', score: 66 },
  { name: 'Riot Ventures', score: 60 },
  { name: 'Closed Loop Partners', score: 67 },
  { name: 'Faction', score: 93 },
  { name: 'Valor Ventures', score: 83 },
  { name: 'HCAP Partners', score: 64 },
  { name: 'M3 Ventures', score: 29 },
  { name: 'The LegalTech Fund', score: 51 },
  { name: 'LifeSci Venture Partners', score: 47 },
  { name: 'Outward VC', score: 84 },
  { name: 'Digital Sandbox KC', score: 67 },
  { name: 'SternAegis', score: 67 },
  { name: 'Emerald Development Managers', score: 57 },
  { name: 'Berkeley Catalyst Fund (BCF)', score: 28 },
  { name: 'LongJump', score: 56 },
  { name: 'Owl Rock Capital', score: 61 },
  { name: 'New World Angels', score: 30 },
  { name: 'Time Ventures', score: 58 },
  { name: 'TruStage Ventures', score: 41 },
  { name: 'Liberty Global', score: 43 },
  { name: 'Abell Foundation', score: 11 },
  { name: 'Access Biotechnology', score: 79 },
  { name: 'RTP Ventures', score: 67 },
  { name: 'Endeavour Ventures', score: 28 },
  { name: 'Velo Partners', score: 20 },
  { name: 'Formic Ventures', score: 5 },
  { name: 'Jeff Bezos', score: 50 },
  { name: 'Arts Alliance', score: 9 },
  { name: 'Adobe Ventures', score: 82 },
  { name: 'Blueprint Ventures', score: 43 },
  { name: 'UCLB', score: 96 },
  { name: 'ARC Angel Fund', score: 67 },
  { name: 'Arrington Capital', score: 86 },
  { name: 'Material Impact', score: 67 },
  { name: 'Flex Capital', score: 67 },
  { name: 'Leonid Capital Partners', score: 67 },
  { name: 'Visible Ventures', score: 53 },
  { name: 'Curql', score: 67 },
  { name: 'GroundForce Capital', score: 67 },
  { name: 'Swift Ventures', score: 52 },
  { name: 'Valor Siren Ventures', score: 30 },
  { name: 'Relevance Ventures (formerly Relevance Capital)', score: 67 },
  { name: 'Vertex Ventures HC', score: 67 },
  { name: 'Longwall Venture', score: 31 },
  { name: 'Stony Lonesome Group', score: 21 },
  { name: 'Fidelity International', score: 88 },
  { name: 'GS Futures', score: 92 },
  { name: 'Lucas Venture Group', score: 5 },
  { name: 'Black Jays', score: 21 },
  { name: 'Co-FundNI', score: 23 },
  { name: 'Wells Fargo Capital Finance', score: 60 },
  { name: 'TA Capital', score: 67 },
  { name: 'Doughty Hanson & Co', score: 2 },
  { name: 'Avalanche VC', score: 36 },
  { name: 'Tech Startup Stabilization Fund', score: 5 },
  { name: 'Frazier Technology Ventures', score: 23 },
  { name: '77 — by SBXi', score: 8 },
  { name: 'Convivialite Ventures', score: 25 },
  { name: 'Coinbase', score: 96 },
  { name: 'Grand Ventures', score: 86 },
  { name: 'Augment Ventures', score: 38 },
  { name: 'Springbank Collective', score: 89 },
  { name: 'Rhapsody Venture Partners', score: 51 },
  { name: 'Shangbay Capital', score: 50 },
  { name: 'Plum Alley', score: 41 },
  { name: 'Differential Ventures', score: 45 },
  { name: 'Golden Section', score: 49 },
  { name: 'InReach Ventures', score: 48 },
  { name: 'Sugar Capital', score: 80 },
  { name: 'Cove Fund', score: 36 },
  { name: 'StageDotO', score: 28 },
  { name: 'Finaventures', score: 12 },
  { name: 'Thiel Capital', score: 55 },
  { name: 'G1 Ventures', score: 48 },
  { name: 'Corner Ventures', score: 31 },
  { name: 'WindSail Capital Group', score: 16 },
  { name: 'Mayo Clinic Ventures', score: 27 },
  { name: 'HG Ventures', score: 90 },
  { name: 'Fortify Ventures', score: 90 },
  { name: 'Sandalphon Capital', score: 5 },
  { name: 'SC Launch, Inc.', score: 57 },
  { name: 'Tribeca Early Stage Partners', score: 17 },
  { name: 'Launchpad Digital Health', score: 12 },
  { name: '8 Decimal Capital', score: 4 },
  { name: 'Tugboat Ventures', score: 3 },
  { name: 'BYU Cougar Capital', score: 92 },
  { name: 'Duke Angel Network', score: 4 },
  { name: 'Collab Capital', score: 94 },
  { name: 'Suffolk Technologies', score: 83 },
  { name: 'EnCap Investments', score: 65 },
  { name: 'Grishin Robotics', score: 29 },
  { name: 'Dallas Venture Capital', score: 63 },
  { name: 'Databricks Ventures', score: 37 },
  { name: 'Telegraph Hill Partners', score: 67 },
  { name: 'Burst Capital', score: 78 },
  { name: 'MatterScale Ventures', score: 35 },
  { name: 'Concrete Rose Capital', score: 14 },
  { name: '2Shares', score: 45 },
  { name: 'DataTribe', score: 67 },
  { name: 'TGM ventures', score: 5 },
  { name: 'FAST — by GETTYLAB', score: 29 },
  { name: 'FOUNDER.org', score: 5 },
  { name: 'Canyon Creek Capital', score: 4 },
  { name: 'Van Wagoner Ventures, LLC', score: 46 },
  { name: 'Thomas Weisel Venture Partners', score: 48 },
  { name: 'Bracket Capital', score: 73 },
  { name: 'Yamaha Motor Ventures', score: 73 },
  { name: 'FM Capital', score: 78 },
  { name: 'Hiro Capital', score: 67 },
  { name: 'Launchbay Capital', score: 91 },
  { name: 'Arka Venture Labs', score: 28 },
  { name: 'The Entrepreneurs\' Fund', score: 67 },
  { name: 'focal', score: 42 },
  { name: 'Plus Capital', score: 13 },
  { name: 'MassDevelopment', score: 75 },
  { name: 'WestSummit Capital', score: 8 },
  { name: 'Spark Ventures', score: 8 },
  { name: 'Blockchain.com Ventures', score: 6 },
  { name: 'Wharton Alumni Angels', score: 4 },
  { name: 'West Quad Ventures', score: 5 },
  { name: 'Maxfield Capital', score: 1 },
  { name: 'Kommune.one', score: 14 },
  { name: 'Brentwood Venture Capital', score: 42 },
  { name: 'Ripple', score: 95 },
  { name: 'SineWave Ventures', score: 66 },
  { name: 'Dementia Discovery Fund', score: 89 },
  { name: 'LIQUiDITY Group', score: 80 },
  { name: 'Santander UK', score: 48 },
  { name: 'Luxor Capital Group', score: 67 },
  { name: 'Bezos Earth Fund', score: 57 },
  { name: 'Muse Capital', score: 45 },
  { name: 'Redbeard Ventures', score: 72 },
  { name: 'Stray Dog Capital', score: 39 },
  { name: 'DARPA', score: 41 },
  { name: 'DFS Lab', score: 43 },
  { name: 'IU Ventures', score: 67 },
  { name: 'Madrone Capital Partners', score: 42 },
  { name: 'Cambridge Capital Group', score: 89 },
  { name: 'Leap Venture Studio', score: 70 },
  { name: 'IDB Lab', score: 67 },
  { name: 'K2 HealthVentures', score: 56 },
  { name: 'Secocha Ventures', score: 4 },
  { name: 'UPS Ventures', score: 6 },
  { name: '137 Ventures', score: 49 },
  { name: 'SYN Ventures', score: 67 },
  { name: 'Active Partners', score: 60 },
  { name: 'SE Ventures', score: 93 },
  { name: 'Gresham House Ventures', score: 67 },
  { name: 'Wefunder', score: 89 },
  { name: 'Blisce', score: 87 },
  { name: 'Geek Ventures', score: 88 },
  { name: 'Alter Global', score: 54 },
  { name: 'Ascend Venture Capital', score: 67 },
  { name: 'Coelius Capital', score: 76 },
  { name: 'DAO Maker', score: 80 },
  { name: 'Clayton Associates', score: 1 },
  { name: 'dmg ventures', score: 67 },
  { name: 'The Venture Collective', score: 53 },
  { name: 'NPIF–Mercia Debt Finance', score: 78 },
  { name: 'The Kraft Group', score: 67 },
  { name: 'MedVenture Associates', score: 50 },
  { name: 'Define Ventures', score: 70 },
  { name: 'HealthX Ventures', score: 55 },
  { name: 'Town Hall Ventures', score: 51 },
  { name: 'Lever VC', score: 80 },
  { name: 'OVO Fund', score: 29 },
  { name: 'Sure Valley Ventures', score: 67 },
  { name: 'Grayhawk Capital', score: 37 },
  { name: 'Catalyst Health Ventures', score: 48 },
  { name: 'Tamiami Angel Funds', score: 16 },
  { name: 'JobsOhio', score: 48 },
  { name: 'Graphene Ventures', score: 48 },
  { name: 'Formless Capital', score: 74 },
  { name: 'CNF Investments, LLC', score: 4 },
  { name: 'MVP Ventures', score: 87 },
  { name: 'Crescent Capital', score: 3 },
  { name: 'O2h Ventures', score: 40 },
  { name: 'Panorama Capital', score: 43 },
  { name: 'Seabed VC', score: 3 },
  { name: 'Healthy Ventures', score: 22 },
  { name: 'HubSpot Ventures', score: 53 },
  { name: 'Phoenix Venture Partners', score: 39 },
  { name: 'Wipro Ventures', score: 89 },
  { name: 'Canapi Ventures', score: 47 },
  { name: 'Social Impact Capital', score: 67 },
  { name: 'Mercato Partners', score: 67 },
  { name: 'Acre Venture Partners', score: 67 },
  { name: 'Moonfire Ventures', score: 91 },
  { name: 'Monroe Capital', score: 69 },
  { name: 'Fountain Healthcare Partners', score: 35 },
  { name: 'BioStar Capital', score: 74 },
  { name: 'Partners Innovation Fund', score: 1 },
  { name: 'Excell Partners', score: 71 },
  { name: 'OS Fund', score: 2 },
  { name: 'Bridge Investments', score: 29 },
  { name: 'The Fintech Fund', score: 67 },
  { name: 'Feenix Venture Partners LLC', score: 15 },
  { name: 'Draper University Ventures', score: 20 },
  { name: 'Horizon Ventures', score: 12 },
  { name: 'StartFast Ventures', score: 5 },
  { name: 'Gula Tech Adventures', score: 38 },
  { name: 'WorldQuant Ventures LLC', score: 8 },
  { name: 'Harmonix Fund', score: 7 },
  { name: 'ZMT Capital', score: 16 },
  { name: 'THE CATALYTIC IMPACT FOUNDATION (CIF)', score: 36 },
  { name: 'Main Street Ventures', score: 51 },
  { name: 'Solstice Capital', score: 11 },
  { name: 'ONE WORLD Impact Investments LLC', score: 4 },
  { name: 'Powerhouse Ventures', score: 69 },
  { name: 'Riverside Acceleration Capital', score: 46 },
  { name: 'Recursive Ventures', score: 84 },
  { name: 'Energy Innovation Capital', score: 66 },
  { name: 'Silas Capital', score: 59 },
  { name: 'Lateral Frontiers', score: 10 },
  { name: 'Wisemont Capital', score: 7 },
  { name: 'Epidarex Capital', score: 14 },
  { name: 'DNS Capital', score: 81 },
  { name: 'Tudor Investments', score: 8 },
  { name: 'Good Friends', score: 52 },
  { name: 'Stata Venture Partners (SVP)', score: 43 },
  { name: 'Altitude Life Science Ventures', score: 29 },
  { name: 'Syncona Partners LLP', score: 68 },
  { name: 'Rubicon Venture Capital', score: 2 },
  { name: 'Revolution Ventures', score: 33 },
  { name: 'Glade Brook Capital Partners', score: 67 },
  { name: 'Next Play Capital', score: 54 },
  { name: 'Snowflake Ventures', score: 67 },
  { name: 'Elephant', score: 73 },
  { name: 'Marcy Venture Partners', score: 67 },
  { name: 'Climate Pledge Fund', score: 85 },
  { name: 'Northwestern Mutual Future Ventures', score: 67 },
  { name: 'Martin Ventures', score: 67 },
  { name: 'Leapfrog Ventures', score: 5 },
  { name: 'Lair East Labs', score: 10 },
  { name: 'G2 Venture Partners', score: 50 },
  { name: 'Decathlon Capital Partners', score: 62 },
  { name: 'Qbic Fund', score: 45 },
  { name: 'Chingona Ventures', score: 67 },
  { name: 'Revelation Partners', score: 76 },
  { name: 'Moment Ventures', score: 33 },
  { name: 'Sun Mountain Capital', score: 28 },
  { name: 'Topspin Partners', score: 24 },
  { name: 'Green Egg Ventures', score: 29 },
  { name: 'Martlet Capital', score: 54 },
  { name: 'Karatage', score: 90 },
  { name: 'Golden Angels Investors', score: 67 },
  { name: 'Capital Group', score: 56 },
  { name: 'RaliCap', score: 80 },
  { name: 'JDRF T1D Fund', score: 91 },
  { name: 'MGV', score: 43 },
  { name: 'Parkway Venture Capital', score: 46 },
  { name: 'Wireframe Ventures', score: 67 },
  { name: 'AI Seed', score: 7 },
  { name: 'Dreamers VC', score: 67 },
  { name: 'Cross Atlantic Capital Partners', score: 17 },
  { name: 'CHL Medical Partners', score: 20 },
  { name: 'Forefront Venture Partners', score: 19 },
  { name: 'Fantail Ventures', score: 4 },
  { name: 'VMG Partners', score: 68 },
  { name: 'Link Ventures', score: 84 },
  { name: 'Amity Ventures', score: 54 },
  { name: 'Energize Capital', score: 94 },
  { name: 'SpringTime Ventures', score: 83 },
  { name: 'Ubiquity Ventures', score: 67 },
  { name: 'Presence Capital', score: 2 },
  { name: 'Vine Ventures', score: 41 },
  { name: 'Blackfinch Ventures', score: 72 },
  { name: 'Sequel Venture Partners', score: 65 },
  { name: 'Microsoft Climate Innovation Fund', score: 40 },
  { name: 'Sageview Capital', score: 42 },
  { name: 'HealthQuest Capital', score: 53 },
  { name: 'Motley Fool Ventures', score: 81 },
  { name: 'TDK Ventures', score: 88 },
  { name: 'Frist Cressey Ventures', score: 50 },
  { name: 'Weekend Fund', score: 38 },
  { name: 'G20 Ventures', score: 15 },
  { name: 'Asymmetric Capital Partners', score: 58 },
  { name: 'AllianceBernstein', score: 68 },
  { name: 'TwentyTwo VC', score: 85 },
  { name: 'Lemnos VC', score: 2 },
  { name: 'Las Olas Venture Capital', score: 67 },
  { name: 'Deerfield Capital Management', score: 96 },
  { name: 'Knoll Ventures', score: 38 },
  { name: 'Kaleo Ventures', score: 85 },
  { name: 'Coughdrop Capital', score: 44 },
  { name: 'Sustainable Ventures', score: 84 },
  { name: 'Blossom Capital', score: 41 },
  { name: 'Goldman Sachs Investment Partners', score: 82 },
  { name: 'BGF Ventures', score: 66 },
  { name: 'SAIC Venture Capital', score: 12 },
  { name: 'Fulgur Ventures', score: 68 },
  { name: 'Covera Ventures', score: 4 },
  { name: 'Karlin Ventures', score: 4 },
  { name: 'Boston Scientific', score: 43 },
  { name: 'Diverse Angels', score: 20 },
  { name: 'Elevate Capital', score: 67 },
  { name: 'Rogue Venture Partners', score: 67 },
  { name: 'RevTech Ventures', score: 30 },
  { name: 'Decibel Partners', score: 49 },
  { name: 'Spero Ventures', score: 42 },
  { name: 'Counterpart Advisors', score: 5 },
  { name: 'McKesson Ventures', score: 34 },
  { name: 'Global Catalyst Partners', score: 90 },
  { name: 'Nvidia Inception', score: 40 }
];

// Transform raw data into Company objects with IDs and logos
const STATIC_COMPANIES_DATA: Company[] = RAW_COMPANIES_DATA.map(company => ({
  ...company,
  id: createSlug(company.name),
  logoUrl: generateFallbackAvatar(company.name),
  portfolio: [], // Will be populated from CSV
}));

// Function to fetch and parse portfolio data from CSV
const fetchPortfolioData = async (): Promise<Map<string, PortfolioCompany[]>> => {
  try {
    const response = await fetch('/VCSCORE_v2.csv');
    const csvText = await response.text();
    
    const portfolioMap = new Map<string, PortfolioCompany[]>();
    const lines = csvText.split('\n');
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      if (columns.length >= 22) {
        const vcName = columns[0];
        const portfolio: PortfolioCompany[] = [];
        
        // Extract portfolio companies from columns 8, 14, 20 with dates from 9, 15, 21 and investment types from 10, 16, 22
        const portfolioData = [
          { name: columns[8], date: columns[9], investmentType: columns[10] },
          { name: columns[14], date: columns[15], investmentType: columns[16] },
          { name: columns[20], date: columns[21], investmentType: columns[22] }
        ];
        
        portfolioData.forEach(({ name, date, investmentType }) => {
          if (name && name.trim() && name !== 'N/A') {
            // This is CSV data that needs parsing
            // Format is usually like "VanEck investment in Seed Round - CompanyName"
            let companyName = name.trim();
            let cleanInvestmentType = investmentType && investmentType.trim() && investmentType !== 'N/A' ? investmentType.trim() : 'Unknown';
            
            // Only parse if this looks like a CSV description (contains " - ")
            if (companyName.includes(' - ')) {
              // Try to extract company name from description if it follows the pattern
              const match = companyName.match(/.*?-\s*(.+)$/);
              if (match) {
                companyName = match[1].trim();
              }
              
              // Try to extract investment type from the description if not available in separate column
              if (cleanInvestmentType === 'Unknown' || cleanInvestmentType === 'investment') {
                const investmentMatch = name.match(/investment in (.+?) -/);
                if (investmentMatch) {
                  cleanInvestmentType = investmentMatch[1].trim();
                }
              }
            }
            
            portfolio.push({
              name: companyName,
              announcementDate: date && date.trim() ? date.trim() : 'Unknown',
              investmentType: cleanInvestmentType
            });
          }
        });
        
        if (portfolio.length > 0) {
          portfolioMap.set(vcName, portfolio);
        }
      }
    }
    
    return portfolioMap;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return new Map();
  }
};

// Custom hook to manage CSV data loading and processing with pagination
export const useCSVData = () => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const COMPANIES_PER_PAGE = 50; // Show 50 companies initially, then load more

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dynamic companies from API
        let dynamicCompanies = [];
        try {
          const response = await fetch('http://localhost:3001/api/companies');
          if (response.ok) {
            dynamicCompanies = await response.json();
          }
        } catch (apiError) {
          console.warn('API unavailable, using static data only');
        }
        
        // Fetch portfolio data
        const portfolioData = await fetchPortfolioData();
        
        // Merge with existing static companies
        const allCompaniesData = [...STATIC_COMPANIES_DATA, ...dynamicCompanies];
        
        // Merge portfolio data with all company data
        const companiesWithPortfolio = allCompaniesData.map(company => {
          // For dynamic companies (from API), preserve their existing portfolio data
          // For static companies, use CSV portfolio data
          const csvPortfolio = portfolioData.get(company.name) || [];
          const existingPortfolio = company.portfolio || [];
          
          // If company already has portfolio data (from API), keep it
          // Otherwise, use CSV portfolio data
          const portfolio = existingPortfolio.length > 0 ? existingPortfolio : csvPortfolio;
          
          return {
            ...company,
            portfolio
          };
        });
        
        // Sort by score (highest first)
        const sortedCompanies = companiesWithPortfolio.sort((a, b) => b.score - a.score);
        
        setAllCompanies(sortedCompanies);
        
        // Initially show only first page
        const initialCompanies = sortedCompanies.slice(0, COMPANIES_PER_PAGE);
        setCompanies(initialCompanies);
        setHasMore(sortedCompanies.length > COMPANIES_PER_PAGE);
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const loadMore = () => {
    console.log('🔄 loadMore called!', { 
      currentPage, 
      allCompaniesLength: allCompanies.length, 
      currentCompaniesLength: companies.length,
      hasMore 
    });
    
    const nextPage = currentPage + 1;
    const startIndex = currentPage * COMPANIES_PER_PAGE;
    const endIndex = startIndex + COMPANIES_PER_PAGE;
    
    console.log('📊 Pagination details:', { nextPage, startIndex, endIndex });
    
    const newCompanies = allCompanies.slice(startIndex, endIndex);
    
    console.log('📦 New companies to add:', newCompanies.length);
    
    if (newCompanies.length > 0) {
      setCompanies(prev => {
        const updated = [...prev, ...newCompanies];
        console.log('✅ Updated companies array:', updated.length);
        return updated;
      });
      setCurrentPage(nextPage);
      setHasMore(endIndex < allCompanies.length);
      console.log('🔄 Updated state:', { nextPage, hasMore: endIndex < allCompanies.length });
    } else {
      console.log('❌ No more companies to load');
      setHasMore(false);
    }
  };

  const searchCompanies = (searchTerm: string): Company[] => {
    if (!searchTerm.trim()) {
      return companies;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return allCompanies.filter(company =>
      company.name.toLowerCase().includes(searchLower)
    );
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dynamic companies from API
      let dynamicCompanies = [];
      try {
        const response = await fetch('http://localhost:3001/api/companies');
        if (response.ok) {
          dynamicCompanies = await response.json();
        }
      } catch (apiError) {
        console.warn('API unavailable, using static data only');
      }
      
      // Fetch portfolio data
      const portfolioData = await fetchPortfolioData();
      
      // Merge with existing static companies
      const allCompaniesData = [...STATIC_COMPANIES_DATA, ...dynamicCompanies];
      
      // Merge portfolio data with all company data
      const companiesWithPortfolio = allCompaniesData.map(company => {
        // For dynamic companies (from API), preserve their existing portfolio data
        // For static companies, use CSV portfolio data
        const csvPortfolio = portfolioData.get(company.name) || [];
        const existingPortfolio = company.portfolio || [];
        
        // If company already has portfolio data (from API), keep it
        // Otherwise, use CSV portfolio data
        const portfolio = existingPortfolio.length > 0 ? existingPortfolio : csvPortfolio;
        
        return {
          ...company,
          portfolio
        };
      });
      
      // Sort by score (highest first)
      const sortedCompanies = companiesWithPortfolio.sort((a, b) => b.score - a.score);
      
      setAllCompanies(sortedCompanies);
      
      // Reset pagination and show first page
      const initialCompanies = sortedCompanies.slice(0, COMPANIES_PER_PAGE);
      setCompanies(initialCompanies);
      setCurrentPage(1);
      setHasMore(sortedCompanies.length > COMPANIES_PER_PAGE);
      
      setError(null);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh company data');
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    companies, 
    allCompanies,
    isLoading, 
    error, 
    hasMore,
    loadMore,
    searchCompanies,
    refreshData,
    totalCount: allCompanies.length,
    loadedCount: companies.length
  };
};

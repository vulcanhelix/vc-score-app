interface LogoServiceResponse {
  logoUrl: string | null;
  error?: string;
}

// Cache for logo URLs with expiration
interface LogoCache {
  [key: string]: {
    url: string | null;
    timestamp: number;
    expires: number;
  };
}

// Cache duration: 24 hours
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'company_logo_cache';

// Get cache from localStorage
const getLogoCache = (): LogoCache => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

// Save cache to localStorage
const saveLogoCache = (cache: LogoCache): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore localStorage errors
  }
};

// Check if cache entry is valid
const isCacheValid = (entry: LogoCache[string]): boolean => {
  return Date.now() < entry.expires;
};

// Batch logo requests to avoid overwhelming the service
const pendingRequests = new Map<string, Promise<string | null>>();

// Clearbit logo service with caching
const getClearbitLogo = async (companyName: string): Promise<LogoServiceResponse> => {
  try {
    // Convert company name to domain format for Clearbit
    const domain = companyName
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '')
      .replace(/(inc|llc|corp|corporation|ltd|limited|ventures|capital|partners|group|holdings)$/i, '')
      + '.com';
    
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    
    // Test if the logo exists by trying to fetch it
    const response = await fetch(logoUrl, { method: 'HEAD' });
    if (response.ok) {
      return { logoUrl };
    }
    
    return { logoUrl: null, error: 'Logo not found' };
  } catch (error) {
    return { logoUrl: null, error: 'Service unavailable' };
  }
};

// Manual mapping for known companies (expanded)
const manualLogos: Record<string, string> = {
  'openai': 'https://logo.clearbit.com/openai.com',
  'google': 'https://logo.clearbit.com/google.com',
  'microsoft': 'https://logo.clearbit.com/microsoft.com',
  'apple': 'https://logo.clearbit.com/apple.com',
  'meta': 'https://logo.clearbit.com/meta.com',
  'amazon': 'https://logo.clearbit.com/amazon.com',
  'netflix': 'https://logo.clearbit.com/netflix.com',
  'uber': 'https://logo.clearbit.com/uber.com',
  'airbnb': 'https://logo.clearbit.com/airbnb.com',
  'stripe': 'https://logo.clearbit.com/stripe.com',
  'spotify': 'https://logo.clearbit.com/spotify.com',
  'slack': 'https://logo.clearbit.com/slack.com',
  'zoom': 'https://logo.clearbit.com/zoom.us',
  'dropbox': 'https://logo.clearbit.com/dropbox.com',
  'github': 'https://logo.clearbit.com/github.com',
  'linkedin': 'https://logo.clearbit.com/linkedin.com',
  'twitter': 'https://logo.clearbit.com/twitter.com',
  'instagram': 'https://logo.clearbit.com/instagram.com',
  'tiktok': 'https://logo.clearbit.com/tiktok.com',
  'snapchat': 'https://logo.clearbit.com/snapchat.com',
  'sequoia': 'https://logo.clearbit.com/sequoiacap.com',
  'a16z': 'https://logo.clearbit.com/a16z.com',
  'kleinerperkins': 'https://logo.clearbit.com/kleinerperkins.com',
  'accel': 'https://logo.clearbit.com/accel.com'
};

// Main logo service with caching and batching
export const getCompanyLogo = async (companyName: string): Promise<string | null> => {
  const cacheKey = companyName.toLowerCase().trim();
  
  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }
  
  // Check cache first
  const cache = getLogoCache();
  const cachedEntry = cache[cacheKey];
  
  if (cachedEntry && isCacheValid(cachedEntry)) {
    return cachedEntry.url;
  }
  
  // Create promise for this request
  const logoPromise = (async (): Promise<string | null> => {
    try {
      console.log(`Fetching logo for: ${companyName}`);
      
      // Check manual mapping first
      const normalizedName = companyName.toLowerCase().replace(/[^\w]/g, '');
      const manualLogo = manualLogos[normalizedName];
      
      if (manualLogo) {
        console.log(`Using manual logo mapping for ${companyName}`);
        const result = manualLogo;
        
        // Cache the result
        cache[cacheKey] = {
          url: result,
          timestamp: Date.now(),
          expires: Date.now() + CACHE_DURATION
        };
        saveLogoCache(cache);
        
        return result;
      }
      
      // Try Clearbit
      const clearbitResult = await getClearbitLogo(companyName);
      const result = clearbitResult.logoUrl;
      
      if (result) {
        console.log(`Found Clearbit logo for ${companyName}`);
      } else {
        console.log(`No logo found for ${companyName}`);
      }
      
      // Cache the result (even if null)
      cache[cacheKey] = {
        url: result,
        timestamp: Date.now(),
        expires: Date.now() + CACHE_DURATION
      };
      saveLogoCache(cache);
      
      return result;
    } catch (error) {
      console.error(`Error fetching logo for ${companyName}:`, error);
      return null;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  })();
  
  // Store pending request
  pendingRequests.set(cacheKey, logoPromise);
  
  return logoPromise;
};

// Batch fetch logos for multiple companies
export const batchFetchLogos = async (companyNames: string[]): Promise<Map<string, string | null>> => {
  const results = new Map<string, string | null>();
  
  // Process in batches of 5 to avoid overwhelming the service
  const batchSize = 5;
  for (let i = 0; i < companyNames.length; i += batchSize) {
    const batch = companyNames.slice(i, i + batchSize);
    const batchPromises = batch.map(async (name) => {
      const logo = await getCompanyLogo(name);
      return { name, logo };
    });
    
    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(({ name, logo }) => {
      results.set(name, logo);
    });
    
    // Small delay between batches to be respectful to the service
    if (i + batchSize < companyNames.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};

// Clear logo cache (useful for debugging)
export const clearLogoCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore localStorage errors
  }
};

// Generate a fallback avatar with company initials
export const generateFallbackAvatar = (companyName: string): string => {
  const initials = companyName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
  
  // Generate a consistent color based on company name
  const colors = [
    '#117b69', '#0f6b5a', '#18b89a', '#20c997', '#6f42c1', 
    '#e83e8c', '#fd7e14', '#ffc107', '#28a745', '#17a2b8'
  ];
  
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  // Create SVG avatar - use URL encoding instead of base64 to avoid Unicode issues
  const svg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="32" fill="${backgroundColor}"/><text x="32" y="40" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600">${initials}</text></svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

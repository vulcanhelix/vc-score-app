import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, Search } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  score: number;
  logoUrl?: string;
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  onCompanySelect: (company: Company) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number;
  loadedCount?: number;
  searchCompanies?: (searchTerm: string) => Company[];
}

// Debounced search hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Simplified list component with infinite scrolling (no virtual scrolling for now)
const ScrollableList: React.FC<{
  items: Company[];
  onItemSelect: (company: Company) => void;
  maxHeight: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}> = ({ items, onItemSelect, maxHeight, hasMore, onLoadMore, isLoading }) => {
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    
    // Check if we're near the bottom and should load more
    if (hasMore && onLoadMore && !isLoading) {
      const scrollBottom = target.scrollTop + target.clientHeight;
      const scrollHeight = target.scrollHeight;
      const threshold = 100;
      
      console.log('📜 Scroll event:', { 
        scrollTop: target.scrollTop,
        clientHeight: target.clientHeight,
        scrollHeight: target.scrollHeight,
        scrollBottom, 
        diff: scrollHeight - scrollBottom,
        threshold,
        hasMore,
        isLoading,
        itemsLength: items.length,
        onLoadMoreExists: !!onLoadMore
      });
      
      // Load more when we're within threshold of the bottom
      if (scrollHeight - scrollBottom < threshold) {
        console.log('🚀 TRIGGERING LOAD MORE!');
        onLoadMore();
      }
    } else {
      console.log('❌ Scroll conditions not met:', { hasMore, onLoadMore: !!onLoadMore, isLoading });
    }
  }, [hasMore, onLoadMore, isLoading, items.length]);

  return (
    <div 
      className="overflow-y-auto"
      style={{ maxHeight }}
      onScroll={handleScroll}
    >
      {items.map((company) => (
        <button
          key={company.id}
          onClick={() => onItemSelect(company)}
          className="w-full px-6 py-4 text-left hover:bg-white/25 hover:bg-gradient-to-r hover:from-[#117b69]/20 hover:to-white/10 active:bg-white/30 transition-all duration-200 flex items-center justify-between group cursor-pointer border-none bg-transparent hover:border-l-4 hover:border-l-[#117b69]"
          type="button"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            minHeight: '72px'
          }}
        >
          <div className="flex-1 min-w-0 mr-4">
            <div className="text-white font-medium group-hover:text-[#117b69] transition-colors duration-200 truncate">
              {company.name}
            </div>
            <div className="text-white/60 text-sm">
              Score: {company.score}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              company.score >= 70 
                ? 'bg-[#117b69]/20 text-[#117b69]'
                : company.score >= 40
                ? 'bg-white/20 text-white'
                : company.score >= 20
                ? 'bg-white/20 text-white'
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {company.score >= 70 ? 'High' : company.score >= 40 ? 'Medium' : company.score >= 20 ? 'Low' : 'Moonshot'}
            </div>
          </div>
        </button>
      ))}
      
      {/* Loading indicator at the bottom */}
      {hasMore && (
        <div className="flex items-center justify-center py-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
              Loading more companies...
            </div>
          ) : (
            <div className="text-white/40 text-xs">
              Scroll to load more companies
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  companies,
  selectedCompany,
  onCompanySelect,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  totalCount,
  loadedCount,
  searchCompanies
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered companies for performance
  const filteredCompanies = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return companies;
    }
    
    // Use the searchCompanies function from the hook if available (searches all companies)
    if (searchCompanies) {
      return searchCompanies(debouncedSearchTerm);
    }
    
    // Fallback to local filtering (only searches loaded companies)
    const searchLower = debouncedSearchTerm.toLowerCase();
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchLower)
    );
  }, [companies, debouncedSearchTerm, searchCompanies]);

  const handleCompanySelect = useCallback((company: Company) => {
    onCompanySelect(company);
    setIsOpen(false);
    setSearchTerm('');
  }, [onCompanySelect]);

  // Update dropdown position when button ref changes or dropdown opens
  useEffect(() => {
    if (buttonRef && isOpen) {
      const rect = buttonRef.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
  }, [buttonRef, isOpen]);

  // Handle button click and position calculation
  const handleButtonClick = () => {
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('[data-dropdown-container]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-sm animate-pulse">
          <CardContent className="p-0">
            <div className="h-6 bg-white/20 rounded-full mb-4"></div>
            <div className="h-12 bg-white/20 rounded-2xl"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-8 relative" style={{ zIndex: 10000 }} data-dropdown-container>
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500">
        <CardContent className="p-0">
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-4">
              <span className="text-[#117b69] text-sm font-medium">Select Company</span>
            </div>
          </div>

          <div className="relative">
            <Button
              ref={setButtonRef}
              onClick={handleButtonClick}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 flex items-center justify-between"
            >
              <span>
                {selectedCompany ? selectedCompany.name : 'Choose a company to analyze...'}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {companies.length > 0 && (
            <div className="mt-4 text-center text-white/60 text-sm">
              {debouncedSearchTerm ? (
                `${filteredCompanies.length} companies matching "${debouncedSearchTerm}"`
              ) : (
                `${loadedCount || companies.length} of ${totalCount || companies.length} companies loaded`
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portal dropdown */}
      {isOpen && createPortal(
        <div 
          className="fixed bg-[#1a1d1b] border border-white/20 rounded-2xl shadow-2xl max-h-80 overflow-hidden"
          style={{ 
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 999999
          }}
          data-dropdown-container
        >
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                autoFocus
              />
            </div>
          </div>
          
          {filteredCompanies.length > 0 ? (
            <ScrollableList
              items={filteredCompanies}
              onItemSelect={handleCompanySelect}
              maxHeight={240}
              hasMore={!debouncedSearchTerm && hasMore}
              onLoadMore={!debouncedSearchTerm ? onLoadMore : undefined}
              isLoading={isLoading}
            />
          ) : (
            <div className="px-6 py-8 text-center text-white/60">
              No companies found matching "{debouncedSearchTerm}"
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/button';

// Investment type options
const INVESTMENT_TYPES = [
  'Seed',
  'Series A',
  'Series B', 
  'Series C',
  'Series D+',
  'Pre-Seed',
  'Bridge',
  'Growth',
  'Debt',
  'Equity',
  'Convertible Note',
  'SAFE',
  'Revenue-Based Financing',
  'Venture Debt',
  'Mezzanine',
  'Secondary',
  'Other'
];

// Validation schema for admin form
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  score: z.number().min(0).max(100),
  logoUrl: z.string().url().optional().or(z.literal('')),
  portfolio1Name: z.string().optional(),
  portfolio1Date: z.string().optional(),
  portfolio1Type: z.string().optional(),
  portfolio2Name: z.string().optional(),
  portfolio2Date: z.string().optional(),
  portfolio2Type: z.string().optional(),
  portfolio3Name: z.string().optional(),
  portfolio3Date: z.string().optional(),
  portfolio3Type: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Simple password - in production, this should be more secure
  const ADMIN_PASSWORD = 'admin2024!';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please try again.');
      setLoginPassword('');
    }
  };
  
  // Admin form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema)
  });

  // Admin form submission
  const onAdminSubmit = async (data: CompanyFormData) => {
    setAdminSubmitting(true);
    setAdminError('');

    try {
      // Format portfolio companies
      const portfolio = [];
      
      if (data.portfolio1Name && data.portfolio1Name.trim()) {
        portfolio.push({
          name: data.portfolio1Name.trim(),
          announcementDate: data.portfolio1Date && data.portfolio1Date.trim() ? data.portfolio1Date.trim() : 'Unknown',
          investmentType: data.portfolio1Type && data.portfolio1Type.trim() ? data.portfolio1Type.trim() : 'Unknown'
        });
      }
      
      if (data.portfolio2Name && data.portfolio2Name.trim()) {
        portfolio.push({
          name: data.portfolio2Name.trim(),
          announcementDate: data.portfolio2Date && data.portfolio2Date.trim() ? data.portfolio2Date.trim() : 'Unknown',
          investmentType: data.portfolio2Type && data.portfolio2Type.trim() ? data.portfolio2Type.trim() : 'Unknown'
        });
      }
      
      if (data.portfolio3Name && data.portfolio3Name.trim()) {
        portfolio.push({
          name: data.portfolio3Name.trim(),
          announcementDate: data.portfolio3Date && data.portfolio3Date.trim() ? data.portfolio3Date.trim() : 'Unknown',
          investmentType: data.portfolio3Type && data.portfolio3Type.trim() ? data.portfolio3Type.trim() : 'Unknown'
        });
      }

      // Prepare payload for API
      const payload = {
        name: data.name,
        score: data.score,
        logoUrl: data.logoUrl || '',
        portfolio: portfolio
      };

      const response = await fetch('http://localhost:3001/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mvp-secret-key-2024'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAdminSuccess(true);
        reset();
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setAdminSuccess(false);
        }, 3000);
      } else {
        throw new Error('Failed to add company');
      }
    } catch (error) {
      setAdminError('Failed to add company. Please try again.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b0a] via-[#1a1d1b] to-[#0a0b0a] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#117b69]/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#117b69]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#18b89a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Login Form */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-sm mx-auto mt-32">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#117b69]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#117b69]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-semibold text-white mb-2">Admin Access</h1>
                  <p className="text-white/60 text-sm">Enter password to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                      placeholder="Enter admin password"
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{loginError}</p>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-2xl py-3 font-medium transition-all duration-300"
                  >
                    Access Admin Panel
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <a 
                    href="/"
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    ← Back to Main Site
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show admin form if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b0a] via-[#1a1d1b] to-[#0a0b0a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#117b69]/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#117b69]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#18b89a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-16">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold text-white mb-2">Admin Panel</h1>
                <p className="text-white/60 text-sm">Add new companies to the database</p>
              </div>

              {adminSuccess && (
                <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-400 text-sm">Company added successfully!</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onAdminSubmit)} className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Company Name *</label>
                  <input
                    {...register('name')}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                    placeholder="Acme Ventures"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Score (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('score', { valueAsNumber: true })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                    placeholder="75"
                  />
                  {errors.score && (
                    <p className="text-red-400 text-xs mt-1">{errors.score.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Logo URL (optional)</label>
                  <input
                    {...register('logoUrl')}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                    placeholder="https://example.com/logo.png"
                  />
                  {errors.logoUrl && (
                    <p className="text-red-400 text-xs mt-1">{errors.logoUrl.message}</p>
                  )}
                </div>

                {/* Portfolio Companies Section */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-white text-lg font-medium mb-4">Portfolio Companies (optional)</h3>
                  
                  {/* Portfolio Company 1 */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-white/80 text-sm font-medium">Portfolio Company 1</h4>
                    <div className="space-y-3">
                      <input
                        {...register('portfolio1Name')}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                        placeholder="Company name"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          {...register('portfolio1Date')}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                          placeholder="Date (e.g., 2024-01-15)"
                        />
                        <select
                          {...register('portfolio1Type')}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                        >
                          <option value="">Select investment type</option>
                          {INVESTMENT_TYPES.map(type => (
                            <option key={type} value={type} className="bg-gray-800 text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Company 2 */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-white/80 text-sm font-medium">Portfolio Company 2</h4>
                    <div className="space-y-3">
                      <input
                        {...register('portfolio2Name')}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                        placeholder="Company name"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          {...register('portfolio2Date')}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                          placeholder="Date (e.g., 2024-01-15)"
                        />
                        <select
                          {...register('portfolio2Type')}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                        >
                          <option value="">Select investment type</option>
                          {INVESTMENT_TYPES.map(type => (
                            <option key={type} value={type} className="bg-gray-800 text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Company 3 */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-white/80 text-sm font-medium">Portfolio Company 3</h4>
                    <div className="space-y-3">
                      <input
                        {...register('portfolio3Name')}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                        placeholder="Company name"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          {...register('portfolio3Date')}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                          placeholder="Date (e.g., 2024-01-15)"
                        />
                        <select
                          {...register('portfolio3Type')}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                        >
                          <option value="">Select investment type</option>
                          {INVESTMENT_TYPES.map(type => (
                            <option key={type} value={type} className="bg-gray-800 text-white">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {adminError && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{adminError}</p>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={adminSubmitting}
                  className="w-full bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-2xl py-3 font-medium transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adminSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Adding Company...
                    </>
                  ) : (
                    'Add Company'
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a 
                  href="/"
                  className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  ← Back to Main Site
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

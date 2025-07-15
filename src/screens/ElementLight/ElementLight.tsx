import React, { useState, useEffect } from 'react';
import { useCSVData } from '../../hooks/useCSVData';
import { CompanySelector } from '../../components/CompanySelector';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, ArrowRight, Bell, Mail } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  score: number;
  logoUrl?: string;
  portfolio?: Array<{ name: string; announcementDate: string; }>;
}

export const ElementLight: React.FC = () => {
  const { companies, isLoading, error, hasMore, loadMore, totalCount, loadedCount } = useCSVData();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Subscription modal state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: ''
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  // Check URL parameters for initial company selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId') || urlParams.get('vcId') || urlParams.get('id');
    
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        setSelectedCompany(company);
      }
    }
  }, [companies]);

  // Update URL when company selection changes
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('companyId', company.id);
    window.history.pushState({}, '', url.toString());
  };


  // Email template for portfolio companies
  const emailTemplate = {
    subject: "Recruitment approach that could help with runway",
    body: `Hi [Name],

Came across this recruitment model that lets you pay 3-12% upfront for hires instead of the usual 20%, with balance only due when you raise your next round.

Thought it could be useful if you're planning any hires. Details attached. Let me know how you get on.

[VC Name]`
  };

  // Handle opening email modal
  const handleSendToPortfolio = () => {
    setShowEmailModal(true);
  };

  // Handle copying email content
  const handleCopyEmail = async () => {
    const fullEmail = `Subject: ${emailTemplate.subject}\n\n${emailTemplate.body}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Subscription modal functions
  const validateForm = () => {
    const errors = {
      email: '',
      firstName: '',
      lastName: '',
      company: ''
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Company validation
    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('https://hook.eu2.make.com/di9xteoqx17ux00zpuisa6i15o4bh0k6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ email: '', firstName: '', lastName: '', company: '' });
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setShowSubscriptionModal(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSubscriptionModal = () => {
    setShowSubscriptionModal(true);
    setSubmitSuccess(false);
    setSubmitError('');
    setFormErrors({ email: '', firstName: '', lastName: '', company: '' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b0a] via-[#1a1d1b] to-[#0a0b0a] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error Loading Data</h1>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#0a0b0a] via-[#1a1d1b] to-[#0a0b0a] relative overflow-hidden m-0 p-0">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#117b69]/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#117b69]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#18b89a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8 animate-fadeInUp">
            <div className="w-2 h-2 bg-[#117b69] rounded-full mr-3"></div>
            <span className="text-[#117b69] text-sm font-medium">Trusted by 200+ Portfolio Companies</span>
            <span className="ml-3 px-2 py-1 bg-[#117b69] text-white text-xs rounded-full">LIVE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-white mb-2 animate-fadeInUp delay-200">
            Risk Adjusted
          </h1>
          <h2 className="text-5xl md:text-7xl font-light text-[#117b69] mb-8 animate-fadeInUp delay-300">
            Hiring
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-2 animate-fadeInUp delay-400">
            Extend portfolio company runways through <span className="text-[#117b69]">Risk Adjusted Hiring</span>.
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8 animate-fadeInUp delay-500">
            Pay 3-12% on hire for global talent, balance only when and if your companies hit their next funding milestone.
          </p>
          
          {/* CTA Button */}
          <div className="mb-12 animate-fadeInUp delay-600">
            <button 
              onClick={() => {
                const companySelector = document.querySelector('[data-company-selector]');
                if (companySelector) {
                  companySelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#117b69]/25 flex items-center mx-auto cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {selectedCompany ? `Get ${selectedCompany.name}'s Growth Score` : "Get Your Growth Score"}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Trusted by section */}
          <div className="text-center mb-16 animate-fadeInUp delay-700">
            <p className="text-white/60 text-sm mb-4">Trusted by leading VCs:</p>
            <div className="flex justify-center items-center space-x-8 text-white/40 text-sm">
              <span>Sequoia</span>
              <span>a16z</span>
              <span>Kleiner Perkins</span>
              <span>Accel</span>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fadeInUp delay-800">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">
                2.3x
              </div>
              <div className="text-white/60 text-sm">
                Average Runway Extension
              </div>
              <div className="text-white/40 text-xs mt-1">
                Across 200+ Portfolio Companies
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">
                $47M
              </div>
              <div className="text-white/60 text-sm">
                Capital Preserved
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">
                94%
              </div>
              <div className="text-white/60 text-sm">
                Retention Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2">
                23
              </div>
              <div className="text-white/60 text-sm">
                Days
              </div>
              <div className="text-white/40 text-xs mt-1">
                Time To Hire
              </div>
            </div>
          </div>
        </div>

        {/* Outcome-Based Partnership Section */}
        <div className="mt-24 animate-fadeInUp delay-900">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8">
              <span className="text-[#117b69] text-sm font-medium">Proprietary Algorithm</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
              Outcome-Based
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#117b69] mb-8">
              Partnership
            </h3>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              The only hiring partner that succeeds when your portfolio succeeds. Proven track record, aligned incentives.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* High Probability Tier */}
            <div className="bg-gradient-to-br from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/40 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#117b69]/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-white text-lg font-medium mb-1">High</div>
                    <div className="text-white text-lg font-medium">Probability</div>
                  </div>
                  <div className="bg-gradient-to-r from-[#117b69] to-[#0f6b5a] rounded-2xl px-6 py-4 text-center">
                    <div className="text-white text-2xl font-bold">70-</div>
                    <div className="text-white text-2xl font-bold">100</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-white text-3xl font-light mb-1">3%</div>
                    <div className="text-white/60 text-sm">placement fee</div>
                    <div className="text-[#117b69] text-sm">+ 17% on funding round</div>
                  </div>
                  <div className="text-[#117b69] text-sm font-medium">94% retention rate</div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-2xl py-3 font-medium transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
              </div>
            </div>

            {/* Medium Probability Tier */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white text-lg font-medium mb-1">Medium</div>
                  <div className="text-white text-lg font-medium">Probability</div>
                </div>
                <div className="bg-gradient-to-r from-white/30 to-white/20 rounded-2xl px-6 py-4 text-center border border-white/30">
                  <div className="text-white text-2xl font-bold">40-</div>
                  <div className="text-white text-2xl font-bold">69</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <div className="text-white text-3xl font-light mb-1">5%</div>
                  <div className="text-white/60 text-sm">placement fee</div>
                  <div className="text-white/60 text-sm">+ 17% on funding round</div>
                </div>
                <div className="text-white/60 text-sm">78% success rate</div>
              </div>
              
              <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl py-3 font-medium transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Low Probability Tier */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white text-lg font-medium mb-1">Low</div>
                  <div className="text-white text-lg font-medium">Probability</div>
                </div>
                <div className="bg-gradient-to-r from-white/30 to-white/20 rounded-2xl px-6 py-4 text-center border border-white/30">
                  <div className="text-white text-2xl font-bold">20-</div>
                  <div className="text-white text-2xl font-bold">39</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <div className="text-white text-3xl font-light mb-1">8%</div>
                  <div className="text-white/60 text-sm">placement fee</div>
                  <div className="text-white/60 text-sm">+ 12% on funding round</div>
                </div>
                <div className="text-white/60 text-sm">52% success rate</div>
              </div>
              
              <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl py-3 font-medium transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Moonshot Tier */}
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/40 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white text-lg font-medium">Moonshot</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-6 py-4 text-center">
                  <div className="text-white text-2xl font-bold">0-19</div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <div className="text-white text-3xl font-light mb-1">12%</div>
                  <div className="text-white/60 text-sm">placement fee</div>
                  <div className="text-orange-400 text-sm">+ 8% on funding round</div>
                </div>
                <div className="text-orange-400 text-sm">28% success rate</div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl py-3 font-medium transition-all duration-300 hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Company Selector */}
        <div className="mt-32 animate-fadeInUp delay-500" data-company-selector>
          <CompanySelector
            companies={companies}
            selectedCompany={selectedCompany}
            onCompanySelect={handleCompanySelect}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            totalCount={totalCount}
            loadedCount={loadedCount}
          />
        </div>

        {/* Score Display */}
        {selectedCompany && (
          <div id="risk-score-visualization" className="animate-fadeInUp delay-600">
            <ScoreDisplay
              companyName={selectedCompany.name}
              score={selectedCompany.score}
              companyLogoUrl={selectedCompany.logoUrl}
            />
          </div>
        )}

        {/* Portfolio Display */}
        {selectedCompany && selectedCompany.portfolio && selectedCompany.portfolio.length > 0 && (
          <div className="mt-8 animate-fadeInUp delay-700">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-sm">
                <CardContent className="p-0">
                  <h3 className="text-white text-lg font-medium mb-4">Portfolio Companies</h3>
                  <div className="space-y-2">
                    {selectedCompany.portfolio.map((company, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-lg">
                        <span className="text-white">{company.name}</span>
                        <span className="text-white/60 text-sm">{company.announcementDate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* CTA Button - Portfolio Strategy Call */}
        {selectedCompany && (
          <div className="max-w-2xl mx-auto mb-8 mt-16 text-center animate-fadeInUp delay-800">
            <a 
              href="https://calendly.com/10xhiring/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#117b69]/25"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {selectedCompany 
                ? `Discuss ${selectedCompany.name}'s Hiring Strategy`
                : "Book a 30-Minute Portfolio Strategy Call"
              }
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <p className="text-white/60 text-sm mt-3">
              Free consultation • No commitment required
            </p>
          </div>
        )}

        {/* Testimonials Section */}
        <div className="mt-32 animate-fadeInUp delay-700">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8">
              <span className="text-[#117b69] text-sm font-medium">Client Success</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
              Trusted by
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#117b69] mb-8">
              Industry Leaders
            </h3>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500 relative">
              <div className="absolute top-6 right-6 opacity-20">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <p className="text-white/90 text-lg italic leading-relaxed mb-8">
                  "Their proprietary scoring system provided unprecedented visibility into our portfolio risk. We've optimized our entire investment strategy and seen remarkable returns."
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#117b69] to-[#0f6b5a] flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">MR</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Michael Rodriguez</div>
                    <div className="text-white/60 text-sm">Senior Partner, Apex Ventures</div>
                  </div>
                </div>
              </div>
              
              {/* Company Logo */}
              <div className="absolute bottom-6 right-6">
                <div className="w-16 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white/60 text-xs font-medium">Apex</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500 relative">
              <div className="absolute top-6 right-6 opacity-20">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <p className="text-white/90 text-lg italic leading-relaxed mb-8">
                  "The risk-adjusted hiring model transformed how we support our portfolio companies. Our startups now extend their runways by 2.3x on average."
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#117b69] to-[#0f6b5a] flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">SC</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Sarah Chen</div>
                    <div className="text-white/60 text-sm">Managing Director, Growth Capital</div>
                  </div>
                </div>
              </div>
              
              {/* Company Logo */}
              <div className="absolute bottom-6 right-6">
                <div className="w-20 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white/60 text-xs font-medium">Growth Cap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-[#117b69] rounded-full"></div>
          </div>
        </div>

        {/* CTA Button - VC Score Updates Subscription */}
        <div className="max-w-2xl mx-auto mt-16 text-center animate-fadeInUp delay-800">
          <button 
            onClick={handleOpenSubscriptionModal}
            className="inline-flex items-center bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#117b69]/25"
          >
            <Bell className="w-5 h-5 mr-2" />
            Get Monthly VC Score Updates
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <p className="text-white/60 text-sm mt-3">
            Stay informed about your portfolio companies' risk scores
          </p>
        </div>

        {/* Zero-Risk Partnership Section */}
        <div className="mt-32 animate-fadeInUp delay-800">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8">
              <span className="text-[#117b69] text-sm font-medium">Risk-Free Trial</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
              Zero-Risk
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#117b69] mb-8">
              Partnership
            </h3>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-16">
              Test Drive Our Model - No Strings Attached
            </p>
          </div>

          {/* Main Content Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-12 backdrop-blur-sm">
              <div className="mb-12">
                <p className="text-white/90 text-lg leading-relaxed">
                  We're so certain that our risk-adjusted model delivers better outcomes that we'll prove it 
                  however you want to test us. Pick one portfolio company. Give us their hardest-to-fill 
                  role. We'll show you exactly why 200+ portfolio companies trust us with their most 
                  critical hires.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Why We're This Confident */}
                <div>
                  <h4 className="text-[#117b69] text-xl font-semibold mb-6">
                    Why We're This Confident
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        13 years, 3,750+ placements, 94% retention rate
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        23-day average time-to-hire vs industry 45+ days
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        Specialist teams across AI/ML, engineering, GTM, operations
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        Global talent network across 40+ countries
                      </p>
                    </div>
                  </div>
                </div>

                {/* Our Performance Promise */}
                <div>
                  <h4 className="text-[#117b69] text-xl font-semibold mb-6">
                    Our Performance Promise
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        Shortlist of 3-5 qualified candidates within 72 hours
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        Placement within 23 days or we work for free
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        90-day performance guarantee with free replacement
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#117b69] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <p className="text-white/80 text-sm">
                        No payment beyond placement fee if funding round fails
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Small, Scale Smart */}
              <div className="border-t border-white/10 pt-8">
                <h4 className="text-[#117b69] text-xl font-semibold mb-6">
                  Start Small, Scale Smart
                </h4>
                <div className="space-y-4 mb-8">
                  <p className="text-white/80 text-sm leading-relaxed">
                    Test us on one critical hire. See the quality, speed, and cash flow impact firsthand. Once you experience the 
                    difference, we'll discuss portfolio-wide implementation. No long-term contracts, no minimum commitments - 
                    just results that speak for themselves.
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Ready to see why leading VCs are switching to risk-adjusted hiring? Let's start with your most challenging 
                    role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
      
      {/* Ready to Get Started Section */}
      <section className="py-24 relative overflow-hidden mt-32 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#117b69]/10 to-transparent w-full"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8">
                <span className="text-[#117b69] text-sm font-medium">Get Started</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                Ready to <span className="text-[#117b69]">Optimize</span> Your Portfolio?
              </h2>
              <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
                Join leading VCs who are already using our platform to make smarter hiring decisions and extend portfolio company runways.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
                {/* Card 1 - Urgent Hire Support */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-[#117b69] to-[#0f6b5a] rounded-full text-white text-xs font-medium">
                      Start This Week
                    </div>
                  </div>
                  <CardContent className="p-8 pt-12">
                    <h3 className="text-2xl font-semibold text-white mb-6 group-hover:text-[#117b69] transition-colors duration-300">
                      Urgent Hire Support
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-8">
                      Need to fill a critical role fast? CTO, Head of Sales, VP Engineering? We'll start immediately with our 23-day average placement time. Pay 3-12% upfront, balance only when your company raises their next round.
                    </p>
                    <div className="mt-auto">
                      <Button className="w-full bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-2xl py-4 font-medium transition-all duration-300 hover:scale-105">
                        Get Urgent Help
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2 - Share with Portfolio */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500 group">
                  <CardContent className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-semibold text-white mb-6 group-hover:text-[#117b69] transition-colors duration-300">
                      Share with Your Portfolio Companies
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-8 flex-grow">
                      We know you're busy, so we've created a ready-to-send email with everything your portfolio companies need to understand our risk-adjusted hiring model.
                    </p>
                    <div className="mt-auto">
                      <Button 
                        onClick={handleSendToPortfolio}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl py-4 font-medium transition-all duration-300 hover:scale-105"
                      >
                        Send to Portfolio Companies
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3 - Portfolio Hiring Planning */}
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-gradient-to-r from-white/20 to-white/10 border border-white/20 rounded-full text-white text-xs font-medium">
                      Free 30-Min Call
                    </div>
                  </div>
                  <CardContent className="p-8 pt-12 flex flex-col h-full">
                    <h3 className="text-2xl font-semibold text-white mb-6 group-hover:text-[#117b69] transition-colors duration-300">
                      Portfolio Hiring Planning
                    </h3>
                    <p className="text-white/70 leading-relaxed mb-8 flex-grow">
                      30-minute call to discuss your portfolio companies' upcoming hiring needs. We'll show you exactly how much runway you could extend across your companies and create a hiring roadmap that aligns with funding cycles.
                    </p>
                    <div className="mt-auto">
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl py-4 font-medium transition-all duration-300 hover:scale-105">
                        Plan Portfolio Hiring
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-white/60 text-sm mb-4">
                  Trusted by 50+ venture capital firms and 200+ portfolio companies
                </p>
                <div className="flex items-center justify-center gap-2 text-white/40">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Enterprise-grade security & compliance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Reopen main content container for FAQ */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-8">

        {/* FAQ Section */}
        <div className="mt-32 animate-fadeInUp delay-900">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8">
              <span className="text-[#117b69] text-sm font-medium">Frequently Asked</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-2">
              Common
            </h2>
            <h3 className="text-4xl md:text-5xl font-light text-[#117b69] mb-8">
              Questions
            </h3>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Financial & Risk Questions */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  Financial & Risk Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="financial-1" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      What happens if my portfolio company fails to raise? Do I still owe the balance?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      No. If your portfolio company doesn't close their next round, you owe nothing beyond the initial placement fee (3-12%). We genuinely share the funding risk - no round means no additional payment required.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="financial-2" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      How do you assess company risk scores? Can this be gamed?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      We analyze 47+ data points from Crunchbase including funding history, team composition, market traction, investor quality, and growth metrics. Scores refresh monthly based on publicly available data that's difficult to manipulate. Full methodology available on request.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="financial-3" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      What are your fees versus traditional recruiters?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      A total fee of 20% but completely different cash flow impact. Traditional recruiters charge 20% at placement. We charge 3-12% at placement, remainder only when and if your portco close their next funding round. Portfolio companies preserve 60-85% more working capital for growth.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="financial-4" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      What if my portfolio company exits through IPO, acquisition, or other liquidity events instead of raising another round?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      Any successful liquidity event triggers the deferred payment - IPO, acquisition above previous valuation, or strategic exit. This aligns perfectly with your returns: we get paid when you achieve liquidity and validate the investment thesis. If it's a down-round acquisition or wind-down, no additional payment is due.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Portfolio & Performance Questions */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  Portfolio & Performance Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="portfolio-1" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      Do you understand startup hiring velocity? Most recruiters can't keep pace.
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      23-day average time-to-hire with 94% retention rate over 13 years. We've completed 3,750+ placements across leadership, AI/ML, data, PMO, GTM and operations roles. We get the urgency.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="portfolio-2" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      Can you coordinate hiring across multiple portfolio companies?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      Yes. We manage portfolio-wide talent strategies with your risk-adjusted pricing applying across all companies. We coordinate timing to avoid internal competition for candidates.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="portfolio-3" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      Can you source technical talent that actually understands our space?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      73% of recent placements are technical roles including AI/ML specialists, senior engineers, and technical leadership. We maintain talent networks across 40+ countries for specialized expertise.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Legal & Operational Questions */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">⚖️</span>
                  Legal & Operational Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="legal-1" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      Is this structured as debt? Do we need regulatory approval?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      No. This is milestone-based service payment, not lending. You're paying for recruitment services - partial payment at delivery, remainder at funding milestone. No financial services regulations apply.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="legal-2" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      What if someone leaves post-hire but pre-funding?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      Free replacement within 90 days if performance issues arise. If they leave after 6+ months and you haven't raised, you still owe nothing beyond initial placement fee.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="legal-3" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      How do you handle confidentiality across competing portfolio companies?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      Strict information barriers. Each engagement runs independently with dedicated team members. We never share competitive intelligence between portfolio companies.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Scale & Strategy Questions */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  Scale & Strategy Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="scale-1" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      Can this scale with our fund size? We back 50+ companies.
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      Larger portfolios benefit most from cash flow preservation and risk distribution. We provide dedicated portfolio dashboards and can assign relationship managers for funds above certain AUM thresholds.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="scale-2" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      What's your bandwidth for simultaneous urgent hires?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      We deploy specialist teams across functions and geographies rather than overloading single consultants. Each role gets appropriate expertise while maintaining consistent risk-adjusted pricing.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="scale-3" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-medium text-white hover:text-[#117b69] transition-colors duration-200 hover:no-underline">
                      How is this different from just negotiating payment terms with any recruiter?
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-white/80 leading-relaxed">
                      Traditional recruiters won't accept genuine funding risk. They want guaranteed payment regardless of outcome. We're structurally aligned - our economics depend on your portfolio companies successfully raising capital. Bottom line: We're not recruiters offering payment plans. We're risk-sharing partners whose success is tied to your portfolio's funding outcomes.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-8">
          <footer className="py-12 border-t border-white/10">
            <div className="container mx-auto px-6">
              <div className="text-center">
                <div className="text-white/60 text-sm">
                  © 2024 Portfolio Risk Intelligence. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-semibold text-white">Ready-to-Send Email</h3>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
              <div className="mb-4">
                <div className="text-white/60 text-sm mb-2">Subject:</div>
                <div className="text-white font-medium">{emailTemplate.subject}</div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="text-white/60 text-sm mb-2">Message:</div>
                <div className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">
                  {emailTemplate.body}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleCopyEmail}
                className="flex-1 bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-2xl py-3 font-medium transition-all duration-300 flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setShowEmailModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl py-3 px-6 font-medium transition-all duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-semibold text-white">Stay Updated on Your Portfolio</h3>
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Get monthly VC Score updates and insights delivered to your inbox. Track your portfolio companies' risk scores and funding probability changes.
            </p>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#117b69] to-[#0f6b5a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-white text-lg font-semibold mb-2">Thanks for subscribing!</h4>
                <p className="text-white/60 text-sm">You'll receive monthly VC Score updates starting next month.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                    placeholder="your@email.com"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                      placeholder="John"
                      required
                    />
                    {formErrors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                      placeholder="Doe"
                      required
                    />
                    {formErrors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#117b69] transition-colors duration-300"
                    placeholder="Acme Ventures"
                    required
                  />
                  {formErrors.company && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.company}</p>
                  )}
                </div>

                {submitError && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-[#117b69] to-[#0f6b5a] hover:from-[#0f6b5a] hover:to-[#0d5a4a] text-white rounded-2xl py-3 font-medium transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setShowSubscriptionModal(false)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl py-3 px-6 font-medium transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>

                <p className="text-white/40 text-xs text-center mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

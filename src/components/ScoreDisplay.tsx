import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from './ui/card';

interface ScoreDisplayProps {
  companyName?: string;
  score?: number;
  companyLogoUrl?: string;
}

// Memoized score category calculation
const getScoreCategory = (score: number) => {
  if (score >= 70) return { category: "High Probability", color: "from-[#117b69] to-[#0f6b5a]", textColor: "text-[#117b69]" };
  if (score >= 40) return { category: "Medium Probability", color: "from-white/30 to-white/20", textColor: "text-white" };
  if (score >= 20) return { category: "Low Probability", color: "from-white/30 to-white/20", textColor: "text-white" };
  return { category: "Moonshot", color: "from-orange-500 to-red-500", textColor: "text-orange-400" };
};

// Memoized pricing calculation
const getPricingInfo = (score: number) => {
  return {
    placementFee: score >= 70 ? '3%' : score >= 40 ? '5%' : score >= 20 ? '8%' : '12%',
    fundingFee: score >= 70 ? '17%' : score >= 40 ? '17%' : score >= 20 ? '12%' : '8%',
    successRate: score >= 70 ? '94%' : score >= 40 ? '78%' : score >= 20 ? '52%' : '28%'
  };
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = React.memo(({
  companyName = "Your Company",
  score = 75,
  companyLogoUrl
}) => {
  // Memoized calculations
  const scoreInfo = useMemo(() => getScoreCategory(score), [score]);
  const pricingInfo = useMemo(() => getPricingInfo(score), [score]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:border-[#117b69]/50 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#117b69]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <CardContent className="p-0 relative z-1">
          <div className="text-center">
            {/* Category Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#117b69]/20 to-[#0f6b5a]/20 border border-[#117b69]/30 mb-8">
              <span className="text-[#117b69] text-sm font-medium">Risk Assessment</span>
            </div>

            {/* Company Name */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4">
                {companyLogoUrl && (
                  <div className="relative">
                    <img
                      src={companyLogoUrl}
                      alt={companyName}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-white/20 group-hover:border-[#117b69]/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#117b69]/20 hover:scale-110"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#117b69]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl font-light text-white group-hover:text-[#117b69] transition-colors duration-300">
                  {companyName}
                </h2>
              </div>
            </div>

            {/* Score Display */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className={`px-12 py-6 bg-gradient-to-r ${scoreInfo.color} rounded-3xl text-white text-6xl md:text-7xl font-black shadow-2xl border-2 border-[#18b89a]/50 group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#18b89a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 tracking-wider">
                    {score}
                  </span>
                </div>
              </div>

              {/* Category Label */}
              <div className={`text-xl font-semibold ${scoreInfo.textColor} mb-2`}>
                {scoreInfo.category}
              </div>
              
              <div className="text-white/60 text-sm">
                Risk Score
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-light text-white mb-1">
                    {pricingInfo.placementFee}
                  </div>
                  <div className="text-white/60 text-sm">Placement Fee</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-white mb-1">
                    {pricingInfo.fundingFee}
                  </div>
                  <div className="text-white/60 text-sm">On Funding Round</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-white mb-1">
                    {pricingInfo.successRate}
                  </div>
                  <div className="text-white/60 text-sm">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

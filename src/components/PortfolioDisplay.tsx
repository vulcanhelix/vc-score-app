import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PortfolioCompany {
  name: string;
  announcementDate: string;
}

interface PortfolioDisplayProps {
  companies: PortfolioCompany[];
}

export const PortfolioDisplay: React.FC<PortfolioDisplayProps> = ({ companies }) => {
  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white mb-6 group-hover:text-[#117b69] transition-colors duration-300">Recent Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {companies.map((company, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-white/90 text-lg">{company.name}</span>
              <span className="text-white/60 text-sm">{company.announcementDate}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
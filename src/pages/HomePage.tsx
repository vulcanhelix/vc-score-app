import React from 'react';
import { Link } from 'react-router-dom';

// Import the locally saved data
let vcs: Array<{id: string, name: string, score: number}> = [];
try {
  vcs = require('../data/vcs.json');
} catch (error) {
  console.warn('Could not load VC data:', error);
}

export default function HomePage() {
  // Show the first 10 VCs as examples
  const sampleVCs = vcs.slice(0, 10);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to the VC Scoreboard</h1>
      <p className="text-lg text-gray-600 mb-8">
        This is a statically generated site with {vcs.length} unique pages. Here are a few examples:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleVCs.map(vc => (
          <Link 
            to={`/vcs/${vc.id}`} 
            key={vc.id} 
            className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-indigo-600">{vc.name}</h3>
            <p className="text-gray-500">Score: {vc.score}</p>
          </Link>
        ))}
      </div>
      {vcs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No VC data available. Run the build process to fetch data.</p>
        </div>
      )}
    </div>
  );
}
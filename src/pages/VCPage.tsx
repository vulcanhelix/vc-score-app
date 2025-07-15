import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Import the pre-fetched data - CRITICAL: Import the local JSON, not fetch data
let vcs: Array<{id: string, name: string, score: number}> = [];
try {
  vcs = require('../data/vcs.json');
} catch (error) {
  console.warn('Could not load VC data:', error);
}

export default function VCPage() {
  const { id } = useParams();
  const vc = vcs.find(v => v.id === id);

  if (!vc) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">VC Not Found</h1>
        <p className="text-gray-500 mt-4">The VC with this ID does not exist.</p>
        <Link 
          to="/" 
          className="mt-6 inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-indigo-600 rounded shadow ripple hover:shadow-lg hover:bg-indigo-800 focus:outline-none"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">{vc.name}</h1>
        <p className="mt-4 text-lg text-gray-500">Signal Score</p>
        <div className="mt-6 text-8xl font-bold text-indigo-600">{vc.score}</div>
      </div>
      <div className="text-center mt-8">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
          &larr; Back to all VCs
        </Link>
      </div>
    </div>
  );
}
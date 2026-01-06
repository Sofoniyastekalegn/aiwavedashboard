
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-white/5 py-5 px-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">AIWaveAgency</h1>
          <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Precision Voice Systems</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Global Node: Active</span>
        </div>
        <div className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20">
          Enterprise v2.5
        </div>
      </div>
    </header>
  );
};

export default Header;

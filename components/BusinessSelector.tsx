
import React from 'react';
import { BUSINESSES } from '../constants';
import { BusinessConfig } from '../types';

interface Props {
  onSelect: (business: BusinessConfig) => void;
}

const BusinessSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">AIWaveAgency Agents</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Deploy a humanized voice receptionist in seconds. Specialized for your industry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BUSINESSES.map((biz) => (
          <button
            key={biz.id}
            onClick={() => onSelect(biz)}
            className="group flex flex-col bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 text-left"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform bg-${biz.color}-50`}>
              {biz.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{biz.name}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium">
                {biz.description}
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Core Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {biz.services.map(s => (
                    <span key={s} className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold px-2.5 py-1.5 rounded-lg border border-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-indigo-600 font-black text-xs uppercase tracking-widest">
              Launch Agent 
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusinessSelector;

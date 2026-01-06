import React, { useEffect, useRef, useState } from 'react';
import { BusinessConfig, TranscriptionItem } from '../types';

interface Props {
  business: BusinessConfig;
  isActive: boolean;
  isTransferred: boolean;
  transcriptions: TranscriptionItem[];
  onHangUp: () => void;
  onManualTransfer: () => void;
}

const LiveCallUI: React.FC<Props> = ({ business, isActive, isTransferred, transcriptions, onHangUp, onManualTransfer }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderDashboard = () => {
    const baseClass = "p-3 rounded-xl border";
    if (business.id === 'barber') {
      return (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className={`bg-blue-50 ${baseClass} border-blue-100`}>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Stations</p>
            <p className="text-xl font-bold text-blue-700">6 Avail</p>
          </div>
          <div className={`bg-blue-50 ${baseClass} border-blue-100`}>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Sync</p>
            <p className="text-[11px] font-bold text-blue-700">Active</p>
          </div>
        </div>
      );
    } else if (business.id === 'medspa') {
      return (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className={`bg-indigo-50 ${baseClass} border-indigo-100`}>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Precision</p>
            <p className="text-xl font-bold text-indigo-700">99.8%</p>
          </div>
          <div className={`bg-indigo-50 ${baseClass} border-indigo-100`}>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Status</p>
            <p className="text-[11px] font-bold text-indigo-700">Clinical</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className={`bg-pink-50 ${baseClass} border-pink-100`}>
            <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest">Scalp Lab</p>
            <p className="text-xl font-bold text-pink-700">Online</p>
          </div>
          <div className={`bg-pink-50 ${baseClass} border-pink-100`}>
            <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest">Flow</p>
            <p className="text-[11px] font-bold text-pink-700">Holistic</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 max-w-4xl mx-auto w-full border-x border-white/5 shadow-2xl overflow-hidden rounded-t-3xl relative">
      <div className={`absolute inset-y-0 right-0 w-72 bg-white shadow-2xl z-40 transform transition-transform duration-500 border-l border-gray-100 p-6 ${showDetails ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h4 className="font-bold text-gray-900 mb-6 pt-4 uppercase text-[10px] tracking-widest">Business Context</h4>
        
        <div className="space-y-6">
          <div>
             <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Team on Shift</p>
             <div className="flex flex-wrap gap-1.5">
               {business.employees.map(e => (
                 <span key={e} className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded text-[10px] font-bold">{e}</span>
               ))}
             </div>
          </div>
          
          {renderDashboard()}

          <div className="pt-4 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Hours</p>
            <p className="text-xs text-gray-700 font-medium">{business.hours}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-md p-6 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg">
            {business.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-tight">{business.name}</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[9px] text-green-400 font-black uppercase tracking-[0.2em]">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Active Agent
              </span>
              <span className="text-[9px] text-white/40 font-bold tabular-nums bg-white/5 px-2 py-0.5 rounded-full">{formatDuration(duration)}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          {showDetails ? 'Close Details' : 'Agent Specs'}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-4 bg-gradient-to-b from-black/20 to-transparent scroll-smooth">
        {transcriptions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="relative w-full h-full bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Connecting AI Receptionist...</p>
          </div>
        )}
        
        {transcriptions.map((t, idx) => (
          <div key={idx} className={`flex ${t.speaker === 'user' ? 'justify-end' : t.speaker === 'system' ? 'justify-center' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm transition-all duration-300 ${
              t.speaker === 'user' 
                ? 'bg-indigo-600 text-white shadow-xl rounded-br-none' 
                : t.speaker === 'system'
                  ? 'bg-white/5 text-gray-500 italic text-[10px] border border-white/5 py-1 px-4 rounded-full uppercase font-bold tracking-widest'
                  : 'bg-white/10 border border-white/10 text-white rounded-bl-none'
            }`}>
              {t.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gray-900 border-t border-white/5 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
          <div className={`h-full bg-indigo-500 transition-all duration-1000 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
        </div>

        <div className="flex items-center justify-center gap-12">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500/50"></div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">HD Link</span>
          </div>

          <button 
            onClick={onHangUp} 
            className="group w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
          </button>

          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full bg-green-500/50 ${isActive ? 'animate-bounce' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Vox</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCallUI;

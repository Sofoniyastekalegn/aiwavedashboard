
import React from 'react';
import { TranscriptionItem, BusinessConfig } from '../types';

interface Props {
  transcriptions: TranscriptionItem[];
  business: BusinessConfig;
}

const SalesManagerDashboard: React.FC<Props> = ({ transcriptions, business }) => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Incoming Transferred Call</h2>
            <p className="text-gray-500">Call escalated from AI Receptionist Agent</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Source Business</p>
              <p className="font-semibold text-indigo-600">{business.name}</p>
            </div>
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center">
              LIVE
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-xl p-6 h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 border-b pb-2">Full Context Transcript</h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {transcriptions.map((t, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded h-fit mt-1 ${
                      t.speaker === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {t.speaker.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-700">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Summary
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Client is looking for a {business.id === 'medspa' ? 'consultation' : 'booking'}. They seemed curious about specialized treatments but the agent triggered an escalation for final pricing confirmation.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-sm transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Take Over Call
              </button>
              <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50">
                Put on Hold
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard;


import React from 'react';
import { BookingRecord } from '../types';

interface Props {
  bookings: BookingRecord[];
}

const BookingDatabase: React.FC<Props> = ({ bookings }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
          </svg>
          Memory Database (Recent Bookings)
        </h3>
        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full uppercase">Live Sync</span>
      </div>
      <div className="overflow-x-auto">
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400 italic">
            No bookings recorded in the database yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Pro / Employee</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{booking.customerName}</div>
                    <div className="text-xs text-gray-400">{booking.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.businessName}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                      {booking.employee}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Confirmed
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingDatabase;

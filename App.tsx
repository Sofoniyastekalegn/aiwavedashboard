import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BusinessConfig, TranscriptionItem, BookingRecord } from './types';
import Header from './components/Header';
import BusinessSelector from './components/BusinessSelector';
import LiveCallUI from './components/LiveCallUI';
import SalesManagerDashboard from './components/SalesManagerDashboard';
import BookingDatabase from './components/BookingDatabase';
import { VoiceSession } from './services/geminiService';

const App: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessConfig | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const voiceSessionRef = useRef<VoiceSession | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aiwave_bookings');
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  const updateTranscription = useCallback((speaker: 'user' | 'ai' | 'system', text: string, isFinal: boolean) => {
    setTranscriptions(prev => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (last.speaker === speaker && speaker !== 'system') {
          const updated = [...prev];
          updated[updated.length - 1] = { ...last, text, timestamp: Date.now() };
          return updated;
        }
      }
      return [...prev, { speaker, text, timestamp: Date.now() }];
    });
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    setTranscriptions(prev => [...prev, { speaker: 'system', text, timestamp: Date.now() }]);
  }, []);

  const handleBookingSaved = (data: any) => {
    const newBooking: BookingRecord = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      businessName: selectedBusiness?.name || "Unknown",
      service: data.service,
      employee: data.employeeName,
      time: data.time,
      timestamp: Date.now()
    };
    
    setBookings(prev => {
      const updated = [newBooking, ...prev].slice(0, 15);
      localStorage.setItem('aiwave_bookings', JSON.stringify(updated));
      return updated;
    });
    addSystemMessage(`Booking confirmed for ${data.customerName}`);
  };

  const handleStartCall = useCallback(async (business: BusinessConfig) => {
    setSelectedBusiness(business);
    setIsActive(true);
    setTranscriptions([{ speaker: 'system', text: `Initiating secure link to ${business.name}...`, timestamp: Date.now() }]);

    const session = new VoiceSession(business);
    voiceSessionRef.current = session;

    await session.start({
      onTranscription: (speaker, text, isFinal) => updateTranscription(speaker, text, isFinal),
      onBookingSaved: (data) => handleBookingSaved(data),
      onTransfer: (reason) => {
        setIsTransferred(true);
        addSystemMessage(`Manager required: ${reason}`);
      },
      onError: (err) => {
        addSystemMessage('System error: check mic and API settings.');
        setIsActive(false);
      },
      onClose: () => {
        addSystemMessage('Call ended.');
        setIsActive(false);
      },
    });
  }, [updateTranscription, addSystemMessage, selectedBusiness]);

  const handleHangUp = useCallback(() => {
    if (voiceSessionRef.current) voiceSessionRef.current.stop();
    setIsActive(false);
    setIsTransferred(false);
    setTranscriptions([]);
    setSelectedBusiness(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        {!selectedBusiness ? (
          <div className="flex-1 overflow-y-auto pb-12">
            <BusinessSelector onSelect={handleStartCall} />
            <div className="max-w-6xl mx-auto px-6 mb-12">
              <BookingDatabase bookings={bookings} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            {isTransferred ? (
              <div className="flex flex-col lg:flex-row h-full">
                <div className="w-full lg:w-1/3 h-1/2 lg:h-full border-r bg-gray-900">
                   <LiveCallUI business={selectedBusiness} isActive={isActive} isTransferred={isTransferred} transcriptions={transcriptions} onHangUp={handleHangUp} onManualTransfer={() => {}} />
                </div>
                <div className="w-full lg:w-2/3 h-1/2 lg:h-full overflow-y-auto bg-white">
                  <SalesManagerDashboard transcriptions={transcriptions} business={selectedBusiness} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
                <LiveCallUI business={selectedBusiness} isActive={isActive} isTransferred={isTransferred} transcriptions={transcriptions} onHangUp={handleHangUp} onManualTransfer={() => {}} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

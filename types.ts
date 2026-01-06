
export type BusinessType = 'barber' | 'beauty' | 'medspa';

export interface BusinessConfig {
  id: BusinessType;
  name: string;
  icon: string;
  description: string;
  color: string;
  systemInstruction: string;
  services: string[];
  employees: string[];
  hours: string;
  priceRange: string;
}

export interface TranscriptionItem {
  speaker: 'user' | 'ai' | 'system';
  text: string;
  timestamp: number;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  service: string;
  employee: string;
  time: string;
  timestamp: number;
}

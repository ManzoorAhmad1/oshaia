'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const countryCodes = [
  { code: '+91', flag: 'in', name: 'India' },
  { code: '+1', flag: 'us', name: 'United States' },
  { code: '+44', flag: 'gb', name: 'United Kingdom' },
  { code: '+61', flag: 'au', name: 'Australia' },
  { code: '+971', flag: 'ae', name: 'UAE' },
  { code: '+65', flag: 'sg', name: 'Singapore' },
  { code: '+60', flag: 'my', name: 'Malaysia' },
  { code: '+92', flag: 'pk', name: 'Pakistan' },
  { code: '+880', flag: 'bd', name: 'Bangladesh' },
  { code: '+94', flag: 'lk', name: 'Sri Lanka' },
  { code: '+977', flag: 'np', name: 'Nepal' },
  { code: '+230', flag: 'mu', name: 'Mauritius' },
  { code: '+27', flag: 'za', name: 'South Africa' },
  { code: '+33', flag: 'fr', name: 'France' },
  { code: '+49', flag: 'de', name: 'Germany' },
];

export default function CountryDropdown({ selectedCountry, onSelect }:any) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = countryCodes.find(c => c.code === selectedCountry) || countryCodes[0];

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 bg-primary-navy border border-border-gray rounded-l-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <span className={`flag-icon flag-icon-${selected.flag} text-lg`}></span>
          <span className="font-medium">{selected.code}</span>
        </div>
        <FiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-primary-navy border border-border-gray rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                className="flex items-center w-full px-4 py-3 hover:bg-secondary-purple/20 text-left text-white"
                onClick={() => {
                  onSelect(country.code);
                  setIsOpen(false);
                }}
              >
                <span className={`flag-icon flag-icon-${country.flag} mr-3`}></span>
                <span className="font-medium mr-2">{country.code}</span>
                <span className="text-text-gray text-sm">{country.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
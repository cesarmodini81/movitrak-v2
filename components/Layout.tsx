import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { VehicleQueryModal } from './VehicleQueryModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isQueryModalOpen, setQueryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar onQueryClick={() => setQueryModalOpen(true)} />
      <TopBar />
      <main className="ml-64 pt-16 min-h-screen p-8 transition-all">
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
          {children}
        </div>
      </main>
      <VehicleQueryModal isOpen={isQueryModalOpen} onClose={() => setQueryModalOpen(false)} />
    </div>
  );
};
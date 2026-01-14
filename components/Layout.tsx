
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { RepuestosSidebar } from './RepuestosSidebar';
import { TopBar } from './TopBar';
import { VehicleQueryModal } from './VehicleQueryModal';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isQueryModalOpen, setQueryModalOpen] = useState(false);
  const { isPartsMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {isPartsMode ? (
        <RepuestosSidebar />
      ) : (
        <Sidebar onQueryClick={() => setQueryModalOpen(true)} />
      )}
      
      <TopBar />
      <main className="ml-64 pt-16 min-h-screen p-4 lg:p-8 transition-all">
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4">
          {children}
        </div>
      </main>
      
      {!isPartsMode && (
        <VehicleQueryModal isOpen={isQueryModalOpen} onClose={() => setQueryModalOpen(false)} />
      )}
    </div>
  );
};

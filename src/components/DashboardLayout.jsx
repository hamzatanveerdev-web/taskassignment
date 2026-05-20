import React, { useState } from 'react';
import { useUI } from '../context/hooks';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);


  return (
    <div >
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all`}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

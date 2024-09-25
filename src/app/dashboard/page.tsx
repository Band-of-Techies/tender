"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaBox, FaCog, FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';
import AddProductForm from '../addproducts/page';



export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('addProducts'); // Set default tab to 'addProducts'

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'addProducts':
        return <AddProductForm/>;
      case 'showProducts':
        return '';
      default:
        return ''; // Default to AddProducts
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside
        className={`fixed z-20 inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out w-64 bg-white text-black shadow-lg lg:relative lg:translate-x-0 lg:w-64`}
      >
        <div className="h-16 flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button className="lg:hidden" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-200"
            onClick={() => setActiveTab('addProducts')}
          >
            <FaBox className="mr-2" />
            Add Products
          </Link>
          <Link
            href="#"
            className="flex items-center py-2 px-4 rounded hover:bg-gray-200"
            onClick={() => setActiveTab('showProducts')}
          >
            <FaBox className="mr-2" />
            Show Products
          </Link>
          <Link href="#" className="flex items-center py-2 px-4 rounded hover:bg-gray-200">
            <FaCog className="mr-2" />
            Settings
          </Link>
        </nav>
        <div className="p-4 mt-auto fixed bottom-0 w-full">
          <button className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white text-black shadow-lg px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h2 className="text-xl font-semibold">Welcome to the Dashboard</h2>
          </div>
          <button className="text-gray-700 hover:text-black hidden lg:block">
            <FaUser />
            Profile
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 text-black">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

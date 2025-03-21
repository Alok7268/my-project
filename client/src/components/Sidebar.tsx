import React from 'react';
import { Settings, BookMarked, Home, type LucideIcon } from 'lucide-react';

type TabType = "home" | "saved" | "preferences";

type SidebarProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

const tabs: { id: TabType; icon: LucideIcon; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'saved', icon: BookMarked, label: 'Saved' },
  { id: 'preferences', icon: Settings, label: 'Preferences' },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">NewsHub</h1>
      <nav>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

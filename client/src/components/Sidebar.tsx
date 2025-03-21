import React from 'react';
import { Settings, BookMarked, Home, type LucideIcon, User, LayoutGrid } from 'lucide-react';
import Button from '@mui/material/Button';
import AppTheme from '../theme/AppTheme';
import { useUserData, useSignOut } from '@nhost/react';
import { useNavigate } from 'react-router-dom';

type TabType = "home" | "saved" | "preferences" | "personalized";

type SidebarProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

const tabs: { id: TabType; icon: LucideIcon; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'saved', icon: BookMarked, label: 'Saved' },
  { id: 'preferences', icon: Settings, label: 'Preferences' },
  { id: 'personalized', icon: LayoutGrid, label: 'Your Feed' },
];

export const Sidebar = React.memo(({ activeTab, setActiveTab }: SidebarProps) => {
  
  const user = useUserData();
  const { signOut } = useSignOut();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    console.log('Logged out successfully');
    navigate('/login'); // Redirect to login page or home page
  };

  return (
    <AppTheme>
      <div className="w-64 bg-white h-screen border-r border-gray-200 p-4 flex flex-col justify-between sticky top-0">
        <div>
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
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            {user ? <p>User ID: {user.email}</p> : <p>No USER</p>}
          </p>
          <Button fullWidth variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </AppTheme>
  );
});

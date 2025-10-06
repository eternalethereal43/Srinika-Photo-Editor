import React from 'react';
import { EditMode } from '../types';

interface ActionTabsProps {
  activeTab: EditMode;
  setActiveTab: (tab: EditMode) => void;
}

const ActionTabs: React.FC<ActionTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = Object.values(EditMode);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500
            ${activeTab === tab
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ActionTabs;
import React, { useState } from 'react';
import { Activity, LayoutDashboard, History, Settings, Bell, Check, Info } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Analysis #8492 Complete", time: "2m ago", unread: true, type: 'success' },
    { id: 2, title: "System maintenance", time: "1h ago", unread: false, type: 'info' },
    { id: 3, title: "New model version available", time: "1d ago", unread: false, type: 'info' },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onViewChange('analysis')}
          >
             <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-1.5 rounded-lg shadow-sm group-hover:shadow-blue-500/30 transition-shadow">
               <Activity className="w-5 h-5 text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                 MediSynth <span className="text-blue-500">AI</span>
               </h1>
             </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
            <NavItem 
              icon={<LayoutDashboard className="w-4 h-4" />} 
              label="Analysis" 
              active={currentView === 'analysis'} 
              onClick={() => onViewChange('analysis')}
            />
            <NavItem 
              icon={<History className="w-4 h-4" />} 
              label="History" 
              active={currentView === 'history'}
              onClick={() => onViewChange('history')}
            />
            <NavItem 
              icon={<Settings className="w-4 h-4" />} 
              label="Settings" 
              active={currentView === 'settings'}
              onClick={() => onViewChange('settings')}
            />
          </div>

          {/* Right Section - Notifications */}
          <div className="flex items-center gap-4 relative">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 transition-colors rounded-full hover:bg-slate-100 ${showNotifications ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
             >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
             </button>

             {/* Notification Dropdown */}
             {showNotifications && (
               <>
                 <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                 <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                       <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                       <button 
                         onClick={markAllRead}
                         className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                       >
                         <Check className="w-3 h-3" />
                         Mark all read
                       </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                           <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors ${n.unread ? 'bg-blue-50/40' : ''}`}>
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                <div>
                                  <p className={`text-sm ${n.unread ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.title}</p>
                                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                                </div>
                              </div>
                           </div>
                        ))
                      )}
                    </div>
                 </div>
               </>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
      ${active 
        ? 'bg-white text-blue-600 shadow-sm' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);
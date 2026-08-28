import React from 'react';
import { 
  Brain, 
  LayoutDashboard, 
  Briefcase, 
  FileUp, 
  MessageSquareText, 
  FileSpreadsheet,
  Sparkles, 
  Search, 
  BarChart3, 
  ShieldCheck,
  Bell,
  LogOut,
  User as UserIcon,
  QrCode,
  FileText,
  Scale,
  Layers,
  Zap,
  Mail,
  Calendar,
  CheckSquare,
  ShieldAlert,
  Folder,
  History,
  Activity,
  UserCheck,
  ChevronDown,
  Cpu,
  Users,
  Sliders
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: UserProfile | null;
  onLogout?: () => void;
  onOpenQR?: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  onOpenQR,
  unreadNotificationsCount = 0,
  onOpenNotifications 
}: NavbarProps) {
  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pipeline", label: "Kanban Pipeline", icon: Layers },
    { id: "jobs", label: "Jobs & Matching", icon: Briefcase },
    { id: "ingestion", label: "Resume Ingestion", icon: FileUp },
    { id: "assistant", label: "AI Recruiter Copilot", icon: MessageSquareText },
    { id: "extracted_matrix", label: "Extracted Resume Matrix", icon: FileSpreadsheet },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'HR';

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-slate-800 text-slate-300 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight text-white">
                TalentPulse <span className="text-cyan-400 font-mono text-xs uppercase ml-1">Enterprise AI</span>
              </span>
            </div>
          </div>

          <nav className="hidden xl:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-cyan-400 border border-slate-800 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            {onOpenQR && (
              <button 
                onClick={onOpenQR}
                title="Mobile QR Candidate Self-Registration"
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Mobile QR Code</span>
              </button>
            )}

            <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300 font-medium">Enterprise Secured</span>
            </div>

            <button 
              onClick={onOpenNotifications}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors relative border border-transparent hover:border-slate-800"
              title="Notification Center"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-slate-700 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium text-white truncate max-w-[120px]">
                    {user?.name || 'HR User'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {user?.email || 'hr@enterprise.com'}
                  </div>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="xl:hidden flex overflow-x-auto space-x-1 py-2 border-t border-slate-800 scrollbar-none">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-slate-900 text-cyan-400 border border-slate-800"
                    : "text-slate-400 bg-slate-900/30 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}


